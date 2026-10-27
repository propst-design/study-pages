# Study Pages

Jacob's study site: Physics Field Notes plus the nine interactive Circuits Challenge trainers.

Plain static HTML, no build step. Every page is self-contained (inline CSS/JS) and works offline.

- `index.html` — hub page
- `field-notes-physics.html` — Physics field notes: 136 topics in 7 subjects (Mechanics; Waves, Sound & Light; Electricity & Magnetism; Heat & Modern Physics; Astrophysics; Electronics; Math Toolkit). Each topic has equations, practical applications, symbol and Greek-letter tables, worked examples, common mistakes, a history note, a calculator with generated practice problems and related links; 25 have simulations. Also: concept maps, a printable formula sheet, a glossary, a units & prefixes page, constants, and per-browser study progress with a spaced review schedule.
- `circuits.html` — Circuits Challenges menu
- `*_Challenge.html` — the nine challenge trainers

## Deploying on Cloudflare Pages

Connect this repo in Cloudflare Pages with:

- Framework preset: None
- Build command: (leave empty)
- Build output directory: `/`

Every push to `main` redeploys.
