# Notes for Claude

## Alternate-explanation sections (work in progress)

Goal: many Field Notes topics (`study-pages/field-notes-physics.html`) are dense. Instead of
rewriting them, add extra explanation alongside the existing article that comes at the idea from a
different angle. Long-term aim: every topic gets these.

Status: done. All 137 topics have an alternate-explanation section (Impedance was added later, written to the same rules). The first five
(`semiconductors`, `secondlaw`, `faraday`, `timedilation`, `logs`) were trials worked through with
Jacob; the rest were rolled out in 14 batches using the rules below. New topics should get one too.

### Structure (decided)

1. **Find the spine first.** List the article's 4–6 key ideas, in the article's order. If a long
   article has more, merge small ones into a neighbour (Logs: "logs need pure numbers" folded into
   the decibels idea).
2. **Every full angle walks the whole spine**, in that order. Angles differ in *how* they explain,
   not in *which* parts they cover. (Reason: a reader stuck on any one idea should be helped by
   every angle, not just the one that happens to cover it.)
3. **Numbers at human scale is an optional add-on**, not a full angle. It only covers the
   number-heavy ideas, so it is exempt from the full-spine rule.
4. **Going beyond the article is fine.** If the article states something without explaining it
   (e.g. *why* no engine turns all heat into work), the angles should supply the reason.

### Angles Jacob likes (keep)

Full angles (must cover the whole spine):

- **Problem it solves.** Start from why anyone cares and what goes wrong without it, then explain
  the idea as the answer to that problem. The problem can be practical (Faraday: batteries can't
  power a city) or a contradiction physics had to resolve (Relativity: light's speed was the same
  for everyone, which shouldn't be possible). It also works for maths topics (Logs: things that
  change by a fraction, and quantities spanning huge ranges).
- **Questions you're stuck on (Q&A).** Plain questions a confused reader actually asks, at least
  one per spine idea, each answered in two or three sentences. Add extra questions for the obvious
  confusions too; a long Q&A is fine (Entropy's had 8 and Jacob wanted to keep it). Fits almost
  every topic.

Add-on (partial coverage is fine):

- **Numbers at human scale.** Turn the article's huge or tiny numbers into everyday counts
  (people, cities, seconds). Only use this when the topic has numbers worth scaling; it won't fit
  every topic. Check the arithmetic, because a wrong scaled number misleads more than none.

### Angles rejected

- **A single analogy carried through the whole topic** (e.g. a car park for bands and holes).
  Jacob liked this one least.

### Draft ground rules (not final)

1. No new equations. Only refer to equations the article already has.
2. End by connecting back to the article's own terms.
3. **Comparisons: as many as help, but each one is local.** It serves one spine idea, is used once,
   and is not extended (that would drift back into the rejected single-analogy angle). Use a
   comparison only where an idea is hard to picture. Add a one-line "where it breaks" only when the
   comparison could plant a misconception. (Example that earned its place: a Ferris wheel for why a
   spinning coil's emf peaks when the flux is zero.)
4. Keep the Problem-it-solves angle to roughly 400 words at most. The Q&A has no length cap.
5. The numbers add-on is only included when the topic has numbers worth scaling.
6. **Explain every piece of notation.** Every unfamiliar symbol or operation in the article
   (integrals, d/dt, Σ, ∝, cos θ, subscripts like n_i, etc.) gets a plain-words answer somewhere
   in the **Symbols & terms** list (kept separate from the concept Q&A), e.g. "What does dΦ/dt
   mean if I don't do calculus?" Include units and jargon terms the article uses without defining
   (eV, kelvin, "normal to the loop", "frame", "event").
   **Where a question goes:** "What does this mark/word say, how do I read it?" goes in Symbols &
   terms. "Why is it like that?" goes in Questions, even if it is about notation (e.g. "Why does
   anything to the power 0 equal 1?" is a Question).

### Presentation

Jacob wants these **collapsible** so articles don't become overwhelmingly long. The topic page
already uses collapsible cards (`<details class="card fold">`, see `exampleCard`, `historyCard`)
and per-item "Show solution" toggles, so reuse those patterns.

Built:

- Content lives in a separate `ALT` object (the line after `APPS`), keyed by topic id:
  `{why: html, qa: [[question, answer html], ...], sym: [[question, answer html], ...], nums: html}`.
  `nums` is optional.
- Write maths as plain HTML (`<i>n</i><sub>i</sub>`, `<sup>`, Unicode ∝ ≈ ×), the way `APPS` does.
  Topic bodies use pre-rendered KaTeX, but there is no KaTeX at runtime, so don't paste TeX.
- `altCard(t)` renders one folded card, **collapsed by default**, directly under the article body:
  tag "Stuck?", title "Try another way in". Inside are tabs: The problem it solves | Questions (n) |
  Symbols & terms (n) | Numbers at human scale. Each Q&A answer is hidden until its question is clicked. `wireAlt`
  handles the tabs.

### Rollout (done)

Rolled out to the remaining 131 topics in 14 batches, grouped by subject
group. Each batch is drafted separately, then checked before it goes on the page:

1. Automatic check: right shape, Problem-it-solves 150–430 words, at least 4 questions and 2
   symbols/terms, balanced HTML, no TeX, internal links point at real topics.
2. Arithmetic: every number in the numbers add-on (and any in the other tabs) recomputed.
3. Render check in a browser: every topic in the batch opens its card and every tab, no errors.
4. Spot-read for accuracy and for the rules above (full spine, local comparisons, notation).

| Batch | Groups | Topics |
|---|---|---|
| 1 | Motion, Forces | 8 |
| 2 | Energy & Momentum, Rotation | 11 |
| 3 | Oscillations & Gravity, Fluids & Materials | 9 |
| 4 | Wave Basics, Sound | 9 |
| 5 | Rays & Optics | 9 |
| 6 | Wave Optics, Electrostatics | 12 |
| 7 | Circuits, Magnetism | 12 |
| 8 | Induction & AC, Fields & Waves | 8 |
| 9 | Heat & Temperature, Thermodynamics, Relativity | 10 |
| 10 | Quantum & Atoms | 10 |
| 11 | Nuclear Physics, Particle Physics, Stars | 9 |
| 12 | Compact Objects, Cosmology, Semiconductors | 7 |
| 13 | Analog Circuits, Digital Logic | 7 |
| 14 | Units & Numbers, Algebra & Graphs, Vectors, Calculus | 10 |

## Units & conventions

- **AC power is American.** Any reference to household power or the grid uses the US system:
  120 V rms at 60 Hz (peak ≈ 170 V, ω ≈ 377 rad/s, full-wave ripple 120 Hz), 120/240 V split-phase
  homes, 15–20 A breaker circuits, ~12 kV distribution, 345/500/765 kV transmission, 3600 rpm
  two-pole generators. Say "outlet", "household power", "line voltage", not "socket" or "mains".
  A short "(230 V, 50 Hz in Europe)" comparison is fine.
