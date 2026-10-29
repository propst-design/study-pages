# ETCAI originals: how the exercises really work

The Circuits Challenge pages are based on ETCAI Products' Windows programs. Four of them ship as a
bare executable with no lesson files, so their rules could only be learned by running them. These
notes record what each exercise does, found by playing the originals under Wine on 2026-10-29, and
end with a list of where the HTML page differs.

| Program | Notes | HTML page |
|---|---|---|
| AC Circuits Challenge v4.0 (`acv4.exe`) | [ac-circuits.md](ac-circuits.md) | `study-pages/AC_Circuits_Challenge.html` |
| DC Circuits Challenge v4.0 (`dcv4.exe`) | [dc-circuits.md](dc-circuits.md) | `study-pages/DC_Circuits_Challenge.html` |
| Power Supply Challenge v3.0 (`power99.exe`) | [power-supply.md](power-supply.md) | `study-pages/Power_Supply_Challenge.html` |
| Solid State Challenge (`SolidSt4.exe`) | [solid-state.md](solid-state.md) | `study-pages/Solid_State_Challenge.html` |

The other five (Basic Circuits, Digital, Ohmmeter, Op Amp, Voltmeter) ship their lesson text as
`.rtf` files and have not been played yet.

The HTML line numbers in the "Differences" sections are from commit `fd1dddd` and will drift.

## Patterns that recur

- **Answer tolerance is about ±5%** in the AC, DC and Solid State worksheets (about ±6% on AC
  Conversions and Transformers). The HTML pages use ±2%.
- **Worksheet scoring is per item.** Each item is worth its share of 100. A wrong check costs 2 and
  every opening of Help costs 3, both taken from that item only, and an item never drops below 0.
  The HTML takes penalties off the final percentage and charges Help once per item.
- **AC, DC and Solid State troubleshooting boards:** probes start on the board and the first reading is free. The black
  probe stays on the supply's minus terminal and only the red one moves. Items are worth 12 points
  (120 total) in AC and DC. The supply changes with every item, and in AC the component values change too.
  Power Supply scores differently (130 points, 5 off per wrong answer); see its notes.
- **No pass mark** in AC or Power Supply: they just report the score. The HTML pages pass at 60–80%.

## Running the originals again

The programs are licensed software, so they are not kept in this repo. Given the unzipped program
folders:

```bash
dpkg --add-architecture i386 && apt-get update
apt-get install -y --no-install-recommends wine wine32:i386 xvfb xdotool imagemagick icoutils
export ETCAI_WORK=/some/scratch/folder        # holding acz/<Program Folder>/...
reference/etcai/tools/ui.sh 11 start "AC Circuits Challenge" acv4.exe
reference/etcai/tools/ui.sh 11 shot screen.png  # then click / type / key / stop
python3 -I reference/etcai/tools/dfm.py prog.exe outdir   # form captions, labels and help text
```

Under Wine, Ω and µ show as boxes, because the programs use the Symbol font.
