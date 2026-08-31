#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  B.U.G. — MOBILE VIDEO ENCODES
#
#  Makes a small copy of every flag and the strobe, named
#  alongside the original:  x.webm -> x-sm.webm
#
#  usage:  ./video-sm.sh          report only
#          ./video-sm.sh --run    encode
#          ./video-sm.sh --clean  delete every -sm file
#
#  The flags are 1080x1920 at desktop quality. A phone displays
#  them at roughly a third of that, so it is downloading around
#  nine times the pixels it can show — on the connection least
#  able to afford it.
#
#  720x1280 at a lower bitrate is visually identical at phone
#  size and roughly a quarter of the weight. Desktop keeps the
#  full-quality files untouched.
#
#  Both codecs are produced for the same reason as the originals:
#  Safari renders VP9 alpha as a solid black box, so it needs the
#  HEVC and cannot be given a WebM fallback.
# ═══════════════════════════════════════════════════════════
cd "$(dirname "$0")" || exit 1

MODE="${1:-}"
W=720
H=1280

if [ "$MODE" = "--clean" ]; then
  n=$(find assets -type f -name '*-sm.*' | wc -l | tr -d ' ')
  find assets -type f -name '*-sm.*' -delete
  echo "removed $n mobile encodes"
  exit 0
fi

made=0
bytes=0

encode_alpha() {                    # $1 = source stem (no extension)
  local stem="$1"
  local src="${stem}.webm"
  [ -e "$src" ] || { echo "  SKIP $stem (no webm)"; return; }

  # Both outputs are made from the WEBM, including the HEVC one.
  # ffmpeg cannot decode Apple's alpha layer out of an HEVC file, so
  # using x.mp4 as the source silently produces a file with no
  # transparency at all. VP9 alpha decodes correctly, so it is the
  # only usable master here.
  #
  # ── on checking alpha ──────────────────────────────────
  # ffprobe reporting pix_fmt=yuv420p on a WebM does NOT mean the
  # alpha is gone. VP9 carries it as a container-level side channel,
  # so the video stream really is yuv420p — the originals report the
  # same. The tag to look for is ALPHA_MODE=1:
  #
  #   ffprobe -v error -show_streams FILE | grep -i alpha
  #
  # The decoder flag and format filter below are belt-and-braces:
  # they cost nothing and guarantee the chain never flattens alpha,
  # but the container tag is what actually matters.

  ffmpeg -y -v error -c:v libvpx-vp9 -i "$src" \
    -vf "scale=${W}:${H},format=yuva420p" \
    -c:v libvpx-vp9 -pix_fmt yuva420p \
    -auto-alt-ref 0 -crf 36 -b:v 0 \
    -row-mt 1 -threads 8 -deadline good -cpu-used 4 \
    -an "${stem}-sm.webm" && echo "  ok ${stem}-sm.webm"

  ffmpeg -y -v error -c:v libvpx-vp9 -i "$src" \
    -vf "scale=${W}:${H},format=yuva420p" \
    -c:v hevc_videotoolbox -alpha_quality 0.7 \
    -b:v 900k -maxrate 1200k -bufsize 2400k \
    -allow_sw 1 -tag:v hvc1 \
    -an "${stem}-sm.mp4" && echo "  ok ${stem}-sm.mp4"
}

echo "═══ FLAGS"
for f in assets/flags/*.webm; do
  [ -e "$f" ] || continue
  case "$f" in *-sm.webm) continue ;; esac
  stem="${f%.webm}"
  if [ "$MODE" = "--run" ]; then
    encode_alpha "$stem"
  else
    echo "  $stem"
  fi
  made=$((made+1))
done

echo
echo "═══ STROBE"
# no alpha here, so a plain h264 pass is enough and plays anywhere
for f in assets/meme-strobe-2.mp4 assets/meme-strobe.mp4; do
  [ -e "$f" ] || continue
  case "$f" in *-sm.mp4) continue ;; esac
  out="${f%.mp4}-sm.mp4"
  if [ "$MODE" = "--run" ]; then
    ffmpeg -y -v error -i "$f" \
      -vf "scale='min(720,iw)':-2" \
      -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p \
      -c:a aac -b:a 96k -movflags +faststart \
      "$out" && echo "  ok $out"
  else
    echo "  $f"
  fi
done

echo
if [ "$MODE" = "--run" ]; then
  echo "mobile encodes now: $(find assets -name '*-sm.*' | wc -l | tr -d ' ') files"
  echo "assets total: $(du -sh assets | cut -f1)"
else
  echo "$made flags plus the strobe would get a ${W}x${H} encode"
  echo "run with --run to encode, --clean to remove them"
fi
