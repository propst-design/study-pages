# Study Pages

Jacob's study site: Physics Field Notes plus the nine interactive Circuits Challenge trainers.

Plain static HTML, no build step. Every page is self-contained (inline CSS/JS) and works offline.

- `index.html` — hub page
- `field-notes-physics.html` — Physics field notes: 137 topics in 7 subjects (Mechanics; Waves, Sound & Light; Electricity & Magnetism; Heat & Modern Physics; Astrophysics; Electronics; Math Toolkit). Each topic has equations, practical applications, symbol and Greek-letter tables, worked examples, common mistakes, a history note, a calculator with generated practice problems and related links; 25 have simulations. Also: concept maps, a printable formula sheet, a glossary, a units & prefixes page, constants, and per-browser study progress with a spaced review schedule.
- `circuits.html` — Circuits Challenges menu
- `*_Challenge.html` — the nine challenge trainers

## Installable app (PWA)

The site can be installed as an app on phones and computers ("Add to Home Screen" on iPhone/Android, the install icon in Chrome or Edge's address bar) and then works offline.

- `manifest.webmanifest`: app name, icons, start page
- `icons/`: app icons (`icon.svg` is the source; the PNGs are rendered from it)
- `sw.js`: service worker. It caches every page on first visit. Pages load from the network first, so a new deploy shows up on the next visit, and fall back to the cached copy offline (or after 4 s on a bad connection). **When adding or renaming a page, add it to `PAGES` in `sw.js`, bump `VERSION`, and add the manifest link and service-worker script that every page has.**

The service worker only runs over http(s), not when a page is opened straight from disk.

## Deploying on Cloudflare

The site is deployed by Cloudflare Workers Builds (project `study-pages`), connected to this repo.
Every push to `main` redeploys the live site. Pushes to other branches upload a preview version;
the non-production deploy command is `npx wrangler versions upload` (`npx wrangler preview` fails
without a `previews` block in a Wrangler config, and the repo has no Wrangler config).

## Fonts

Every page embeds a small Greek-only subset of [STIX Two Text](https://github.com/stipub/stixfonts) (as "FN Greek" and, for italic Greek in equations, "FN Greek Math") so that Greek letters look the same in equations and in text on every device. STIX Two is licensed under the SIL Open Font License 1.1; see `FONT-LICENSE.txt`.
