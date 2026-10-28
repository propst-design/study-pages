// Cross-browser sync for the study site: a tiny username + PIN account API in front of the static pages.
// Everything outside /api/ is served straight from study-pages/ (see wrangler.jsonc).
// Deliberately simple and NOT secure: a PIN only keeps casual people out. The pages tell users so.
//
// POST /api/login   {user, pin, create}  → {user, token}   (create:true makes a new account)
// POST /api/logout                        (Bearer token)
// GET  /api/data                          → {data: {key: doc}}     (Bearer token)
// PUT  /api/data    {data: {key: doc}}    → {ok:true}               (Bearer token; upserts the given keys)
// POST /api/delete  {pin}                 deletes the account and everything stored for it (Bearer token)
//
// Storage is the D1 database bound as DB. Tables are created on first use, so a fresh database needs no setup.

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL,
     fails INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user TEXT NOT NULL, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS data (user TEXT NOT NULL, k TEXT NOT NULL, v TEXT NOT NULL, updated INTEGER NOT NULL,
     PRIMARY KEY (user, k))`,
];
let ready = null; // one schema check per isolate
const setup = db => (ready ??= db.batch(SCHEMA.map(s => db.prepare(s))).catch(e => { ready = null; throw e; }));

const USER_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/; // stored lower-case
const PIN_RE = /^\d{4,8}$/;
const KEY_RE = /^(fn-progress|cc:student|cc:[a-z0-9-]{1,40}:grades)$/; // the only keys the pages sync
const MAX_VALUE = 200_000, MAX_KEYS = 40;
const MAX_FAILS = 5, LOCK_MS = 15 * 60_000; // 5 wrong PINs locks the account for 15 minutes
const PBKDF2_ITER = 5_000;  // a 4-digit PIN can't be made strong by hashing; the lockout is what slows guessing

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const fail = (msg, status = 400) => json({ error: msg }, status);
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const randHex = n => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));

async function pinHash(pin, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITER }, key, 256);
  return hex(bits);
}
const same = (a, b) => a.length === b.length && [...a].reduce((d, c, i) => d | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;

async function body(req) { try { return await req.json(); } catch { return {}; } }

async function session(req, db) {
  const m = /^Bearer ([0-9a-f]{64})$/.exec(req.headers.get('authorization') || '');
  if (!m) return null;
  const row = await db.prepare('SELECT user FROM sessions WHERE token = ?').bind(await sha256(m[1])).first();
  return row ? { user: row.user, tokenHash: await sha256(m[1]) } : null;
}

// Checks a PIN against the account, counting failures. Returns an error Response, or null when the PIN is right.
async function checkPin(db, u, pin) {
  const now = Date.now();
  if (u.locked_until > now) return fail(`Too many wrong PINs. Try again in ${Math.ceil((u.locked_until - now) / 60_000)} min.`, 429);
  if (same(await pinHash(pin, u.salt), u.hash)) {
    if (u.fails) await db.prepare('UPDATE users SET fails = 0, locked_until = 0 WHERE name = ?').bind(u.name).run();
    return null;
  }
  const fails = u.fails + 1, lock = fails >= MAX_FAILS;
  await db.prepare('UPDATE users SET fails = ?, locked_until = ? WHERE name = ?')
    .bind(lock ? 0 : fails, lock ? now + LOCK_MS : 0, u.name).run();
  return fail(lock ? 'Too many wrong PINs. The account is locked for 15 minutes.' : 'Wrong username or PIN.', 401);
}

async function login(req, db) {
  const b = await body(req);
  const user = String(b.user || '').trim().toLowerCase(), pin = String(b.pin || '');
  if (!USER_RE.test(user)) return fail('Usernames are 3–24 letters, digits, dots, dashes or underscores.');
  if (!PIN_RE.test(pin)) return fail('The PIN must be 4 to 8 digits.');
  let u = await db.prepare('SELECT * FROM users WHERE name = ?').bind(user).first();
  if (b.create) {
    if (u) return fail('That username is taken. Pick another, or sign in if it is yours.', 409);
    const salt = randHex(16);
    await db.prepare('INSERT INTO users (name, salt, hash, created) VALUES (?, ?, ?, ?)')
      .bind(user, salt, await pinHash(pin, salt), Date.now()).run();
  } else {
    if (!u) return fail('Wrong username or PIN.', 401);
    const err = await checkPin(db, u, pin);
    if (err) return err;
  }
  const token = randHex(32);
  await db.prepare('INSERT INTO sessions (token, user, created) VALUES (?, ?, ?)').bind(await sha256(token), user, Date.now()).run();
  return json({ user, token });
}

async function getData(db, s) {
  const { results } = await db.prepare('SELECT k, v FROM data WHERE user = ?').bind(s.user).all();
  const data = {};
  for (const r of results) { try { data[r.k] = JSON.parse(r.v); } catch {} }
  return json({ user: s.user, data });
}

async function putData(req, db, s) {
  const b = await body(req), data = b && b.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('Expected {data: {...}}.');
  const keys = Object.keys(data);
  if (keys.some(k => !KEY_RE.test(k))) return fail('Unknown key.');
  const vals = keys.map(k => JSON.stringify(data[k]));
  if (vals.some(v => v.length > MAX_VALUE)) return fail('Value too large.', 413);
  const { results } = await db.prepare('SELECT k FROM data WHERE user = ?').bind(s.user).all();
  if (new Set([...results.map(r => r.k), ...keys]).size > MAX_KEYS) return fail('Too many keys.', 413);
  const now = Date.now();
  if (keys.length) await db.batch(keys.map((k, i) => db.prepare(
    'INSERT INTO data (user, k, v, updated) VALUES (?, ?, ?, ?) ON CONFLICT (user, k) DO UPDATE SET v = excluded.v, updated = excluded.updated')
    .bind(s.user, k, vals[i], now)));
  return json({ ok: true });
}

async function deleteAccount(req, db, s) {
  const u = await db.prepare('SELECT * FROM users WHERE name = ?').bind(s.user).first();
  if (!u) return fail('No such account.', 404);
  const err = await checkPin(db, u, String((await body(req)).pin || ''));
  if (err) return err;
  await db.batch(['DELETE FROM data WHERE user = ?', 'DELETE FROM sessions WHERE user = ?', 'DELETE FROM users WHERE name = ?']
    .map(q => db.prepare(q).bind(s.user)));
  return json({ ok: true });
}

async function api(req, env, path) {
  const db = env.DB;
  if (!db) return fail('Sync is not set up on this server.', 503);
  await setup(db);
  if (path === '/api/login' && req.method === 'POST') return login(req, db);
  const s = await session(req, db);
  if (!s) return fail('Signed out. Sign in again.', 401);
  if (path === '/api/data' && req.method === 'GET') return getData(db, s);
  if (path === '/api/data' && req.method === 'PUT') return putData(req, db, s);
  if (path === '/api/logout' && req.method === 'POST') {
    await db.prepare('DELETE FROM sessions WHERE token = ?').bind(s.tokenHash).run();
    return json({ ok: true });
  }
  if (path === '/api/delete' && req.method === 'POST') return deleteAccount(req, db, s);
  return fail('Not found.', 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await api(req, env, url.pathname); }
      catch (e) { console.error(e); return fail('Server error.', 500); }
    }
    return env.ASSETS.fetch(req);
  },
};
