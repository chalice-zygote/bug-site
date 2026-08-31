/* ═══════════════════════════════════════════════════════════
   B.U.G. — release page renderer

   Every per-release page is a ~20-line shell carrying
   data-release="<id>" on <body>. This reads that, pulls the
   record out of releases.js, and builds the page.

   Layout lives here and in release.css — one copy — so the
   per-release files can't drift apart.
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* the id is baked into the page — no query string, nothing for a
     server to rewrite away */
  const id   = document.body.dataset.release || '';
  const list = window.RELEASES || [];
  const hit  = list.find(x => x.id === id);

  /* No silent fallback to the first record — a wrong or missing id
     used to render Miasma, which reads as a routing bug rather than
     a bad link. Say what happened instead. */
  if (!hit) {
    document.getElementById('record').innerHTML =
      `<div class="credits">NO RECORD FILED UNDER &ldquo;${id || '\u2014'}&rdquo;.<br><br>` +
      list.map(x => `<a href="${x.id}.html" style="color:inherit">${x.catDisp} &mdash; ${x.artist} ${x.title}</a>`).join('<br>') +
      `</div>`;
    return;
  }
  const r = hit;

  document.title = `${r.artist} — ${r.title} — BEAUTIFUL UNITY GYMNASIUM`;

  /* dark grounds get a white panel rather than a colour change */
  if (r.ink)   document.getElementById('record').style.setProperty('--record-ink', r.ink);
  if (r.panel) {
    document.getElementById('record').classList.add('has-panel');
    document.getElementById('record').style.setProperty('--panel', r.panel);
  }

  /* purpose-made ground image, falling back to the cover if absent */
  /* A CSS background cannot use srcset, so the choice is made here.
     The ground is a blurred, full-bleed backdrop — nobody inspects
     it, and on a phone the master is several megabytes for something
     scaled past recognition. */
  const groundSrc = r.bg || r.cover;
  const groundPick = window.matchMedia('(max-width: 900px)').matches
    ? groundSrc.replace(/\.([^.\/]+)$/, '-900.$1')
    : groundSrc;
  document.getElementById('ground').style.backgroundImage = `url("${groundPick}")`;

  /* ═══════════════════════════════════════════════════════
     SPINE — colours sampled from the artwork

     Rather than hand-authoring a palette per release, the cover
     is drawn to a small canvas and its pixels bucketed into a
     coarse histogram. The result is sorted by luminance to give
     a monochrome ramp, and the most saturated bucket is dropped
     in near the middle as the single pop.

     Extracting rather than authoring means every future record
     gets its spine for free, and the colours can never drift out
     of sync with the artwork.
     ═══════════════════════════════════════════════════════ */
  const SPINE_STOPS = 26;

  function lum(c) { return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; }
  function sat(c) {
    const mx = Math.max(c[0],c[1],c[2]), mn = Math.min(c[0],c[1],c[2]);
    return mx === 0 ? 0 : (mx - mn) / mx;
  }
  function hue(c) {
    const r0=c[0]/255, g0=c[1]/255, b0=c[2]/255;
    const mx=Math.max(r0,g0,b0), mn=Math.min(r0,g0,b0), d=mx-mn;
    if (!d) return 0;
    let h;
    if (mx===r0)      h = ((g0-b0)/d) % 6;
    else if (mx===g0) h = (b0-r0)/d + 2;
    else              h = (r0-g0)/d + 4;
    return (h*60 + 360) % 360;
  }
  /* Push each stop away from its own max channel, which increases
     chroma. amt = 1 is unchanged, BELOW 1 desaturates, above 1
     saturates. Averaging pixels inside a bucket always mutes them, so
     these run well above 1 to put back what the sampling took out. */
  function punch(c, amt) {
    const mx = Math.max(c[0],c[1],c[2]);
    return c.map(v => Math.max(0, Math.min(255, mx - (mx - v) * amt)));
  }
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2,'0')).join('');

  function buildSpine(srcUrl) {
    const spine = document.getElementById('spine');

    /* ── CURATED OVERRIDE ──────────────────────────────────
       If the record carries a `spine` array in releases.js, those
       colours are used verbatim and nothing is sampled. Extraction
       is the fallback for records not yet curated.

       To curate one: load the page, copy the hex array logged to the
       console, paste it into releases.js as `spine: [...]`, then edit
       freely. Extraction proposes, you dispose.
       ─────────────────────────────────────────────────────── */
    if (Array.isArray(r.spine) && r.spine.length) {
      spine.innerHTML = r.spine.map(c => `<i style="background:${c}"></i>`).join('');
      return;
    }

    /* per-record saturation trim, 1 = as sampled */
    const boost = typeof r.spineBoost === 'number' ? r.spineBoost : 1;
    const RAMP_PUNCH = 0.62 * boost;
    const POP_PUNCH  = 0.42 * boost;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const N = 96;
        const cv = document.createElement('canvas');
        cv.width = N; cv.height = N;
        const cx = cv.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0, N, N);
        const d = cx.getImageData(0, 0, N, N).data;

        const bucket = new Map();
        for (let i = 0; i < d.length; i += 4) {
          if (d[i+3] < 128) continue;
          const key = (d[i] >> 3) + ',' + (d[i+1] >> 3) + ',' + (d[i+2] >> 3);
          const b = bucket.get(key);
          if (b) { b.n++; b.r += d[i]; b.g += d[i+1]; b.b += d[i+2]; }
          else bucket.set(key, { n: 1, r: d[i], g: d[i+1], b: d[i+2] });
        }
        if (!bucket.size) return;

        const all = [...bucket.values()].map(b => ({
          c: [b.r/b.n, b.g/b.n, b.b/b.n], n: b.n
        }));

        /* Ranking by frequency alone surfaces the muted mid-tones that
           dominate any blurred image. Weighting by saturation pulls the
           colours the artwork is actually ABOUT to the front. */
        const scored = all
          .map(o => ({ ...o, score: o.n * (0.18 + Math.pow(sat(o.c), 1.6) * 3.2) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 46)
          .map(o => o.c);

        /* pops: most saturated, one per distinct hue family */
        const pops = [];
        [...scored].sort((a, b) => sat(b) - sat(a)).forEach(c => {
          if (sat(c) < 0.25) return;
          if (pops.every(p => Math.abs(hue(p) - hue(c)) > 42)) pops.push(c);
        });

        const ramp = scored.slice().sort((a, b) => lum(a) - lum(b));
        const stops = [];
        for (let i = 0; i < SPINE_STOPS; i++) {
          stops.push(punch(ramp[Math.floor(i / SPINE_STOPS * ramp.length)], RAMP_PUNCH));
        }

        /* drop the pops in at spread intervals so they read as accents */
        pops.slice(0, 4).forEach((p, i) => {
          stops[Math.floor(SPINE_STOPS * (0.20 + i * 0.21))] = punch(p, POP_PUNCH);
        });

        const hexes = stops.map(hex);
        spine.innerHTML = hexes.map(c => `<i style="background:${c}"></i>`).join('');

        // paste this into releases.js as `spine: [...]` to freeze and edit it
        console.log('[spine] ' + r.id + ' — extracted, copy to curate:\n' +
          'spine: [' + hexes.map(c => `'${c}'`).join(', ') + '],');
      } catch (e) {
        console.warn('[spine] could not sample', srcUrl, e);
      }
    };
    img.onerror = () => console.warn('[spine] image failed to load:', srcUrl);
    /* sample the 900px variant, not the master — this runs on every
       page load and a full-size cover can be several megabytes */
    img.src = srcUrl.replace(/\.([^.\/]+)$/, '-900.$1');
  }

  buildSpine(r.cover);

  document.getElementById('plates').innerHTML =
    (r.plates || []).map((p, i) =>
      `<img src="${p}" srcset="${bugSrcset(p)}" sizes="(max-width: 900px) 100vw, 50vw"
            alt="${r.title} documentation ${i + 1}" loading="lazy" decoding="async">`
    ).join('');

  const tracks = (r.tracks || []).length
    ? `<div class="tracks">` +
      r.tracks.map((t, i) => `${String(i + 1).padStart(2, '0')}. ${t}`).join('<br>') +
      `</div>`
    : '';

  document.getElementById('record').innerHTML = `
    <span class="title-block">${r.artist} - ${r.title}</span>
    <img class="cover" src="${r.rightTop || r.cover}"
         srcset="${bugSrcset(r.rightTop || r.cover)}"
         sizes="(max-width: 900px) 100vw, 46vw"
         alt="${r.artist} — ${r.title}" decoding="async">

    <div class="type-panel">
      <div class="credits">${(r.credits || [])
          .map(l => l === '' ? '<span class="gap"></span>' : l)
          .join('<br>')}</div>
      ${tracks}
      ${(r.note || []).length ? `<div class="note">${
          r.noteLead ? `<div class="note-lead">${r.noteLead}</div>` : ''
        }${r.note.map(p => `<p>${p}</p>`).join('')}</div>` : ''}
      <div class="url">${r.catDisp}${r.format ? ' &middot; ' + r.format : ''}</div>
      <div class="listen-head">LISTEN</div>
      <div class="listen">
        ${(r.listen || []).map(l =>
          `<a href="${l.href}"${l.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${l.label}</a>`
        ).join('')}
      </div>
      ${(r.mark || []).length ? (() => {
          const cells = `<span class="mark-grid" style="--mark-cols:${
            Math.max(...r.mark.map(row => row.length))
          }">${r.mark.map(row => row.map(cell =>
            `<i>${cell || ''}</i>`).join('')).join('')}</span>`;
          return r.markHref
            ? `<a class="mark" href="${r.markHref}" target="_blank" rel="noopener" aria-label="${r.artist}">${cells}</a>`
            : `<div class="mark">${cells}</div>`;
        })() : ''}
    </div>

    <img class="lockup" src="assets/logo-lockup.svg" alt="Artworks produced by the B.U.G.">
    ${(r.rightPlates || []).map((p) =>
        `<img class="sleeve" src="${p}" srcset="${bugSrcset(p)}"
              sizes="(max-width: 900px) 100vw, 46vw"
              alt="${r.title} documentation" loading="lazy" decoding="async">`
      ).join('')}
  `;
})();
