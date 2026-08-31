/* ═══════════════════════════════════════════════════════════
   B.U.G. — release registry

   Single source of truth. catalog.html renders the index from
   this; release.html renders a detail page from ?id=.

   Adding a release means adding one object here — nothing else.

   SPINE COLOURS
     By default the spine is sampled from `cover`. Two ways to take
     control, in increasing order of authority:
       spineBoost: 1.25   nudge saturation for this record only
       spine: ['#...']    hand-picked, used verbatim, nothing sampled
     Load the page and the console prints the extracted array ready to
     paste in as `spine:` — start from that and edit.

   Catalog numbers follow BUG CATALOG REGISTER (rev. 08.10.2026):
     primary  BUG.WRKS.002   — files, URLs, code, spines, footers
     display  B.U.G. WRKS 002 — site, packaging face, print
   Sequence is per-division and numbers are never reused.

   When the search taxonomy lands, this becomes data.json and the
   facets (state / artist / format / year / id) live alongside.
   ═══════════════════════════════════════════════════════════ */

window.RELEASES = [
  {
    id:       'angels',
    artist:   'UNITY GARNISH',
    title:    'F***ING ANGELS',
    format:   'SINGLE',
    date:     '07.09.25',
    cat:      'BUG.WRKS.001',
    catDisp:  'B.U.G. WRKS 001',
    artworkBy:'SAM KLICKNER',
    url:      'midiworld.live/angels',

    cover:    'assets/releases/angels/angels-cover.png',
    bg:       'assets/releases/angels/angels-background.png',
    rightTop: 'assets/releases/angels/angels-text.jpg',

    credits: [
      'RELEASED 07.09.25',
      'COMPOSED, PRODUCED AND MIXED BY',
      'SAM KLICKNER AND DEREK BLACKSTONE',
      'MASTERED BY ENYANG URBIKS',
      '',
      'ARTWORK AND LAYOUT BY SAM KLICKNER',
      'VIDEO BY CHRIS KING',
      '',
      'ACCOMPANIED BY B.U.G. CHNL 001',
      '&copy; THE BEAUTIFUL UNITY GYMNASIUM 2025'
    ],

    tracks: [],        /* single — format line says it, a list would not */

    /* Quoted, not paraphrased. The institutional voice can't say
       "got pretty obsessed" without sounding like a press release
       affecting candour — in quotation marks it is simply true.

       NOTE: unlike `credits`, each entry here is a PARAGRAPH, not a
       line. It wraps on its own; hard line breaks would fight it. */
    noteLead: 'A note from Sam Kl***ckner:',
    note: [
      '&ldquo;I recently got pretty obsessed with the beautiful cover art for the 1999 Japanese exclusive PS1 game GERMS: Nerawareta Machi, to which no artist other than the development company seems to be attributed. I later found out that the game also draws heavily from the work of Wilhelm Reich and the X-Files &mdash; two huge personal influences not just for this single but across my work generally. The song&rsquo;s title was derived from a reading of Wilhelm&rsquo;s The Murder of Christ. I initially was going to just crop out the PS1 logo and use this original art for this release, but then I had the idea to recreate a version of it using Blender and Photoshop, the result of which you see here.&rdquo;'
    ],

    /* The ground on this record is too dark for the house blue, so the
       text sits on a white panel instead of changing colour — the blue
       is the institution's, the ground is the record's. */
    panel: 'rgba(255,255,255,0.69)',

    listen: [
      { label: 'BANDCAMP', href: '#' },
      { label: 'YOUTUBE',  href: '#' },
      { label: 'NINA',     href: '#' },
      { label: 'SPOTIFY',  href: '#' }
    ],

    /* Unity Garnish sigil. A GRID, not preformatted text — spaces and
       arrows have different widths in a proportional face, so spacing
       it with characters can never come out symmetric.

       Nine half-width columns rather than five, so the arrows can pull
       in tighter than whole-step placement allows while still sitting
       wider than the circled letters. Centre is column 5. */
    markHref: 'https://www.instagram.com/unitygarnish/',
    mark: [
      ['', '',       '\u2196', '', '',       '', '\u2197', '',       ''],
      ['', '',        '',       '', '\u2191', '', '',       '',       ''],
      ['', '',        '',       '', '\u25CF', '', '',       '',       ''],
      ['', '',        '\u24CA', '', '',       '', '\u24BC', '',       '']
    ],

    /* left column — top to bottom */
    plates: [
      'assets/releases/angels/angels-cover.png',
      'assets/releases/angels/angels-germs.jpg',
      'assets/releases/angels/angels-germs-manual.webp',
      'assets/releases/angels/angels-truck.jpg',
      'assets/releases/angels/angels-stu.jpg',
      'assets/releases/angels/angels-stills-1.jpg',
      'assets/releases/angels/angels-stills-2.png'
    ],

    /* right column, below the record — top to bottom */
    rightPlates: [
      'assets/releases/angels/angels-stills-3.png',
      'assets/releases/angels/angels-stills-4.png',
      'assets/releases/angels/angels-vid-1.gif',
      'assets/releases/angels/angels-vid-2.gif',
      'assets/releases/angels/angels-vid-3.gif',
      'assets/releases/angels/angels-vid-4.gif'
    ]
  },

  {
    id:       'miasma',
    artist:   'URIEL',
    title:    'MIASMA',
    format:   'ALBUM',
    date:     '04.28.26',
    cat:      'BUG.WRKS.002',        /* primary form */
    catDisp:  'B.U.G. WRKS 002',     /* display form */
    artworkBy:'JONATHAN BENZ',
    url:      'midiworld.live/miasma',
    cover:    'assets/releases/miasma.jpg',           /* catalog plate + spine source */
    bg:       'assets/releases/miasma-bg-web.png',    /* purpose-made ground */
    rightTop: 'assets/releases/miasma-sticker.png',
    /* right column, below the record */
    rightPlates: [
      'assets/releases/miasma-package-wrapped.png'
    ],

    credits: [
      'RELEASED 04.28.26',
      'PRODUCED &amp; MIXED BY JONATHAN BENZ',
      'COMPOSED &amp; RECORDED AT THE GYM',
      'MASTERED BY AMIR SHOAT',
      'VOCALS ON "GALORE WEST" BY M.',
      'ART DIRECTION AND LAYOUT BY B.U.G.',
      'ADDITIONAL ART DIRECTION AND LAYOUT BY WINNY SCHWARZ'
    ],

    tracks: [
      'HH DRAGON', 'PISS HEAVEN', 'STINGING NETTLE', 'GOLDENFUCK',
      'ECSTASY GAP', 'LOATHEGARDEN', 'WASP NEST', 'RARE SAPPHIRE',
      'BEHAVIOR PATCH', 'ANGEL ROT', 'GALORE WEST', 'HARMONY BOUND'
    ],

    listen: [
      { label: 'BANDCAMP', href: '#' },
      { label: 'YOUTUBE',  href: '#' },
      { label: 'NINA',     href: '#' },
      { label: 'SPOTIFY',  href: '#' }
    ],

    /* left column — top to bottom */
    plates: [
      'assets/releases/miasma.jpg',
      'assets/releases/miasma-package-green-2.jpg',
      'assets/releases/miasma-group.png',
      'assets/releases/miasma-package-orange.jpg',
      'assets/releases/miasma-package-green-1.png'
    ]
  },

  {
    id:       'miracle',
    artist:   'TETON ETERNAL',
    title:    'MIRACLE!',
    format:   'ALBUM',
    date:     '08.16.26',
    cat:      'BUG.WRKS.003',
    catDisp:  'B.U.G. WRKS 003',
    artworkBy:'SAM KLICKNER',
    url:      'midiworld.live/miracle',

    cover:    'assets/releases/miracle-front-cover.png',   /* catalog plate + spine source */
    bg:       'assets/releases/miracle-bg-web.png',        /* purpose-made ground */
    spineBoost: 1.3,      /* sampled a touch flat — lift the chroma */
    rightTop: 'assets/releases/miracle-booklet-back.png',

    credits: [
      'RELEASED 08.16.26',
      'MUSIC BY ELIZABETH LOVELL AND SAM KLICKNER',
      'PRODUCED BY SAM KLICKNER AND DEREK BLACKSTONE',
      '',
      'ADDITIONAL PERFORMANCES:',
      'KYE GRANT - VOICE, ANDREW JONES - FRETLESS BASS',
      'RYAN MILLER - GUITARS, NICK PODGURSKI - VOICE',
      'CASPAR SONNET - LAPSTEEL AND VOICE',
      '',
      'SNOWFLAKE CHOIR:',
      'DEREK BLACKSTONE, KYE GRANT, MAXX KATZ,',
      'ERICA MILLER, SCOTT SCHAUS, JON SCHEID, CASPAR SONNET',
      '',
      'ARTWORK BY SAM KLICKNER',
      'LIGHT LANGUAGE BY ERICA MILLER',
      'PHOTOGRAPHY BY DUSTIN HOUSTON',
      '',
      'MIXED BY BEN GREENBERG AT CIRCULAR RUINS',
      'MASTERED BY ENYANG URBIKS AT URBIKS MUSIC',
      '&copy; THE BEAUTIFUL UNITY GYMNASIUM 2026'
    ],

    tracks: [
      'STARS', 'GREATNESS', 'HELD STILL FOR ALWAYS', 'PRISTINITY',
      'LISTEN IN SECRET', 'SNOWFLAKE', 'PRUDENCE', 'LOVE DESTINY',
      'PAIN ALIVE', 'MIRACLE'
    ],

    listen: [
      { label: 'BANDCAMP', href: '#' },
      { label: 'YOUTUBE',  href: '#' },
      { label: 'NINA',     href: '#' },
      { label: 'SPOTIFY',  href: '#' }
    ],

    /* left column — top to bottom */
    plates: [
      'assets/releases/miracle-front-cover.png',
      'assets/releases/MIRACLE-CD-2026-FRONT-MOCK.png',
      'assets/releases/MIRACLE-CD-BACK-2026-MOCK.png',
      'assets/releases/dew-drop.png',
      'assets/releases/plastic.png',
      'assets/releases/snwflk-1.png'
    ],

    /* right column, below the record — top to bottom */
    rightPlates: [
      'assets/releases/miracle-disc-3.png',
      'assets/releases/miracle-back-ice-1.png',
      'assets/releases/miracle-disc-1.png',
      'assets/releases/miracle-front-ice-1.png',
      'assets/releases/miracle-tray-ice-1.png'
    ]
  }
];
