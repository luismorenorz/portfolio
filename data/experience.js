/* =========================================================================
   Experience.

   One flat list, most recent first. Sorting and durations are derived in
   app.js from the machine-readable `start` and `end` below, so the printed
   dates and the printed durations can never disagree with each other.

   `end: null` means the role is current. Nothing here is estimated: every
   date comes from the resume, and `Coalition Technologies` is kept with the
   dates it already had on the site.

   Only Flowium carries an employment `type`, because that is the only role
   the resume labels a contract.

   `details` holds everything that was verified for each role. The section
   renders the first ROLE_POINTS of them (three) to stay scannable; the rest
   stay here so raising that number is a one-line change.
   ========================================================================= */

const EXPERIENCE = {
  eyebrow: "Experience",
  heading: "More than a decade turning brand systems into production-ready work.",

  /* The headline claim, not a sum. Concurrent contract work overlaps two
     staff roles, so adding the individual durations would double-count. */
  claim: { value: "10+ years", label: "of experience" },
  span: { label: "Agency, in-house and contract work" },

  note: "Overlapping dates reflect concurrent contract work alongside a staff role.",

  roles: [
    {
      id: "gas-group",
      company: "GAS Group",
      role: "Marketing Designer",
      location: "Manhattan, NY",
      env: "Agency",
      start: { m: 6, y: 2022 },
      end: { m: 3, y: 2026 },
      summary: "High-volume creative production, campaign systems and cross-channel direction for multiple accounts.",
      details: [
        "Directed creative production for up to eight accounts per month, producing approximately ten social assets and ten email campaigns weekly, plus more than 50 web banners monthly, while maintaining concept quality at volume.",
        "Built content buckets, creative kits and reusable template systems, then extended those systems into print collateral, retail materials, packaging updates and production-ready files.",
        "Used performance signals, heatmaps, content structure and deliverability considerations to guide layout and hierarchy across landing pages, launches and paid-ready creative.",
        "Turned product benefits into visual storytelling, carrying one message from email through landing page and paid social.",
        "Closed asset gaps for brands with limited photo libraries through art direction and AI-assisted image creation when appropriate.",
        "Led concept development for open briefs, including hiring campaigns, moodboards, alternative creative directions and rationale presented to creative leadership, project managers, copywriters and paid media teams."
      ]
    },
    {
      id: "flowium",
      company: "Flowium",
      role: "Graphic Designer",
      type: "Contract",
      location: "New York, NY · Remote",
      env: "Email agency",
      start: { m: 9, y: 2023 },
      end: { m: 2, y: 2026 },
      summary: "Contract email design for ecommerce brands, translating strategy and performance signals into scalable Klaviyo campaigns.",
      details: [
        "Designed and shipped between eight and 15 emails per day for ecommerce brands, including campaigns, automated flows, opt-in forms, banners and reusable modules.",
        "Used heatmaps, click behaviour, engagement patterns and campaign KPIs as design inputs to improve hierarchy, responsiveness, interaction clarity and conversion.",
        "Collaborated with strategists, copywriters and project managers while managing up to eight clients simultaneously.",
        "Built each send as a visual story from hook to offer to CTA, maintaining readability on mobile and in dark mode.",
        "Introduced motion into email with After Effects while staying within email best practices and deliverability limits.",
        "Created visual direction through design research and moodboards for brands that did not have an established system.",
        "Produced brand-aligned visual assets for clients with limited or nonexistent creative libraries.",
        "Worked across beauty, wellness, healthcare, fitness, cannabis, AI, SaaS and CPG accounts."
      ]
    },
    {
      id: "coalition",
      company: "Coalition Technologies",
      role: "Marketing Designer",
      location: "Los Angeles, CA",
      env: "Agency",
      start: { m: 7, y: 2022 },
      end: { m: 3, y: 2023 },
      summary: "Fast modular Klaviyo production across multiple brands, including packaging and product-line work.",
      details: [
        "Produced six to eight Klaviyo emails per day across multiple brands while maintaining each brand's standards at speed.",
        "Built a modular production system using hero variants, product and benefit blocks, promotional modules, CTA styles and text-only alternatives.",
        "Extended one design system across six to eight SKUs, including dielines and print-ready production files.",
        "Translated campaign goals into structured layouts with clear hierarchy and click intent.",
        "Worked directly with strategists, copywriters and email marketing specialists.",
        "Proposed packaging and naming direction for a beach and beauty product line."
      ]
    },
    {
      id: "teleperformance",
      company: "Teleperformance",
      role: "Creative Content Coordinator",
      location: "Monterrey, México",
      env: "Corporate · B2B",
      start: { m: 8, y: 2019 },
      end: { m: 6, y: 2022 },
      summary: "B2B sales enablement, event branding and immersive client-facing environments.",
      details: [
        "Produced B2B business-development collateral for sales enablement and client pitches, including presentations, one-pagers and event branding.",
        "Designed event experiences that merged the Teleperformance brand with client brands.",
        "Built themed environments for visiting clients using branded spatial design to make each visit memorable and detail-driven.",
        "Carried a single visual story across merchandise, signage, backdrops and on-site activations."
      ]
    },
    {
      id: "svelte",
      company: "Svelte Media Inc.",
      role: "Creative Designer",
      location: "West Palm Beach, FL",
      env: "Digital growth · Ecommerce",
      start: { m: 2, y: 2017 },
      end: { m: 7, y: 2019 },
      summary: "Direct-response landing pages and organic social content for a wellness ecommerce business.",
      details: [
        "Designed high-converting landing pages for an ecommerce wellness business serving women from 40 to 60.",
        "Built the visual argument around direct-response principles and the audience's decision triggers.",
        "Established social content direction and produced organic creative.",
        "Transformed supplied material into structured posts that maintained the brand's voice and messaging."
      ]
    },
    {
      id: "conduent",
      company: "Conduent",
      role: "Brand Manager",
      location: "Monterrey, México",
      env: "Corporate · Brand systems",
      start: { m: 5, y: 2015 },
      end: { m: 9, y: 2016 },
      summary: "Internal brand programs, executive communication and editorial assets across multiple stakeholder groups.",
      details: [
        "Managed internal brand and communications programs across multiple stakeholder groups.",
        "Designed executive-ready presentations for internal teams, sales enablement and client pitches.",
        "Produced editorial-style eBooks and long-form assets that translated brand guidelines into readable layouts.",
        "Used email engagement signals, including opens and clicks, to understand performance and adjust communication.",
        "Maintained clear arguments and consistent brand expression across presentation systems."
      ]
    },
    {
      /* Copy taken from Luis's own LinkedIn entry for this role. Note that
         LinkedIn lists this role as "Senior Graphic Designer, Jun 2017 – Jan
         2018"; the title and dates kept here are the ones Luis supplied as
         verified. Flagged rather than silently reconciled. */
      id: "revista-escaparate",
      company: "Revista Escaparate",
      role: "Editorial Designer",
      location: "México",
      env: "Editorial · Fashion magazine",
      start: { m: 1, y: 2014 },
      end: { m: 5, y: 2015 },
      summary: "Editorial design and art direction for a fashion magazine: covers, layouts, photo shoots and the brand system holding them together.",
      details: [
        "Designed editorial layouts and covers with strong hierarchy and a modern, trend-forward aesthetic.",
        "Planned and art-directed fashion photo shoots, shaping concept, mood and overall visual direction, including sets and backdrops.",
        "Developed brand identities and visual guidelines for the magazine, and kept them consistent across print, digital, social and event materials.",
        "Retouched photography to editorial-ready standards.",
        "Created event and social advertising for both digital and print placements.",
        "Scouted and selected talent so each issue's visuals stayed cohesive and on brand.",
        "Partnered with clients and collaborators to translate their ideas into clear, high-impact design."
      ]
    },
    {
      id: "rio-da-prata",
      company: "Rio da Prata",
      role: "Marketing and Communications Manager",
      location: "Mato Grosso do Sul, Brasil",
      env: "Marketing leadership · Tourism",
      start: { m: 6, y: 2013 },
      end: { m: 1, y: 2014 },
      summary: "Organic social strategy and communications for a tourism destination in Brazil.",
      details: [
        "Managed organic social media for a tourism destination with no paid-media budget.",
        "Doubled to nearly tripled follower growth within one year.",
        "Created a structured posting system and tone-of-voice guidelines across multiple sub-brands.",
        "Built the strategy around content direction, consistent publishing and community."
      ]
    }
  ],

  achievements: [
    {
      title: "Times Square, from brief to billboard",
      copy: "Designed advertising creative for a swimwear client's Times Square billboard, taking the project from an open brief through concept directions and final production."
    },
    {
      title: "One visual system across every channel",
      copy: "Created a cohesive direction for a wine portfolio across web, social, print and packaging, moving the brand beyond logo-only execution."
    },
    {
      title: "Email designed for real inboxes",
      copy: "Built responsive, dark-mode-ready email creative using live text, clear click hierarchy and deliverability-aware layouts instead of image-only execution."
    }
  ],

  profile: {
    summary: "Marketing designer specializing in email campaign design and modular design systems for agency and corporate teams, with high-volume production experience in Klaviyo. I turn a single message into scalable creative across email, social, web, print and packaging, working closely with strategists, copywriters and account teams to keep every campaign on brand and performance-aware.",
    columns: [
      {
        title: "Email systems",
        items: ["Email campaign design", "Klaviyo", "Automated flows", "Lifecycle email",
                "Modular email systems", "Reusable templates", "Mobile-first design",
                "Dark mode design", "Deliverability-aware layout"]
      },
      {
        title: "Creative direction and channels",
        items: ["Visual storytelling", "Creative direction", "Design research", "Moodboards",
                "Paid social creative", "Landing pages", "Packaging", "Print production",
                "Editorial design"]
      },
      {
        title: "Systems and collaboration",
        items: ["Accessibility", "Brand consistency", "Cross-functional collaboration",
                "Client management"]
      },
      {
        title: "Tools and platforms",
        items: ["Figma", "Photoshop", "Illustrator", "InDesign", "After Effects", "PowerPoint",
                "Google Slides", "Klaviyo", "Shopify", "Webflow", "WordPress", "Squarespace",
                "ChatGPT", "Midjourney", "Firefly", "NanoBanana"]
      }
    ],
    education: {
      institution: "Universidad Autónoma de Coahuila",
      location: "Saltillo, Mexico",
      degree: "Bachelor degree in Marketing",
      dates: "2011 – 2015"
    },
    languages: [
      { name: "Spanish", level: "Native" },
      { name: "English", level: "Proficient" },
      { name: "Portuguese", level: "Proficient" }
    ]
  },

  resume: {
    href: "assets/documents/Luis-Moreno-RZ-Resume-Aug-2026.pdf",
    label: "Download résumé (PDF)"
  }
};
