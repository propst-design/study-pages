# Notes for Claude

## Alternate-explanation sections (work in progress)

Goal: many Field Notes topics (`study-pages/field-notes-physics.html`) are dense. Instead of
rewriting them, add extra explanation alongside the existing article that comes at the idea from a
different angle. Long-term aim: every topic gets these.

Status: still trialling on a few topics before settling the rules. Trials so far:
Semiconductors & Doping (`semiconductors`), Entropy & the Second Law (`secondlaw`). Nothing has
been added to the page yet.

### Structure (decided)

1. **Find the spine first.** List the article's 4–6 key ideas, in the article's order.
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
  the idea as the answer to that problem. Use one everyday comparison at most.
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
3. If an analogy is used, say in one line where it breaks.
4. Keep the Problem-it-solves angle to roughly 200–300 words. The Q&A has no length cap.
5. The numbers add-on is only included when the topic has numbers worth scaling.

Open questions: section heading/name, styling (`.note` box vs own section), placement in the topic
page, and whether the extra explanations live in the `TOPICS` data or a separate field.
