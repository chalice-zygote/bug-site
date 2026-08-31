/* ═══════════════════════════════════════════════════════════
   B.U.G. — object page renderer

   Each object page is a short shell carrying data-object="<slug>"
   on <body>. This reads that, pulls the record out of objects.js,
   and builds the page. Layout lives here and in object.css — one
   copy — so the per-object files can't drift apart.
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const slug = document.body.dataset.object || '';
  const list = window.OBJECTS || [];
  const o = list.find(x => x.slug === slug);

  if (!o) {
    document.getElementById('record').innerHTML =
      `<div class="meta">NO OBJECT FILED UNDER &ldquo;${slug || '\u2014'}&rdquo;.</div>`;
    return;
  }

  /* strip tags but keep the casing — the wordmark is not uppercased */
  document.title = o.title.replace(/<[^>]+>/g, '') + ' — BEAUTIFUL UNITY GYMNASIUM';

  const shots = o.shots || [];

  /* the lead is the hover still — it is the one chosen to represent
     the object, and the grid tile already showed the other */
  const lead = o.thumbAlt || o.thumb || shots[0] || '';

  document.getElementById('shots').innerHTML = shots
    .map((src, i) => `<img src="${src}" srcset="${bugSrcset(src)}"
         sizes="(max-width: 900px) 100vw, 50vw"
         alt="${o.slug} ${i + 1}" loading="lazy" decoding="async">`)
    .join('');

  document.getElementById('record').innerHTML = `
    <span class="title-block">${o.title}</span>
    ${lead ? `<img class="lead" src="${lead}" srcset="${bugSrcset(lead)}"
         sizes="(max-width: 900px) 100vw, 46vw" alt="" decoding="async">` : ''}
    <div class="no">${o.catDisp}${o.meta ? ' &middot; ' + o.meta : ''}</div>
    ${(o.note && o.note.length) ? `<div class="note">${
        (Array.isArray(o.note) ? o.note : [o.note])
          .map(l => l === '' ? '<span class="gap"></span>' : l).join('<br>')
      }</div>` : ''}
    ${o.buy ? `<a class="buy lb" href="${o.buy.href}" target="_blank" rel="noopener">${o.buy.label}</a>` : ''}
  `;

  /* ── lightbox ───────────────────────────────────────────
     Click any shot for full size; arrows walk the set. Built
     here rather than in the shell so every object page gets it
     without duplicating markup. */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="lightbox" role="dialog" aria-modal="true" aria-label="Full size">
      <img id="lb-img" src="" alt="">
      <div id="lb-meta"><span id="lb-n"></span></div>
      <button class="lb-btn" id="lb-prev" aria-label="Previous">&larr;</button>
      <button class="lb-btn" id="lb-next" aria-label="Next">&rarr;</button>
      <button class="lb-btn" id="lb-close" aria-label="Close">&times;</button>
    </div>`);

  const pics  = [...document.querySelectorAll('#shots img, .record .lead')];
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  let at = -1;

  function show(i) {
    if (i < 0 || i >= pics.length) return;
    at = i;
    lbImg.src = pics[i].src;
    document.getElementById('lb-n').textContent = (i + 1) + ' / ' + pics.length;
    lb.classList.add('open');
    document.body.classList.add('lb-open');
    [i - 1, i + 1].forEach(j => {
      if (pics[j]) { const im = new Image(); im.src = pics[j].src; }
    });
  }
  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-open');
    lbImg.src = '';
  }

  pics.forEach((el, i) => el.addEventListener('click', () => show(i)));
  lb.addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', e => {
    e.stopPropagation(); show((at - 1 + pics.length) % pics.length); });
  document.getElementById('lb-next').addEventListener('click', e => {
    e.stopPropagation(); show((at + 1) % pics.length); });
  document.getElementById('lb-close').addEventListener('click', e => {
    e.stopPropagation(); close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show((at - 1 + pics.length) % pics.length);
    if (e.key === 'ArrowRight') show((at + 1) % pics.length);
  });

  /* ── spine, sampled from the lead ──────────────────────── */
  const STOPS = 26;
  const lum = c => 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2];
  const sat = c => { const mx = Math.max(...c), mn = Math.min(...c);
                     return mx ? (mx - mn) / mx : 0; };
  const punch = (c, a) => { const mx = Math.max(...c);
                            return c.map(v => Math.max(0, Math.min(255, mx - (mx - v) * a))); };
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

  if (!lead) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const N = 96, cv = document.createElement('canvas');
      cv.width = cv.height = N;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      cx.drawImage(img, 0, 0, N, N);
      const d = cx.getImageData(0, 0, N, N).data;

      const bucket = new Map();
      for (let i = 0; i < d.length; i += 4) {
        if (d[i+3] < 128) continue;
        const k = (d[i] >> 3) + ',' + (d[i+1] >> 3) + ',' + (d[i+2] >> 3);
        const b = bucket.get(k);
        if (b) { b.n++; b.r += d[i]; b.g += d[i+1]; b.b += d[i+2]; }
        else bucket.set(k, { n: 1, r: d[i], g: d[i+1], b: d[i+2] });
      }
      if (!bucket.size) return;

      const all = [...bucket.values()].map(b => ({ c: [b.r/b.n, b.g/b.n, b.b/b.n], n: b.n }));
      const scored = all
        .map(x => ({ ...x, s: x.n * (0.18 + Math.pow(sat(x.c), 1.6) * 3.2) }))
        .sort((a, b) => b.s - a.s).slice(0, 46).map(x => x.c);

      const pop  = scored.slice().sort((a, b) => sat(b) - sat(a))[0];
      const ramp = scored.slice().sort((a, b) => lum(a) - lum(b));

      const out = [];
      for (let i = 0; i < STOPS; i++)
        out.push(punch(ramp[Math.floor(i / STOPS * ramp.length)], 0.62));
      if (pop) out[Math.floor(STOPS * 0.42)] = punch(pop, 0.42);

      document.getElementById('spine').innerHTML =
        out.map(c => `<i style="background:${hex(c)}"></i>`).join('');
    } catch (e) {
      console.warn('[spine] could not sample', lead, e);
    }
  };
  img.src = lead;
})();
