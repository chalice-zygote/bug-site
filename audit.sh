#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — UNUSED ASSET AUDIT
#
#  Lists every file under assets/ that no HTML or JS in the
#  site refers to, plus the raw source clips that should never
#  reach the repo.
#
#  usage:  ./audit.sh          report only
#          ./audit.sh --move   move the unused into _unused/
#
#  Nothing is deleted. --move shelves files so the site can be
#  checked before anything is thrown away.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

MOVE=0
[ "${1:-}" = "--move" ] && MOVE=1

HAY="$(mktemp)"
cat *.html *.js 2>/dev/null > "$HAY"

UNUSED="$(mktemp)"
: > "$UNUSED"

find assets -type f ! -name '.*' -print0 |
while IFS= read -r -d '' f; do
  base="$(basename "$f")"

  # A file counts as referenced if its path or filename appears
  # anywhere. Several are assembled at runtime and never appear
  # whole in the source, so two more forms are checked:
  #   'assets/logo' + VEXT   -> the extensionless PATH
  #   'x' + EXT              -> the bare STEM, from a name list
  # Missing either produced false positives in testing, and a
  # false positive here means deleting a live asset.
  stem="${base%.*}"
  noext="${f%.*}"
  if grep -qF "$f" "$HAY" \
     || grep -qF "$base" "$HAY" \
     || grep -qF "$noext" "$HAY" \
     || grep -qF "'$stem'" "$HAY"; then
    continue
  fi
  printf '%s\n' "$f" >> "$UNUSED"
done

echo "═══ SOURCE CLIPS — raw footage, should not ship"
find assets -type f \( -iname '*.mov' -o -iname '*.MOV' \) -print0 |
  xargs -0 du -h 2>/dev/null | sort -h
echo

echo "═══ UNREFERENCED"
if [ -s "$UNUSED" ]; then
  while IFS= read -r f; do
    printf '  %-58s %s\n' "$f" "$(du -h "$f" | cut -f1)"
  done < "$UNUSED"
  echo
  echo "  total: $(wc -l < "$UNUSED" | tr -d ' ') files, $(du -ch $(cat "$UNUSED") 2>/dev/null | tail -1 | cut -f1)"
else
  echo "  none"
fi
echo

echo "═══ SIZE BY FOLDER"
du -h -d 2 assets | sort -h | tail -14
echo
echo "═══ TOTAL: $(du -sh assets | cut -f1)"

if [ "$MOVE" = "1" ] && [ -s "$UNUSED" ]; then
  mkdir -p _unused
  while IFS= read -r f; do
    mkdir -p "_unused/$(dirname "$f")"
    mv "$f" "_unused/$f"
  done < "$UNUSED"
  echo
  echo "moved $(wc -l < "$UNUSED" | tr -d ' ') files into _unused/ — check the site, then delete"
fi

rm -f "$HAY" "$UNUSED"
