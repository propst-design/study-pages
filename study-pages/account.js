/* Sync across browsers: an optional username + PIN account that keeps study progress and grade files in step.
   Shared by every page (see the README). Pages keep working exactly as before from localStorage; this only
   copies the synced keys to and from the server (worker/index.js) when someone is signed in.

   Synced keys and how two copies are merged:
   - fn-progress          Field Notes progress, {topicId: {first, last, n, due}}: per topic, the newer `last` wins.
   - cc:<program>:grades  a Challenge grade file, [record]: the union of both copies (newest 500).
   - cc:student           the Challenge student name/ID: whichever was changed last wins.
   Deletions (unmarking a topic, clearing a grade file) are found by comparing with the copy from the last
   sync and kept as tombstones, so another browser's old copy can't bring them back.

   Signing in also sets the Challenge student name to the username if this browser has none yet (the ID code
   for certificates stays optional), so one sign-in covers both.

   Pages call Acct.touch(key) after writing a key, Acct.mount(el) to show the account button, and listen for
   the 'acct-sync' event (detail.changed = keys this browser just received) and 'acct-change' (signed in or out)
   to redraw. Acct.open() shows the dialog and resolves with the username (or null) when it closes. */
(() => {
  const API = '/api/', META = 'fn-acct';
  const online = /^https?:$/.test(location.protocol);
  const lsGet = k => { try { const v = localStorage.getItem(k); return v === null ? undefined : JSON.parse(v); } catch (e) { return undefined; } };
  const lsSet = (k, v) => { try { if (v === undefined) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  // meta = {user, token, base: {key: doc from the last sync}, mt: {key: ms the key last changed here}, at: ms of last sync}
  let meta = lsGet(META) || {};
  const saveMeta = () => lsSet(META, meta);
  const reload = () => { meta = lsGet(META) || {}; }; // another tab may have signed in or out

  // ── merging
  const gradeId = r => r.ts ? 't' + r.ts + ':' + r.mid : 'h:' + [r.mid, r.date, r.time, r.score, r.name, r.id].join('|');
  const RULES = [
    { re: /^fn-progress$/, kind: 'set', time: e => (e && e.last) || 0,
      toItems: v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {}), fromItems: it => it },
    { re: /^cc:[a-z0-9-]+:grades$/, kind: 'set', cap: true, time: r => (r && r.ts) || 0,
      toItems: v => Object.fromEntries((Array.isArray(v) ? v : []).map(r => [gradeId(r), r])),
      fromItems: it => Object.values(it).sort((a, b) => (a.ts || 0) - (b.ts || 0)).slice(-500) },
    { re: /^cc:student$/, kind: 'last' },
  ];
  const ruleFor = k => RULES.find(r => r.re.test(k));
  const canon = v => v === undefined ? 'u' : JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x)
    ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);

  // doc for a 'set' key: {items: {id: item}, del: {id: ms deleted}}; an item survives unless deleted after it last changed
  function mergeSets(rule, a, b) {
    const del = Object.assign({}, a.del);
    for (const id in b.del) del[id] = Math.max(del[id] || 0, b.del[id]);
    const items = {};
    for (const src of [a.items, b.items]) for (const id in src) {
      const it = src[id], t = rule.time(it);
      if (del[id] != null && del[id] >= t) continue;
      if (!items[id] || rule.time(items[id]) < t) items[id] = it;
    }
    if (rule.cap) { // keep only the records the grade file keeps
      const keep = new Set(rule.fromItems(items).map(gradeId));
      for (const id in items) if (!keep.has(id)) delete items[id];
    }
    return { items, del };
  }

  function mergeKey(k, rule, remote, now) {
    const local = lsGet(k), base = meta.base[k];
    if (rule.kind === 'last') { // doc: {v, t}
      const mine = { v: local === undefined ? null : local, t: meta.mt[k] || 0 };
      const doc = !remote ? mine : (local === undefined && !meta.mt[k]) || remote.t >= mine.t ? remote : mine;
      return { doc, value: doc.v === null ? undefined : doc.v };
    }
    const cur = rule.toItems(local), b = base || { items: {}, del: {} };
    const del = Object.assign({}, b.del);
    for (const id in b.items) if (!(id in cur)) del[id] = now; // gone since the last sync, so deleted here
    const doc = mergeSets(rule, remote || { items: {}, del: {} }, { items: cur, del });
    const empty = !Object.keys(doc.items).length;
    return { doc, value: empty && local === undefined ? undefined : rule.fromItems(doc.items) };
  }

  // ── server calls
  async function call(method, path, body) {
    const r = await fetch(API + path, { method, cache: 'no-store',
      headers: Object.assign({ 'content-type': 'application/json' }, meta.token ? { authorization: 'Bearer ' + meta.token } : {}),
      body: body ? JSON.stringify(body) : undefined });
    let j = {}; try { j = await r.json(); } catch (e) {}
    if (!r.ok) { const e = new Error(j.error || (r.status === 404 ? 'Sync is not available on this server.' : 'Server error ' + r.status)); e.status = r.status; throw e; }
    return j;
  }

  // ── sync
  let busy = null, again = false, timer = 0, state = 'off', err = '';
  const setState = (s, e = '') => { state = s; err = e; paint(); };
  async function sync() {
    reload();
    if (!meta.token) return setState('off');
    if (busy) { again = true; return busy; }
    busy = (async () => {
      setState('busy');
      try {
        do {
          again = false;
          const remote = (await call('GET', 'data')).data || {}, now = Date.now();
          reload(); meta.base = meta.base || {}; meta.mt = meta.mt || {};
          const keys = new Set([...Object.keys(remote), ...Object.keys(meta.base)]);
          for (let i = 0; i < localStorage.length; i++) keys.add(localStorage.key(i));
          const put = {}, changed = [];
          for (const k of keys) {
            const rule = ruleFor(k); if (!rule) continue;
            const { doc, value } = mergeKey(k, rule, remote[k], now);
            if (canon(value) !== canon(lsGet(k))) { lsSet(k, value); changed.push(k); }
            if (canon(doc) !== canon(remote[k])) put[k] = doc;
            meta.base[k] = doc;
          }
          if (Object.keys(put).length) await call('PUT', 'data', { data: put });
          meta.at = Date.now(); saveMeta();
          if (changed.length) dispatchEvent(new CustomEvent('acct-sync', { detail: { changed } }));
        } while (again);
        setState('ok');
      } catch (e) {
        if (e.status === 401) { meta = {}; saveMeta(); setState('off', 'You were signed out. Sign in again to keep syncing.'); changed(); }
        else setState('error', e.status ? e.message : 'Offline. Changes will sync when the connection is back.');
      } finally { busy = null; }
    })();
    return busy;
  }
  function touch(k) {
    if (!ruleFor(k)) return;
    reload(); meta.mt = meta.mt || {}; meta.mt[k] = Date.now(); saveMeta();
    if (!meta.token) return;
    clearTimeout(timer); timer = setTimeout(sync, 1500);
  }

  // ── UI: a button showing the state, and a dialog to sign in / out
  const css = `
.acct-btn{font:inherit;font-size:13px;display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:6px 11px;border-radius:8px;cursor:pointer;
  border:1px solid var(--line);background:var(--surface, var(--panel, var(--bg)));color:var(--ink)}
.acct-btn:hover{border-color:var(--accent, var(--blue, currentColor))}
.acct-btn i{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.35;flex:none}
.acct-btn[data-state="ok"] i{background:#2fae64;opacity:1}.acct-btn[data-state="busy"] i{background:#d9a21b;opacity:1}
.acct-btn[data-state="error"] i{background:#d2453b;opacity:1}
dialog.acct{font:inherit;font-size:15px;line-height:1.45;max-width:min(430px, calc(100vw - 32px));width:100%;padding:20px;border-radius:12px;
  border:1px solid var(--line);background:var(--surface, var(--panel, var(--bg)));color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.35)}
dialog.acct::backdrop{background:rgba(0,0,0,.45)}
dialog.acct h3{margin:0 0 10px;font-size:18px}
dialog.acct p{margin:0 0 12px}
dialog.acct .warn{font-size:13px;padding:10px 12px;border-radius:8px;border:1px solid var(--line);border-left:4px solid #d9a21b;margin-bottom:14px}
dialog.acct label{display:block;font-size:13px;font-weight:600;margin:10px 0 4px}
dialog.acct input[type=text],dialog.acct input[type=password]{box-sizing:border-box;width:100%;font:inherit;padding:9px 10px;border-radius:8px;
  border:1px solid var(--line);background:var(--bg);color:var(--ink)}
dialog.acct .chk{display:flex;gap:8px;align-items:flex-start;font-weight:400;font-size:14px}
dialog.acct .err{color:#d2453b;font-size:14px;min-height:1.2em;margin:10px 0 0}
dialog.acct .row{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:14px}
dialog.acct button{font:inherit;font-size:14px;min-height:38px;padding:7px 14px;border-radius:8px;cursor:pointer;border:1px solid var(--line);background:var(--bg);color:var(--ink)}
dialog.acct button.pri{border-color:var(--accent, var(--blue, currentColor));box-shadow:inset 0 0 0 1px var(--accent, var(--blue, currentColor));font-weight:600}
dialog.acct button.link{border:none;background:none;padding:7px 4px;text-decoration:underline;margin-right:auto}
dialog.acct .muted{opacity:.75;font-size:13px}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ago = t => { const s = Math.round((Date.now() - t) / 1000); return s < 60 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : s < 86400 ? Math.round(s / 3600) + ' h ago' : new Date(t).toLocaleDateString(); };
  const btns = new Set();
  function paint() {
    btns.forEach(b => {
      if (!b.isConnected) { btns.delete(b); return; }
      b.dataset.state = meta.token ? state : 'off';
      b.lastChild.textContent = meta.token ? (state === 'error' ? 'Sync paused · ' : 'Synced · ') + meta.user : 'Sync across browsers';
      b.title = meta.token ? (state === 'error' ? err : 'Signed in as ' + meta.user + (meta.at ? ', last synced ' + ago(meta.at) : '')) : 'Sign in with a username and PIN to keep progress in step across browsers';
    });
  }
  function mount(el) {
    if (!online || !el) return;
    if (!document.getElementById('acct-css')) { const s = document.createElement('style'); s.id = 'acct-css'; s.textContent = css; document.head.append(s); }
    el.innerHTML = '<button type="button" class="acct-btn"><i></i><span></span></button>';
    const b = el.firstChild; b.onclick = open; btns.add(b); paint();
  }

  const WARN = `<div class="warn"><b>Not a secure account.</b> This is a small study site. The PIN only keeps casual people out, so
    don't reuse a username or PIN you use anywhere that matters. Only study progress, grade files and your Challenge
    student name/ID are stored.</div>`;
  const changed = () => dispatchEvent(new CustomEvent('acct-change', { detail: { user: meta.user || null } }));
  function open() {
    reload();
    const d = document.createElement('dialog'); d.className = 'acct';
    let res; const closed = new Promise(r => { res = r; });
    const done = () => d.close();
    d.addEventListener('close', () => { d.remove(); paint(); res(meta.user || null); });
    const show = html => { d.innerHTML = html; const f = d.querySelector('input'); if (f) f.focus(); };
    const fail = m => { const e = d.querySelector('.err'); if (e) e.textContent = m; };
    const busyBtns = on => d.querySelectorAll('button').forEach(b => { b.disabled = on; });

    function signedOut(msg = err) {
      show(`<h3>Sync across browsers</h3><p>Sign in on each browser or device with the same username and PIN, and your progress follows you.</p>${WARN}
        <form><label for="acu">Username</label><input type="text" id="acu" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" placeholder="3–24 letters or digits">
        <label for="acp">PIN</label><input type="password" id="acp" autocomplete="current-password" inputmode="numeric" maxlength="8" placeholder="4–8 digits">
        <p class="err">${esc(msg || '')}</p>
        <div class="row"><button type="button" data-a="close" class="link">Not now</button><button type="button" data-a="create">Create account</button><button type="submit" class="pri">Sign in</button></div></form>`);
      const go = async create => {
        const user = d.querySelector('#acu').value.trim().toLowerCase(), pin = d.querySelector('#acp').value;
        if (!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(user)) return fail('Usernames are 3–24 letters, digits, dots, dashes or underscores.');
        if (!/^\d{4,8}$/.test(pin)) return fail('The PIN must be 4 to 8 digits.');
        busyBtns(true); fail('');
        try {
          const r = await call('POST', 'login', { user, pin, create });
          meta = { user: r.user, token: r.token, base: {}, mt: (lsGet(META) || {}).mt || {} }; saveMeta(); err = '';
          await sync();
          let named = '';
          if (lsGet('cc:student') === undefined) { lsSet('cc:student', { name: r.user, id: '' }); touch('cc:student'); named = ' Your Challenge student name is now ' + r.user + '; change it or add an ID code under Options in any Challenge.'; }
          changed();
          signedIn((create ? 'Account created. This browser\'s progress is now saved to it.' : '') + named);
        } catch (e) { busyBtns(false); fail(e.status ? e.message : 'Can\'t reach the server. Check the connection.'); }
      };
      d.querySelector('form').onsubmit = e => { e.preventDefault(); go(false); };
      d.querySelector('[data-a=create]').onclick = () => go(true);
      d.querySelector('[data-a=close]').onclick = done;
    }
    function signedIn(msg = '') {
      const status = state === 'error' ? esc(err) : meta.at ? 'Last synced ' + ago(meta.at) + '.' : '';
      show(`<h3>Signed in as ${esc(meta.user)}</h3><p>Progress on this browser syncs automatically. ${status}</p>
        ${msg ? `<p>${esc(msg)}</p>` : ''}
        <label class="chk"><input type="checkbox" id="acclr" checked> When signing out, remove my progress from this browser (it stays in the account)</label>
        <p class="err"></p>
        <div class="row"><button type="button" data-a="del" class="link">Delete account…</button><button type="button" data-a="out">Sign out</button><button type="button" data-a="sync">Sync now</button><button type="button" data-a="close" class="pri">Done</button></div>`);
      d.querySelector('[data-a=close]').onclick = done;
      d.querySelector('[data-a=sync]').onclick = async () => { busyBtns(true); await sync(); signedIn(); };
      d.querySelector('[data-a=out]').onclick = async () => {
        const clear = d.querySelector('#acclr').checked; busyBtns(true);
        await sync(); // send anything not yet synced
        if (state === 'error' && clear) { busyBtns(false); return fail('Couldn\'t sync first, so nothing was removed. Try again when online, or untick the box.'); }
        try { await call('POST', 'logout'); } catch (e) {}
        if (clear) Object.keys(meta.base || {}).forEach(k => lsSet(k, undefined));
        const keys = Object.keys(meta.base || {});
        meta = {}; saveMeta(); setState('off'); changed();
        if (clear && keys.length) dispatchEvent(new CustomEvent('acct-sync', { detail: { changed: keys } }));
        signedOut('');
      };
      d.querySelector('[data-a=del]').onclick = () => {
        show(`<h3>Delete account ${esc(meta.user)}?</h3><p>This deletes the account and everything saved in it. Progress already in this browser stays here.</p>
          <form><label for="acp">PIN</label><input type="password" id="acp" autocomplete="current-password" inputmode="numeric" maxlength="8">
          <p class="err"></p><div class="row"><button type="button" data-a="back">Cancel</button><button type="submit" class="pri">Delete account</button></div></form>`);
        d.querySelector('[data-a=back]').onclick = () => signedIn();
        d.querySelector('form').onsubmit = async e => {
          e.preventDefault(); busyBtns(true);
          try { await call('POST', 'delete', { pin: d.querySelector('#acp').value }); meta = {}; saveMeta(); setState('off'); changed(); signedOut(''); }
          catch (x) { busyBtns(false); fail(x.status ? x.message : 'Can\'t reach the server.'); }
        };
      };
    }
    document.body.append(d); d.showModal();
    if (meta.token) signedIn(); else signedOut();
    return closed;
  }

  window.Acct = { online, touch, sync, mount, open, user: () => (reload(), meta.user || null) };
  if (online) {
    if (meta.token) sync();
    addEventListener('online', sync);
    let last = Date.now();
    document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - last > 20000) { last = Date.now(); sync(); } });
    addEventListener('storage', e => { if (e.key === META) { reload(); paint(); } });
  }
})();
