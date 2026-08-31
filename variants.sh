#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — RESPONSIVE VARIANTS
#
#  Makes a 900px copy of every image the site references, named
#  alongside the original:  foo.jpg -> foo-900.jpg
#
#  usage:  ./variants.sh          report only
#          ./variants.sh --run    generate
#          ./variants.sh --clean  delete every -900 file
#
#  The pages ask for both sizes through srcset and the browser
#  picks. A phone showing a 400px tile currently downloads the
#  2200px file — roughly nine times the pixels it can display.
#
#  Variants are generated for EVERY referenced raster image, not
#  a chosen subset, so the markup can add srcset unconditionally
#  without checking whether a given variant exists.
#
#  Format is preserved: a PNG variant stays a PNG, so transparency
#  survives. The variant is only ever served to phones, so a
#  flattening bug here would be invisible while developing.
#
#  Sources already under 900px are COPIED rather than resized, so
#  every referenced image has a variant at the expected name.
#
#  SKIPPED: svg (vector), video, anything already -900.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

MODE="${1:-}"
WIDE=900

if [ "$MODE" = "--clean" ]; then
  n=$(find assets -type f -name '*-900.*' | wc -l | tr -d ' ')
  find assets -type f -name '*-900.*' -delete
  echo "removed $n variants"
  exit 0
fi

HAY="$(mktemp)"
cat *.html *.js *.css 2>/dev/null > "$HAY"
trap 'rm -f "$HAY"' EXIT

made=0; skipped=0; bytes=0

while IFS= read -r -d '' f; do
  case "$f" in
    *-900.*)        continue ;;
    *.svg|*.SVG)    continue ;;
  esac

  base="$(basename "$f")"
  stem="${base%.*}"
  noext="${f%.*}"

  # only images the site actually asks for
  grep -qF "$f" "$HAY" || grep -qF "$base" "$HAY" \
    || grep -qF "$noext" "$HAY" || grep -qF "'$stem'" "$HAY" || continue

  out="${f%.*}-900.${f##*.}"

  long=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null |
         awk '/pixel/{print $2}' | sort -n | tail -1)
  [ -z "$long" ] && continue

  # An image already narrower than the target still needs a variant
  # to EXIST — the markup adds srcset unconditionally, so a missing
  # one is a 404 rather than a graceful fallback. Copy it instead of
  # resizing: same bytes, but the name the page asks for.
  if [ "$long" -le "$WIDE" ]; then
    [ "$MODE" = "--run" ] && cp "$f" "$out"
    skipped=$((skipped+1))
    continue
  fi

  if [ "$MODE" = "--run" ]; then
    # Resize only — format is preserved. Forcing JPEG here would
    # flatten any PNG holding transparency, and because the variant
    # is served only to phones the damage would be invisible on the
    # machine that made it.
    if sips -Z "$WIDE" "$f" --out "$out" >/dev/null 2>&1; then
      sz=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")
      bytes=$((bytes + sz))
      made=$((made+1))
    else
      echo "  FAIL $f"
    fi
  else
    made=$((made+1))
  fi
done < <(find assets -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

echo
if [ "$MODE" = "--run" ]; then
  echo "generated $made variants, $((bytes/1024/1024))MB total"
  echo "$skipped were already small enough and were copied as-is"
  echo "assets now: $(du -sh assets | cut -f1)"
else
  echo "$made images would get a 900px variant"
  echo "$skipped are already small enough and will be copied as-is"
  echo "run with --run to generate, --clean to remove them"
fi
