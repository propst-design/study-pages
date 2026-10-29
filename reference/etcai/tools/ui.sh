#!/bin/bash
# GUI driver for the ETCAI programs under Wine.
# Each caller picks its own display number N (e.g. 11..14); everything else is derived from it.
#   ui.sh N start "<program folder name>" <exe>   copy the folder, start Xvfb + Wine, wait for the window
#   ui.sh N shot out.png                          screenshot of the whole 1024x768 screen
#   ui.sh N click X Y                             left click (screen coordinates from the screenshot)
#   ui.sh N type "text"                           type into the focused control
#   ui.sh N key Return|Tab|BackSpace|ctrl+a ...   key press(es)
#   ui.sh N wins                                  titles of the visible windows
#   ui.sh N stop                                  kill Wine and Xvfb for this display
S=${ETCAI_WORK:?set ETCAI_WORK to a scratch folder holding acz/, the unzipped programs}
N=$1; cmd=$2; shift 2
export DISPLAY=:$N WINEPREFIX=$S/wine$N WINEDEBUG=-all
case $cmd in
  start)
    mkdir -p $S/run$N && rm -rf "$S/run$N/$1" && cp -r "$S/acz/$1" $S/run$N/
    pgrep -f "Xvfb :$N " >/dev/null || (Xvfb :$N -screen 0 1024x768x24 >/dev/null 2>&1 &)
    [ -d $S/wine ] || WINEPREFIX=$S/wine wineboot -i >/dev/null 2>&1   # first run: build a prefix once
    [ -d $S/wine$N ] || cp -a $S/wine $S/wine$N                         # each display gets its own copy
    sleep 1
    cd "$S/run$N/$1" && (setsid wine "$2" >$S/run$N/wine.log 2>&1 &)
    timeout 120 bash -c 'until xdotool search --onlyvisible --name . getwindowname %@ 2>/dev/null | grep -qvE "^(Wine|Loading program)$"; do sleep 0.5; done'
    sleep 4; xdotool search --onlyvisible --name . getwindowname %@ ;;
  shot) sleep 0.7; import -window root "$1" ;;
  click) xdotool mousemove "$1" "$2" click 1 ;;
  dclick) xdotool mousemove "$1" "$2" click --repeat 2 1 ;;
  type) xdotool type --delay 40 "$1" ;;
  key) xdotool key "$@" ;;
  wins) xdotool search --onlyvisible --name . getwindowname %@ ;;
  stop) WINEPREFIX=$S/wine$N wineserver -k; pkill -f "Xvfb :$N " ;;
esac
