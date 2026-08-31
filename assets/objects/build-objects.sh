#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — OBJECT MANIFEST
#
#  Scans assets/objects/ and prints the image array for each
#  object folder, ready to paste into objects.js.
#
#  usage:  ./build-objects.sh
#
#  Same shape as build-media.sh: bash 3.2, no associative
#  arrays, digit runs zero-padded so 2 sorts before 10.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

for d in */; do
  d="${d%/}"
  [ -d "$d" ] || continue

  find "$d" -type f \
    \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
       -o -iname "*.webp" -o -iname "*.gif" -o -iname "*.svg" \
       -o -iname "*.mp4" -o -iname "*.webm" \) \
    -print0 |
  while IFS= read -r -d '' f; do
    base="$(basename "$f")"
    case "$base" in
      .*)      continue ;;
      *-900.*) continue ;;   # responsive variant, not a separate image
    esac
    pad="$(printf '%s' "$f" | sed -E 's/([0-9]+)/00000\1/g; s/0*([0-9]{5})/\1/g')"
    printf '%s|assets/objects/%s\n' "$pad" "$f" >> "$WORK/$d"
  done
done

for b in "$WORK"/*; do
  [ -f "$b" ] || continue
  echo "    /* ── $(basename "$b") ── */"
  echo "    shots: ["
  sort -t'|' -k1,1 "$b" | while IFS='|' read -r pad path; do
    [ -n "$path" ] || continue
    case "$path" in
      *.mp4|*.webm) echo "      { video: '$path' }," ;;
      *)            echo "      '$path'," ;;
    esac
  done
  echo "    ],"
  echo
done
