# Study Pages

Jacob's study site: Physics Field Notes plus the nine interactive Circuits Challenge trainers.

Plain static HTML, no build step. Every page is self-contained (inline CSS/JS) and works offline.

- `index.html` — hub page
- `field-notes-physics.html` — Physics field notes: 142 topics in 7 subjects (Mechanics; Waves, Sound & Light; Electricity & Magnetism; Heat & Modern Physics; Astrophysics; Electronics; Math Toolkit). Each topic has equations, practical applications, symbol and Greek-letter tables, worked examples, common mistakes, a history note, a calculator with generated practice problems and related links; 26 have simulations. Also: concept maps, a printable formula sheet, a glossary, a units & prefixes page, constants, and per-browser study progress with a spaced review schedule.
- `circuits.html` — Circuits Challenges menu
- `*_Challenge.html` — the nine challenge trainers

## Installable app (PWA)

The site can be installed as an app on phones and computers ("Add to Home Screen" on iPhone/Android, the install icon in Chrome or Edge's address bar) and then works offline.

- `manifest.webmanifest`: app name, icons, start page
- `icons/`: app icons (`icon.svg` is the source; the PNGs are rendered from it)
- `sw.js`: service worker. It caches every page on first visit. Pages load from the network first, so a new deploy shows up on the next visit, and fall back to the cached copy offline (or after 4 s on a bad connection). If a newer copy arrives after the cached one was shown, the page shows a "New version available · Reload" bar. **When adding or renaming a page, add it to `PAGES` in `sw.js`, bump `VERSION`, and add the manifest link and service-worker script that every page has.**

The service worker only runs over http(s), not when a page is opened straight from disk.

## Sync across browsers (username + PIN)

Optional. Each page still saves to `localStorage` as before; signing in also copies the synced keys to the server, so
progress follows the reader to other browsers and devices. **It is deliberately not secure** (a 4–8 digit PIN, no
email, no recovery), and the sign-in dialog says so.

- `account.js` (loaded by `index.html`, Field Notes and every Challenge): the sign-in dialog and the merge. Synced
  keys: `fn-progress` (per topic, newer `last` wins), `cc:<program>:grades` (union of records, newest 500) and
  `cc:student` (last change wins). Deletions are kept as tombstones so an old copy elsewhere can't bring them back.
  Pages call `Acct.touch(key)` after writing a synced key and redraw on the `acct-sync` event.
- `../worker/index.js`: the API (`/api/login`, `/api/data`, `/api/logout`, `/api/delete`) on a D1 database bound as
  `DB`. Five wrong PINs lock an account for 15 minutes. The database is created by the first deploy and the worker
  creates its own tables, so there is nothing to set up by hand. Browse or delete accounts under
  Storage & Databases → D1 → study-pages-db in the Cloudflare dashboard.
- Pages opened straight from disk don't show the sync button and work as before.

## Deploying on Cloudflare

The site is deployed by Cloudflare Workers Builds (project `study-pages`, live at
https://study-pages.jacobt666.workers.dev), connected to this repo. `wrangler.jsonc` at the repo
root configures it: everything in `study-pages/` is served from the site root.

- Every push to `main` redeploys the live site. This needs, under study-pages → Settings → Builds: Production
  branch `main` and deploy command `npx wrangler deploy`. (With `npx wrangler versions upload` instead, each build
  only uploads a version, which then has to be promoted by hand under Deployments.)
- Pushes to other branches build a preview. Cloudflare runs `npx wrangler preview` for these, which
  needs the `previews` block in `wrangler.jsonc`.

## Looks

Field Notes and the hub page have four looks, picked in the Field Notes sidebar or under the hub's heading and remembered in this browser (`localStorage` key `fn-look`): **Blueprint** (the default; dark navy grid paper), **Oscilloscope** (phosphor green on black), **Swiss** (white, big type, one orange accent) and **Classic** (the original design, which keeps its light/dark toggle). `<html data-look="…">` selects one; each look redefines the colour and font tokens (`--bg`, `--ink`, `--accent`, `--f-head`, `--f-body`, `--f-mono`, …) and adds a few signature rules, so new CSS should use the tokens rather than fixed colours or fonts. The Circuits Challenge pages still use their own design.

## Fonts

Every page embeds a small Greek-only subset of [STIX Two Text](https://github.com/stipub/stixfonts) (as "FN Greek" and, for italic Greek in equations, "FN Greek Math") so that Greek letters look the same in equations and in text on every device. STIX Two is licensed under the SIL Open Font License 1.1; see `FONT-LICENSE.txt`.

The looks use Space Grotesk, IBM Plex Sans and Plex Mono, JetBrains Mono, Inter and Inter Tight, self-hosted as Latin-subset WOFF2 files in `fonts/` (from Google Fonts; all under the SIL Open Font License 1.1) and precached by the service worker for offline use.
