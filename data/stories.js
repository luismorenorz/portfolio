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
    next: "gut1",
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

      { kind: "reel", videos: ["gh-campaign-video-01", "gh-campaign-video-03", "gh-campaign-video-05"],
        caption: "Three of the seven cuts." },

      { kind: "full", image: "171-31", caption: "Defend The Day, installed." }
    ]
  },

  {
    id: "gut1",
    number: "02",
    client: "equilibri-o",
    title: "AI Product Universe",
    disciplines: ["Advertising", "AI-Assisted", "Product Imagery"],
    year: "2026",
    role: "Designer",
    deliverables: [
      "Studio product imagery",
      "Texture and ingredient shots",
      "Packaging-format concepts",
      "Lifestyle scenes",
      "Atmospheric brand imagery",
      "One-palette art direction"
    ],
    line: "A whole product world for one tub, generated rather than shot.",
    cover: { image: "equilibrio-gut1-01" },
    next: "sky18",
    projects: ["equilibrio-gut1"],
    sections: [
      { kind: "text", title: "Overview",
        body: "Gut 1 is a single product: a 435 g tub of lemon-lychee powder, a fiber, prebiotic, enzyme, electrolyte and amino-acid blend. Fifteen images build the entire visual world around it, all AI-assisted, all held to one palette." },

      { kind: "text", title: "Challenge",
        body: "A launch product has no photo library, and a campaign needs one before it can start. There is no budget logic in booking a studio, a stylist, a model and a location for a single SKU with no history. The pack design is real and fixed. Everything around it had to be made." },

      { kind: "text", title: "Creative approach",
        body: "Rather than generate fifteen unrelated images, I worked in four families: studio, texture, format and life. Each answers a different question a buyer asks, and together they cover a launch. What is it, what is inside, how does it arrive, and who is it for." },

      { kind: "trio", images: ["equilibrio-gut1-04", "equilibrio-gut1-05", "equilibrio-gut1-06"],
        caption: "Studio: a reflective sweep, a plinth in hard light, and a block with the shadow thrown long." },

      { kind: "text", title: "One light, one palette",
        body: "What makes a generated set read as one shoot is discipline about light. Every studio frame takes the same key from the upper left and the same sage-on-bone palette, so the shadows fall the same way from image to image and the label holds the same value. Nothing here is warmer or cooler than anything else." },

      { kind: "quote", text: "The pack never changes. Everything around it does." },

      { kind: "aside", image: "equilibrio-gut1-11", title: "What is inside",
        body: "Three tubs stacked with the middle one tipped and the powder running out onto the surface. It is the only frame that opens the product, and it is the one that makes the other fourteen credible: without it the tub is a shape, and with it there is something to buy." },

      { kind: "trio", images: ["equilibrio-gut1-09", "equilibrio-gut1-10", "equilibrio-gut1-14"],
        caption: "Format: a moulded pulp tray, a loose flat lay, and a clear carry bag." },

      { kind: "text", title: "How it arrives",
        body: "The format family does work beyond advertising. A pulp tray, a scattered set and a transparent multipack are three subscription and retail scenarios rendered before anyone commits to tooling. They are proposals as much as they are assets, and they cost nothing to revise." },

      { kind: "trio", images: ["equilibrio-gut1-03", "equilibrio-gut1-07", "equilibrio-gut1-08"],
        caption: "Life: a hand reaching across a kitchen counter, the tub held at the waist in activewear, and a glass poured at home." },

      { kind: "text", title: "People, kept quiet",
        body: "The lifestyle frames stay deliberately low-key. No faces held to camera, no expression selling a feeling. A hand reaching, a torso, someone drinking while looking away. That keeps the product as the subject and stays out of the uncanny territory that generated faces walk into." },

      { kind: "duo", images: ["equilibrio-gut1-13", "equilibrio-gut1-15"],
        caption: "Atmosphere: caustics through shallow water, and the tub held up against cloud." },

      { kind: "duo", images: ["equilibrio-gut1-01", "equilibrio-gut1-02"],
        caption: "Carried: a string market bag with lemons, and the tub going into a gym bag." },

      { kind: "text", title: "Holding it together",
        body: "Fifteen images, one sage green, one light direction, one pack rendered consistently enough that the label reads the same in every frame. The set is meant to be used together, and the rule that makes that possible is the one it never breaks." },

      { kind: "full", image: "equilibrio-gut1-12",
        caption: "One tub, one pedestal, nothing else in the room." }
    ]
  },

  {
    id: "sky18",
    number: "03",
    client: "Sky 18 Capital",
    title: "Rebrand and Rollout",
    disciplines: ["Branding", "Web & UI", "Motion"],
    year: "2026",
    role: "Designer",
    deliverables: [
      "Logotype and mark",
      "Colour and type system",
      "Website design",
      "Email newsletter and signature",
      "LinkedIn graphics",
      "Brand film"
    ],
    line: "A private lender rebuilt from the mark out to the live site.",
    cover: { image: "sky18-rebrand-01" },
    next: "greenhouse",
    projects: ["sky18-rebrand", "sky18-site", "sky18-film"],
    sections: [
      { kind: "text", title: "Overview",
        body: "Sky 18 Capital is a private lending firm in North Miami that funds real estate investors. The rebrand covers the mark, the palette, the website, the email system and the social graphics, and ends with the live site at sky18capital.com and a brand film." },

      { kind: "text", title: "Challenge",
        body: "Private lending sells on trust and speed at the same time. The identity had to look like an institution a broker would send a deal to, and still move at the pace the category promises. Nothing in the category's usual toolkit — stock skylines, gold gradients — does both." },

      { kind: "duo", images: ["sky18-rebrand-01", "sky18-rebrand-03"],
        caption: "The lockup set on charcoal and on white: horizontal, stacked and the mark on its own." },

      { kind: "text", title: "The mark",
        body: "The symbol reads two ways at once: a skyline of vertical bars and a bar chart. It carries the property side and the capital side in one shape, and it survives being shrunk to a favicon or a LinkedIn avatar because it has no detail to lose." },

      { kind: "quote", text: "Capital that moves as fast as your next deal." },

      { kind: "aside", image: "sky18-rebrand-05", title: "Palette",
        body: "Five named colours: Charcoal Trust, Skyline Blue, Capital Blue, Limestone White and Sandstone Beige. The blues carry the finance signal, and the two warm neutrals keep the documents and long-form pages from reading as cold." },

      { kind: "text", title: "The site",
        body: "The website was designed around the questions an investor actually arrives with. Three loan programs — fix and flip, bridge loans and ground-up construction — then a five-step funding review, a checklist of the documents to prepare before requesting terms, a map of the Florida markets served, a comparison table across programs, and a form to submit a deal." },

      { kind: "full", image: "sky18-site-01",
        caption: "The live site at sky18capital.com, top to bottom." },

      { kind: "text", title: "The system in use",
        body: "Beyond the site, the identity had to hold in the places a lender actually appears: a campaign newsletter, an email signature that doubles as a business card, and a LinkedIn set covering the profile banner, the post format and the profile frame." },

      { kind: "trio", images: ["sky18-rebrand-06", "sky18-rebrand-07", "sky18-rebrand-08"],
        caption: "Email newsletter, email signature and the LinkedIn graphics." },

      { kind: "text", title: "Motion",
        body: "A 78-second brand film closes the rollout, introducing the firm and the three programs in the same palette and type the rest of the system uses." },

      { kind: "reel", videos: ["sky18-film-01"],
        caption: "The brand film." },

      { kind: "full", image: "sky18-rebrand-02",
        caption: "We are private lenders." }
    ]
  }

];
