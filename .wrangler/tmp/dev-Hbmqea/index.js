var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.js
var SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL,
     fails INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user TEXT NOT NULL, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS data (user TEXT NOT NULL, k TEXT NOT NULL, v TEXT NOT NULL, updated INTEGER NOT NULL,
     PRIMARY KEY (user, k))`
];
var ready = null;
var setup = /* @__PURE__ */ __name((db) => ready ??= db.batch(SCHEMA.map((s) => db.prepare(s))).catch((e) => {
  ready = null;
  throw e;
}), "setup");
var USER_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
var PIN_RE = /^\d{4,8}$/;
var KEY_RE = /^(fn-progress|cc:student|cc:[a-z0-9-]{1,40}:grades)$/;
var MAX_VALUE = 2e5;
var MAX_KEYS = 40;
var MAX_FAILS = 5;
var LOCK_MS = 15 * 6e4;
var PBKDF2_ITER = 5e3;
var json = /* @__PURE__ */ __name((body2, status = 200) => new Response(JSON.stringify(body2), {
  status,
  headers: { "content-type": "application/json", "cache-control": "no-store" }
}), "json");
var fail = /* @__PURE__ */ __name((msg, status = 400) => json({ error: msg }, status), "fail");
var hex = /* @__PURE__ */ __name((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""), "hex");
var randHex = /* @__PURE__ */ __name((n) => hex(crypto.getRandomValues(new Uint8Array(n))), "randHex");
var sha256 = /* @__PURE__ */ __name(async (s) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))), "sha256");
async function pinHash(pin, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITER },
    key,
    256
  );
  return hex(bits);
}
__name(pinHash, "pinHash");
var same = /* @__PURE__ */ __name((a, b) => a.length === b.length && [...a].reduce((d, c, i) => d | c.charCodeAt(0) ^ b.charCodeAt(i), 0) === 0, "same");
async function body(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
__name(body, "body");
async function session(req, db) {
  const m = /^Bearer ([0-9a-f]{64})$/.exec(req.headers.get("authorization") || "");
  if (!m) return null;
  const row = await db.prepare("SELECT user FROM sessions WHERE token = ?").bind(await sha256(m[1])).first();
  return row ? { user: row.user, tokenHash: await sha256(m[1]) } : null;
}
__name(session, "session");
async function checkPin(db, u, pin) {
  const now = Date.now();
  if (u.locked_until > now) return fail(`Too many wrong PINs. Try again in ${Math.ceil((u.locked_until - now) / 6e4)} min.`, 429);
  if (same(await pinHash(pin, u.salt), u.hash)) {
    if (u.fails) await db.prepare("UPDATE users SET fails = 0, locked_until = 0 WHERE name = ?").bind(u.name).run();
    return null;
  }
  const fails = u.fails + 1, lock = fails >= MAX_FAILS;
  await db.prepare("UPDATE users SET fails = ?, locked_until = ? WHERE name = ?").bind(lock ? 0 : fails, lock ? now + LOCK_MS : 0, u.name).run();
  return fail(lock ? "Too many wrong PINs. The account is locked for 15 minutes." : "Wrong username or PIN.", 401);
}
__name(checkPin, "checkPin");
async function login(req, db) {
  const b = await body(req);
  const user = String(b.user || "").trim().toLowerCase(), pin = String(b.pin || "");
  if (!USER_RE.test(user)) return fail("Usernames are 3\u201324 letters, digits, dots, dashes or underscores.");
  if (!PIN_RE.test(pin)) return fail("The PIN must be 4 to 8 digits.");
  let u = await db.prepare("SELECT * FROM users WHERE name = ?").bind(user).first();
  if (b.create) {
    if (u) return fail("That username is taken. Pick another, or sign in if it is yours.", 409);
    const salt = randHex(16);
    await db.prepare("INSERT INTO users (name, salt, hash, created) VALUES (?, ?, ?, ?)").bind(user, salt, await pinHash(pin, salt), Date.now()).run();
  } else {
    if (!u) return fail("Wrong username or PIN.", 401);
    const err = await checkPin(db, u, pin);
    if (err) return err;
  }
  const token = randHex(32);
  await db.prepare("INSERT INTO sessions (token, user, created) VALUES (?, ?, ?)").bind(await sha256(token), user, Date.now()).run();
  return json({ user, token });
}
__name(login, "login");
async function getData(db, s) {
  const { results } = await db.prepare("SELECT k, v FROM data WHERE user = ?").bind(s.user).all();
  const data = {};
  for (const r of results) {
    try {
      data[r.k] = JSON.parse(r.v);
    } catch {
    }
  }
  return json({ user: s.user, data });
}
__name(getData, "getData");
async function putData(req, db, s) {
  const b = await body(req), data = b && b.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return fail("Expected {data: {...}}.");
  const keys = Object.keys(data);
  if (keys.some((k) => !KEY_RE.test(k))) return fail("Unknown key.");
  const vals = keys.map((k) => JSON.stringify(data[k]));
  if (vals.some((v) => v.length > MAX_VALUE)) return fail("Value too large.", 413);
  const { results } = await db.prepare("SELECT k FROM data WHERE user = ?").bind(s.user).all();
  if ((/* @__PURE__ */ new Set([...results.map((r) => r.k), ...keys])).size > MAX_KEYS) return fail("Too many keys.", 413);
  const now = Date.now();
  if (keys.length) await db.batch(keys.map((k, i) => db.prepare(
    "INSERT INTO data (user, k, v, updated) VALUES (?, ?, ?, ?) ON CONFLICT (user, k) DO UPDATE SET v = excluded.v, updated = excluded.updated"
  ).bind(s.user, k, vals[i], now)));
  return json({ ok: true });
}
__name(putData, "putData");
async function deleteAccount(req, db, s) {
  const u = await db.prepare("SELECT * FROM users WHERE name = ?").bind(s.user).first();
  if (!u) return fail("No such account.", 404);
  const err = await checkPin(db, u, String((await body(req)).pin || ""));
  if (err) return err;
  await db.batch(["DELETE FROM data WHERE user = ?", "DELETE FROM sessions WHERE user = ?", "DELETE FROM users WHERE name = ?"].map((q) => db.prepare(q).bind(s.user)));
  return json({ ok: true });
}
__name(deleteAccount, "deleteAccount");
async function api(req, env, path) {
  const db = env.DB;
  if (!db) return fail("Sync is not set up on this server.", 503);
  await setup(db);
  if (path === "/api/login" && req.method === "POST") return login(req, db);
  const s = await session(req, db);
  if (!s) return fail("Signed out. Sign in again.", 401);
  if (path === "/api/data" && req.method === "GET") return getData(db, s);
  if (path === "/api/data" && req.method === "PUT") return putData(req, db, s);
  if (path === "/api/logout" && req.method === "POST") {
    await db.prepare("DELETE FROM sessions WHERE token = ?").bind(s.tokenHash).run();
    return json({ ok: true });
  }
  if (path === "/api/delete" && req.method === "POST") return deleteAccount(req, db, s);
  return fail("Not found.", 404);
}
__name(api, "api");
var worker_default = {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(req, env, url.pathname);
      } catch (e) {
        console.error(e);
        return fail("Server error.", 500);
      }
    }
    return env.ASSETS.fetch(req);
  }
};

// ../../../tmp/claude-0/-home-user-study-pages/17118795-0932-553b-90ae-f542e4bcabe9/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../tmp/claude-0/-home-user-study-pages/17118795-0932-553b-90ae-f542e4bcabe9/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body2 = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body2);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body2, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-v1nXdN/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../tmp/claude-0/-home-user-study-pages/17118795-0932-553b-90ae-f542e4bcabe9/scratchpad/wr/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-v1nXdN/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
