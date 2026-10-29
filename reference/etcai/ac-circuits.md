# AC Circuits Challenge (original v4.0, acv4.exe): how each exercise works

Observed by running the original under Wine on 2026-10-29, played for real.
Anything marked *(inferred)* was not seen directly.

Wine quirk: the program draws Ω and µ with the Symbol font, which Wine lacks. Labels such as "680Ω" or
"518.3 mH" show boxes for the Ω and the decimal point. Component values below were worked back from the
answers the program reveals.

## Global behaviour

- **Main menu:** 14 exercises, the same set as the HTML: Voltage Conversions, Transformers, Series and
  Parallel C, Series and Parallel L, RL Series, RL Parallel, RC Series, RC Parallel, RLC Series,
  RLC Parallel, Series Resonance, Parallel Resonance, Troubleshooting Simple Circuits, Troubleshooting
  Transformer Circuits.
  Utility buttons: Check Validity, About, Options, Print Grade File, Animation Speed, Manual. The menu
  also has a decorative transformer demo with clickable turns buttons (2T/4T primary, 1T/2T/4T secondary).
- **Intro page:** every exercise opens with a page of text (and formulas for the fundamentals), then
  Begin / Quit.
- **Timer:** "Time on task" runs on every exercise screen.
- **End of exercise:** a box says "Exercise completed. Select OK to continue."
  - With disk storage on: a dialog asks for a name (2 or more letters) and an ID (2–9 digits), then
    "Store grade on disk" or "Skip". A bad name or ID gives "Error in name or ID length. Ignore?".
  - With certificates on: an **Achievement Certificate** shows Topic, Name, User ID, Date/Time,
    Exercise score %, Time on task and a 10-letter validity code. Buttons: Printer setup, Print,
    Do not print ("Are you sure?").
  - **Check Validity** re-enters those seven fields to verify a certificate.
- **Options dialog:** only three check boxes: Print Certificates, Store scores on disk, Display
  wallpaper. Their defaults come from `options.ini` (lines 1–3; line 4 is the grade folder, default
  `a:\`). There are **no scoring or tolerance options**.
- **Pass mark:** none shown anywhere; the score is just reported. *(Inferred: no pass/fail.)*
- **Tolerance:** it differs by exercise. It is relative, and the phase angle is relative too, not in
  degrees.
  - Voltage Conversions and Transformers: about **±6%** (5.5%, 5.8% accepted; 6.0% and 8% rejected).
  - Series/Parallel C and the AC worksheets: about **±5%** (4.0%, 4.5%, 4.8% accepted; 5.0%, 5.1%,
    5.4% rejected).
  - A θ that was 2° (4.6%) off was accepted.

## Voltage Conversions

- **Problems:** 11 "problem sets". The meter shows one value (rms, peak, peak-to-peak or average,
  chosen at random) to 3 decimals. The student types the other three into yellow boxes.
- **Values:** each set is built from an rms voltage with one decimal (seen 23.4–107.0 V), converted
  with the 1.414 / 0.637 factors. Given values include 142.814 Vp, 28.100 Vrms, 38.100 Vavg,
  96.377 Vavg and 177.316 Vpp.
- **Grading:** one press of Grade Answers per set; no retry. Each box shows "Right !" or
  "Incorrect — The correct answer is 59.812 volts peak." A blank box is filled with 0 and marked
  Incorrect.
  - Original typo: the peak answer is sometimes labelled "volts rms".
- **Running total:** "Problem set n of 11 · x of y items answered correctly · Your present grade is
  NN.NN".
- **Score:** % of items right (33 items in all).
- **Intro:** text on effective/rms, peak, peak-to-peak and average, and why technicians use each, plus
  the six factor formulas (Vrms = Vp × 0.707, Vp = Vrms × 1.414, Vpp = 2 Vp, Vp = Vpp × 0.5,
  VA = Vp × 0.637, Vp = VA × 1.57). No worked solutions.

## Transformers

- **Problems:** **8** problem sets. Six boxes: Tp (turns), Ts, Vp, Vs, Ip, Is (amperes).
  - Three are blue (given) and three yellow (to find).
  - The load resistance is on the schematic.
- **Values:** all small "nice" integers.
  - Turns: 15–432 (e.g. 144/24, 108/432, 48/384, 384/96, 30/240, 64/192, 60/360, 15/120).
  - Voltages: 8–240 V.
  - Currents: whole amperes (3–32 A).
  - Load: 1–64 Ω.
- **Known combinations:** any three of the six, including Ip given, or both currents given
  (seen: Tp,Vp,Vs; Tp,Ip,Is; Ts,Vp,Vs; Tp,Ts,Vp; Tp,Ts,Ip; Ts,Ip,Is; Tp,Ts,Vs).
- **Grading:** like Conversions: one grade per set, "Correct!" or "The correct answer is 1.333
  amperes." Empty boxes count as zero. Tolerance is about ±6% (5.8% accepted).
- **Score:** % of items right (24 items).

## Series and Parallel C

- **Problems:** 12 in random order, three each of: 2 in parallel, 3 in parallel, 2 in series,
  3 in series.
- **Values:** E6/E12 values from 2.2 to 1000. Each problem is either in **µF** or in **µµF**
  (picofarads, written the old way). The answer box carries the same unit.
- **Feedback:** one try per problem.
  - Right: a big "Correct !".
  - Wrong: "Incorrect · The correct answer is 7.80 µF · found using the formula below", with the
    formula shown (CT = C1 + C2, or the reciprocal form).
  - Then Continue.
- **Blank or non-numeric answer:** "Please correct error in number format." It is not graded.
- **Running total:** "Number correct = n · Current score is NN.N".
- **Tolerance:** ±5%.
- **Intro:** parallel adds, series uses the reciprocal (the opposite of resistors), with formulas for
  2, 3 and n parts.

## Series and Parallel L

Works the same as the C exercise. Inductors are in **mH only**, E-series 5.6–1000 mH. 12 problems,
three of each type. The formula appears on a wrong answer.

## RL Series, RC Series, RL Parallel, RC Parallel (2-part worksheets)

- **Layout:** one circuit with source voltage (4 decimals, e.g. 2.7527 V, 11.189 V, 6.0288 V) and
  frequency (50, 100, 120, 200, 300 Hz seen), plus R and L or C.
- **Items:** 10, **10 pts each**:
  - Series: XL/XC, Z, IR, IL/IC, IT, θ, VR, VL/VC, PT (mW), PA (mVA).
  - Parallel: the same list.
  - Units: Ω, mA, °, V, mW, mVA.
- **Values:** the program picks **round currents** and derives the voltage and parts from them. So
  part values are not standard:
  - Seen: IR = 9.1 mA (RC series); IR = 9.3, IL = 4.0 mA; IR = 5, IC = 8.1 mA; IR = 2.7 mA.
  - Parts seen: L = 518.3 mH, 2.554 H, 4.146 H, 366 mH; C = 3.748 µF, 0.573 µF.
  - R is E12, 560–1500 Ω.
- **"c" check button on each item:**
  - Right: "Right !"; the box locks and the c button disappears.
  - Wrong: "Error", and that item's value drops by 2 (10 → 8 → 6 …). "Maximum possible score" at the
    bottom drops to match.
- **Help:** applies to the highlighted (focused) item.
  - First a dialog: "Using the HELP option cost three points per item … CAUTION! Some calculations
    must be done in a specific order." Choices: Show Help / Exit Help (Exit is free).
  - Show Help takes 3 from that item and shows its formula with a sentence (e.g.
    "IT = V / Z — Total circuit current is found by dividing the source voltage by the circuit
    impedance"). Help is charged each time it is opened.
- **Grade:** grades every item at once, with **no confirmation for blanks**.
  - It animates down the list: ✓ Right or ⊘ plus the correct answer in blue, and the points kept.
  - **Final Grade = sum of the remaining value of each right item.** Example: 10+6+10+8+5+10+10+10+10+0
    = 79. A wrong item scores 0, so its own deductions don't count twice.
- **θ sign is graded on all four sheets.**
  - RC series: −32.29 accepted, +32.29 rejected.
  - RL parallel: −72.95 accepted, +72.95 rejected; the shown answer was −23.27.
  - RL series is positive (55.161); RC parallel is positive (58.313).
  - The help formula for RL parallel is θ = ATN(IL/IR) without a minus sign, yet the answer is negative.
- **Intro (RL series):** voltage leads current by 90° in L, so R and XL add at 90°. Impedance angle is
  0–90°. The help option has a small penalty; practice until confident. Each run has new R values and
  a random operating voltage.

## RLC Series and RLC Parallel

- **Items:** **12**, **8 pts each, plus a free 4** (a blank sheet scores 4):
  XC, XL, Z, IR, IC, IL, IT, θ, VR, VC, VL, PA. **There is no PT item.**
- **Values:** again built from round currents.
  - Series: I = 7.9 mA, XC = 1310, XL = 520, R = 390.
  - Parallel: IR = 8.4, IC = 9.4, IL = 5.4 mA, R = 1000.
- **θ:** series −63.72 (capacitive); parallel +25.463 (capacitive, current angle). The sign is graded.
- **Check, Help and Grade:** as above.

## Series Resonance and Parallel Resonance

- **Layout:** the same 12-item worksheet as RLC (8 pts each + 4): XC, XL, Z, IR, IC, IL, IT, θ, VR,
  VC, VL, PA.
- **The source frequency is given and already equals the resonant frequency** (180 Hz and 100 Hz
  seen). The student does **not** calculate Fr. Low audio frequencies, µF and hundreds of mH.
- **Series example:** R = 390, XL = XC = 618, Z = R, I = 2 mA everywhere, θ = 0, VR = Vs = 0.7799 V,
  VC = VL = 1.2359 V, PA = 1.5599 mVA.
- **Parallel example:** R = 1000, XL = XC = 505.15, IR = IT = 4.9 mA, IL = IC = 9.7 mA, Z = 1000,
  θ = 0, PA = 24.01 mVA.

## Troubleshooting Simple Circuits

- **Board:** series loop J1 – F1 – trace 1 – C1 – trace 2 – R1 – trace 3 – L1 – trace 4 – J2.
  - Pads: J1, F1 top/bottom, C1 left/right, R1 top/bottom, L1 top/bottom, J2.
  - The supply panel shows "AC Volts @ 60Hz" (whole volts) and "AC Ma." (to 3–4 decimals).
- **Values change every item:**
  - Supply **12, 18 or 24 V at 60 Hz**.
  - C1 5.48–19.5 µF, R1 90–316 Ω (not E-series: 90, 126, 130, 153, 168, 171, 200, 252, 268, 316),
    L1 318–1007 mH.
  - The values are printed on the board ("C1 = 13.2 Microfarads", "R1=316 Ohms", "L1=806.3 mH").
- **Probes:** they start with **black on J2 and red on L1 bottom**, and that reading is free.
  - **Only the red probe moves:** clicking a pad moves red, and the black probe stays fixed on J2
    (clicking J2 or right-clicking does nothing).
  - Each new reading costs 1 point; clicking the same pad again is free.
  - The meter drifts in the last digits and can read slightly negative near 0 (−0.004 V).
- **Faults (12):** Fuse Blown, C1 Open/Shorted, R1 Open/Shorted, L1 Open/Shorted, Trace 1–4 Open,
  No Faults.
  - One run gave Trace 4, Fuse, Trace 2, Trace 1, C1 Open, No Faults, C1 Shorted, Trace 3, R1 Shorted,
    R1 Open.
- **Scoring:** 10 items, 12 points each.
  - Right: "Right ! You earned 9 points on this item. Your total score so far is …".
  - Wrong: "Incorrect — The red arrow points to the correct answer"; the red arrow appears next to the
    right fault.
  - Selecting a fault and pressing Grade Item is the only answer; there is no worked explanation.
- **Intro:** four parts in series on a PC board; 20% part tolerance; meters up to 5% off with minor
  drift; ten problems per run; "Twelve different problems can be encountered". It warns that part
  voltages in series RLC can exceed the supply.
  - A reading seen: C1 right to J2 = 58.96 V on a 24 V supply.

## Troubleshooting Transformer Circuits

- **Board:**
  - Primary side: J1 – F1 – trace 1 – primary (P1/P2).
  - Secondary side: S1 – trace 2 – R1 – trace 3 – L1 – common.
  - P2, S2, L1 bottom and J2 all sit on one common trace.
  - Pads: J1, F1 top/bottom, P1, P2, S1, S2, R1 top/bottom, L1 top/bottom, J2.
- **Values change every item:**
  - Line voltage **106–124 V** (whole volts).
  - "Secondary Voltage = **12, 18 or 24 V**" printed above the board.
  - **R1 6–20 Ω** and **L1 15.9–74.2 mH**, printed below the board.
  - XL is often but not always equal to R (12/31.8 mH gives 12 Ω; 9/31.8 does not).
- **Open load:** the supply current drops to a magnetizing current of 12.5–29.5 mA. With a fault on the
  primary side it is 0 mA.
  - No-fault example: 122 V, 12 V secondary, R1 = 6, L1 = 15.9 mH gives 153 mA.
  - L1 shorted example: 106 V, 12 V, 14 Ω, 21.2 mH gives 106.7 mA.
- **Probes:** they start black on J2 and red on L1 bottom (free first reading). Only red moves; 1 point
  per new reading; 12 points per item; 10 items.
- **Faults (10):** Fuse Blown, Primary Open, Secondary Open, R1 Open, L1 Open, L1 Shorted, Trace 1–3
  Open, No Faults. Repeats happen within a run (Trace 3 came up twice).
- **Feedback:** the same as Simple Circuits (Right/points, or Incorrect plus the red arrow).
- **Intro:** fuse, transformer, resistor and inductor on a PC board; 20% tolerance; meters up to 5%
  with some drift; ten problems; "Ten different problems can be encountered"; understand transformers
  and RL circuits first.

## Differences from AC_Circuits_Challenge.html

Most important first. Line numbers refer to `study-pages/AC_Circuits_Challenge.html` at fd1dddd.

1. **Resonance asks a different set of quantities** (`seriesRes` l.1097, `parallelRes` l.1117).
   - The original gives the source frequency (already at resonance) and asks 12 items: XC, XL, Z, IR,
     IC, IL, IT, θ, VR, VC, VL, PA.
   - The HTML hides the frequency, asks **Fr** first, and asks 10 items including PT but not PA
     (series also has no IR/IC/IL; parallel has no VR/VC/VL).
   - The HTML resonant frequencies are 200 Hz–100 kHz (`resValues` l.1091); the original uses low
     audio frequencies (100–180 Hz seen).
2. **Troubleshooting Simple Circuits board differs** (`seriesBoard` l.1290, intro l.1467).
   - Supply: the HTML is a fixed **10 V at 1 kHz** with E12 R 330–3300 Ω. The original changes per item
     to **12/18/24 V at 60 Hz**, with R1 about 90–320 Ω (non-standard values), C1 about 5–20 µF and
     L1 about 0.3–1 H, printed on the board.
   - Start position: the HTML gives **no start position** (probes off the board, l.1400 `TS_HOW`). The
     original starts black on J2 and red on L1 bottom with a free reading.
3. **Probe handling** (`CC.trouble` l.811, `TS_HOW` l.1400). In both originals the **black probe is
   fixed on J2** and only red moves. The HTML lets either probe move (Red/Black probe buttons), which
   gives readings the original can't, such as across a single part.
4. **Troubleshooting Transformer Circuits uses fixed values** (`xfmrBoard` l.1338: 12 V secondary,
   R1 = 8 Ω, L1 = 21.2 mH, intro l.1470).
   - The original changes them per item: secondary 12/18/24 V, R1 6–20 Ω, L1 about 16–74 mH, line
     106–124 V. The secondary voltage label changes with them.
   - The HTML magnetizing current is about 9–12 mA (`Imag`, l.1358); the original showed 12.5–29.5 mA.
5. **Tolerance.** The HTML uses **2%** everywhere (`CC.close` default l.259, `TOLNOTE` l.955, `PS_HOW`
   l.1436) and θ within 0.6° (`PH_TOL` l.952).
   - The original accepts about **±6%** (conversions, transformers) and **±5%** (series/parallel C/L
     and worksheets), with θ relative (a 2° miss was accepted).
   - The intro text promising 2% would need changing too.
6. **θ sign on the RC/RL worksheets.** The HTML accepts either sign (`SIGN_FREE`, `signFree:!rlc` at
   l.1009 and l.1070). The original **grades the sign on all six non-resonant sheets**:
   - RC series negative, RL series positive.
   - RC parallel positive, RL parallel negative.
   - The original's θ conventions match the HTML's values; only the grading differs.
7. **RLC worksheets.** The HTML has 13 items including **PT** (`seriesWS`/`parallelWS`); the original
   has 12 (no PT), each worth 8 points with a free 4.
8. **Worksheet scoring rule** (`CC.worksheet` l.710–755).
   - HTML: score = % right minus every deduction. A penalty on an item that ends up wrong is lost
     twice, and the score can go negative.
   - Original: each item has its own value (10, or 8) that wrong checks (−2) and help (−3) reduce. The
     final grade adds up the remaining values of right items only.
   - Original extras: a right check **locks** the item and hides its c button. Help is charged on every
     opening (the HTML charges once per item). The original also shows a live "Maximum possible score".
   - The HTML asks for confirmation when boxes are blank (l.745); the original grades at once.
9. **Transformers** (`transformerSet` l.1257).
   - The original has **8** problems; the HTML has 10 (`count:10`, `PS_HOW('ten')`).
   - The original uses small integer values: turns 15–432, currents in whole amps, R 1–64 Ω.
   - Its known sets can include **Ip** or both currents. The HTML `combos` never give Ip and never give
     Is together with Ip.
10. **Series and Parallel C units** (`spProblems` l.1209). The original mixes **µF and pF** (shown as
    "µµF") and uses values 2.2–1000. The HTML uses µF only, 0.01–100. Inductors match (mH, 3 per type,
    12 problems).
11. **Blank answers in Series/Parallel C/L.** The original refuses to grade ("Please correct error in
    number format"); the HTML grades a blank as wrong.
12. **Value style on the worksheets.**
    - The original picks round branch or series currents and derives V, C and L. That gives odd
      voltages (2.7527 V), part values off the E-series (518.3 mH, 3.748 µF, 4.146 H), and frequencies
      50–300 Hz.
    - The HTML picks round V from a list (`pickV` l.923), F up to 10 kHz (`pickF` l.924) and E12 parts
      limited to 1 mH–1 H and 1 nF–10 µF (l.925–929).
    - This is a matter of taste rather than a bug. Note that the original's L can exceed 1 H.
13. **Conversions values.** The original builds each set from an rms value with one decimal and shows
    the given value to 3 decimals. The HTML picks a 3-significant-figure given value of any kind
    (`conversions` l.1177). The behaviour is otherwise the same: 11 sets, one grade each, answers
    revealed.
14. **Pass mark.** The HTML has `pass:80` (l.1441); no pass mark was seen in the original.
15. **HTML additions the original lacks** (fine to keep): worked solutions after grading, the phasor
    diagram card, worked "how to find this fault" explanations in troubleshooting, and a readings log.
    The original only shows correct answers, the formula (C/L) or the red arrow.

**Not determined:** whether help cost repeats on the same item in every case (seen once per opening);
the exact tolerance edge (somewhere between 5.8% and 6.0% for conversions, and between 4.8% and 5.0% on
worksheets); whether any exercise has a pass threshold hidden in the grade file; and the Manual's
contents (not opened).
