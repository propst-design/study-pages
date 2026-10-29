# Power Supply Challenge (power99.exe, "Power Supply Challenge 98", V3.0, © 1993–2008 ETCAI)

How I found this out: I played the program under Wine. Every exercise except the
voltmeter ones was played through to the end at least once: 6 troubleshooting exercises, about 64
supplies in all, plus practice mode. Values on the scope were read from the screen pixels (10 px per
division). Voltmeter values were read with OCR. Help and manual text come from the form resources
(TFORM1, TINFORMATIONFORM; dump them with `tools/dfm.py`).
**[inferred]** marks conclusions drawn from patterns rather than seen directly.

## Main menu (global)

- 7 exercise buttons: Half-Wave / Full-Wave / Bridge Troubleshooting with Oscilloscope, the same
  three with Voltmeter, and Measurement Practice with No Circuit Faults.
- Utility buttons: Check Validity (for certificates), Print Grade File, About, Manual, Options,
  Animation Speed.
- An animated demo on the menu moves a probe around a bridge supply and shows captions such as
  "The peak to peak voltage measures 320 volts. This is equivalent to 113.1 volts rms…" and
  "…ripple 800 mV… 120 Hertz…".
- A troubleshooting button goes **straight into supply 1 of 10**. There is no intro page.
- **Options dialog**: three checkboxes, Print Certificates, Store scores on disk, Display wallpaper.
  Defaults come from `options.ini`, whose line 4 is the grade-file path (default `a:`). There are
  **no scoring options**.
- **Grade file**: `g<ID digits>` on drive A:, one record per finished exercise, each with a
  "validity code". Print Grade File checks the records (prints E! for an edited record, D! for a
  duplicate).

## Common screen for all six troubleshooting exercises

- Top: a green PC board labelled "REV97-2B" with AC input L1/L2/G, a switch, fuse F1, an "ACME"
  transformer, the rectifier diodes, a 4700 µF C1, R1 (yellow-violet-red, 4.7 kΩ), and U1 (a
  TO-220) feeding a "Vcc" pin to an "AMP PCB". The scope or meter is on the right. The **black lead
  is fixed** on the PCB ground (G, bottom right). At the start of each supply the **red lead sits on
  G (input ground)**.
- Bottom-left tabbed notebook: **Schematic | Specifications | Score | Help**.
  - Specifications, e.g.: "Transformer Primary = 120 VAC; Transformer Secondary = 10 V; Diodes = 50 V
    PIV @ 2 A, Silicon Type; Capacitor = 4700 MFD @ 25VDC; Regulator = 8 Volts, Type LM7808".
  - Score tab text: "Test the circuit then select the part to replace. / N points are available for
    repairing this power supply. / Power supply k of 10 -- Your current total score is T points."
    Below that is the SCORING memo.
- Bottom right: the **SELECT PART TO REPLACE** radio list, which always has all **11 items** for
  every supply type: Switch, Fuse, Transformer primary, Transformer secondary, Capacitor C1,
  Resistor R1, Regulator U1, Diode D1, D2, D3, D4. Buttons: **Grade selection** and **Quit
  exercise**.
- **Moving the red lead**: click a part lead. Each move to a *different* point costs **1 point**
  (moving back to an earlier point costs again).
  - Probe points: L1; switch left/right; fuse left/right; transformer P1, P2, S1, S2 (and CT for
    full-wave); each diode lead; C1+; R1 top; U1 in, ground, out. These are clickable hotspots on
    the drawing. Clicking anywhere else does nothing and costs nothing.
  - **P2 is the hot primary lead** (fuse → P2). P1 goes to L2 (neutral) and reads 0.
  - Half-wave: **S2 is the hot secondary end** and S1 is grounded.
  - On U1 the top pin is the output (to Vcc), the middle pin is ground and the bottom pin is the
    input.
- **Ohmmeter**: **double-click** a part on the board. Testable parts are the transformer primary,
  the secondary, R1, and any diode body.
  - The notebook hides, the part is drawn "removed" on the Ohm Master meter, and the scope goes into
    "Storage Mode Active".
  - Pressing **ON** takes the reading and **costs 2 points** (hint: "Two points for each use").
  - **+/–** swaps the lead polarity for free. OFF or CANCEL closes the meter and brings the notebook
    back.
  - C1, U1, the switch and the fuse can't be tested.
  - Readings print to many decimals:
    - primary ≈ 3.87 Ω, secondary ≈ 0.254 Ω;
    - R1 ≈ 4777 Ω;
    - good diode ≈ 320 Ω forward and 99999.0x reversed;
    - an open winding or diode reads 99999.0x (both ways for a diode).
- **Grading**: choose a part, then Grade selection. Feedback appears on the Score tab:
  - Correct: "Excellent, you are RIGHT ! ! !"; the points left on this supply are added to the total.
  - Wrong: −5 (the item can't go below 0). Messages: "Sorry, your selection is incorrect. Try again.
    … You have two more attempts…", then "…one more attempt…".
  - **The wrong option stays enabled and selected.** Grading the same wrong part again counts as
    another try and costs another 5.
  - After the 3rd wrong try: "Sorry, your are incorrect. An arrow points to the correct option. No
    points were earned servicing this power supply. Select "NEXT ITEM"…". A red arrow appears next
    to the correct list entry and the list is disabled.
  - After an item is finished, the probe can't be moved.
  - A **Next Power Supply** button appears on the Score tab. A new supply resets the points to 13
    and puts the red lead back on G. Gain and coupling settings carry over.
- **Scoring**: 10 supplies × 13 points. A move costs 1, an ohmmeter use costs 2, a wrong answer
  costs 5; floor 0 per supply; max 130. The help says practical scores are "much less than 130 even
  for an expert". **No pass mark** exists anywhere.
- **End of an exercise**:
  1. After supply 10 the Score tab says "Your exercise is complete." with a **Score Printing**
     button → message box "Exercise completed. Select OK to continue."
  2. The student then presses **Quit exercise** → "Request User Name" dialog (name ≥ 2 letters,
     ID 2–9 digits; Store grade on disk / Skip) → Achievement Certificate (Topic title, e.g.
     "Half-Wave PS Scope T-Shooting", Name, User ID, Date/Time, **Exercise score: N %**, Time on
     task, Validity code; Printer setup / Print / Do not print) → back to the menu.
  - **The certificate shows the raw point total with a "%" sign**: 61 points printed as "61 %",
    3 points as "3 %". The true percentages are 47% and 2%.
  - "Time on task" seemed to count from **program launch**, not from the exercise start: 46:27 on
    an exercise that took about 5 min. I saw this as a bug.
  - **Quit exercise before supply 10** asks "Are you sure?" and returns to the menu with no
    certificate and no grade record.

## Half-Wave Troubleshooting with Oscilloscope

- Board: one diode D1 (anode toward S2, cathode to C1+), T1 with P1/P2/S1/S2. The list still shows
  D1–D4.
- **Scope ("Scope Master")**:
  - Vertical gain radio buttons: .2 / 1 / 5 / 50 V/Div (**starts at 50 V/Div**). DC/AC coupling
    (starts on DC). A fixed sweep of **5 mS/Div** (10 divisions, so 3 cycles of 60 Hz).
  - Position arrows **up/down/left/right**. The screen is 8 divisions high.
  - Changing gain or coupling is free.
  - Every AC point is drawn with the **same phase**: the full-wave S1 and S2 look identical, so
    phase isn't simulated.
  - The line on L1 is about 320 V p-p (clipped at 5 V/div).
- Values vary per supply:
  - secondary 9–12 V rms (whole volts seen: 9, 10, 11, 12);
  - regulator 5, 6, 7 or 8 V (LM7805–LM7808);
  - line voltage 111–126 V rms (from the voltmeter runs);
  - C1 about 1.4 × Vsec − 0.7 (e.g. 13.8 V for 10 V);
  - ripple on a good half-wave C1 about 0.4 V p-p at 60 Hz (AC, 0.2 V/div).
- Faults seen in 10 + 3 supplies, with their signatures:
  - **Switch**: L1 has line; switch right and everything after it read 0.
  - **Fuse**: switch right has line; fuse right reads 0.
  - **Transformer primary** and **Transformer secondary**: P2 has line, both secondary ends read 0.
    The two look identical on voltage readings; only the ohmmeter (99999 on the bad winding) tells
    them apart.
  - **Capacitor C1**: C1+ shows bare half-sine pulses (0 → peak, mean ≈ 5 V DC on 16 V peak), and
    the U1 output drops out (max 8, mean 1.9 V).
  - **Regulator U1**, two forms:
    - (a) output 0 V with C1 charged near the peak;
    - (b) **output equals input** (C1 voltage, ripple passed through). Answer "Regulator U1" both
      times.
  - **Diode D1**: secondary present, D1 cathode/C1/output all 0. Seen in the voltmeter version.
- **Resistor R1 was never the fault** in any of about 64 supplies across all exercises
  **[inferred: R1 isn't in the fault pool]**. D2–D4 never came up in half-wave.

## Full-Wave Troubleshooting with Oscilloscope

- Board: centre-tapped T1 (S2, CT, S1 drawn higher), D1 and D2 stacked, cathodes joined to C1+.
  Probe hotspots for S2/S1 are the same as for half-wave. CT and the D2 anode didn't respond to
  clicks.
- Normal readings: secondary each half peaks at 12–16 V, C1 11–15 V DC with small ripple, output at
  the rated voltage.
- Faults seen (10 supplies): Regulator U1 (×2, both "output = input"), Diode D1 (×3), Diode D2,
  Transformer primary, Transformer secondary, Capacitor C1, Switch.
  - **Open diode**: the ripple grows (C1 13.5–15.5 V with about 1–2 V p-p instead of about 0.5) but
    **the output stays regulated**.
  - The full-wave voltmeter run also showed D1 open as C1 ripple 1.05 V AC vs normal about 0.4.
  - C1 open: pulses 0–14 V, output 0–5 V.

## Bridge Troubleshooting with Oscilloscope

- Board: D1/D2 top row and D3/D4 bottom row.
  - The D1 bottom and D3 top pads are the bridge minus (0 V).
  - The D2 bottom and D4 top pads are the bridge plus (= C1+).
  - S2 reaches the D1 top / D2 top node; S1 reaches the D3 bottom / D4 bottom node.
- Normal readings: measured to ground, **S1 and S2 each show positive half-wave pulses** (0 → peak,
  e.g. 16 V peak, mean 7.9 V). C1 12–14 V with about 0.5 V ripple.
- Faults seen (10 supplies): Transformer secondary, Switch, Diode D2 (×2), Regulator U1 (dead, and
  output = input), Fuse, Diode D3, Capacitor C1, Transformer primary.
  - **Open diode**: the S1/S2 waveforms go lopsided. Examples: D2 open gives S2 up to 20 V with min
    −0.5, and S1 0–12.5; D3 open gives S2 17.5/−1.5 and S1 ±10.
  - The ripple on C1 grows, and the output stays regulated.

## Half-, Full-, Bridge Troubleshooting with Voltmeter

- Same board and same rules. The instrument is the "Super Autoranger Model 1010" digital voltmeter
  with a **DC/AC** switch. Switching is free; checked, 6 switches didn't cost a point.
- The display autoranges and shows **raw noisy values with up to 6 decimals**: e.g. "0.094668"
  near 0, "125.5647" for line AC, "15.78096" DC. A grounded point reads ±0.1 V of random noise.
- AC readings:
  - line 111–126 V (random per supply);
  - secondary 8.4–11.7 V AC;
  - good C1 ripple 0.33–0.66 V AC (half-wave), about 0.37 V (bridge practice);
  - open C1 on a half-wave reads about 4.6 V DC / 4.8 V AC at C1, with the output at about
    2.4–3.5 V DC.
- Bridge (good, practice): S1 and S2 each read about 6.2 V DC / 6.6 V AC (half of C1 on DC); C1 11.7
  DC / 0.37 AC; output 7.03 V.
- Bridge, D4 open: S2 9.6 DC / 9.0 AC, S1 9.7 DC / 6.4 AC, C1 ripple 0.9 V AC, output still 6.09
  (rated 6).
- Faults seen:
  - half-wave: Fuse, D1 ×2, Switch ×2, U1 (output = input) ×2, C1 ×2, Secondary;
  - full-wave, blind-guess run: D2 ×3, U1 ×4, Switch, Primary, Secondary;
  - bridge: Switch, D4 ×2.

## Measurement Practice with No Circuit Faults

- Clicking the menu button opens a panel: "Voltmeter Measurements" or "Oscilloscope Measurements",
  each × Half-Wave / Full-Wave / Bridge (6 buttons), plus Exit. Each opens a new working supply with
  new parameters.
- Same board and instruments. The part list is greyed out, there is no Grade selection button, and
  the Score tab shows "This is a simulation of a functional circuit… There is no scoring."
- The ohmmeter works. Quit exercise returns to the menu after "Are you sure?".

## Differences from Power_Supply_Challenge.html

Most important first. Line numbers refer to `study-pages/Power_Supply_Challenge.html` at fd1dddd.

1. **Pass mark and percentage.**
   - Original: no pass mark. It reports raw points out of 130, and the certificate even labels the
     points as "%". Its own help says practical scores are far below 130.
   - HTML: grades `total/(N*PTS)*100` with `pass:60` (`end`, l.1184; `CC.App.init` `pass:60`,
     l.1213). That needs 78/130, which by the original's own description is hard even for experts.
     Consider a much lower pass mark, or reporting points only.
2. **Fault pool.**
   - HTML picks the fault uniformly from `PS.parts(type)` (l.1111), which **includes Resistor R1**
     (l.930), and has an R1 explanation (l.1006).
   - The original never faulted R1 in about 64 supplies **[inferred: R1 not a fault]**. In the
     original, U1 was the most common fault (about 25%) and the switch and transformer were common.
3. **Regulator fault has two forms in the original:** output dead (0 V), or **output = input**
   (shorted pass element). HTML models only "no output" (`regOut`, l.951; explanation l.1007).
4. **The part list always has 11 entries in the original** (D1–D4 even for half- and full-wave), so
   absent diodes are possible wrong answers. HTML lists only the diodes present (`PS.parts`, l.930;
   radio list l.1129).
5. **Wrong-answer handling.**
   - Original: a wrong choice stays selectable, and re-grading the same wrong part uses another try
     and another 5 points.
   - HTML disables and unchecks the wrong option (l.1176). It's friendlier, but different.
6. **Component values.** HTML `PS.make` (l.935) and `specs` (l.987) don't match the original:

   | | Original | HTML |
   |---|---|---|
   | Secondary | 9–12 V rms in whole volts | 12.6, 18 or 24 V |
   | Regulator | 5–8 V (LM7805–7808) | 5/9/12/15 V |
   | Diodes | "50 V PIV @ 2 A, Silicon" | 1N4004 |
   | C1 | 4700 µF @ 25 VDC | @ 35 V |
   | R1 | 4.7 kΩ, not in the spec list | 1/1.5/2.2 kΩ |
   | Line | random about 111–126 V | 120 V ± 2 % (l.932) |
   | Spec list | no fuse or load spec | fuse spec and load current |
7. **Ohmmeter.**
   - Original: double-click the part on the board, then press ON (2 points per use). +/– is free.
     Readings:
     - primary ≈ 3.9 Ω, secondary ≈ 0.25 Ω;
     - R1 ≈ 4.78 kΩ;
     - diode ≈ 320 Ω forward, "99999.0…" reverse/open.
   - HTML: a separate Ohmmeter tab with a part dropdown (l.1158–1165) and "OL" for open.
   - HTML readings (`c.ohm`, l.980–984):
     - primary 9–14 Ω, secondary 0.4–1.2 Ω;
     - R1 1–2.2 kΩ;
     - diode 0.55–0.7 kΩ forward.
8. **Primary/secondary lead naming.**
   - Original: P2 is the hot primary lead, and on half-wave **S2** is the hot secondary end (S1
     grounded).
   - HTML: P1 hot / P2 neutral (`wave` l.965–966, board l.1035). Half-wave S1 is hot and S2 is 0
     (l.967–971).
   - Cosmetic, but a student comparing with the original will see swapped labels.
9. **Start position of the red lead.** The original puts the red lead on G at every new supply, so
   the first move costs 1. In HTML `probe=null` (l.1113) and the first tap also costs 1. Same cost
   in effect, but no "G" reading exists.
10. **Voltmeter display.** The original autoranges with noisy, many-digit readings (±0.1 V noise
    near zero, up to 6 decimals). HTML shows 2 decimals with a ±1.5 % bias (l.1136, 1140).
    **[Judgement]** HTML is cleaner; keep it unless matching the look matters.
11. **Scope.**
    - Original: position arrows up/down/**left/right**; starts at 50 V/Div; all AC points drawn in
      the same phase.
    - HTML: up/down/Center (l.1122), starts at 5 V/div (l.1114), real phase on S1/S2.
    - The original also shows "Storage Mode Active" while the ohmmeter is open. Minor.
12. **End-of-exercise flow and records.**
    - Original: Score Printing → Quit → name/ID → optional disk record + certificate (with validity
      code). Quitting early saves nothing.
    - HTML finishes automatically after supply 10 (l.1171, l.1184).
    - Original "time on task" ran from program launch (a bug); no need to copy it.
13. **HTML additions not in the original**: intro/theory page per exercise (l.1201–1208), a
    "Show how to find this fault" explanation after each supply (`PS.explain`, l.994–1017, l.1180),
    a Score tab with tries used, and a "Center" button. None conflict with the original; they're
    extras.
14. **Practice mode.** The original opens from a 6-button picker (3 types × voltmeter/scope). HTML
    starts on bridge + scope with in-page type and instrument buttons (l.1100, l.1220). Equivalent.
15. **Bridge waveforms.** Both show S1/S2 as positive half-wave pulses to ground. On the voltmeter
    the original reads S1/S2 ≈ ½ C1 on DC and ≈ 6.6 V on AC (for 9 V rms). HTML computes the true
    mean and AC rms of its model (≈ Vp/π DC). Numbers will differ, and the behaviour is the same.

Could not determine:
- whether R1 can ever be a fault (0 in about 64);
- the full ranges (only whole-volt secondaries 9–12 and regulators 5–8 were seen);
- whether a fault is ever repeated in the same order rules (the order looked random).
