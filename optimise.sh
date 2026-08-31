#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — IMAGE OPTIMISE
#
#  Resizes oversized images IN PLACE. Format is never changed:
#  a PNG stays a PNG, a JPEG stays a JPEG.
#
#  usage:  ./optimise.sh          report only, changes nothing
#          ./optimise.sh --run    do it
#
#  Almost all the weight here is pixel dimensions, not format —
#  a 6000px photograph shown at 400px carries 200x the pixels it
#  needs. Resizing alone recovers most of it, and because nothing
#  is re-encoded to a different format:
#    - transparency survives
#    - filenames do not change, so no path anywhere breaks
#    - no judgement call about which files hold alpha
#
#  SKIPPED: assets/flags (encoded video), SVG (vector, no
#  pixels), anything already under the threshold.
#
#  Originals go to _orig/ rather than being overwritten.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

RUN=0
[ "${1:-}" = "--run" ] && RUN=1

MAXPX=2200        # long edge; comfortably 2x any display size
THRESHOLD=400000  # bytes

count=0
saved=0

while IFS= read -r -d '' f; do
  case "$f" in
    assets/flags/*) continue ;;
    *.svg|*.SVG)    continue ;;
  esac

  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  [ "$size" -lt "$THRESHOLD" ] && continue

  long=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null |
         awk '/pixel/{print $2}' | sort -n | tail -1)
  [ -z "$long" ] && continue
  [ "$long" -le "$MAXPX" ] && continue      # already small enough

  if [ "$RUN" = "1" ]; then
    mkdir -p "_orig/$(dirname "$f")"
    cp "$f" "_orig/$f"
    if sips -Z "$MAXPX" "$f" >/dev/null 2>&1; then
      new=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
      saved=$((saved + size - new))
      count=$((count + 1))
      printf '  %-58s %6sK -> %5sK\n' "$f" "$((size/1024))" "$((new/1024))"
    else
      cp "_orig/$f" "$f"
      echo "  FAIL $f (restored)"
    fi
  else
    printf '  %-58s %6sK  %spx\n' "$f" "$((size/1024))" "$long"
    count=$((count + 1))
  fi
done < <(find assets -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

echo
if [ "$RUN" = "1" ]; then
  echo "resized $count files, saved $((saved/1024/1024))MB"
  echo "originals in _orig/ — check the site, then: rm -rf _orig"
else
  echo "$count files would be resized to ${MAXPX}px on the long edge"
  echo "formats and filenames unchanged; run with --run to do it"
fi
echo "assets now: $(du -sh assets | cut -f1)"
