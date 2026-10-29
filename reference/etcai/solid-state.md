# Solid State Challenge (ETCAI, SolidSt4.exe, "Version 1.0f", © 1993, 2001)

Explored under Wine on 2026-10-29 by playing every menu exercise.
"(inferred)" marks anything not directly observed.

Main menu: 12 exercises in two columns, plus utilities (Check Validity, Print Grade File, About,
Manual, Options, Animation Speed, Quit) and a live **Amp Calc** panel (see the end).

Common to every exercise: an intro page (text + yellow-oval picture, **Begin** / **Quit**), a
"Time on task" clock, **Quit** asks "Are you sure?" and returns to the intro (no score saved).
Finishing an exercise → "Exercise completed" → name (≥2 letters) + ID (2–9 digits) dialog with
*Store grade on disk* / *Skip* → **Achievement Certificate** (topic, name, ID, date, score %, time
on task, validity code) with Print / Do not print.

## Basic Diode Testing

- Ohmmeter (cyan LCD, "Ohms") wired to a diode on screen; 11 diodes per run ("Diode n of 11").
  Clicking either probe reverses the leads. **Probe orientation carries over to the next diode.**
- Four options: *Defective diode, low resistance in both directions* / *Defective diode, open
  circuit* / *Good diode, the right lead is the cathode* / *Good diode, the left lead is the cathode*.
- Readings seen (11 + 9 diodes): forward **343–436 Ω for every diode, LEDs included** (an LED read
  375.9 Ω); reverse and open read **99999**; shorted read about **0 Ω** (0.059, 0, −0.00, 0.039).
  Two "shorted" diodes read about 350–370 Ω **in both directions**, and option 1 was graded right for
  them. So "low both ways" covers forward-like values too, not just ~0 Ω.
  The reading drifts by ±0.1 in the last digit while you watch.
- Grading: *Grade Selected Answer* → "Correct !" or "Incorrect" plus a red arrow beside the right
  option, with no explanation text. You can keep measuring, then *Go Next Problem*.
- Score: 100/11 = 9.09 points per diode; the panel shows points earned, % correct so far and
  "maximum possible score is now …". Readings are free.

## Basic Transistor Testing

- Same layout; 12 transistors ("Transistor n of 12"), 8 options (Good NPN/PNP × base A/B/C, Bad –
  open junction, Bad – shorted junction). Package pictures vary (flat TO-92, round can).
- Probe mechanics: both probes are always on two of the three leads. **Clicking a probe tip moves
  that probe to the free lead; clicking the free lead reverses the probes.** Each new transistor
  starts with the probes on some pair (varies).
- Readings: junction forward **337–441 Ω**; reverse/open **999999 or 999998**; shorted junction about
  **0 Ω, even negative** (0.0799, −0.070, −0.050, −0.039, 0.0199). An open junction leaves exactly one
  low reading among the six combinations. A shorted junction reads ~0 both ways, and the other junction
  still reads normally.
- Scoring like the diodes: 100/12 = 8.33 points each, red arrow on a wrong answer, readings free.

## Common Emitter Amp One (base bias)

- Intro: the 12-step base-bias analysis sequence, plus a note that base bias is beta-sensitive.
- Worksheet: schematic (VCC, R1, RC, 30 µF C1/C2, "Beta Q1 = 178.7"). Ten answer boxes, each **10 pts**,
  in this order: VE, VB, VC, VR1, VRC, IE (mA), IB (µA), IC (mA), A, Zin (Ω).
- Values seen: VCC 9 or 15 V; R1 300–390 kΩ; RC 820–1500 Ω; **beta has one decimal** (118.7, 119.5,
  178.7, 191.1).
- Buttons: a **c** beside each box (tooltip "Check your answer. Cost: 2 points."). Right → "Right !"
  and the c button disappears; wrong → "Error" and **that item's points drop by 2** (10→8→6…, floor 0).
  **Help** (bottom) applies to the highlighted box: a warning that costs nothing if you exit, then
  *Show Help* costs that item 3 points **every time** (7→4 on a second look). Help shows the formula
  with each symbol defined, e.g. A = RC / R′E with R′E = 25 mV / IE;
  Zin = 1 / (1/R1 + 1/(β·R′E)); VR1 = VCC − 0.7.
- Tolerance: ±5% (VC 4.436: 4.20 wrong, 4.23 right; VB 0.7: 0.66 wrong, 0.68 right).
  **Answers whose value is 0 must be exactly 0** (0.04, 0.01 and 0.001 were all "Error"; seen on
  Power Amp Two VEQ1).
- *Grade* marks every row in turn: ✓ "Right !" keeps the item's remaining points; ⦸ shows the correct
  value in blue and scores 0. "Final Grade = sum of item points". "Maximum possible score" updates live.
  One circuit per run.
- Answer key matches: IB = (VCC−0.7)/R1, IC = β·IB, IE = IB+IC, r′e = 25 mV/IE, A = RC/r′e,
  Zin = R1 ∥ β·r′e.

## Common Emitter Amp Two (divider, no bypass)

- Intro lists VR1 = VCC·R1/(R1+R2), VR2, VB, VE = VB−0.7, IE = VE/RE, IC ≈ IE, VRC, VC, r′e,
  A = RC/(r′e+RE), Zin = R1 ∥ R2 ∥ β(r′e+RE).
- Items (10 × 10 pts): VR1, VR2, VB, VE, VRC, VC, VCE, IE (mA), A, **Zin in kΩ**.
- Example: VCC 14 V, R1 180 kΩ, R2 27 kΩ, RC 6.8 kΩ, RE 1.2 kΩ, β 150. Key: VB 1.826 (unloaded
  divider), IE 0.9384 mA, A 5.5435, Zin 20.821 kΩ. The divider here is **not stiff** (β·RE = 180 kΩ
  < 10·R2), yet the key still uses the unloaded divider. The original doesn't restrict values to stiff
  dividers.

## Common Emitter Amp Three (divider with bypass)

- Same DC; A = RC/r′e, Zin = R1 ∥ R2 ∥ β·r′e. A 220 µF bypass cap is drawn across RE.
- Items: VR1, VR2, VB, VE, VRC, VC, VCE, IE, A, Zin (kΩ).
- Example: VCC 18 V, R1 82 k, R2 33 k, RC 2.2 k, RE 1.2 k, β 150 → A 327.44, Zin 0.9663 kΩ.

## Common Collector Amplifiers

- Items (10): VR1, VR2, VB, VE, VRE, VC (= VCC), VCE, IE, A, Zin (kΩ). **No Zout.**
- Example: 18 V, R1 180 k, R2 27 k, RE 1.2 k, β 250 → Zin 21.797 kΩ. Typing A = 1 was graded right
  (true value ≈ 0.985, within 5%).

## Common Base Amplifiers

- The schematic is drawn in the **classic common-base layout**: input on the left into the emitter,
  output on the right from the collector, base decoupled to ground by a capacitor.
- Items: VR1, VR2, VB, VE, VRC, VC, VCE, IE, A, Zin (Ω). Zin = r′e ∥ RE.
- Example: 12 V, R1 68 k, R2 10 k, RC 5.6 k, RE 1 k, β 150 → A 187.81, Zin 28.953 Ω.

## Class B Power Amp One (single supply)

- Items (10 × 10 pts): VEQ1, VBQ1, VCQ1, VEQ2, VBQ2, VCQ2, VR1, VR2, A, **Zout (Ω) ≈ R_load**.
  No power, efficiency or cutoff-frequency items.
- Example: VCC 18 V, R1 = R2 1.2 kΩ, D1/D2, 220 µF input cap, 1000 µF output cap, 16 Ω speaker,
  β 60 → 9, 9.6999, 18, 9, 8.3000, 0, 8.3000, 8.3000, 1, 16.
- The intro formulas match these items.

## Class B Power Amp Two (dual supply)

- Same 10 items. Examples: ±17 V, R 1.2 kΩ, 16 Ω, β 40; ±15 V, R 680 Ω, 8 Ω, β 80.
  Key: VEQ 0, VBQ1 0.6999, VBQ2 −0.699, VCQ2 −VCC, VR1 = VR2 = VCC−0.7 (positive), Zout = RL.

## Class B Power Amp Three (Darlington)

- 12 items (shown as "8 pts" each): VEQ1, VBQ1, VCQ1, VBQ2, VEQ2, VEQ3, VBQ3, VCQ3, VBQ4, VEQ4, A, Zout.
  Q1/Q3 are the drivers (VEQ1 = 0.7, VBQ1 = 1.4). Example: ±17 V, R1 = R2 1 kΩ, 16 Ω,
  "Beta Q1,Q3 = 80  Beta Q2,Q4 = 15". **No darlington-beta item.**
- Oddity: with only A right (shown 8 pts) the result read "Final Grade = 12". Not explained
  (possibly 8.33-point items plus rounding, or a bug).

## Troubleshooting Simple Amplifiers (base bias)

- Board picture: signal generator, POWER SUPPLY with a live LCD, VOLTMETER with DC Volts / AC Volts
  buttons. The negative lead is fixed on GND; clicking a solder pad moves the red probe there.
  Beside the board: "Beta = 102, R1 = 1.2MΩ, RC = 5.6KΩ". A **Schematic** button shows an unlabelled
  schematic overlay.
- Board traces (as printed): **T1** C1 (base side) → R1 bottom, **T2** R1 top → VCC rail, **T3** R1
  bottom/C1 node → base, **T4** emitter → ground, **T5** collector → RC bottom, **T6** RC bottom → C2.
- **Supply voltage changes every item: 10.70, 11.35, 11.93, 15.45, 15.62, 20.84, 21.23, 21.97,
  23.81, 24.15 V.** Beta also changes per item (93–111). Input is 6–12 mVpp, shown in mVPP / VPP.
- Fault list (10): C1 Open, C2 Open, RC Open, Trace 1 Open, Trace 2 Open, Trace 3 Open, **Trace 6
  Open**, Open Junctions in Q1, Shorted Junctions in Q1, No Faults.
- Fault signatures observed:
  - C2 open: DC normal; C2 collector side 2.83 VPP, C2 output side and OUTPUT 0.
  - C1 open: input side of C1 has the signal; base side 0.70 V DC, no signal.
  - Trace 1 open: C1 base side 0.00 V DC with the signal; R1 bottom/base 0.70 V, no signal.
  - Trace 2 open: R1 **top** reads 0 V; R1 bottom, base and emitter 0; collector at VCC.
  - Trace 3 open: R1 bottom (and C1 base side) at VCC; base 0; collector VCC.
  - Trace 6 open: collector and RC bottom normal with a large signal; C2 collector side 0 V DC, no signal.
  - RC open: RC top VCC; RC bottom and collector **≈ 0.00 V**; base 0.70 V.
  - Open junctions: base ≈ VCC, emitter 0, collector VCC.
  - Shorted junctions: base, emitter, collector, RC bottom and C1 base side all ≈ 0.
- Scoring: 12 points per item, 10 items (120 possible). **Moving the probe to a different pad costs 1;
  clicking the same pad again or switching DC↔AC is free.** The probe starts on the emitter pad, and
  that first reading is free. The meter mode carries over to the next item.
  Right → "Right ! You earned n points on this item"; wrong → "Incorrect" plus a red arrow at the right
  fault, with no explanation. The manual says readings after "INCORRECT" don't affect the score.

## Troubleshooting CE Amplifiers (voltage divider, bypassed)

- "Beta = 153…278 (varies), R1 = 68K, R2 = 27K, RE = 5.6K, RC = 12K". C2 is the emitter bypass
  capacitor (across RE), C3 the output capacitor. Supply varies per item: 12.13–21.60 V.
  Input 6–12 mVpp. The probe starts on R2 bottom.
- Traces: **T1** C1 → R1 bottom, **T2** R1 top → VCC, **T3** R1 bottom → R2 top, **T4** divider → base,
  **T5** emitter → RE/C2, **T6** collector → RC, **T7** RC → C3.
- Fault list (10): R1 Open, C1 Open, C2 Open, C3 Open, Trace 2 Open, Trace 4 Open, **Trace 5 Open**,
  Open Junction in Q1, Shorted Junction in Q1, No Faults.
- Observed:
  - Shorted junction: **base, emitter and collector all equal (5.28 V on a 16.9 V supply)**, which
    means the collector is shorted too (R1 ∥ RC pulls the node up, R2 ∥ RE pulls it down).
  - R1 open: R1 top VCC, R1 bottom/base 0 V; collector VCC.
  - C1 open: DC normal; no signal past C1.
  - Trace 4 open: divider point at its unloaded value (4.28 V), base 0.
  - Trace 2 open: R1 top 0 V; bias all 0; collector VCC.
  - Open junction: base at the unloaded divider value, emitter 0, collector VCC.
  - No faults: B 6.14, E 5.44, C 9.95 V (21.6 V supply); output 3.26 Vpp from 7 mVpp (gain ≈ 466 = RC/r′e).
  - C2 (bypass) open: DC normal; the full input appears at the emitter; output only 12.85 mVpp
    from 6 mVpp (gain ≈ 2 = RC/RE).
  - C3 open: collector side 4.48 VPP, output 0.
  - Trace 5 open: not drawn in the run (inferred: emitter pad ≈ VB−0.6, RE top 0, collector VCC).
- Scoring is the same as the simple board.

## Options, globals, Amp Calc

- **Options** ("Score Recording and Other Options"): Print Certificates on/off, Store scores on disk
  on/off, Display wallpaper on/off. **No scoring options.**
- Manual (strings in the exe): numeric answers ±5%, and enter values to about 1% because errors
  cascade. Troubleshooting: 120 max, −1 per meter reading, a wrong fault scores 0, and a perfect 120
  is only possible by guessing. Grade files are `gxxxxxxx.xx` with a validity code; Print Grade File
  checks it.
- **Amp Calc** (main menu): an editable **bypassed** voltage-divider CE amp (C across RE). Defaults:
  VCC 12, R1 82 k, R2 33 k, RC 6.8 k, RE 2.7 k, β 200. It shows VR1, VR2, VRE, VRC, VB, VE, VC, IE,
  A (= RC/r′e = 276), Zin (= R1 ∥ R2 ∥ β·r′e = 4.06 k), **PR1, PR2, PRE, PRC, PQ1** and
  **Max Output = 2·VCE (4.694 VPP)**. Three warnings: "VB is too small to forward bias the B-E
  junction…decrease R1 or increase R2 and/or VCC"; "The transistor is saturated…increase R1 or
  decrease RC and/or decrease R2"; "The voltage divider current is too small…decrease both R1 and R2".

## Differences from Solid_State_Challenge.html

Line numbers refer to `study-pages/Solid_State_Challenge.html` at fd1dddd.

**Troubleshooting (biggest gaps)**

1. **Supply voltage is fixed in the HTML** (`ampBoard`, l.1391: `VCC=div?20:12`). In the original it
   changes every item, roughly 10.7–24.2 V. Beta also changes per item in both, but the HTML's
   divider-board range (80–180) is lower than observed (153–278).
2. **Trace numbering and fault lists differ** (`faults`, l.1394–1395; `P`/trace drawing, l.1430–1448).
   - Simple board: the original lists Trace 1, 2, 3, **6**. The HTML lists Trace 1, 2, 3, **4**, and
     its traces mean different things. HTML T2 (R1→base) = original **T3**. HTML T3 (RC→collector)
     and HTML T4 (emitter→ground) are not faults in the original. The original's **T2 (R1 top cut from
     VCC: R1 top reads 0 V)** and **T6 (RC → C2)** don't exist in the HTML.
   - Divider board: the original has 10 faults (R1, C1, C2, C3, T2, T4, T5, open junction, shorted
     junction, none). The HTML has 12, adding **RC Open, Trace 1, Trace 3** and lacking the original's
     **T2 (R1 top from VCC)**. HTML T2 (divider→base) = original **T4**; HTML T4 (emitter→RE) =
     original **T5**. The board should be relabelled T1–T7 as in the original.
3. **Shorted junction on the divider board**: the original shorts all three terminals (B = E = C ≈
   5.3 V on 16.9 V). The HTML shorts base–emitter only, with the collector at VCC (l.1416), and its
   label "Shorted B-E Junction" differs from "Shorted Junction in Q1". Likewise "Open B-E Junction in
   Q1" vs "Open Junction in Q1" (l.1394).
4. **RC open (simple board)**: the original collector and RC bottom read ≈ 0.00 V; the HTML reads about
   0.2 V (VBE−0.5, `noCollector`, l.1407).
5. **Reading cost**: in the HTML every new (pad, mode) pair costs a point, so **switching DC↔AC costs**
   (`take`, key `probe|mode`, around l.1040; `TS_HOW` says so). In the original only moving to a new
   pad costs; mode switches and re-clicking the same pad are free.
6. The original's probe **starts on a pad** (emitter on the simple board, R2 bottom on the divider
   board) with a free first reading; the HTML probe starts nowhere (`probe=null`, ampBench). The
   original's meter mode also carries over between items.
7. The HTML adds explanation text and worked "normal values" after grading (`EXPL`, `work`); the
   original only shows a red arrow. That's an addition, not a conflict. The original also shows beta
   and part values beside the board instead of an info line.
8. Input signal: the original used 6–12 mVpp on both boards; the HTML uses 5/8/10 mV (simple) and
   10/15/20 mV (divider) (l.1391).

**Worksheets (CE / CC / CB / class B)**

9. **Scoring model** (`CC.worksheet`, l.710–766).
   - Original: each item is worth 100/N (10 pts, or 8.33 for Power Amp Three). A wrong check costs 2
     and each Help *view* costs 3, both **from that item only**, floored at 0. At Grade a right item keeps
     what's left and a wrong one scores 0; the final grade is the sum.
   - HTML: % right minus total penalties, with help charged **once per item** (`helped` Set, l.713).
     So in the HTML, penalties on a wrong item still count, and repeated help is free.
   - The original also shows a live "Maximum possible score".
10. **Zero-valued answers**: the original needs exactly 0 (0.001 is wrong). The HTML accepts ±0.05 V
    (`Z0={absTol:0.05}`, l.1079).
11. **Class B item sets differ** (`classB`/`bOut`, l.1241–1297). The original has 10/10/12 items ending
    with A and **Zout ≈ RL**. The HTML drops Zout and adds Vout(pk), Iout(pk), Pout(max), PDC, η (all
    three amps) plus fc (Amp One) and βD (Amp Three). Original Amp Three has no βD item. The HTML also
    gives A a 10% tolerance (l.1254); the original grades everything at 5%.
12. **CC has an extra Zout item in the HTML** (l.1235); the original has 10 items, no Zout.
13. **Zin units**: the original asks for Zin in **kΩ** on CE Two, CE Three and CC, and in Ω on CE One
    and CB. The HTML always uses Ω.
14. **Item order differs**. Original CE One: VE, VB, VC, VR1, VRC, IE, IB, IC, A, Zin. HTML: VE, VB,
    VR1, IB, IC, VRC, VC, IE, A, Zin. Divider amps: the original puts IE after VCE; the HTML puts it
    after VE.
15. **Value generation**.
    - Original CE One: VCC 9/15 V, R1 300–390 kΩ, RC 0.82–1.5 kΩ, **non-integer beta** (e.g. 178.7).
      HTML (`baseBias`, l.1162): RC 1–10 kΩ, integer betas from a list.
    - Original divider circuits aren't forced stiff (saw β·RE < 10·R2) and use VCC values like 14 V.
      The HTML forces stiff dividers and Thevenin within 4% (`divider`, l.1193–1203), which is a
      deliberate improvement.
    - Original class B used ±15/±17 V with 680 Ω–1.2 kΩ bias resistors (HTML has no resistor values in
      the givens).
16. **CB schematic**: the original draws the classic common-base layout; the HTML reuses the CE-style
    drawing (`schCE('cb')`, l.1086–1104).
17. **Check button**: the original hides it after a right answer. Help is a single Help button for the
    highlighted box, not a per-row "?". Cosmetic.
18. After Grade the original shows correct values only for wrong items (no worked solutions); the HTML
    shows all values plus worked solutions. That's an addition.

**Ohmmeter exercises**

19. **Diode readings** (`diodeBuild`, l.1333–1354): original forward is 343–436 Ω for every diode,
    **LEDs included**. The HTML uses 470–940 Ω, and 1400–2600 Ω for LEDs, with explain text saying LEDs
    read higher. Original shorts read ≈ 0 Ω (0–0.06, can show −0.00); the HTML uses 0.6–14 Ω. Original
    over-range shows **99999**, the HTML "OL". The original also has shorted diodes reading ~350 Ω
    **both ways**, which the HTML never generates.
20. **Transistor readings** (`transistorBuild`, l.1357–1385): original shorted junctions read ≈ 0
    (±0.08 Ω); the HTML uses 1–15 Ω. Original open shows 999999; HTML "OL". Original forward is
    337–441 Ω; HTML 570–760 Ω.
21. **Transistor probe interaction**: in the original you click a probe tip to move it to the free lead,
    or click the free lead to reverse. The HTML uses red/black selector buttons, then tap a lead
    (`ohmBench`, l.957). The original keeps probe positions between diodes (HTML resets).
22. Scoring is equivalent (percent right). The original shows 9.09 / 8.33 points per item and
    "maximum possible score is now".

**Main page / global**

23. **Amp Calc** (`hero`, l.1490–1516): the original models a **bypassed** amp (A = RC/r′e,
    Zin = R1 ∥ R2 ∥ βr′e) and also reports VB, VE, PR1, PR2, PRE, PRC, PQ1 and Max Output (2·VCE p-p).
    The HTML models no bypass (A = RC/(r′e+RE)) with no power or max-output lines, adds near-cutoff and
    near-saturation warnings, and has different defaults (orig 82 k/33 k/6.8 k/2.7 k/12 V/β 200; HTML
    68/27/12/5.6/20/100).
24. Certificates, disk grade files, validity codes and Options toggles have no HTML equivalent. That's
    expected for an offline web page; the HTML records scores its own way.

Not determined: Trace 5 Open's exact readings on the divider board (not drawn); the "Final Grade = 12"
oddity on Power Amp Three; whether help or check costs are configurable (no option seen).
