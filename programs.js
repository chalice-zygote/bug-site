/* ═══════════════════════════════════════════════════════════
   B.U.G. — program registry

   Mirrors BUG.PRGM in the catalog register (rev. 08.10.2026).
   program.html renders from this; nothing is typed into the page.

   `parts` holds the legs of a multi-part program. The register
   uses decimals for these — PRGM.002.1 through .6 — so they are
   legs of one program, not six separate programs.

   `bill` holds the lineup and any production credits, one line
   each. Blank string opens a gap.

   `slug` is the anchor a program's images sit under in
   gallery.html. Every program has one so the register line can
   jump straight to its own zone.

   `media` holds the images. Each carries a kind:
     PROM  promotional — poster, flyer, made BEFORE the event
     ARCV  archival — documentation, made AT or AFTER it
   The distinction matters: one is a claim about what will
   happen, the other a record of what did.
   ═══════════════════════════════════════════════════════════ */

window.PROGRAMS = [
  {
    cat:     'BUG.PRGM.007',
    slug:    'drift-ii',
    catDisp: 'B.U.G. PRGM 007',
    title:   'COLD NEW AGE',
    sub:     '[CENO-BITE OST]',
    venue:   'DRIFT II &mdash; THE COMPOUND, PORTLAND OR',
    venueAfter: true,          /* venue sits below the lockup, not above it */
    date:    '09.05.2026',
    sort:    '2026-09-05',
    bill: [
      'EVENING RESIDUE COMPOSITIONS BY THE B.U.G.'
    ],
    /* utm parameters stripped — they tagged the link as coming from
       Instagram, which would misattribute every click off this page */
    link: { label: 'TICKETS', href: 'https://sickening.events/e/drift-ii' },

    media: [
      { kind: 'PROM', src: 'assets/program/drift-ii/cold-new-age.png' },
      { kind: 'PROM', src: 'assets/program/drift-ii/ceno-bite-gateway.png' },
      { kind: 'PROM', src: 'assets/program/drift-ii/ceno-bite-1.png' },
      { kind: 'PROM', src: 'assets/program/drift-ii/ceno-bite-2.png' }
    ]
  },
  {
    cat:     'BUG.PRGM.006',
    slug:    '1412-gallery',
    catDisp: 'B.U.G. PRGM 006',
    title:   '1412 GALLERY',
    venue:   '1412 GALLERY, SEATTLE WA',
    date:    '06.26.2026',
    sort:    '2026-06-26',
    bill: [
      'UNITY GARNISH, SEBASTIAN CAMENS, BITGRAVES'
    ],

    media: [
      { kind: 'PROM', src: 'assets/program/1412-gallery/1412-poster-promo.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive1.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive2.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive3.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive7.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive10.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive13.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive14.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive15.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive18.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive20.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive21.jpg' },
      { kind: 'ARCV', src: 'assets/program/1412-gallery/1412-archive22.jpg' },
      { kind: 'ARCV', video: 'assets/program/1412-gallery/1412-patch.mp4' }
    ]
  },
  {
    cat:     'BUG.PRGM.005',
    slug:    'holocene',
    catDisp: 'B.U.G. PRGM 005',
    title:   'B.U.G. &times; VIRTUA',
    sub:     'FULL VENUE ACTIVATION',
    venue:   'HOLOCENE, PORTLAND OR',
    date:    '06.24.2026',
    sort:    '2026-06-24',
    bill: [
      'MATTHEW D. GANTT, MIKE NIGRO, FAMILY TRUST,',
      'UNITY GARNISH, AESTHETIC STALEMATE',
      '',
      'LIVE SCULPTING BY COLLECT CALL',
      'LIVE VISUALS BY GUYNOID',
      'BOUNCE HOUSE'
    ],
    /* Filed as PRGM.007w in the register, i.e. under Drift II — but
       placed here per instruction. One of the two is wrong. */
    carrier: { cat: 'BUG.PRGM.007w', label: '4ct1v4t0rs.com', href: 'https://4ct1v4t0rs.com' },

    media: [
      { kind: 'PROM', src: 'assets/program/holocene/holocene-promo1.jpg' },
      { kind: 'PROM', src: 'assets/program/holocene/holocene-promo2.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive1.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive2.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive3.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive4.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive5.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive6.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive7.jpeg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive9.jpeg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive10.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive11.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive13.jpeg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive14.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive15.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive16.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive17.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive18.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive19.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive20.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive21.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive23.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive26.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive30.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive31.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive32.jpg' },
      { kind: 'ARCV', src: 'assets/program/holocene/holocene-archive33.jpg' },
      { kind: 'ARCV', video: 'assets/program/holocene/holocene-bumper.mp4' },
      { kind: 'ARCV', video: 'assets/program/holocene/holocene-patch.mp4' }
    ]
  },
  {
    cat:     'BUG.PRGM.004',
    slug:    'wyrd-hut',
    catDisp: 'B.U.G. PRGM 004',
    title:   'WYRD HUT TAKEOVER',
    venue:   'PORTLAND OR',
    date:    '06.21.2026',
    sort:    '2026-06-21',
    bill: [
      'RICHARD LAWS, URIEL, STEVIE SCHMIDT, SPEDNAR'
    ],

    media: [
      { kind: 'PROM', src: 'assets/program/wyrd-hut/wryd-promo1.JPEG' },
      { kind: 'PROM', src: 'assets/program/wyrd-hut/wryd-promo2.JPEG' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive1.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive3.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive4.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive6.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive9.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive10.jpg' },
      { kind: 'ARCV', src: 'assets/program/wyrd-hut/wyrd-archive13.jpeg' },
      { kind: 'ARCV', video: 'assets/program/wyrd-hut/wyrd-patch.mp4' }
    ]
  },
  {
    cat:     'BUG.PRGM.003',
    slug:    'angel-dust',
    catDisp: 'B.U.G. PRGM 003',
    title:   'ANGEL DUST (1994)',
    sub:     'B.U.G. RESCORE',
    venue:   'CLINTON STREET THEATER, PORTLAND OR',
    date:    '12.14.2025',
    sort:    '2025-12-14',

    media: [
      { kind: 'PROM', src: 'assets/program/angel-dust/angel-dust-promo1.jpg' },
      { kind: 'PROM', src: 'assets/program/angel-dust/angel-dust-promo2.png' },
      { kind: 'PROM', src: 'assets/program/angel-dust/angel-dust-promo3.png' },
      { kind: 'PROM', src: 'assets/program/angel-dust/angel-dust-promo4.png' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-archive1.jpg' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-archive2.jpg' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-archive3.jpg' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-archive4.jpg' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-archive.jpg' },
      { kind: 'ARCV', src: 'assets/program/angel-dust/angel-dust-arch444.JPG' },
      { kind: 'ARCV', video: 'assets/program/angel-dust/angel-dust-end-credits.mp4' }
    ]
  },
  {
    cat:     'BUG.PRGM.002',
    slug:    'midiworldlive',
    catDisp: 'B.U.G. PRGM 002',
    title:   '<span class="mw"><i>midi</i>WORLD<i>live</i></span>',
    sub:     'UNITY GARNISH &times; URIEL &mdash; NORTH AMERICA TOUR',
    venue:   '',
    date:    '09.04&ndash;09.28.2025',
    sort:    '2025-09-04',
    parts: [
      { cat: '002.1', date: '09.04.2025', city: 'PORTLAND',      venue: 'SEIZURE PALACE',     with: 'W/ {ARSONIST}, MAUVE DECADE' },
      { cat: '002.2', date: '09.05.2025', city: 'SEATTLE',       venue: "DRAC'S CASTLE",      with: 'W/ FLESH PRODUCE' },
      { cat: '002.3', date: '09.06.2025', city: 'OLYMPIA',       venue: 'MORTUARY',           with: 'W/ HUMAN JOY' },
      { cat: '002.4', date: '09.07.2025', city: 'VANCOUVER BC',  venue: 'KW STUDIO',          with: 'W/ B.MICHAAEL, IVY HOLLIVANA' },
      { cat: '002.5', date: '09.26.2025', city: 'QUEENS NY',     venue: 'INTERCOMM',          with: 'W/ WEEDWACKER, DASYCHIRA' },
      { cat: '002.6', date: '09.28.2025', city: 'BROOKLYN NY',   venue: 'THE LIVING GALLERY', with: 'W/ MUEIN, MARTINI' }
    ],

    media: [
      { kind: 'PROM', src: 'assets/program/midiworldlive/midiworldlive-promo.jpg' },
      { kind: 'ARCV', src: 'assets/program/midiworldlive/midiworldlive-archive1.jpg' },
      { kind: 'ARCV', src: 'assets/program/midiworldlive/midiworldlive-archive2.jpg' },
      { kind: 'ARCV', src: 'assets/program/midiworldlive/midiworldlive-archive3.jpg' },
      { kind: 'ARCV', src: 'assets/program/midiworldlive/midiworldlive-archive4.jpg' },
      { kind: 'ARCV', video: 'assets/program/midiworldlive/midiworldlive-clip.mp4' }
    ]
  },
  {
    cat:     'BUG.PRGM.001',
    slug:    'saint-david',
    catDisp: 'B.U.G. PRGM 001',
    title:   'SAINT DAVID OF WALES',
    venue:   'PORTLAND OR',
    date:    '04.29.2025',
    sort:    '2025-04-29',
    bill: [
      'LEYA, TETON ETERNAL, PEARL ONION'
    ],

    media: [
      { kind: 'ARCV', src: 'assets/program/saint-david/FullSizeRender.jpg' },
      { kind: 'ARCV', src: 'assets/program/saint-david/leya-v1.png' },
      { kind: 'ARCV', src: 'assets/program/saint-david/ley-v2.png' }
    ]
  }
];
