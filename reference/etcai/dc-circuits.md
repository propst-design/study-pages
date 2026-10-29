# DC Circuits Challenge (original v4.0, dcv4.exe) — how it works

Observed by running the program under Wine on 2026-10-29. "(inferred)" marks anything not directly observed.

Main menu: 15 exercises (Series One–Three, Parallel One–Three, Series-Parallel I–V, Basic Networks,
Troubleshooting Series / Parallel / Series-Parallel). The HTML page has the same 15.

## Common rules for the 12 circuit worksheets (Series, Parallel, Series-Parallel, Networks)

- **Screen:** schematic top-left with the givens printed on it (source voltage to 3 decimals or 5 sig. figs,
  e.g. `15.263V`, `9.2799V`; resistor values in Ω). One quantity may instead be printed *in the answer panel*
  as a pre-filled read-only box (a given current, purple text). A right-hand panel lists every quantity to
  find, each with a text box, unit label (Ω, mA, V, mW; A and V in Networks), a **c** (check) button and its
  point value. A running "Maximum possible score = 100" sits under the list; a "Time on task" clock runs.
- **Points per item:** 100 split over the asked items and rounded down (12 items → 8 pts, 11 → 9, 10 → 10,
  9 → 11, 6 → 16). The leftover (100 − n×pts) is effectively a free bonus.
- **Tolerance: ±5 % relative**, symmetric. Probed on Series One: +4.2 %, +4.9 %, −4.9 % accepted; +5.15 %,
  +5.6 %, −5.25 % rejected.
- **Input:** plain decimal numbers in the unit shown. A malformed number (e.g. `7.7.55`) gives an
  "Error in number format" message box and costs nothing. The minus key appears to be ignored in the answer
  boxes (typing `-1.561` left `1.561`) (inferred) — answers are magnitudes.
- **c (check) button:** right → "Right !" in blue, the c button disappears and the box can no longer be
  re-checked; wrong → "Error" label (only on the latest wrong check), **−2 points from that item**, and the
  same 2 come off "Maximum possible score". An item cannot go below 0 (5 wrong checks on an 8-pt item → 0;
  max dropped only by 8). The correct answer is not revealed by checking.
- **Help button:** opens a panel "Using the HELP option costs three points per item… Caution! Some calculations
  must be done in a specific order. Choose exit if you do not need help. There is no score penalty if you exit
  at this point." → Show Help / Exit Help. Show Help gives formulas for the **currently highlighted (focused)
  box** (e.g. for PR3: P = V·I, P = I²R, P = V²/R as images). **Charged −3 every time it is shown**, taken
  from that item (RT: 8 → 5 → 2 after two helps; max 100 → 94). (When the item was already at 0 the 3 came
  off the total only, and the per-item point labels displayed oddly — looks like a display bug.)
- **Grade:** animates down the list, ✓ "Right !" or ⊘ "Should be 7.1999" (correct value to ~5 sig. figs)
  with "0 Pts" for wrong/blank items, then "Final Grade = N". N = max possible score − remaining points of
  every item that is wrong at grading (checked: 81 − 4 − 6 − 0 = 71). I.e. you lose an item's points if it
  is wrong, plus 2 per wrong check and 3 per help already deducted.
- **After grading:** "Exercise completed. Select OK to continue." → grade-storage dialog (name ≥ 2 letters,
  ID 2–9 digits, "Score will be stored at a:\"; STORE GRADE ON DISK / SKIP) → Achievement Certificate
  (topic, name, ID, date/time, "Exercise score: 71 %", time on task, validity code; Printer setup / Print /
  Do not print) → back to the exercise intro page (Begin = new problem).
- **Quit** during a worksheet: "Are you sure?" → back to the main menu, no grade.
- Intro page per exercise (Begin / Quit) with a paragraph of theory + "This exercise has a help option…
  Each run of this exercise will have new resistor values selected. The operating voltage will be randomly
  selected."
- **Values:** resistors only from {390, 470, 560, 680, 820, 1000, 1200, 1500} Ω (all values seen across
  ~45 runs). Source voltage random, not a round number (6.7–57 V seen; e.g. 6.75, 9.2799, 15.263, 33.819,
  42.400, 57.073). Given currents look like 2-sig-fig values with float noise (5.4000, 3.7999, 9, 12.25).

## Series One — resistors and source known
3 resistors in series, source V given. 12 items × 8 pts: RT, IT, IR1–3, VR1–3, PT, PR1–3.

## Series Two — source voltage unknown
3 resistors given, source shown as "? Vs". **The current through one randomly chosen resistor is given**
(pre-filled, e.g. IR3 = 4.5 mA, IR2 = 5.4 mA, IR1 = 3.7999 mA). 11 items × 9 pts: RT, IT, the two other
IRs, VR1–3, Vs, PR1–3. **No total power, given or asked.**

## Series Three — one resistor unknown
Source V given; one resistor's value blank on the schematic (any of R1–R3); **the current through it is
given** (pre-filled IRx). 11 items × 9 pts: RT, IT, the other two IRs, VR1–3, **Rx**, PR1–3. No PT.

## Parallel One — resistors and source known
3 branches. 12 items × 8 pts: RT, IT, IR1–3, VR1–3, PT, PR1–3.

## Parallel Two — source voltage unknown
"? Vs"; **one branch current given** (random branch, e.g. IR1 = 14.899, IR3 = 36.785 mA). 11 × 9 pts:
RT, IT, other two IRs, VR1–3, Vs, PR1–3. No PT.

## Parallel Three — one resistor unknown
Source V given, one resistor blank (any branch), **its branch current given**. 11 × 9 pts: RT, IT, other
two IRs, VR1–3, Rx, PR1–3. No PT.

## Series-Parallel I — three resistors, source known
R1 in series with (R2 ∥ R3). 12 × 8 pts: RT, IT, IR1–3, VR1–3, PT, PR1–3.

## Series-Parallel II — source unknown
Same circuit, "? Vs", **one of IR1–IR3 given** (seen IR2 and IR3). 11 × 9 pts (RT, IT, other IRs, VR1–3,
Vs, PR1–3). No PT.

## Series-Parallel III — one resistor unknown
Same circuit, source V given, **R1 unknown in all 4 runs**, IR1 given. 11 × 9 pts (RT, IT, IR2, IR3,
VR1–3, R1, PR1–3).

## Series-Parallel IV — four resistors, source known
R1 in series with (R3 ∥ (R2 + R4)) — same topology as the HTML. 10 × 10 pts: RT, IT, IR1–4, VR1–4.
No power items.

## Series-Parallel V — four resistors, R1 unknown (source KNOWN)
Same circuit; **source voltage given**, **R1 blank, IR1 given** (all 4 runs). 9 × 11 pts: RT, IT, IR2–4,
VR1–4. R1 itself is not asked (inferred from the item list; no R1 row).

## Basic Networks — two sources
Intro page: two-source problems need superposition / Thevenin / Norton / mesh / nodal; "The HELP option is
not functional for this exercise"; "new resistor values, source voltages, and source polarities on each use".
- Circuit: V1 – R1 – node – R2 – V2, with R3 from the node to the bottom wire (same topology as the HTML).
- Givens listed in cyan read-only boxes: V1, V2 **whole volts, 3–57 V seen**; R1, R2, R3 **single-digit
  ohms (2–9 Ω)**. Polarity varies per source and is drawn with the standard symbol (long plate = +):
  checked on a run with V1 reversed (−38 V) and V2 normal (5 V): only that reading matched the accepted answers.
- 6 items × 16 pts: IR1, IR2, IR3 in **amperes**, VR1, VR2, VR3 in volts. Magnitudes accepted (sign not
  required; a minus could not be typed). Answers came out as whole numbers in both runs checked
  (2/1/1 A, 6/3/9 V; 5/4/1 A, 35/8/3 V) (inferred: values chosen to give tidy answers).
- ±5 % tolerance (4 % accepted, 5.6 % rejected). Help shows only a generic note and **costs nothing**.

## Troubleshooting (common)
- Intro page per board (theory of opens and shorts, "Do not be concerned about scores…").
- Screen: DC power supply (DC Volts and **DC mA** displays, always visible, free), a photo-style PC board with
  colour-coded resistors (values must be read from the colour bands), and a voltmeter. "Item n of 10",
  fault radio list, Grade Item, "Points Earned", "12 points remain for item n".
- **Probes start on the board** and the first reading is free: black on the supply's − pad, red on the
  far end of the last part. **Clicking a pad moves only the red probe**; the black probe stayed on the −
  terminal whatever I clicked (left-, right-click, clicking the black probe first) (inferred: black is fixed).
  Each new red position costs 1 point. The meter drifts by a few mV between redraws.
- 10 items, **12 points per item** (max 120). Correct → earn the remaining points ("Right ! You earned 9 points
  on this item. Your total score so far is 9 points."). Wrong → 0 and a red arrow points at the correct fault
  ("Incorrect. The red arrow points to the correct answer."). No explanation is shown.
- End: "Exercise completed" → grade storage → certificate shows **"Exercise score: 21 points"** (points, not %).
- **The resistor values are the same for every item and every run** (inferred from 2 runs of Series and 1 of
  each other board): only the supply voltage and the fault change.

## Troubleshooting Series Circuits
Board: four vertical resistors R1 270 Ω, R2 560 Ω, R3 1200 Ω, R4 470 Ω (colour bands). Supply + to R1 top,
R1 bottom –Trace 1– R2 bottom, R2 top –Trace 2– R3 top, R3 bottom –Trace 3– R4 bottom, R4 top to supply −.
Faults (12): R1–R4 Shorted/Open, Trace 1–3 Open, No Faults. Supply 9.1–31.2 V seen (opens show round values
10, 17.5, 22.5, 25, 27.5). Probe start: red on R4 bottom.
Items seen: R4 Shorted, R3 Shorted, R4 Open, Trace 3 Open ×2, R1 Shorted, R2 Open ×2, No Faults, R2 Shorted.

## Troubleshooting Parallel Circuits
Board: R1 220 Ω, R2 560 Ω, R3 1200 Ω vertical. Supply + on R1 top; **Trace 1** R1 top→R2 top, **Trace 2**
R2 top→R3 top; **Trace 3** R1 bottom→R2 bottom, **Trace 4** R2 bottom→R3 bottom, **Trace 5** R3 bottom→
right corner, **Trace 6** right side up to supply −. Faults (10): Trace 1–6 Open, R1–R3 Open, No Faults —
**no short option**. Supply about 10.6–11.8 V. Probe start: black on − (Trace 6 top), red on Trace 6 bottom.
Seen: Trace 1 Open (48.2 mA = R1 alone), Trace 6 Open.

## Troubleshooting Series-Parallel Circuits
Board: **three** resistors, R1 220 ∥ R2 560, in series with R3 1200 Ω. Supply + on R1 top; Trace 1 R1 top→
R2 top; Trace 3 R1 bottom→R2 bottom; Trace 4 R2 bottom→R3 bottom; R3 top –Trace 2– supply −; Trace 5 runs
from R3 bottom to a test pad (dead end). Faults (10): Trace 1–4 Open, R1–R3 Open, R3 Shorted, "R1 or R2
Shorted", No Faults. Supply 16–28 V. Probe start: black on −, red on the Trace 5 pad. Seen: R2 Open,
No Faults ×2, Trace 1 Open.

## Utilities
- **Options** ("Score Recording and Other Options"): Print Certificates on/off, Store scores on disk on/off,
  Display wallpaper on/off. No scoring options.
- **Check Validity:** re-type a certificate's fields + validity code → Evaluate Validity.
- Print Grade File, Animation Speed, Manual, About. Main menu also has a toy
  ohmmeter: click resistors on a 3×2 board to cycle 270/560/1200/short/open (the HTML hero copies this).

## Differences from DC_Circuits_Challenge.html

Most important first.

1. **Tolerance ±5 % in the original, ±2 % in the HTML.** `TOL=0.02` (line 1067), used by `sheet()` (1245),
   `network()` (1269) and the worksheet `ok()` default (`CC.worksheet`, line 723). HOWWS (1331), each `note`
   in `sheet()`, and the Networks `how` text (1488) all say ±2 %. `pickCircuit` (1229) also throws away
   circuits where 3-sig-fig rounding would break ±2 %, which a ±5 % rule would not need.
2. **The "source unknown" and "resistor unknown" variants give a different quantity.** The original gives
   **one current** (a random IRx for Series/Parallel/SP Two; the unknown resistor's own current for Three).
   The HTML gives **total power PT** (`sheet()` adds `Total power, PT` to givens, line ~1252;
   `solve()` derives everything from PT, lines 1073–1092; intro texts par2/par3/sp2/sp3/sp5 at ~1318–1324
   tell the student to use total power; FORM.src/srcP/rx). This changes the method the student practises.
3. **Series-Parallel V is a different variant.** Original: source **known**, **R1 unknown with IR1 given**,
   items RT, IT, IR2–4, VR1–4 (9 × 11 pts). HTML: `wsMod('sp5',…,'four resistors, source unknown','sp4',4,'src')`
   (line 1484) — source unknown, total power given, Vs asked.
4. **Series-Parallel III always has R1 unknown** in the original (4/4 runs). The HTML picks `rx=ri(0,N-1)`
   (any resistor) in `pickCircuit` (1229).
5. **Worksheet scoring.** Original: each item worth ⌊100/n⌋ points. A wrong check costs 2 *from that item*,
   and help costs 3 per use, also from that item. An item can't go below 0. Grade = 100 − deductions − the
   remaining value of every item still wrong. HTML (`CC.worksheet`, 710–756): score = (right/N)×100 − pen,
   and deductions are not capped per item, so one item can cost more than it is worth.
   - Help is charged **once per item** in the HTML (`helped` set, line 736) vs **every use** in the original.
   - Networks help is free and generic in the original. The HTML charges 3 points (Networks `how` text,
     line 1488) and gives specific nodal-analysis help (`network()` H, ~1283).
6. **Item lists.** Original Two/Three variants have no PT row (HTML `answers()` line 1104 only adds PT for
   'known' — this matches). But they ask for the given current's *other* currents only. The HTML asks all IRs,
   because no current is given. Original Series/Parallel/SP Three ask Rx — matches 'RX'.
7. **Values.** Original resistors come only from {390…1500} Ω (8 values) and the source is a random
   non-round voltage (≈6.7–57 V). HTML resistors are E12 100 Ω–10 kΩ (`pickCircuit`, line 1231) and the
   source comes from `VS_LIST` (whole volts, line 1220).
8. **Basic Networks values and units.** Original uses V1, V2 whole volts 3–57 V, R 2–9 Ω, currents in
   **A**, tidy answers, 16 pts per item. HTML (`network()` 1269–1305) uses V 5–30 V, R E12 470 Ω–10 kΩ,
   currents in mA. Both use random polarity and accept magnitudes.
9. **Troubleshooting probes.** Original: probes start on the board (black on the supply −, red across the
   last part) and the first reading is free; **only red moves**. HTML: both probes start off the board, the
   first two taps place red then black, and either can be moved (`CC.trouble` `tap`, ~line 851; `TS_HOW`
   1431). `boardFactory` (1377) sets no `b.start`, though the engine supports one (used by the AC page).
10. **Troubleshooting scoring.** Original: 12 points per item (120 max), and the certificate shows points.
    HTML: `tsMod` uses `points:10` (line 1432) and `end()` reports a percentage of 100. TS_HOW says "starts
    at 10 points".
11. **Series-Parallel troubleshooting is a different circuit.** Original: 3 resistors, (R1 ∥ R2) + R3,
    traces 1–5 (5 a dead-end test trace), 10 faults including "R1 or R2 Shorted" and "R3 Shorted". HTML
    `SPB` (1423): 4 resistors, R1 + (R2 ∥ R3) + R4, 13 faults.
12. **Parallel troubleshooting fault list and trace numbering.** Original has no short fault (10 options).
    HTML `PAR.faults` (1414) adds "R1, R2 or R3 Shorted" (11). The original's Trace 1/2 join the resistor
    tops (J+ is on R1 directly) and Traces 3/4/5 the bottoms, with Trace 6 back to −. HTML: T1 J+→R1,
    T2 R1→R2, T3 R2→R3 on top, T4/T5 bottom, T6 to J2. So the same fault name means a different break.
13. **Troubleshooting values.** Original resistor values are fixed (Series 270/560/1200/470; Parallel and
    SP 220/560/1200) and read from colour bands, and only the supply voltage varies (Series 9–31 V,
    Parallel ≈11 V, SP 16–28 V). HTML draws random E12 220–4.7 k marked values ±2 % per item
    (`SER/PAR/SPB.marked`, `boardFactory`), printed as text in `info()`, with a supply from
    [12,15,18,20,24,30].
14. **Series troubleshooting board layout.** Original has four vertical resistors side by side, + to R1
    top and − to R4 top. HTML `SER.draw` (1407) uses a loop layout with J1/J2 pads. The circuit and fault
    list are the same (12 options).
15. **Feedback after grading.** Original worksheets show only "Should be X"; troubleshooting shows only the
    red arrow. The HTML adds worked solutions, clue text and normal/faulty voltage tables (extra, not a
    conflict).
16. **Grade flow.** Original asks for name/ID, stores to A:, prints a certificate with a validity code, and
    has a Check Validity utility. HTML records to its own grade store (`App`, ~line 625). This is by design,
    noted for completeness.

Not determined: whether a typed negative number is accepted (the minus key never reached the box); the
exact rounding of points per item for other item counts; whether troubleshooting resistor values ever
change (I saw no change across runs).
