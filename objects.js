/* ═══════════════════════════════════════════════════════════
   B.U.G. — object registry

   BUG.OBJT. media.html renders the grid; each object with a
   `href` opens its own page, built from `shots`.

   thumb      grid tile
   thumbAlt   revealed on hover — both preload, so no flash
   thumbVideo alpha video tile; give the path WITHOUT extension
   inset      art sits inside the plate rather than bleeding to it
   pos        object-position for cropped tiles, e.g. 'center 38%'
   shots     everything, in scroll order
   note      array; each entry is a LINE, blank opens a gap
   buy       optional external link, rendered as a block button

   Regenerate `shots` with assets/objects/build-objects.sh
   rather than hand-listing.
   ═══════════════════════════════════════════════════════════ */

window.OBJECTS = [
  {
    cat: 'BUG.OBJT.001', catDisp: 'B.U.G. OBJT 001',
    slug: 'shirts', href: 'shirts',
    title: 'B.U.G. &times; UG Cursor Cross Shirt',
    meta: '',
    note: [
      'Screen printed on 6&nbsp;oz, 100% ring-spun cotton Bella+Canvas Heavyweight T-Shirt.',
      '',
      'Artwork by Sam Klickner',
      'Printed by Studio AYC in Portland, OR',
      'Models: Paige and Benzy',
      '',
      'VARIANTS:',
      'Cream ink on &ldquo;Vintage Brown&rdquo; shirt',
      'Bronze ink on &ldquo;Vintage White&rdquo; shirt'
    ],
    buy: { label: 'PURCHASE',
           href: 'https://unitygarnish.bandcamp.com/merch/cursor-cross-x-b-u-g-shirt' },
    thumb:    'assets/objects/ug-shirts-cross/ug-shirt-main-4.png',
    thumbAlt: 'assets/objects/ug-shirts-cross/ug-shirt-main-1.png',
    pos: 'center 38%',   /* crop takes from the bottom, keeping the print */
    shots: [
      'assets/objects/ug-shirts-cross/ug-shirt-main-2.png',
      'assets/objects/ug-shirts-cross/ug-shirt-main-3.png',
      'assets/objects/ug-shirts-cross/ug-shirt-main-4.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-1.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-2.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-3.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-4.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-5.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-6.png',
      'assets/objects/ug-shirts-cross/ug-shirt-models-7.png'
    ]
  },

  {
    cat: 'BUG.OBJT.002', catDisp: 'B.U.G. OBJT 002',
    slug: 'hats', href: 'hats',
    title: '<span class="mw"><i>midi</i>WORLD<i>live</i></span> Hat',
    meta: 'LIMITED EDITION &middot; SOLD OUT',
    note: [
      'Royal blue embroidery on a black Fahrenheit unstructured cap.',
      '',
      'Embroidered by All City Print in Vancouver, WA',
      'Design by Sam Klickner / B.U.G.',
      'Model: Winny'
    ],
    thumb:    'assets/objects/bug-hats/bug-hat-4.jpg',
    thumbAlt: 'assets/objects/bug-hats/bug-hat-1.jpg',
    inset: true,
    shots: [
      'assets/objects/bug-hats/bug-hat-2.jpg',
      'assets/objects/bug-hats/bug-hat-3.jpg',
      'assets/objects/bug-hats/bug-hat-4.jpg',
      'assets/objects/bug-hats/bug-hat-5.jpg',
      'assets/objects/bug-hats/bug-hat-6.jpg'
    ]
  },

  {
    cat: 'BUG.OBJT.003', catDisp: 'B.U.G. OBJT 003',
    slug: 'flags', href: 'flags',
    title: 'B.U.G. Flags',
    meta: 'OPEN EDITION',
    note: '',
    /* Alpha video rather than a GIF — 256 colors could not hold the
       cloth gradients. Extension is chosen at runtime: Safari renders
       VP9 alpha as a black box, so it gets the HEVC. */
    thumbVideo: 'assets/objects/flags',
    thumb: '', thumbAlt: '',
    shots: []
  }
];
