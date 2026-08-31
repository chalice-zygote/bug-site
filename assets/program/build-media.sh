#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — MEDIA MANIFEST
#
#  Scans assets/program/ and prints the `media` array for each
#  program, ready to paste into programs.js.
#
#  usage:  ./build-media.sh            print to screen
#          ./build-media.sh > out.txt  save it
#
#  Sorting is PROM before ARCV, then filename within each. A
#  file is promotional if "promo" appears anywhere in its path
#  or name; everything else is archival. Video is always ARCV —
#  it documents what happened.
#
#  Digit runs are zero-padded in the sort key only, so
#  archive2 comes before archive10 — plain sort would give
#  1, 10, 11, 2 and scramble the sequence.
#
#  Written for bash 3.2, which is what macOS ships: no
#  associative arrays, so buckets are temp files.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# folder name -> slug in programs.js
slug_for() {
  case "$1" in
    *1412*)          echo "1412-gallery" ;;
    *holocene*)      echo "holocene" ;;
    *wyrd*)          echo "wyrd-hut" ;;
    *drift*)         echo "drift-ii" ;;
    *angel*)         echo "angel-dust" ;;
    *midi*)          echo "midiworldlive" ;;
    *saint*|*david*) echo "saint-david" ;;
    *)               echo "" ;;
  esac
}

UNMAPPED=0

find . -type f \
  \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
     -o -iname "*.webp" -o -iname "*.gif" -o -iname "*.mp4" -o -iname "*.webm" \) \
  -print0 |
while IFS= read -r -d '' f; do
  rel="${f#./}"
  base="$(basename "$rel")"
  case "$base" in .*) continue ;; esac

  top="${rel%%/*}"
  lowtop="$(printf '%s' "$top" | tr '[:upper:]' '[:lower:]')"
  slug="$(slug_for "$lowtop")"

  if [ -z "$slug" ]; then
    printf '%s\n' "$rel" >> "$WORK/_unmapped"
    continue
  fi

  low="$(printf '%s' "$rel" | tr '[:upper:]' '[:lower:]')"
  case "$low" in
    *.mp4|*.webm) kind="ARCV"; sk="1" ;;   # video documents; never promo
    *promo*)      kind="PROM"; sk="0" ;;
    *)            kind="ARCV"; sk="1" ;;
  esac

  # pad digit runs to 5 places for sorting only — keeps
  # archive2 ahead of archive10
  pad="$(printf '%s' "$rel" | sed -E 's/([0-9]+)/00000\1/g; s/0*([0-9]{5})/\1/g')"

  printf '%s|%s|assets/program/%s|%s\n' "$sk" "$pad" "$rel" "$kind" >> "$WORK/$slug"
done

for bucket in "$WORK"/*; do
  [ -f "$bucket" ] || continue
  slug="$(basename "$bucket")"
  [ "$slug" = "_unmapped" ] && continue

  echo "    /* ── $slug ── */"
  echo "    media: ["
  sort -t'|' -k1,1 -k2,2 "$bucket" | while IFS='|' read -r sk pad path kind; do
    [ -n "$path" ] || continue
    case "$path" in
      *.mp4|*.webm) echo "      { kind: '$kind', video: '$path' },"  ;;
      *)            echo "      { kind: '$kind', src: '$path' },"    ;;
    esac
  done
  echo "    ],"
  echo
done

if [ -f "$WORK/_unmapped" ]; then
  n=$(wc -l < "$WORK/_unmapped" | tr -d ' ')
  echo "/* $n file(s) in folders with no matching program — not filed:" >&2
  sed 's/^/     /' "$WORK/_unmapped" >&2
  echo "*/" >&2
fi
