/* =========================================================================
   Experience map.

   Grouped by the kind of environment the work happened in, not by date. Some
   of these run at the same time — the Flowium contract overlaps both the GAS
   Group role and Coalition Technologies — and a timeline would read that as a
   mistake instead of as concurrent client work.

   Only Flowium is labelled a contract, because that is the only one the
   résumé labels that way. Every other `env` describes the environment.

   Edit freely: reorder `groups`, add a role to `roles`, change `metrics` or
   `achievements`. Nothing here is hardcoded in the markup.
   ========================================================================= */

const EXPERIENCE = {
  eyebrow: "Experience",
  heading: "Built across agencies, brands and high-volume creative systems.",
  intro: "More than a decade of creative work across agency teams, corporate environments and concurrent contract engagements. The thread throughout is the same: clear ideas, scalable systems and production that performs under real deadlines.",
  note: "Experience includes agency, corporate and contract engagements. Overlapping dates reflect concurrent contract work.",

  /* Every figure here appears in the résumé. Nothing is estimated. */
  metrics: [
    { value: "10+ years", label: "Creative and marketing experience" },
    { value: "8–15 / day", label: "Ecommerce emails at peak production" },
    { value: "Up to 8", label: "Client accounts managed concurrently" },
    { value: "3 languages", label: "Spanish, English and Portuguese" }
  ],

  groups: [
    {
      id: "agency",
      number: "01",
      title: "Agency & high-volume production",
      blurb: "Campaign systems, multi-account production and creative built to perform at scale.",
      color: "#7c2837",
      roles: [
        {
          id: "gas-group",
          company: "GAS Group",
          role: "Marketing Designer",
          location: "Manhattan, NY",
          dates: "Jun 2022 – Mar 2026",
          env: "Agency environment",
          summary: "High-volume creative production, campaign systems and cross-channel direction for multiple accounts.",
          facts: ["Up to 8 accounts", "~10 email campaigns weekly", "50+ web banners monthly"],
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
          role: "Graphic Designer (Contract)",
          location: "New York, NY · Remote",
          dates: "Sep 2023 – Feb 2026",
          env: "Contract · Email agency",
          summary: "Contract email design for ecommerce brands, translating strategy and performance signals into scalable Klaviyo campaigns.",
          facts: ["8–15 emails daily", "Up to 8 clients", "Klaviyo"],
          details: [
            "Designed and shipped between eight and 15 emails per day for ecommerce brands, including campaigns, automated flows, opt-in forms, banners and reusable modules.",
            "Used heatmaps, click behaviour, engagement patterns and campaign KPIs as design inputs to improve hierarchy, responsiveness, interaction clarity and conversion.",
            "Built each send as a visual story from hook to offer to CTA, maintaining readability on mobile and in dark mode.",
            "Introduced motion into email with After Effects while staying within email best practices and deliverability limits.",
            "Created visual direction through design research and moodboards for brands that did not have an established system.",
            "Produced brand-aligned visual assets for clients with limited or nonexistent creative libraries.",
            "Collaborated with strategists, copywriters and project managers while managing up to eight clients simultaneously.",
            "Worked across beauty, wellness, healthcare, fitness, cannabis, AI, SaaS and CPG accounts."
          ]
        },
        {
          id: "coalition",
          company: "Coalition Technologies",
          role: "Marketing Designer",
          location: "Los Angeles, CA",
          dates: "Jul 2022 – Mar 2023",
          env: "Agency environment",
          summary: "Fast modular Klaviyo production across multiple brands, including packaging and product-line work.",
          facts: ["6–8 emails daily", "6–8 SKUs", "Modular systems"],
          details: [
            "Produced six to eight Klaviyo emails per day across multiple brands while maintaining each brand's standards at speed.",
            "Built a modular production system using hero variants, product and benefit blocks, promotional modules, CTA styles and text-only alternatives.",
            "Translated campaign goals into structured layouts with clear hierarchy and click intent.",
            "Worked directly with strategists, copywriters and email marketing specialists.",
            "Proposed packaging and naming direction for a beach and beauty product line.",
            "Extended one design system across six to eight SKUs, including dielines and print-ready production files."
          ]
        }
      ]
    },
    {
      id: "corporate",
      number: "02",
      title: "Corporate & brand systems",
      blurb: "Brand consistency, sales enablement and creative systems for complex organizations.",
      color: "#5a4a2c",
      roles: [
        {
          id: "teleperformance",
          company: "Teleperformance",
          role: "Creative Content Coordinator",
          location: "Monterrey, México",
          dates: "Aug 2019 – Jun 2022",
          env: "Corporate · B2B",
          summary: "B2B sales enablement, event branding and immersive client-facing environments.",
          facts: ["Sales enablement", "Event experiences", "Spatial design"],
          details: [
            "Produced B2B business-development collateral for sales enablement and client pitches, including presentations, one-pagers and event branding.",
            "Designed event experiences that merged the Teleperformance brand with client brands.",
            "Carried a single visual story across merchandise, signage, backdrops and on-site activations.",
            "Built themed environments for visiting clients using branded spatial design to make each visit memorable and detail-driven."
          ]
        },
        {
          id: "conduent",
          company: "Conduent",
          role: "Brand Manager",
          location: "Monterrey, México",
          dates: "May 2015 – Sep 2016",
          env: "Corporate · Brand systems",
          summary: "Internal brand programs, executive communication and editorial assets across multiple stakeholder groups.",
          facts: ["Brand programs", "Executive decks", "Editorial design"],
          details: [
            "Managed internal brand and communications programs across multiple stakeholder groups.",
            "Used email engagement signals, including opens and clicks, to understand performance and adjust communication.",
            "Designed executive-ready presentations for internal teams, sales enablement and client pitches.",
            "Maintained clear arguments and consistent brand expression across presentation systems.",
            "Produced editorial-style eBooks and long-form assets that translated brand guidelines into readable layouts."
          ]
        }
      ]
    },
    {
      id: "growth",
      number: "03",
      title: "Digital growth & creative leadership",
      blurb: "Direct-response design, organic growth and hands-on marketing leadership.",
      color: "#28575a",
      roles: [
        {
          id: "svelte",
          company: "Svelte Media Inc.",
          role: "Creative Designer",
          location: "West Palm Beach, FL",
          dates: "Feb 2017 – Jul 2019",
          env: "Digital growth · Ecommerce",
          summary: "Direct-response landing pages and organic social content for a wellness ecommerce business.",
          facts: ["Landing pages", "Direct response", "Organic social"],
          details: [
            "Designed high-converting landing pages for an ecommerce wellness business serving women from 40 to 60.",
            "Built the visual argument around direct-response principles and the audience's decision triggers.",
            "Established social content direction and produced organic creative.",
            "Transformed supplied material into structured posts that maintained the brand's voice and messaging."
          ]
        },
        {
          id: "rio-da-prata",
          company: "Rio da Prata",
          role: "Marketing and Communications Manager",
          location: "Mato Grosso do Sul, Brasil",
          dates: "Jun 2013 – Jan 2014",
          env: "Marketing leadership · Tourism",
          summary: "Organic social strategy and communications for a tourism destination in Brazil.",
          facts: ["Zero paid media", "2× to nearly 3× follower growth", "Multiple sub-brands"],
          details: [
            "Managed organic social media for a tourism destination with no paid-media budget.",
            "Built the strategy around content direction, consistent publishing and community.",
            "Doubled to nearly tripled follower growth within one year.",
            "Created a structured posting system and tone-of-voice guidelines across multiple sub-brands."
          ]
        }
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
