/* ---------------------------------------------------------------------------
   PORTFOLIO DATA
   ---------------------------------------------------------------------------
   This is the only file you need to edit to change the site's content.

   Each project looks like this:

     {
       id:       "unique-slug",              // used in the URL (#unique-slug)
       title:    "What the project is",
       client:   "Client or brand name",
       category: "Email",                    // ONE of the CATEGORIES below
       tags:     ["Email", "Campaign"],      // AS MANY as you like
       year:     "2025",                     // optional, delete if unknown
       summary:  "One or two sentences.",
       images:   ["2-10", "2-5"]             // file names in assets/full + assets/thumb
     }

   Every project gets the same size tile, three across. The order on the page
   is the order in this file. Move a block up to push that project higher.

   A project can also carry motion instead of, or alongside, stills:

       videos: ["mo-01", "mo-02"]

   Each name maps to three files the ingest script writes for you:
       assets/video/<name>.mp4     the piece, played in the preview sheet
       assets/preview/<name>.mp4   a short silent loop, played on tile hover
       assets/poster/<name>.webp   the still frame used on the tile

   To add a tag, type it into a project's `tags` array. A tag becomes a filter
   once three projects share it; below that it still shows on the project and
   stays clickable from the preview sheet.
--------------------------------------------------------------------------- */

const SITE = {
  name: "Luis Moreno",
  role: "Graphic & Digital Designer",
  location: "Monterrey, Mexico",
  issue: "Selected work 2025–2026",

  /* The cover. `headline` runs at full editorial scale; `support` is the line
     under it. Change either and the hero follows. */
  headline: "From inbox to shelf.",
  support: "I build visual systems across campaigns, email, retail, motion, web and brand.",

  email: "moreno.luisrz@gmail.com",
  links: [
    // Delete any line you don't want shown, or add another.
    { label: "Email", url: "mailto:moreno.luisrz@gmail.com" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/luismorenorz/" }
  ],

  /* The About manifesto. The first line is the big statement. */
  statement: "I design the system, then make it move.",
  about: [
    "I design across the full commercial stack: lifecycle email, paid and organic social, landing pages, retail displays, packaging and brand identity.",
    "Most of my week is high-volume campaign work for consumer brands: supplements, beverages, cannabis, beauty, health and home. I design inside brand systems I did not write, bilingual copy that changes every line length, print dielines, retail specs, and email clients that break whatever you build.",
    "I also take on identity and presentation work, giving a company a coherent look before the campaigns start."
  ],

  /* The capability list beside the About copy. */
  capabilities: [
    ["Email", "Lifecycle, campaign and promotional email, built to survive the clients that break everything."],
    ["Advertising", "Paid social, display and banner sets, resized across every placement a campaign needs."],
    ["Motion", "Animated email heroes, shoppable and banner video, campaign cuts for vertical and widescreen."],
    ["Retail", "Free-standing displays, cooler wraps and shelf blades, from render through to print dielines."],
    ["Packaging", "Cartons, sleeves and spec sheets, bilingual where the market asks for it."],
    ["Web & UI", "Landing pages and product screens, responsive, built around one clear first step."],
    ["Branding", "Marks, palettes, type systems and the applications that prove they hold."],
    ["Presentations", "Pitch and capability decks with data slides that stay readable."],
    ["AI-assisted", "AI-assisted art direction: generated film and image-to-video, used where it earns its place."]
  ]
};

// Order here is the order of the filter bar.
const CATEGORIES = [
  "Email",
  "Advertising",
  "Motion",
  "AI",
  "Social",
  "Retail",
  "Packaging",
  "Web & UI",
  "Branding",
  "Presentations"
];

const PROJECTS = [
  /* ------------------------------- EMAIL ------------------------------- */
  {
    id: "rove-campaigns",
    title: "Cannabis lifestyle email campaigns",
    client: "Rove",
    category: "Email",
    tags: ["Email", "Campaign", "Art Direction", "Cannabis", "Ecommerce"],
    year: "2025",
    summary:
      "Seven promotional emails for a cannabis brand, from the Labubu collaboration drop to the October Breast Cancer Awareness edition.",
    images: ["2-10", "2-5", "2-6", "2-8", "2-9", "140-33", "140-34"]
  },
  {
    id: "rove-education",
    title: "Product education emails",
    client: "Rove",
    category: "Email",
    tags: ["Email", "Art Direction", "Cannabis", "Editorial"],
    year: "2025",
    summary:
      "Four long-form emails on how the products work, covering sleep, muscle recovery and the Drink Loud line. Illustration carries the layout instead of product photography.",
    images: ["18-4", "2-7", "140-32", "2-11"]
  },
  {
    id: "songer-lifecycle",
    title: "Lifecycle emails for a music creator app",
    client: "Songer",
    category: "Email",
    tags: ["Email", "Campaign", "Tech", "App"],
    year: "2025",
    summary:
      "Six lifecycle emails for a songwriting app. The set runs from a creator-type quiz through testimonial layouts to countdown sales on credit packs.",
    images: ["140-31", "140-30", "18-917", "18-918", "18-920", "18-919"]
  },
  {
    id: "compressionsale-emails",
    title: "Compression wear email program",
    client: "CompressionSale",
    category: "Email",
    tags: ["Email", "Campaign", "Ecommerce", "Health"],
    year: "2025",
    summary:
      "Six emails for a medical compression retailer, mixing sale pushes with product education. Includes the Halloween sitewide promo and the JOBST Comfort Collection launch.",
    images: ["2-12", "2-13", "2-14", "2-15", "18-19", "18-921"]
  },
  {
    id: "golden-hour-hemp",
    title: "Wholesale promo emails",
    client: "Golden Hour Hemp",
    category: "Email",
    tags: ["Email", "Campaign", "Cannabis", "B2B", "Illustration"],
    year: "2025",
    summary:
      "Three deal emails for a hemp wholesaler, covering Wax Wednesday, the 4/20 strain push and the Moonrocks & Snowballs launch.",
    images: ["2-16", "2-17", "2-18"]
  },
  {
    id: "sports-edit",
    title: "Running launch emails",
    client: "The Sports Edit",
    category: "Email",
    tags: ["Email", "Campaign", "Sports", "Ecommerce"],
    year: "2025",
    summary:
      "Product-drop emails for a running retailer, covering the HOKA Challenger 8 launch and the Saucony Hurricane 24.",
    images: ["2-4", "450-34", "450-35"]
  },
  {
    id: "alpha-lion-emails",
    title: "Supplement email campaigns",
    client: "Alpha Lion",
    category: "Email",
    tags: ["Email", "Campaign", "Supplements", "Fitness"],
    year: "2025",
    summary:
      "Welcome-flow and product emails for a sports supplement brand. Dark, high-contrast layout throughout.",
    images: ["137-1475", "137-1476"]
  },
  {
    id: "bbqguys",
    title: "Welcome and lifecycle emails",
    client: "BBQGuys",
    category: "Email",
    tags: ["Email", "Ecommerce", "Home"],
    year: "2025",
    summary:
      "Onboarding emails introducing an outdoor living retailer and its kitchen range.",
    images: ["2-23", "2-22"]
  },
  {
    id: "capri-tools",
    title: "Tool brand emails",
    client: "Capri Tools",
    category: "Email",
    tags: ["Email", "Ecommerce", "Tools", "B2B"],
    year: "2025",
    summary:
      "Welcome and product emails for a hand tool brand, set in heavy industrial type.",
    images: ["2-20", "2-21"]
  },
  {
    id: "wink-scrubs",
    title: "Winter collection email",
    client: "Wink",
    category: "Email",
    tags: ["Email", "Campaign", "Apparel", "Built in Figma"],
    year: "2026",
    summary:
      "Seasonal fit-guide email for a medical scrubs brand. Drawn from scratch in Figma rather than assembled from a template.",
    images: ["242-187"]
  },
  {
    id: "organic-india",
    title: "Loyalty reward email",
    client: "Organic India",
    category: "Email",
    tags: ["Email", "Wellness", "CPG"],
    year: "2025",
    summary: "Loyalty offer email for a herbal supplement brand, live for three days.",
    images: ["2-19"]
  },
  {
    id: "cheers-health",
    title: "Editorial wellness email",
    client: "Cheers",
    category: "Email",
    tags: ["Email", "Wellness", "Editorial"],
    year: "2025",
    summary: "Long-form email on sleep and alcohol, written to read like an article rather than a promo.",
    images: ["179-30"]
  },
  {
    id: "ben-bridge",
    title: "New arrivals email",
    client: "Ben Bridge Jeweler",
    category: "Email",
    tags: ["Email", "Jewelry", "Luxury", "Editorial"],
    year: "2025",
    summary: "New arrivals email for a fine jewelry retailer: type on white above a single product shot, with the hero animated.",
    images: ["18-2"],
    videos: ["giffycanvas-1"]
  },

  /* ---------------------------- ADVERTISING ---------------------------- */
  {
    id: "spartan-watch-bands",
    title: "Apple Watch band campaign",
    client: "Spartan",
    category: "Advertising",
    tags: ["Advertising", "Art Direction", "Product Photography", "Accessories", "Ecommerce"],
    year: "2025",
    summary:
      "Eight paid social and display assets for premium Apple Watch bands, all running the line \"when the occasion calls for something sharper\".",
    images: ["156-100", "156-101", "156-102", "156-103", "156-104", "156-97", "156-98", "156-99"]
  },
  {
    id: "greenhouse-smoothies",
    title: "Smoothie launch carousel",
    client: "Greenhouse",
    category: "Advertising",
    tags: ["Advertising", "Social", "Carousel", "CPG", "Food & Beverage"],
    year: "2025",
    summary:
      "Six-slide carousel launching an organic smoothie line, opening on the brand claim and then one slide per flavour.",
    images: ["156-113", "156-112", "156-114", "156-115", "156-116", "156-117"]
  },
  {
    id: "greenhouse-promos",
    title: "Subscribe & save promo assets",
    client: "Greenhouse",
    category: "Advertising",
    tags: ["Advertising", "Ecommerce", "Banner", "CPG", "Food & Beverage"],
    year: "2026",
    summary:
      "Subscription and sitewide-discount promos, resized across web banner and social formats.",
    images: ["156-105", "156-106", "156-108", "156-109", "156-110", "156-118"]
  },
  {
    id: "greenhouse-immunity",
    title: "Defend The Day digital assets",
    client: "Greenhouse",
    category: "Advertising",
    tags: ["Advertising", "Retail", "Campaign", "CPG", "Food & Beverage"],
    year: "2025",
    summary:
      "Digital assets for the Defend The Day ginger-shot platform, including a gifting push and a shelf blade for retail.",
    images: ["156-96", "156-95", "156-107", "156-111"]
  },
  {
    id: "gelmoment-eyeliner",
    title: "Gel eyeliner launch and promo",
    client: "GelMoment",
    category: "Advertising",
    tags: ["Advertising", "Social", "Beauty", "Bilingual EN/FR", "Product Photography"],
    year: "2025",
    summary:
      "Story, feed and Facebook cuts for the Gel Eyeliner launch and the Instigator gift-with-purchase offer.",
    images: ["3-48", "3-47", "3-49", "3-44", "3-45", "3-46"]
  },
  {
    id: "gelmoment-eyeshadow",
    title: "Toujours eyeshadow offer",
    client: "GelMoment",
    category: "Advertising",
    tags: ["Advertising", "Social", "Beauty", "Bilingual EN/FR"],
    year: "2025",
    summary: "Eyeshadow palette and brush set at 15% off, cut for story, feed and Facebook.",
    images: ["3-51", "3-50", "3-52"]
  },
  {
    id: "gelmoment-footfile",
    title: "Optimum foot file offer",
    client: "GelMoment",
    category: "Advertising",
    tags: ["Advertising", "Social", "Beauty", "Bilingual EN/FR"],
    year: "2025",
    summary: "Foot file, buffer and cream sold as a bundle, sized for three placements.",
    images: ["3-54", "3-53", "3-55"]
  },
  {
    id: "gelmoment-poise",
    title: "Poise Perfection gel polish launch",
    client: "GelMoment",
    category: "Advertising",
    tags: ["Advertising", "Social", "Beauty", "Product Photography"],
    year: "2025",
    summary: "Gel polish shade launch. Close-up manicure photography, almost no copy.",
    images: ["3-57", "3-56", "3-58"]
  },
  {
    id: "gelmoment-vibrance",
    title: "Vibrance hair dye launch",
    client: "GelMoment",
    category: "Advertising",
    tags: ["Advertising", "Social", "Beauty"],
    year: "2025",
    summary: "Launch assets for a temporary hair dye line, running the line \"all the colour, without the commitment\".",
    images: ["3-60", "3-59", "3-61"]
  },
  {
    id: "generac-ads",
    title: "Home standby generator ads",
    client: "Generac dealer",
    category: "Advertising",
    tags: ["Advertising", "Paid Social", "Home Services", "Lead Generation"],
    year: "2025",
    summary:
      "Black Friday and extended-warranty ads for a Generac dealer, pitched at homeowners heading into storm season.",
    images: ["98-419", "98-420", "98-421", "98-422", "98-423"]
  },
  {
    id: "cuddle-sale",
    title: "Days of Cuddle Sale",
    client: "Custom blanket brand",
    category: "Advertising",
    tags: ["Advertising", "Ecommerce", "Home", "Seasonal"],
    year: "2025",
    summary:
      "Black Friday campaign for monogrammed blankets: one offer, four story-format cuts.",
    images: ["98-424", "98-425", "98-426", "98-427"]
  },

  /* ------------------------------- MOTION ------------------------------- */
  {
    id: "gh-campaign-video",
    title: "Product and campaign video",
    client: "Greenhouse",
    category: "Motion",
    tags: ["Motion", "Advertising", "CPG", "Food & Beverage", "Paid Social"],
    year: "2025",
    summary:
      "Seven cuts for a juice and protein brand across vertical, square and widescreen: the microplastics explainer, the Green Ritual banner, a Union Station screen, an Instacart shoppable spot.",
    videos: ["20250409-gh-microplasticsvideos-solution-108", "20250606-gh-greenritual-banner-video-1080x19",
             "20251112-gh-dtd-hdvideobanner-b-1080x1920-v2", "20251113-gh-dtd-fg-instacart-shoppable-video",
             "20250613-gh-proteinplus-union-station-video", "20250812-gh-protein-paid-ads-1080x1080-2",
             "202511051703-2"]
  },
  {
    id: "gh-protein-heroes",
    title: "Protein+ hero animations",
    client: "Greenhouse",
    category: "Motion",
    tags: ["Motion", "Email", "CPG", "Product Photography"],
    year: "2025",
    summary: "Two animated email heroes for the Protein+ shake launch, built on the line \"we solved the protein problem\".",
    videos: ["hero-animation", "hero-anim-protein-2"]
  },
  {
    id: "rove-heroes",
    title: "Animated email heroes",
    client: "Rove",
    category: "Motion",
    tags: ["Motion", "Email", "Cannabis", "Art Direction", "Ecommerce"],
    year: "2025",
    summary:
      "Nine looping heroes for a cannabis lifestyle brand, covering the apparel drops and the Drink Loud beverage line.",
    videos: ["hero-1", "hero-2", "hero-3", "giffycanvas", "ezgif-5bb2358e64c93237",
             "97e71b26-0574-48ce-8db6-422924ca689d", "gif", "gif-1", "gif-2"]
  },
  {
    id: "songer-heroes",
    title: "Animated email heroes",
    client: "Songer",
    category: "Motion",
    tags: ["Motion", "Email", "Tech", "App", "Campaign"],
    year: "2025",
    summary:
      "Six heroes for a songwriting app, most of them countdown-driven: Halloween, Black Friday, and the 92%-off early access run.",
    videos: ["hero", "hero-4", "hero-5", "hero-6", "ezgif-1e222236e4ffc1", "ezgif-32d33707b55529bd"]
  },
  {
    id: "puregenius-heroes",
    title: "Animated email heroes",
    client: "Pure Genius",
    category: "Motion",
    tags: ["Motion", "Email", "CPG", "Ecommerce", "Health"],
    year: "2025",
    summary: "Four heroes for a 23g protein drink, from a back-in-stock alert to a daily-habit push carried by review screenshots.",
    videos: ["attachment-1", "frame-81", "group-66", "ezgif-1691e8e992ef9045"]
  },
  {
    id: "zillow-rentals-motion",
    title: "Rentals campaign motion",
    client: "Zillow Rentals",
    category: "Motion",
    tags: ["Motion", "Advertising", "Campaign", "Real Estate", "B2B"],
    year: "2025",
    summary:
      "Seven pieces for the leasing-season launch, from teaser bumpers to a 79-second sizzle reel aimed at property managers.",
    videos: ["zillowrentals-asclaunchsizzle-reachzillions", "asc-teaser-v2-2", "edit-main-comp",
             "v3-mixed-portfolio-animation-mel-2-1", "merge", "artboard4", "artboard5"]
  },
  {
    id: "zillow-product-motion",
    title: "Product UI motion",
    client: "Zillow",
    category: "Motion",
    tags: ["Motion", "UI/UX", "Product Design", "Real Estate", "Tech"],
    year: "2025",
    summary:
      "Screen-recorded product walkthroughs cut to music, including the property-management integrations flow and the OpenAI demo.",
    videos: ["zillow-openai-demo-v6-final-4k-100325", "emtrata-2", "final-rev-1"]
  },
  {
    id: "jewelry-apparel-heroes",
    title: "Sale email heroes",
    client: "Jewelry and apparel brands",
    category: "Motion",
    tags: ["Motion", "Email", "Jewelry", "Ecommerce", "Apparel"],
    year: "2025",
    summary: "Three animated heroes built around a countdown: a flash sale, a sample sale and a swimwear push led by customer reviews.",
    videos: ["giffycanvas-12", "ezgif-12628e0e63447042", "giffycanvas-2"]
  },
  {
    id: "gelmoment-packaging-video",
    title: "Packaging range animation",
    client: "GelMoment",
    category: "Motion",
    tags: ["Motion", "Packaging", "Beauty", "Product Photography"],
    year: "2026",
    summary: "A vertical spot walking the full product range, one pack at a time.",
    videos: ["packagings"]
  },
  {
    id: "generac-promo-video",
    title: "Generator promotion video",
    client: "Generac dealer",
    category: "Motion",
    tags: ["Motion", "Advertising", "Home Services", "Lead Generation"],
    year: "2026",
    summary: "A January promotion spot pricing out a home standby generator and its seven-year warranty.",
    videos: ["gscvid"]
  },
  {
    id: "sky18-film",
    title: "Brand film",
    client: "Sky 18 Capital",
    category: "Motion",
    tags: ["Motion", "Finance", "B2B", "Brand Film"],
    year: "2026",
    summary: "A 78-second film introducing a private lending firm.",
    videos: ["sky18-hero-vid-2"]
  },
  {
    id: "cne-deals-video",
    title: "Season deals promo",
    client: "CNE",
    category: "Motion",
    tags: ["Motion", "Advertising", "Campaign", "Events"],
    year: "2025",
    summary: "A widescreen promo for an annual insider list, with a PS5 and a ticket upgrade as the hook.",
    videos: ["wheel-video-1920x1080"]
  },
  {
    id: "blaze-product-video",
    title: "Product reveal",
    client: "The Blaze BZ3",
    category: "Motion",
    tags: ["Motion", "Product Photography", "Accessories"],
    year: "2025",
    summary: "A short reveal for an eyewear release, shot against black.",
    videos: ["video-template-aep"]
  },
  {
    id: "sko-film",
    title: "Marketing Challenger SKO film",
    client: "Self-initiated",
    category: "Motion",
    tags: ["Motion", "Presentation", "Data Visualisation", "B2B"],
    year: "2026",
    summary: "A sales-kickoff opener, built to run before the deck rather than inside it.",
    videos: ["luis-marketing-challenger-sko"]
  },

  /* --------------------------------- AI --------------------------------- */
  {
    id: "generac-ai-film",
    title: "AI-generated campaign film",
    client: "Generac dealer",
    category: "AI",
    tags: ["AI", "Motion", "Advertising", "Home Services", "Character Design"],
    year: "2026",
    summary:
      "A mascot-led campaign generated end to end with AI video, cut in four versions: two vertical, two widescreen, the longest running just under three minutes.",
    videos: ["vid-final-16x9-30seg-no-edit-sin-qr", "vid-6-16x9", "vid-9-9x16", "vid-3-9x16"]
  },
  {
    id: "ai-experiments",
    title: "Image-to-video experiments",
    client: "Self-initiated",
    category: "AI",
    tags: ["AI", "Motion", "Product Photography", "R&D"],
    year: "2026",
    summary: "Two tests turning a single still into motion, checking how far a generated camera move holds up on a product shot.",
    videos: ["magnific-animate-the-provided-imag-rgggxfixt", "woman-resting-on-stone-wall-202608060051"]
  },

  /* ------------------------------- SOCIAL ------------------------------ */
  {
    id: "cosmedica-social",
    title: "Aesthetic clinic social system",
    client: "Cosmédica · Dra. Cristal Miranda",
    category: "Social",
    tags: ["Social", "Art Direction", "Beauty", "Healthcare", "Editorial", "Spanish"],
    year: "2025",
    summary:
      "Ongoing Instagram system for an aesthetic medicine clinic, in Spanish. Treatment explainers, before-and-after comparisons and service menus.",
    images: ["18-10", "18-17", "18-18", "18-13", "18-7", "18-16", "18-15", "18-11", "18-8", "18-9"]
  },
  {
    id: "nancy-valdes-social",
    title: "Hormonal and aesthetic medicine social",
    client: "Dra. Nancy Valdés",
    category: "Social",
    tags: ["Social", "Art Direction", "Healthcare", "Beauty", "Spanish"],
    year: "2025",
    summary:
      "Feed content for a hormonal-optimisation and aesthetic medicine practice, including a filler-versus-biostimulator comparison and a Christmas campaign.",
    images: ["3-25", "3-27", "3-28", "3-29", "3-30", "3-26", "3-31", "3-32", "3-34"]
  },
  {
    id: "iduna-social",
    title: "Wellness brand feed",
    client: "IDUNA",
    category: "Social",
    tags: ["Social", "Art Direction", "Wellness", "Editorial", "Spanish"],
    year: "2025",
    summary:
      "Monochrome social system for a body and wellness brand, positioned as \"a new approach to beauty and health\".",
    images: ["3-19", "3-20", "3-21", "3-22", "3-23", "3-24", "3-33"]
  },
  {
    id: "ananda-social",
    title: "Body treatment social posts",
    client: "Ananda Beauty Spot",
    category: "Social",
    tags: ["Social", "Beauty", "Spanish"],
    year: "2025",
    summary: "Feed posts for a body-contouring and advanced aesthetics studio, in Spanish.",
    images: ["18-5", "18-6"]
  },

  /* ------------------------------- RETAIL ------------------------------ */
  {
    id: "greenhouse-dtd-displays",
    title: "Defend The Day retail displays",
    client: "Greenhouse",
    category: "Retail",
    tags: ["Retail", "POS", "Print", "Dielines", "3D Mockup", "CPG", "Food & Beverage"],
    year: "2025",
    summary:
      "Free-standing display units for a ginger-shot launch. Three structural options, each shown as a render plus the flat print panels that build it.",
    images: ["171-36", "171-37", "171-38", "171-42", "171-44", "171-45"]
  },
  {
    id: "greenhouse-fridge",
    title: "Grocery fridge takeovers",
    client: "Greenhouse",
    category: "Retail",
    tags: ["Retail", "POS", "Print", "In-store", "CPG", "Food & Beverage"],
    year: "2025",
    summary:
      "Full cooler wraps for a juice brand, photographed after install in grocery aisles.",
    images: ["171-31", "171-32", "171-33", "171-34"]
  },
  {
    id: "greenhouse-protein",
    title: "Protein+ cooler programme",
    client: "Greenhouse",
    category: "Retail",
    tags: ["Retail", "POS", "3D Mockup", "Print", "CPG"],
    year: "2025",
    summary:
      "Cooler graphics for the Protein+ shake launch, rendered side by side for retailer sign-off.",
    images: ["171-35", "171-39", "171-40"]
  },

  /* ------------------------------ PACKAGING ---------------------------- */
  {
    id: "pkg-vibrance",
    title: "Vibrance hair dye packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Beauty", "Bilingual EN/FR"],
    year: "2025",
    summary:
      "Carton and label system for a temporary hair dye range, dielines through to retail and social collateral.",
    images: ["156-30"]
  },
  {
    id: "pkg-contour",
    title: "Highlight & contour stick packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Beauty", "Bilingual EN/FR"],
    year: "2025",
    summary: "Bilingual carton and usage collateral for a duo highlight and contour stick.",
    images: ["156-40"]
  },
  {
    id: "pkg-tea",
    title: "Tea Time sampler packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Illustration", "Bilingual EN/FR"],
    year: "2025",
    summary:
      "Illustrated sampler pack for the seasonal tea collection, with matching promo assets.",
    images: ["156-50"]
  },
  {
    id: "pkg-nailwraps",
    title: "Glam & Go nail wraps packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Beauty"],
    year: "2025",
    summary: "Sleeve and insert for a gel nail wrap line, plus the pattern range presentation.",
    images: ["156-61"]
  },
  {
    id: "pkg-eyeliner",
    title: "Gel eyeliner packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Beauty", "Bilingual EN/FR"],
    year: "2025",
    summary: "Carton, spec sheet and launch collateral for the Gel Eyeliner and Instigator liner.",
    images: ["156-72"]
  },
  {
    id: "pkg-lashes",
    title: "Lashes & tweezers packaging",
    client: "GelMoment",
    category: "Packaging",
    tags: ["Packaging", "Dielines", "Print", "Beauty"],
    year: "2025",
    summary:
      "One-step lash and tweezer kit. Pack layout, sticker application spec and the campaign imagery.",
    images: ["156-82"]
  },

  /* ------------------------------ WEB & UI ----------------------------- */
  {
    id: "doctronic",
    title: "Telehealth landing page",
    client: "Doctronic",
    category: "Web & UI",
    tags: ["Web", "Landing Page", "Responsive", "UI/UX", "Healthcare"],
    year: "2025",
    summary:
      "GLP-1 telehealth evaluation flow for desktop and mobile. Licensing and privacy signals sit above the form, and the first step asks for one field.",
    images: ["137-618", "137-1477"]
  },
  {
    id: "carevio",
    title: "Healthcare app UI",
    client: "Carevio",
    category: "Web & UI",
    tags: ["UI/UX", "Product Design", "Mobile App", "Healthcare", "Design System"],
    year: "2026",
    summary:
      "Onboarding, dashboard and account screens for a care-management app, shown with the component and colour foundations underneath.",
    images: ["244-1536"]
  },
  {
    id: "alpha-lion-landing",
    title: "BURN20 landing page",
    client: "Alpha Lion",
    category: "Web & UI",
    tags: ["Web", "Landing Page", "Ecommerce", "Supplements", "Fitness"],
    year: "2025",
    summary:
      "Product page for the BURN20 fat burner programme, running the daily routine, then the results timeline, then 136,000 customer reviews.",
    images: ["137-1478"]
  },
  {
    id: "generac-landing",
    title: "Generator dealer landing pages",
    client: "Generac dealer",
    category: "Web & UI",
    tags: ["Web", "Landing Page", "Lead Generation", "Home Services"],
    year: "2025",
    summary:
      "Two lead-generation pages for home standby generators, one led by the offer and one by service area. Both end in a free assessment form.",
    images: ["61-3", "97-418"]
  },
  {
    id: "nole",
    title: "Hair care sampling landing page",
    client: "NOLE",
    category: "Web & UI",
    tags: ["Web", "Landing Page", "Ecommerce", "Beauty", "CPG"],
    year: "2025",
    summary:
      "Free-sample landing page for a natural hair care line, walking through the five scents and the plastic-free promise.",
    images: ["9-3"]
  },
  {
    id: "fragrance-sampler",
    title: "Fragrance sampler landing page",
    client: "Fragrance brand",
    category: "Web & UI",
    tags: ["Web", "Landing Page", "Ecommerce", "Beauty", "Editorial"],
    year: "2025",
    summary:
      "Sampling page for three signature scents, told through still life.",
    images: ["9-6"]
  },
  {
    id: "villa-stari-mlin",
    title: "Villa website",
    client: "Villa Stari Mlin",
    category: "Web & UI",
    tags: ["Web", "Hospitality", "Editorial", "Travel"],
    year: "2025",
    summary: "Booking site for a Mediterranean holiday villa. Large photography, short copy.",
    images: ["3-41"]
  },
  {
    id: "easynerdy",
    title: "B2B services website",
    client: "easynerdy",
    category: "Web & UI",
    tags: ["Web", "B2B", "Tech", "Lead Generation"],
    year: "2025",
    summary: "Productivity-consulting site covering services, process and client proof.",
    images: ["3-42"]
  },

  /* ------------------------------ BRANDING ----------------------------- */
  {
    id: "cafe-cafe",
    title: "Brand identity",
    client: "Café Café",
    category: "Branding",
    tags: ["Branding", "Art Direction", "Print", "Logo", "Hospitality", "Spanish"],
    year: "2025",
    summary:
      "Full identity for a neighbourhood coffee shop. Hand-drawn smile mark, an ochre and maroon palette, uniforms and signage, and a voice that repeats itself: \"repite después de mí\".",
    images: [
      "3-17-01", "3-17-02", "3-17-03", "3-17-04", "3-17-05",
      "3-17-06", "3-17-07", "3-17-08", "3-17-09", "3-17-10"
    ]
  },
  {
    id: "manara",
    title: "Brand identity",
    client: "Manara",
    category: "Branding",
    tags: ["Branding", "Logo", "Interior", "Retail"],
    year: "2025",
    summary: "Identity and applications for a furniture and homeware brand, using a soft gradient-lit palette.",
    images: ["3-2"]
  },
  {
    id: "wyne",
    title: "Brand identity",
    client: "Wyne",
    category: "Branding",
    tags: ["Branding", "Logo", "Print", "Hospitality", "Menu Design"],
    year: "2025",
    summary: "Dark identity for a wine bar, applied to menus, labels, uniforms and signage.",
    images: ["3-3"]
  },
  {
    id: "adapt-cafe",
    title: "Brand identity",
    client: "Adapt Cafe",
    category: "Branding",
    tags: ["Branding", "Logo", "Hospitality", "Editorial"],
    year: "2025",
    summary: "Black-and-white identity for a specialty cafe, shown on signage, packaging and print.",
    images: ["3-4"]
  },
  {
    id: "avenue-pilates",
    title: "Pilates studio identity",
    client: "Avenue",
    category: "Branding",
    tags: ["Branding", "Logo", "Wellness", "Print", "Editorial"],
    year: "2025",
    summary:
      "Identity for a pilates studio: serif wordmark, one red accent, photography of bodies in motion.",
    images: ["3-5"]
  },
  {
    id: "nancy-valdes-brand",
    title: "Personal practice identity",
    client: "Dra. Nancy Valdés",
    category: "Branding",
    tags: ["Branding", "Logo", "Healthcare", "Beauty", "Spanish"],
    year: "2025",
    summary:
      "Personal-practice identity for an aesthetic medicine doctor, monogram and palette through to social and print.",
    images: ["3-6"]
  },

  /* ---------------------------- PRESENTATIONS -------------------------- */
  {
    id: "deck-digital-transformation",
    title: "Digital transformation pitch deck",
    client: "Consulting",
    category: "Presentations",
    tags: ["Presentation", "Pitch Deck", "Data Visualisation", "Consulting", "B2B"],
    year: "2026",
    summary:
      "Pitch deck on reinventing business through technology. Orange on black, with before-and-after data slides.",
    images: ["213-31"]
  },
  {
    id: "deck-orbitoshift",
    title: "Crypto investor deck",
    client: "Orbitoshift",
    category: "Presentations",
    tags: ["Presentation", "Pitch Deck", "Finance", "Crypto", "Data Visualisation"],
    year: "2026",
    summary:
      "Investor deck for decentralised financial infrastructure, blue 3D motif and hard numbers.",
    images: ["213-32"]
  },
  {
    id: "deck-trace-ai",
    title: "Company overview deck",
    client: "Trace AI",
    category: "Presentations",
    tags: ["Presentation", "Pitch Deck", "AI", "Tech", "B2B"],
    year: "2026",
    summary:
      "Capabilities and company-overview deck for an AI business: market thesis, core capabilities, founding team.",
    images: ["213-33"]
  }
];
