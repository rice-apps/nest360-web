import type { CountryPageData } from "./types";

// Ethiopia: content for the /sll360 page, the Ethiopia card on Where We Work,
// and Ethiopia on the map. Text comes from https://nest360.org/sll360/.
// Edit the text below to change what the page shows; see ./types.ts for
// what each field means.
//
// Ethiopia's page lives at /sll360 (Saving Little Lives 360), the same address as on nest360.org.
const ethiopia: CountryPageData = {
  slug: "sll360",
  name: "Ethiopia",
  isoNumeric: "231",
  mapLabelPosition: [39.6, 8.6],
  cardImage: {
    src: "/images/countries/ethiopia.jpg",
    alt: "Ethiopian Mom and Baby in Hawassa University Hospital",
    width: 611,
    height: 406,
  },
  heading: "SAVING LITTLE LIVES 360 ETHIOPIA",
  intro:
    "In Ethiopia, NEST360 has partnered with the government-led Saving Little Lives (SLL) initiative to form SLL360. In collaboration with the Ethiopia Ministry of Health (MOH), SLL360 brings together expertise from SLL and NEST360 to scale up high-quality newborn care nationwide. The initiative focuses on four critical areas: care at birth and safe referral, neonatal intensive care, Kangaroo Mother Care Plus, and specialized support for small and sick newborns.",
  technologies: [
    {
      category: "Hydration, Nutrition & Drug Delivery",
      devices: ["Syringe pump"],
    },
    {
      category: "Jaundice Management",
      devices: ["Bilirubinometer", "Phototherapy"],
    },
    {
      category: "Respiratory Support",
      devices: [
        "CPAP",
        "Flow Splitter",
        "Oxygen Concentrator",
        "Pulse oximeter",
        "Respiratory Rate Monitor",
        "Suction Pump",
      ],
    },
    {
      category: "Thermal Management",
      devices: [
        "Conductive Warmer",
        "Continuous Temperature Monitor",
        "Radiant Warmer",
      ],
    },
    {
      category: "Point-of-care Diagnostics",
      devices: ["Glucometers", "Hemoglobinometers"],
    },
  ],
  photos: [
    {
      src: "/images/countries/ethiopia.jpg",
      alt: "Ethiopian Mom and Baby in Hawassa University Hospital",
      width: 611,
      height: 406,
    },
    {
      src: "/images/countries/ethiopia/nurse-monitoring.jpg",
      alt: "Nurse monitoring a newborn",
      width: 1200,
      height: 802,
    },
  ],
  contact: {
    intro:
      "For more information about the SLL360 program in ETHIOPIA, contact:",
    photo: {
      src: "/images/countries/ethiopia/abiy-seifu-estifanos.jpg",
      alt: "Abiy Seifu Estifanos, Country Lead",
      width: 625,
      height: 625,
    },
    name: "Abiy Seifu Estifanos",
    role: "Country Lead",
    email: "SLL360@aau.edu.et",
    address:
      "Center for Implementation Sciences, Addis Ababa University, Addis Ababa, Ethiopia",
    website: "https://cis.aau.edu.et",
  },
  training: {
    paragraphs: [
      "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the SLL360 bundle of technologies.",
      "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
      "Participants are typically drawn from SLL360 implementing facilities, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.",
    ],
    biomedicalEngineers: "100+",
    clinicians: "900+",
    footnote: "*All numbers reported above are cumulative until-July 2026.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN ETHIOPIA",
    paragraphs: [
      "In Ethiopia, SLL360 is being implemented in 16 hospitals, with the support of 4 skills labs and 1 design studio. These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with Ethiopia’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.",
    ],
    footnote: "*Information on facilities updated as of July 2026.",
    map: {
      src: "/images/countries/ethiopia/facilities-map.png",
      alt: "Map of Ethiopia with NEST360 facilities marked",
      width: 1200,
      height: 907,
    },
    groups: [
      {
        heading: "16 HOSPITALS",
        items: [
          "Adama Teaching Hospital",
          "Adare General Hospital",
          "Adigudom Primary Hospital",
          "Ayder Comprehensive Specialized Hospital",
          "Batu General Hospital",
          "Dangela Primary Hospital",
          "Dorebafana Primary Hospital",
          "Felege Hiwot Referral Hospital",
          "Hagere Selam Primary Hospital",
          "Hawassa University Comprehensive Specialized Hospital",
          "Injibara General Hospital",
          "Mekelle General Hospital",
          "Meki Primary Hospital",
          "Merawi Primary Hospital",
          "Olenchiti Primary Hospital",
          "Tula Primary Hospital",
        ],
      },
      {
        heading: "Design Studio",
        items: ["Addis Ababa Institute of Technology – AAiT"],
      },
      {
        heading: "4 Technical Skills Labs",
        items: [
          "Adama Teaching Hospital",
          "Ayder Comprehensive Specialized Hospital",
          "Felege Hiwot Referral Hospital",
          "Hawassa University Comprehensive Specialized Hospital",
        ],
      },
    ],
  },
  partners: {
    heading: "OUR PARTNERS IN ETHIOPIA",
    paragraph:
      "We work closely with the Federal Ministry of Health, Addis Ababa University – Institute of Technology Addis Ababa University – Aklilu Lema Health Research Institute, Center for Implementation Sciences, Emory University, London School of Hygiene and Tropical Medicine, Mekelle University, Hawassa University, Hatch Technologies, and Rice360 Institute for Global Health Technologies.",
    logos: [
      {
        src: "/images/countries/ethiopia/partners/moh-ethiopia.png",
        alt: "Ministry of Health Ethiopia",
        width: 705,
        height: 210,
      },
      {
        src: "/images/countries/ethiopia/partners/unicef.png",
        alt: "UNICEF",
        width: 220,
        height: 124,
      },
      {
        src: "/images/countries/ethiopia/partners/who.png",
        alt: "World Health Organization",
        width: 436,
        height: 137,
      },
      {
        src: "/images/countries/ethiopia/partners/global-financing-facility.png",
        alt: "Global Financing Facility",
        width: 226,
        height: 110,
      },
      {
        src: "/images/countries/ethiopia/partners/gates-foundation.jpg",
        alt: "Gates Foundation",
        width: 521,
        height: 134,
      },
      {
        src: "/images/countries/ethiopia/partners/laerdal-foundation.png",
        alt: "Laerdal Foundation",
        width: 368,
        height: 216,
      },
      {
        src: "/images/countries/ethiopia/partners/addis-ababa-university.jpg",
        alt: "Addis Ababa University",
        width: 358,
        height: 238,
      },
      {
        src: "/images/countries/ethiopia/partners/hawassa-university.png",
        alt: "Hawassa University",
        width: 748,
        height: 375,
      },
      {
        src: "/images/countries/ethiopia/partners/emory-university.png",
        alt: "Emory University",
        width: 332,
        height: 188,
      },
      {
        src: "/images/countries/ethiopia/partners/many-more.jpg",
        alt: "+ many more...",
        width: 450,
        height: 92,
      },
    ],
  },
  news: [
    {
      title:
        "Research | Examining the perceptions of preterm birth in Ethiopia",
      href: "/research-examining-the-perceptions-of-preterm-birth-in-ethiopia",
      image: "/images/countries/ethiopia/news/preterm-birth-perceptions.jpg",
      excerpt:
        "Research explores the impact of preterm birth perceptions in Ethiopia Researchers, including NEST360 partners in Ethiopia, recently published a work examining the beliefs,...",
    },
    {
      title:
        "News | Keeping small and sick newborns safe starts with safe medical devices",
      href: "/keeping-small-and-sick-newborns-safe-starts-with-safe-medical-devices",
      image: "/images/countries/ethiopia/news/safe-medical-devices.jpg",
      excerpt:
        "In Ethiopia, initiatives such as the SLL360-SSNC Program, led by the Ministry of Health, are contributing to SDG 3 by strengthening human capacity, providing essential medical devi...",
    },
    {
      title:
        "Research | NEST360 team presented NEST360 quality improvement approach at ISQua 2025",
      href: "/research-nest360-team-presented-nest360-quality-improvement-approach-at-isqua-2025",
      image: "/images/news/isqua-2025.jpeg",
      excerpt:
        "NEST360 Research Presentation at ISQua 2025 in BrazilQuality Improvement Approach to Improving Newborn Care NEST360 team members, Nebiyou Hailemariam, Hannah Mwaniki, and Kylie...",
    },
  ],
};

export default ethiopia;
