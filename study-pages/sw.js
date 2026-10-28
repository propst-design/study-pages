// Offline support for the installed app (PWA).
// Pages: network first, so a new deploy shows up on the next visit; the cached copy is used offline or
// when the network takes more than 4 s; if a newer copy then arrives, the page shows a "New version" bar. Everything else (icons, fonts): cache first.
// Bump VERSION when adding or renaming a page so the precache list is fetched again.
const VERSION = 'v5';
const CACHE = 'study-pages-' + VERSION;
const PAGES = ['./', 'index.html', 'field-notes-physics.html', 'circuits.html',
  'AC_Circuits_Challenge.html', 'Basic_Circuits_Challenge.html', 'DC_Circuits_Challenge.html', 'Digital_Challenge.html',
  'Ohmmeter_Challenge.html', 'Op_Amp_Challenge.html', 'Power_Supply_Challenge.html', 'Solid_State_Challenge.html',
  'Voltmeter_Challenge.html', 'account.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png',
  'fonts/space-grotesk.woff2', 'fonts/plex-sans.woff2', 'fonts/plex-mono-400.woff2', 'fonts/plex-mono-500.woff2',
  'fonts/jetbrains-mono.woff2', 'fonts/inter.woff2', 'fonts/inter-tight.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('study-pages-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) return; // sync API: always the network
  const page = req.mode === 'navigate' || (url.origin === location.origin && /\.html$|\/$|\/account\.js$/.test(url.pathname)); // account.js too, so fixes reach everyone
  if (page) {
    // Cloudflare redirects .html pages to extensionless URLs. Use the precached
    // .html key for both forms, including bookmarks never opened before going offline.
    const cacheKey = new URL(req.url);
    if (url.origin === location.origin && PAGES.includes(url.pathname.slice(1) + '.html')) cacheKey.pathname += '.html';
    const net = fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(cacheKey.href, copy)); } return r; });
    const cached = caches.open(CACHE).then(c => c.match(cacheKey.href, { ignoreSearch: true })).then(r =>
      // A redirect-followed response cannot satisfy a navigation in redirect:manual mode.
      r && r.redirected ? new Response(r.body, { status: r.status, statusText: r.statusText, headers: r.headers }) : r);
    let shown = null; // the cached copy, if the network was too slow and we showed that instead
    const slow = new Promise(res => setTimeout(res, 4000)).then(() => cached).then(r => (shown = r));
    // when a newer page arrives after the old copy was shown, tell the page so it can offer a reload
    const tag = r => r.headers.get('etag') || r.headers.get('last-modified') || r.headers.get('content-length');
    e.waitUntil(net.then(async r => {
      if (!shown || !r.ok || tag(shown) === tag(r)) return;
      const c = await self.clients.get(e.resultingClientId || e.clientId);
      if (c) c.postMessage('updated');
    }, () => {}));
    e.respondWith(Promise.race([net, slow.then(r => r || net)]).catch(() => cached.then(r => r || Response.error())));
    return;
  }
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
