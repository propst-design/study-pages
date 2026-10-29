# Content audit

Reviewed against source revision `de9b2cf` on October 28, 2026 (America/Chicago).

This report records **30 findings from the original audit**. All 30 have now been addressed, including fixes already present in remote commit `06de466`, which was incorporated before the remaining changes. The descriptions below preserve the original evidence and locations; they describe the audited snapshot rather than the corrected behavior.

## Remediation record

| Findings | Resolution |
| --- | --- |
| 01–02 | Retained the remote's 400 V 1N4004 rectifiers and 2 W bleeders; independently verified margin for every generated voltage/resistance combination. |
| 03 | Practice selects real isotope tuples, retains all displayed mass digits, and constrains related inputs before grading. Impossible bound-nucleus masses are rejected. |
| 04 | Transimpedance text, inverse formula, worked steps and answer key use one signed-current convention; reverse-current signs are graded. |
| 05–08 | Invalid regulator and passive-meter designs show explanatory validation messages. Discrete quantum/count inputs reject fractions, equality cases are handled, and zero vectors have undefined directions/angles. |
| 09–11 | Corrected BJT injection wording; retained the remote's consistent virtual-field explanation and reversible-adiabatic glossary fix. |
| 12–20 | Clarified friction work, signed displacement, acceleration assumptions, retarded Doppler geometry, reflection exceptions, evanescent flux, material models, latent heat and external-pressure boundary work across the affected articles and alternate explanations. |
| 21–25 | Qualified voltage versus power decibels, explained the 741 corner-frequency error, retained synchronous-counter hazard corrections, limited semiconductor temperature claims to their regimes, and replaced the universal diode-resistor claim. |
| 26–30 | Added the lithium discrepancy, scoped CMB photon density, stated true-rms limitations and external-alpha exceptions, and corrected the tile-example title. |

The service-worker cache version was advanced to `v7` so installed/offline copies refresh the changed pages. The scope limits of the original audit remain; resolving these findings is not a claim to have independently verified every remaining example or historical statement.

## Scope and evidence

The inventory covers all 12 HTML pages: the hub, challenge menu, Physics Field Notes and all nine challenge programs. Field Notes contains 142 topics, 337 worked examples, 762 applications, 288 glossary entries, 141 calculators, and 142 alternate-explanation sections (1,856 concept questions, 1,781 symbol/term questions, and 122 numerical add-ons). The challenges register 124 modules, including introductions and ungraded activities.

Review depth is different from inventory coverage:

| Material | Review performed |
| --- | --- |
| Main physics articles | Source-text review across all topics for formulas, assumptions and conceptual correctness |
| Glossary | Definitions read, including consistency with articles |
| Calculators | All 141 executed at default inputs; implementation review and targeted invalid-input reproductions |
| Alternate explanations | Targeted cross-topic review, numerical scale checks and searches for misleading universal claims |
| Worked examples and applications | Sampled technical review; these have **not all been independently recalculated or source-verified** |
| All nine challenge pages | Inline scripts parsed and registration executed in an isolated headless context; selected teaching text and models reviewed |
| Generated challenge questions | 100 runs of each of 60 modules: 6,000 runs and 90,500 answer fields checked for finite numeric values and valid choice indices |
| Custom probe activities, simulations and diagrams | Selected source/model inspection; **no exhaustive browser interaction or visual audit** |
| History notes and changing real-world statistics | Not independently fact-checked in full |

This is a site-wide audit with explicit sampling limits, **not certification that every sentence, example, diagram or generated answer is correct**. In particular, passing the automated checks below does not establish scientific correctness.

Reproduce the checks from the repository root:

```sh
node scripts/audit-content.mjs
node scripts/audit-challenges.mjs
node --test tests/learning-material.test.cjs
```

Both commands pass their structural checks. There are no duplicate topic IDs, missing application/alternate sections, invalid related-topic/glossary links detected by the checks, calculator output-count mismatches, non-finite default calculator results, or syntax errors in the 45 inline scripts. The challenge sample also has no detected non-finite numeric keys or invalid multiple-choice indices. The component-rating checks now use the actual specified ratings and fail if the conservative stress bounds lack a 50% margin. All 3,000 sampled supplies pass. Eleven regression tests cover physical constraints, isotope practice precision, undefined vectors and signed answer grading, as well as the existing default and rating checks.

## Priority 1: correct first

### 01. Generated power supplies exceed the rectifier's reverse-voltage rating

**Location:** `study-pages/Power_Supply_Challenge.html`, `PS.make`, lines 934–981; especially the `1N4001` specification.

Half-wave and center-tapped full-wave supplies can select 18 or 24 V rms (each half for the center-tapped case), yet every diode is identified as a 1N4001. Its repetitive reverse rating is 50 V. With a reservoir capacitor, reverse stress is approximately twice the secondary peak less a diode drop: about 50.2 V for 18 V rms and 67.2 V for 24 V rms. A supposedly normal supply can therefore contain an underrated rectifier.

**Correction:** choose a suitably rated diode, such as a 1N4002 or higher-voltage member with appropriate margin, or restrict the generated transformer voltages. Check the worst case rather than only nominal output voltage. [Vishay's 1N4001–1N4007 product data](https://www.vishay.com/en/product/88503/) supports the 50 V rating.

The deterministic model check finds reverse stress above 50 V in 721/1,000 half-wave and 715/1,000 center-tapped samples. These are generated-sample counts, not failure probabilities for real components.

### 02. Generated bleeder resistors exceed their stated power rating

**Location:** `Power_Supply_Challenge.html`, `PS.make`, `R1` selection and `c.specs()`.

R1 is selected from 1 kΩ, 1.5 kΩ and 2.2 kΩ but is always labeled ½ W. A 24 V rms secondary produces a bus near 32–33 V. Across 1 kΩ that dissipates about 1 W; 1.5 kΩ can also exceed ½ W. The simulation presents these as working components.

**Correction:** select resistance and wattage together using mean-square bus voltage divided by resistance, with thermal margin. Update both the parameter list and resistor drawing.

The deterministic checks find mean dissipation above ½ W in 353/1,000 half-wave, 348/1,000 center-tapped and 354/1,000 bridge samples.

### 03. Random practice generation can teach impossible nuclear data

**Location:** `field-notes-physics.html`, `wirePractice.make`, lines 1250–1265; `CALC.binding`, around line 836; topic `binding`.

The generic generator independently varies proton count, neutron count and atomic mass. For example, the generated values `Z=2, N=2, M=5 u` are reachable from the defaults. The calculator returns a binding energy of approximately **−900.77 MeV**, and practice accepts finite nonzero negative results as questions. Independently randomizing tightly related physical quantities also affects other topics.

**Correction:** generate topic-specific, physically consistent input tuples. For binding energy, choose a real isotope and its isotope mass together; do not randomize its mass independently. Validate physical relationships before choosing an answer row, not merely whether the row contains a finite number.

## Priority 2: correctness and misleading explanations

### 04. The inverse current-to-voltage formula loses its sign

**Location:** `Op_Amp_Challenge.html`, `T.itov`, around line 951, and the reverse-current item in `simpleItems`, around line 1247.

The text correctly gives `Vout = −Iin Rf`, then says the inverse is `Iin = Vout/Rf`. Under the same current direction it must be **`Iin = −Vout/Rf`**. The reverse exercise accepts either sign, so it conceals the inconsistency.

**Correction:** keep a single signed convention throughout. If the question only wants magnitude, explicitly ask for magnitude and write `|Iin| = |Vout|/Rf`. A positive output corresponds to negative input current under the stated convention. See [TI's transimpedance application report](https://www.ti.com/mx/lit/pdf/sloa272).

### 05. A linear-regulator calculator reports efficiency above 100%

**Location:** `field-notes-physics.html`, `CALC.powersupplies`, around line 880; topic `powersupplies`.

With `Vrms=12 V, f=60 Hz, C=0.0022 F, I=0.5 A, Vout=20 V`, the calculator reports **136.77% efficiency**, even though the calculated reservoir valley is only 13.68 V. The requested linear-regulator output is unattainable.

**Correction:** check dropout/headroom and validity of the small-ripple approximation. Report that the requested output cannot be regulated instead of computing efficiency from it. Use the same validity rule in generated practice.

### 06. Meter design accepts impossible passive resistor values

**Location:** `CALC.meters`, around line 881; topic `meters`.

For `Ig=1 mA, Rg=2000 Ω, I=0.5 mA, V=1 V`, the outputs include **−4000 Ω** for the shunt and **−1000 Ω** for the multiplier. Those are not realizable passive range-extension resistors.

**Correction:** require an ammeter target above the movement's full-scale current and a voltmeter target at least its full-scale coil voltage. Handle equality explicitly as a no-extension case rather than dividing by zero.

### 07. Atomic calculators accept fractional quantum numbers

**Location:** `CALC.bohr`, around line 826; related integer inputs in atomic/nuclear calculators.

`ni=2.5, nf=1` produces a normal-looking hydrogen photon energy and wavelength. Such a hydrogen principal quantum number is not allowed. The check only enforces ordering and a lower bound.

**Correction:** reject non-integer quantum numbers and nucleon counts. Where another calculator currently rounds silently, either reject the value or clearly show the effective integer used.

### 08. The angle of a zero vector is reported as 0°

**Location:** `CALC.products`, around line 911; also review `CALC.vectors` for a zero resultant.

The implementation uses `atan2(|A×B|, A·B)`. If either vector is zero, both arguments are zero, and JavaScript returns zero. The angle between a zero vector and another vector is **undefined**, not 0°.

**Correction:** detect zero magnitudes and return an explanatory undefined result. Likewise, a zero resultant has no direction.

### 09. BJT carrier flow enters through the wrong terminal in the alternate explanation

**Location:** `ALT.transistors.nums`, opening paragraph.

After correctly stating `IB=0.1 mA, IC=10 mA, IE=10.1 mA`, the text says about 99 of every 100 electrons entering the **base** reach the collector. The intended carrier flow is electrons injected **from the emitter into the base**, with most then reaching the collector. The base-terminal current is the small recombination current, not the large injection current.

**Correction:** say “about 99 of every 100 electrons injected by the emitter into the base reach the collector.”

### 10. Virtual-particle explanations incorrectly allow temporary energy violations

**Location:** topic `standardmodel`, body and alternate `why`, concept Q&A and symbol explanations.

The explanation says energy that is not available can be borrowed to create a carrier and repaid within an uncertainty-principle deadline. Energy-time uncertainty is not permission to violate energy conservation. A virtual exchange is not an on-shell particle traveling for a literal loan period.

**Correction:** retain the useful scale `R ≈ ℏ/(mc)` but describe it as the characteristic range of a massive field. Explain that a massive mediator gives an exponentially suppressed long-distance interaction. Remove the loan mechanism consistently from all explanation tabs.

### 11. The adiabatic glossary definition contradicts the article

**Location:** `GLOSSARY`, “Adiabatic process”; topic `processes`.

The definition says an ideal gas in an adiabatic process has constant `pV^γ`. The article correctly explains that free expansion is adiabatic but does **not** obey this relation.

**Correction:** define adiabatic as `Q=0`; qualify `pV^γ=constant` as applying to a reversible adiabatic ideal-gas process with the stated heat-capacity assumptions. [MIT's thermodynamics notes](https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/node18.html) make this distinction.

### 12. Kinetic friction is described as always doing negative work

**Location:** topic `friction`, body paragraph “How good are these rules?”; related energy explanations.

Sliding friction opposes **relative slip**, not necessarily an object's velocity in the chosen frame. A moving conveyor belt can accelerate a slipping box, so friction does positive work on the box while the contact still dissipates mechanical energy.

**Correction:** distinguish work on one object from dissipation across the two contacting bodies. The heat generated is friction magnitude times relative sliding distance; the work on a particular body uses that body's displacement in the selected frame.

### 13. Alternate kinematics explanations undo the distance/displacement distinction

**Location:** `ALT.kinematics.why` and Q&A about the velocity-time graph; article wording about speedometers.

The main article correctly distinguishes distance from displacement, but the alternate explanation calls area under a velocity-time graph “distance covered.” It also repeatedly says a speedometer shows velocity. A speedometer ordinarily reports speed, without a signed direction.

**Correction:** use **signed area = displacement** and **area under |velocity| = distance**. Describe the speedometer as showing instantaneous speed, the magnitude of velocity. Apply this consistently to the Q&A and notation explanations.

### 14. An acceleration application infers distance from insufficient information

**Location:** `APPS.kinematics`, “Acceleration figures for cars.”

A 0–100 km/h time of 8 s determines average acceleration, but does not by itself determine distance traveled. The stated approximately 110 m assumes a linear velocity-time graph, hence constant acceleration.

**Correction:** add “assuming roughly constant acceleration” before the distance estimate. Explain that actual distance requires the velocity-time curve.

### 15. The passing-siren explanation omits sound travel time

**Location:** topic `doppler`, paragraph beginning “Only motion along the line…”.

It says the heard frequency passes through the emitted frequency at the instant the source is at closest approach. For a stationary listener, the relevant source direction is the direction **when the sound was emitted**. Sound emitted at closest approach arrives later, so the crossover is delayed.

**Correction:** use emission-position geometry or explicitly call the instantaneous-position account an approximation when propagation delay can be ignored. The direct approach/recession examples remain valid for their stated geometry.

### 16. “Some light always reflects” conflicts with Brewster's angle

**Location:** topics `refraction` and `tir`, and their alternate explanations; compare `polarization`.

The blanket statement is false for ideal p-polarized light at Brewster incidence, which the polarization article itself explains. Index-matched boundaries also need not reflect.

**Correction:** say reflection generally occurs at an index mismatch, and state the polarization/angle exceptions. At normal incidence the given Fresnel fraction already becomes zero when the two indices match.

### 17. The evanescent field is said to carry no energy

**Location:** topic `tir`, final paragraph and corresponding alternate explanation.

In ideal total internal reflection there is no time-averaged energy flux **normal to the interface into a lossless second medium**. This does not mean the evanescent field has no energy or no energy flow: it stores energy and can have tangential energy flux.

**Correction:** specify the direction and ideal lossless assumptions. Preserve the discussion of coupling to a nearby second material.

### 18. Maxwell's equations in matter cannot generally be obtained by replacing constants

**Location:** topic `maxwell`, final paragraph.

The article says to replace `ε0, μ0` by `ε, μ` inside materials, then concludes light is slower than `c`. That shortcut only works under restricted constitutive assumptions. Macroscopic equations use `D` and `H` with free charges/currents, or retain `E` and `B` with total sources. Dispersion, anisotropy and losses need additional treatment; phase speed need not always be below `c`.

**Correction:** introduce the linear, homogeneous, isotropic, approximately lossless model before using `v=1/√(με)`. Do not present it as a universal substitution in the displayed microscopic equations.

### 19. Latent heat is described as breaking molecular bonds

**Location:** topic `heat`, paragraph introducing phase changes.

For melting ice and boiling water, the relevant energy changes are principally intermolecular interactions and, for vaporization, expansion work. The covalent O–H bonds within water molecules are not broken by ordinary melting or boiling.

**Correction:** say the energy changes the arrangement and interactions **between molecules**. State the fixed-pressure/pure-substance assumptions for a constant-temperature phase transition.

### 20. Gas work needs an external-pressure or reversibility qualification

**Location:** topic `firstlaw`, `W=∫P dV` explanation.

For irreversible boundary work, the resisting external pressure is what determines the work. Substituting an equilibrium gas pressure without qualification fails for free expansion: the gas initially has pressure, yet does no boundary work against vacuum.

**Correction:** write `W=∫P_external dV` for simple piston boundary work, then use gas pressure for a reversible/quasi-static mechanical-equilibrium path. Cross-link the correct free-expansion discussion in `processes`.

### 21. Voltage gain and power gain in decibels are equated without matching impedances

**Location:** topics `filters` and `logs`, displayed decibel equalities and cutoff-power wording; related numerical add-ons.

`20 log10(|Vout/Vin|)` equals `10 log10(Pout/Pin)` only when the relevant real impedances are equal (or the impedance factor is accounted for). An unloaded RC filter's transfer ratio of 0.707 does not mean half the actual input power is delivered at its output port.

**Correction:** distinguish voltage-transfer gain in dB from actual power gain. Say the cutoff is down 3 dB in squared transfer magnitude, or half the power **in the same reference load**, rather than asserting unconditional input-to-output power equality.

### 22. A 741's −3 dB bandwidth is treated as a flat-gain limit

**Location:** topic `opamps`, worked example “How much bandwidth does the preamp have?”

The gain-48 example calculates about 21 kHz and says that just covers audio while keeping its gain. At 20 kHz a single-pole response with a 20.8 kHz corner is already down about **2.8 dB**, around 28% in amplitude. The arithmetic for the corner frequency is correct; the interpretation of usable flat bandwidth is misleading.

**Correction:** label the result as the −3 dB corner and specify a tolerated gain error before calling a frequency range flat. The suggested two-stage approach has substantially more bandwidth, but should still be assessed as a cascade.

### 23. Synchronous counters are incorrectly promised to have no false intermediate counts

**Location:** topic `counters`, “Synchronous counters”; also review the Moore-output explanation in its Q&A.

The text says all bits change together with “no false counts in between.” Actual clock-to-Q delays and clock arrival times differ, so outputs can temporarily form other binary words and combinational decoders can glitch. Synchronous design makes sampling timing manageable; it does not guarantee glitch-free decoded outputs.

**Correction:** say all stages respond to the same clock edge and settle within a bounded interval. Register decoded outputs or use appropriate hazard control when transient values matter. A combinational Moore output can also glitch while state bits settle.

### 24. Heating is said to lower any semiconductor's resistance

**Location:** topic `semiconductors`, body and glossary “Semiconductor”; related generalization in `resistance`.

The intrinsic-carrier formula is useful, but the conclusion is generalized to semiconductor material as a whole. In an extrinsic temperature range with dopants already ionized, carrier density can remain nearly fixed while mobility falls, causing resistivity to **increase** with temperature.

**Correction:** state that the strong negative temperature dependence described here is characteristic of intrinsic conduction or appropriate thermistor materials. Discuss dopant ionization, mobility and the temperature range before generalizing to doped devices.

### 25. Diodes are said always to require a series resistor

**Location:** topic `diodes`, paragraph following the Shockley equation.

A series resistor is a common way to limit current in a voltage-driven LED. It is not a universal requirement for every diode: regulated current sources, inductive/switching circuits and other source impedances can set the current.

**Correction:** say current must be controlled by the surrounding circuit and give a resistor as one method. Retain the LED resistor example within that scope.

### 26. Primordial abundances are described as an exact observational match

**Location:** topic `bigbang`, “The first minutes” and “The evidence.”

The prose groups hydrogen, helium, deuterium and lithium into an unqualified success and describes the predicted mix as exactly observed. The primordial lithium discrepancy is a longstanding exception.

**Correction:** explain the broad success for helium and deuterium, then mention that observed primordial lithium remains discrepant. Avoid “exactly” for approximate abundance predictions. See the [Particle Data Group's Big Bang nucleosynthesis review](https://pdg.lbl.gov/2025/reviews/rpp2024-rev-bbang-nucleosynthesis.pdf).

### 27. The cosmic CMB photon density is applied literally inside the body

**Location:** `ALT.bigbang.nums`.

The approximately 410 photons/cm³ figure is valid for a freely propagating 2.725 K blackbody background. The statement that every cubic centimetre, “including inside you,” contains that CMB population ignores absorption and thermal emission by opaque matter and surrounding enclosures.

**Correction:** apply the figure to unobstructed space filled with the CMB, not literally every material volume or enclosed room. The cosmological density calculation itself can remain.

### 28. A true-rms meter is claimed to measure any waveform correctly

**Location:** topic `meters`, paragraph on AC ranges.

True-rms conversion removes the sine-wave calibration assumption, but real meters still have bandwidth, crest-factor, range and coupling limits. Some AC ranges remove DC; AC+DC rms is a separate capability.

**Correction:** say “within the meter's specified bandwidth, crest factor and range,” and distinguish AC-only from AC+DC rms. This also helps readers interpret the challenge's explicitly AC-coupled ripple readings.

### 29. “Alpha emitters are harmless outside the body” is too broad

**Location:** topic `dose`, final paragraph.

Ordinary alpha particles are stopped by intact outer skin, but this does not make every alpha-emitting material harmless outside the body. The cornea is vulnerable, and an isotope may emit additional penetrating radiation.

**Correction:** say external alpha irradiation is usually a much smaller concern through intact skin, while inhalation, ingestion and contamination require care. Distinguish alpha particles from all emissions of an alpha-emitting source. [ARPANSA's alpha-particle guidance](https://www.arpansa.gov.au/understanding-radiation/what-is-radiation/ionising-radiation/alpha-particles) explicitly notes the corneal exception.

## Priority 3: clarity

### 30. A worked-example title calls a sum a perimeter

**Location:** topic `sigfigs`, worked example “Area and perimeter of a lab bench tile.”

The problem asks for area and the **sum of two adjacent side lengths**, and the solution correctly gives 55 cm² and 16.8 cm. The title says “perimeter,” which would instead require twice that sum: about 33.6 cm.

**Correction:** rename the example “Area and a sum of lengths,” or change the question and solution to calculate a perimeter. The existing addition arithmetic is correct.

## Applying corrections consistently

Field Notes duplicates concepts in `TOPICS`, `APPS`, `ALT`, `GLOSSARY`, calculators, practice questions and simulations. Fix a concept wherever it appears, not just in the main body. The report's locations use topic IDs and object paths because the large data objects occupy single source lines.

For mathematical changes, retain the repository's MathML/TeX conventions and update both wide and narrow equation copies when both exist. Keep the US household-power convention. Preserve useful distinctions already present, including series impedance angle versus parallel current angle in the AC challenges, and idealized amplifier assumptions that the Solid-State worksheets explicitly disclose.

Verification for the corrections includes both audit scripts and the 11 regression tests. Browser checks render all 142 topics, exercise the affected alternate-explanation tabs in all four looks at 360 px, and check calculator validation, isotope practice controls and undefined-vector output. The affected equations are also checked at 375 px. Exhaustive independent recalculation of the remaining examples, source verification of the application/history claims, and complete interaction checks for the custom simulations and probe exercises remain outside the verified coverage of this report.
