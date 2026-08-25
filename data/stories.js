/* ---------------------------------------------------------------------------
   SELECTED STORIES
   ---------------------------------------------------------------------------
   Three long-form case studies. Everything here is written from what is
   actually visible in the work: no invented results, metrics or testimonials.

   Each story reuses assets that already exist in the portfolio. `projects`
   lists the project ids the story draws from, so the archive and the case
   study never drift apart.

   A section is one of:
     { kind: "text",     title, body }
     { kind: "full",     image | video, caption }
     { kind: "duo",      images: [a, b], caption }
     { kind: "trio",     images: [a, b, c], caption }
     { kind: "aside",    image, title, body }        small image, lots of air
     { kind: "quote",    text }                      large editorial line
     { kind: "reel",     videos: [...], caption }    motion strip
--------------------------------------------------------------------------- */

const STORIES = [
  {
    id: "greenhouse",
    number: "01",
    client: "Greenhouse",
    title: "Campaign Ecosystem",
    disciplines: ["Advertising", "Retail", "Motion"],
    year: "2025–2026",
    role: "Designer",
    deliverables: [
      "Paid social and display",
      "Shoppable and banner video",
      "Free-standing retail displays",
      "Cooler wraps and shelf blades",
      "Print dielines"
    ],
    line: "One immunity platform carried from the feed to the grocery aisle.",
    cover: { image: "171-31" },
    next: "rove",
    projects: [
      "greenhouse-immunity", "greenhouse-smoothies", "greenhouse-promos",
      "greenhouse-dtd-displays", "greenhouse-fridge", "greenhouse-protein",
      "gh-campaign-video", "gh-protein-heroes"
    ],
    sections: [
      { kind: "text", title: "Overview",
        body: "Greenhouse is a Canadian organic juice and protein brand. Across 2025 and 2026 the work ran on three surfaces at once: paid social and web banners, in-store retail, and video. The through-line was Defend The Day, a full-spectrum ginger shot positioned around immunity." },

      { kind: "text", title: "Challenge",
        body: "The same idea had to survive very different constraints. A social carousel gets a second of attention on a phone. A cooler wrap is read from across a grocery aisle, at an angle, under fluorescent light. A shelf blade is a tall narrow sliver. None of them can be a resize of the others, and all of them have to look like one brand." },

      { kind: "duo", images: ["156-96", "156-107"],
        caption: "The same platform as a square social asset and as a 1472×5709 shelf blade." },

      { kind: "text", title: "Creative approach",
        body: "I built the platform around the ingredient rather than the packshot. Cut ginger, turmeric and lemon are drawn as flat illustration and used as a repeatable field, which scales from a 1080px square to a two-metre display panel without losing legibility. The bottle sits inside that field instead of floating on white." },

      { kind: "full", image: "171-42",
        caption: "Display option one: the render and the flat print panels that build it." },

      { kind: "text", title: "Visual system",
        body: "Deep green as the ground, ochre and yellow for the ingredient field, white for the claim. Type is set tight and heavy so it holds at distance. Every asset carries the dosage numbers, because in this category the numbers are the argument." },

      { kind: "trio", images: ["156-113", "156-114", "156-116"],
        caption: "Smoothie launch: the brand claim, then one slide per flavour." },

      { kind: "text", title: "Applications",
        body: "Retail took the platform furthest. Three structural options for the free-standing unit, each presented as a render alongside the flat panels a printer needs. Cooler wraps turned a standard grocery fridge into the brand, and were photographed after install." },

      { kind: "duo", images: ["171-33", "171-38"],
        caption: "Installed cooler wraps, photographed in the aisle." },

      { kind: "aside", image: "171-35", title: "Protein+",
        body: "A second line ran in parallel. Same system, different colour temperature: cream and olive instead of green and ochre, with the twenty-gram claim doing the work the dosage numbers do on the ginger shots." },

      { kind: "text", title: "Motion",
        body: "Seven cuts extended the platform into video across vertical, square and widescreen: a microplastics explainer, the Green Ritual banner, a screen at Union Station, and an Instacart shoppable spot." },

      { kind: "reel", videos: ["20250409-gh-microplasticsvideos-solution-108", "20251112-gh-dtd-hdvideobanner-b-1080x1920-v2", "20250613-gh-proteinplus-union-station-video"],
        caption: "Three of the seven cuts." },

      { kind: "full", image: "171-31", caption: "Defend The Day, installed." }
    ]
  },

  {
    id: "rove",
    number: "02",
    client: "Rove",
    title: "Email Art Direction",
    disciplines: ["Email", "Motion", "Art Direction"],
    year: "2025",
    role: "Designer",
    deliverables: [
      "Promotional and launch emails",
      "Long-form product education",
      "Animated email heroes",
      "Campaign art direction"
    ],
    line: "One inbox system stretched across drops, education and apparel.",
    cover: { image: "2-10" },
    next: "cafe-cafe",
    projects: ["rove-campaigns", "rove-education", "rove-heroes"],
    sections: [
      { kind: "text", title: "Overview",
        body: "Rove is a cannabis lifestyle brand that sells product, apparel and a beverage line from the same inbox. Twenty pieces in this story: eleven emails and nine animated heroes." },

      { kind: "text", title: "Challenge",
        body: "The mailing list gets a collaboration drop, a science-led sleep explainer and a streetwear launch in the same month. Each needs a different register, and none of them can read as a different company. The variety is the point, and so is the consistency." },

      { kind: "duo", images: ["2-10", "2-9"],
        caption: "A Labubu collaboration drop and the October Breast Cancer Awareness edition." },

      { kind: "text", title: "Creative approach",
        body: "I let the art direction change while the structure stayed fixed. Every email runs the same skeleton: full-bleed hero, one claim, one button, then modular product blocks. What moves is the treatment. Drops get saturated colour and heavy display type. Education emails drop to illustration and long copy. Apparel goes quiet and photographic." },

      { kind: "quote", text: "The layout is the constant. The tone is the variable." },

      { kind: "trio", images: ["18-4", "2-7", "140-32"],
        caption: "Product education: sleep, muscle recovery, and the Drink Loud line." },

      { kind: "text", title: "Visual system",
        body: "Type does the register-switching. A condensed display face for drops, a lighter sans for education, and a lot of restraint on the apparel work. Product photography sits on flat colour rather than in scenes, which keeps assets reusable across emails and paid social." },

      { kind: "text", title: "Motion",
        body: "Nine heroes animate the top of the email. Each is a short loop, exported light enough for the inbox, covering apparel drops and the Drink Loud beverage line." },

      { kind: "reel", videos: ["hero-1", "hero-2", "hero-3", "giffycanvas"],
        caption: "Four of the nine animated heroes." },

      { kind: "duo", images: ["2-6", "2-8"],
        caption: "A twenty-percent gear push and the pickleball giveaway." },

      { kind: "full", image: "2-5", caption: "Taste the melon, feel the magic." }
    ]
  },

  {
    id: "cafe-cafe",
    number: "03",
    client: "Café Café",
    title: "Brand Identity",
    disciplines: ["Branding", "Print", "Art Direction"],
    year: "2025",
    role: "Designer",
    deliverables: [
      "Logotype and mark",
      "Colour and type system",
      "Uniforms and signage",
      "Packaging and print",
      "Verbal identity"
    ],
    line: "A neighbourhood coffee shop that repeats itself on purpose.",
    cover: { image: "3-17-03" },
    next: "greenhouse",
    projects: ["cafe-cafe"],
    sections: [
      { kind: "text", title: "Overview",
        body: "A full identity for a neighbourhood coffee shop: mark, palette, type, uniforms, signage, packaging and voice. Ten applications in the set." },

      { kind: "text", title: "Challenge",
        body: "The name says the same word twice. That could read as a mistake or as a decision. The identity had to make it obviously the second one, and stay warm rather than clever." },

      { kind: "quote", text: "Café Café. Repite después de mí." },

      { kind: "duo", images: ["3-17-04", "3-17-03"],
        caption: "The wordmark set in a hand-drawn circle, and the same letters loose on ochre." },

      { kind: "text", title: "Creative approach",
        body: "Repetition became the whole system. The wordmark curves around on itself so the two words meet. The voice repeats its own lines. A hand-drawn smile works as a mark small enough for a cup and large enough for a wall." },

      { kind: "aside", image: "3-17-08", title: "Palette",
        body: "Six named colours: ocre, maroon, midnight, lait, dalgona, tan and cielo. Warm and slightly dusty, closer to paper stock than to a screen palette, which is what the print and uniform applications needed." },

      { kind: "trio", images: ["3-17-02", "3-17-05", "3-17-09"],
        caption: "Photography sits in the same warm register as the palette." },

      { kind: "text", title: "Applications",
        body: "Uniforms carry the smile as embroidery and the wordmark across the back. Signage puts the mark at architectural scale next to the street number. The cup, the apron and the shopfront all read from different distances with the same two elements." },

      { kind: "duo", images: ["3-17-07", "3-17-10"],
        caption: "Uniform and shopfront." },

      { kind: "full", image: "3-17-06", caption: "Nos repetimos porque lo simple se disfruta dos veces." }
    ]
  }
];
