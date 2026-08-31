#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — PATCH BUILDER
#
#  Random 1.5s slices from every clip in a folder, rotated to
#  vertical, spliced into one hypercut. Audio kept.
#
#  usage:   ./patch.sh <folder> [output-name]
#  example: ./patch.sh holocene-patch
#           ./patch.sh 1412-patch 1412-patch-v2
#
#  Notes on the choices, since they aren't obvious:
#
#  ROTATION ALTERNATES per clip. Every source here is landscape,
#  so turning them all the same way lets the eye adapt within
#  about three cuts and it stops being disorienting. CW/CCW
#  alternating keeps it destabilised.
#
#  SLICES COME FROM A RANDOM POINT, not the head — the first
#  seconds of a phone clip are someone finding the shot.
#
#  EVERYTHING IS CONFORMED FIRST, then concatenated. Sources run
#  24 / 23.976 / 30 / 29.97 / 120 fps at three frame sizes;
#  concatenating that directly gives drift and dropped frames.
#
#  20ms FADES on each audio slice. Hard-cutting raw audio clicks
#  at every splice, and 30 clicks reads as a broken file rather
#  than a device. Too short to hear as a fade.
#
#  LOOPS repeats the whole cut. With RESHUFFLE=1 each pass gets a
#  new order — same footage, three different edits — so the piece
#  doesn't announce its own loop point. The slices themselves are
#  encoded once and reused, so extra passes are nearly free.
# ═══════════════════════════════════════════════════════════
set -u

SRC="${1:?usage: ./patch.sh <folder> [output-name]}"
SRC="${SRC%/}"
OUT="${2:-$SRC}"

SLICE=1.5          # seconds per cut
LOOPS=3            # times the whole cut repeats
RESHUFFLE=1        # 1 = re-order the cuts on each pass, 0 = identical repeats
FPS=30             # output framerate
W=1080; H=1920     # output frame
LOUD="I=-14:TP=-1.5:LRA=11"

[ -d "$SRC" ] || { echo "no such folder: $SRC"; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "═══ $SRC → ${OUT}.mp4"

# ── collect, then shuffle ─────────────────────────────────
CLIPS=()
while IFS= read -r -d '' f; do CLIPS+=("$f"); done < <(
  find "$SRC" -maxdepth 1 -type f \( -iname "*.mov" -o -iname "*.mp4" \) -print0
)
[ ${#CLIPS[@]} -gt 0 ] || { echo "no clips found"; exit 1; }

# Fisher-Yates — the cut order is the point, so it must be random
for ((i=${#CLIPS[@]}-1; i>0; i--)); do
  j=$((RANDOM % (i+1)))
  tmp="${CLIPS[i]}"; CLIPS[i]="${CLIPS[j]}"; CLIPS[j]="$tmp"
done

# ── slice + conform each ──────────────────────────────────
n=0; kept=0
LIST="$WORK/list.txt"; : > "$LIST"

for f in "${CLIPS[@]}"; do
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  dur=${dur%%.*}

  # a clip shorter than the slice contributes what it has
  if awk "BEGIN{exit !($dur > $SLICE + 0.2)}"; then
    max=$(awk "BEGIN{print $dur - $SLICE - 0.1}")
    ss=$(awk -v m="$max" -v r="$RANDOM" 'BEGIN{printf "%.2f", (r/32767)*m}')
    t=$SLICE
  else
    ss=0
    t=$(awk "BEGIN{d=$dur-0.05; print (d>0.3)? d : 0}")
    if awk "BEGIN{exit !($t < 0.3)}"; then
      echo "  skip  $(basename "$f")  (too short: ${dur}s)"
      continue
    fi
    echo "  short $(basename "$f")  (using ${t}s)"
  fi

  # alternate rotation direction: 1 = 90° CW, 2 = 90° CCW
  if (( n % 2 == 0 )); then tp=1; else tp=2; fi
  n=$((n+1))

  out="$WORK/$(printf '%03d' $n).mp4"
  ffmpeg -nostdin -v error -y \
    -ss "$ss" -t "$t" -i "$f" \
    -vf "transpose=$tp,scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,fps=$FPS,setsar=1,format=yuv420p" \
    -af "aresample=48000,loudnorm=$LOUD,afade=t=in:st=0:d=0.02,afade=t=out:st=$(awk "BEGIN{print $t-0.02}"):d=0.02" \
    -c:v libx264 -preset medium -crf 19 \
    -c:a aac -b:a 192k -ar 48000 -ac 2 \
    "$out" 2>/dev/null

  if [ -s "$out" ]; then
    echo "file '$out'" >> "$LIST"
    kept=$((kept+1))
    printf "  cut   %-30s @ %5ss  rot %s\n" "$(basename "$f")" "$ss" "$([ $tp = 1 ] && echo CW || echo CCW)"
  else
    echo "  FAIL  $(basename "$f")"
  fi
done

[ "$kept" -gt 0 ] || { echo "nothing to splice"; exit 1; }

# ── repeat ────────────────────────────────────────────────
FULL="$WORK/full.txt"; : > "$FULL"
for ((p=1; p<=LOOPS; p++)); do
  if [ "$p" -eq 1 ] || [ "$RESHUFFLE" -eq 0 ]; then
    cat "$LIST" >> "$FULL"
  else
    # new order for this pass — same slices, different edit
    sort -R "$LIST" >> "$FULL" 2>/dev/null || cat "$LIST" >> "$FULL"
  fi
done
[ "$LOOPS" -gt 1 ] && echo "  loop  ${LOOPS}x$([ "$RESHUFFLE" -eq 1 ] && echo ', reshuffled each pass')"

# ── splice ────────────────────────────────────────────────
ffmpeg -nostdin -v error -y -f concat -safe 0 -i "$FULL" \
  -c:v libx264 -preset slow -crf 25 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "${OUT}.mp4"

len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT}.mp4")
sz=$(du -h "${OUT}.mp4" | cut -f1)
echo "─── ${OUT}.mp4   ${kept} cuts x ${LOOPS}   ${len%.*}s   ${sz}"
