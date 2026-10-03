import type { CountryPageData } from "./types";

// Malawi: content for the /malawi page, the Malawi card on Where We Work,
// and Malawi on the map. Text comes from https://nest360.org/malawi/.
// Edit the text below to change what the page shows; see ./types.ts for
// what each field means.
//
// Copied as-is from nest360.org: "Thermal Management" appears under Respiratory Support,
// and the "20 Clinical Lab" heading has 19 entries.
const malawi: CountryPageData = {
  slug: "malawi",
  name: "Malawi",
  isoNumeric: "454",
  mapLabelPosition: [34.2, -13.3],
  cardImage: {
    src: "/images/countries/malawi.jpg",
    alt: "Malawian baby in Zomba nursery",
    width: 2100,
    height: 1500,
  },
  heading: "NEST360 MALAWI",
  intro:
    "Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.",
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
        "Thermal Management",
      ],
    },
    {
      category: "Thermal Management",
      devices: [
        "Conductive Warmer",
        "Continuous Temperature Monitor",
        "Radiant warmer",
      ],
    },
    {
      category: "Point-of-care Diagnostics",
      devices: ["Glucometers", "Hemoglobinometers"],
    },
  ],
  photos: [
    {
      src: "/images/countries/malawi/pumani.jpeg",
      alt: "Newborn care in Malawi",
      width: 1650,
      height: 1238,
    },
    {
      src: "/images/countries/malawi.jpg",
      alt: "Malawian baby in Zomba nursery",
      width: 2100,
      height: 1500,
    },
  ],
  contact: {
    intro: "To learn more about the NEST360 program in Malawi, contact:",
    photo: {
      src: "/images/countries/malawi/samuel-ngwala.jpg",
      alt: "Samuel Ngwala, Country Director",
      width: 1142,
      height: 1200,
    },
    name: "Samuel Ngwala",
    role: "Country Director",
    email: "malawi@nest360.org",
    address: "P.O.Box 31664 Chichiri Blantyre 3, Malawi",
  },
  training: {
    paragraphs: [
      "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the NEST360 bundle of technologies.",
      "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
      "Participants are typically drawn from NEST360 implementing facilities, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.",
    ],
    biomedicalEngineers: "600+",
    clinicians: "6,000+",
    footnote: "*all numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN MALAWI",
    paragraphs: [
      "Malawi is the first country implementing with NEST360 to achieve national scale in comprehensive small and sick newborn care. The initiative spans 38 hospitals across the country and is supported by 22 clinical skills labs and 2 innovation design studios .",
      "These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with Malawi’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.",
    ],
    map: {
      src: "/images/countries/malawi/facilities-map.png",
      alt: "Map of NEST360 sites in Malawi",
      width: 514,
      height: 1200,
    },
    groups: [
      {
        heading: "38 Hospitals",
        items: [
          "Balaka District Hospital",
          "Bwaila Hospital",
          "Chikwawa District Hospital",
          "Chiradzulu District Hospital",
          "Chitipa District Hospital",
          "Dedza District Hospital",
          "Dowa District Hospital",
          "Embangweni Hospital",
          "Holy Family Hospital",
          "Kamuzu Central Hospital",
          "Karonga District Hospital",
          "Kasungu District Hospital",
          "Machinga District Hospital",
          "Malamulo Mission Hospital",
          "Mangochi District Hospital",
          "Mchinji District Hospital",
          "MUA Mission Hospital",
          "Mulanje District Hospital",
          "Mulanje Mission Hospital",
          "Mwanza District Hospital",
          "Mzimba South District Hospital",
          "Mzuzu Central Hospital",
          "Neno District Hospital",
          "Nkhata Bay District Hospital",
          "Nkhoma Mission Hospital",
          "Nkhotakota District Hospital",
          "Nsanje District Hospital",
          "Ntcheu District Hospital",
          "Ntchisi District Hospital",
          "Phalombe District Hospital",
          "Queen Elizabeth Central Hospital",
          "Rumphi District Hospital",
          "Salima District Hospital",
          "St. Luke’s Hospital",
          "St. Peters Mission Hospital (Likoma Island)",
          "Thyolo District Hospital",
          "Trinity Hospital",
          "Zomba Central Hospital",
        ],
      },
      {
        heading: "20 Clinical Lab",
        items: [
          "College of Medicine – Blantyre",
          "College of Medicine – Mangochi",
          "Daeyung University",
          "Ekwendeni College",
          "Holy Family",
          "Kamuzu College of Nursing – Blantyre",
          "Kamuzu College of Nursing -Lilongwe",
          "Malamulo College",
          "Malawi College of Health Sciences – Blantyre",
          "Malawi College of Health Sciences – Lilongwe",
          "Malawi College of Health Sciences – Zomba",
          "Mulanje Mission",
          "Mzuzu University",
          "Nkhoma College",
          "St. Joseph’s College",
          "St. John’s Institute",
          "St. John of God College",
          "St. Luke’s College",
          "Trinity College",
        ],
      },
      {
        heading: "2 Technical Labs",
        items: [
          "Malawi University of Science & Technology – MUST",
          "Malawi University of Business and Applied Sciences – MUBAS",
        ],
      },
      {
        heading: "2 Design Studios",
        items: [
          "Malawi University of Science & Technology – MUST",
          "Malawi University of Business and Applied Sciences – MUBAS",
        ],
      },
    ],
  },
  partners: {
    heading: "OUR PARTNERS IN MALAWI",
    columns: 4,
    paragraph:
      "We work closely with the Ministry of Health, Kamuzu University of Health Sciences, Malawi University of Business & Applied Sciences, Malawi University of Science & Technology, Hatch Technologies, and Rice360 Institute for Global Health Technologies.",
    logos: [
      {
        src: "/images/countries/malawi/partners/moh-malawi.png",
        alt: "Ministry of Health Malawi",
        width: 1165,
        height: 1200,
      },
      {
        src: "/images/countries/malawi/partners/kamuzu-university.jpg",
        alt: "Kamuzu University of Health Sciences",
        width: 1200,
        height: 849,
      },
      {
        src: "/images/countries/malawi/partners/mubas.jpg",
        alt: "Malawi University of Business and Applied Sciences",
        width: 225,
        height: 225,
      },
      {
        src: "/images/countries/malawi/partners/must.jpg",
        alt: "Malawi University of Science and Technology",
        width: 961,
        height: 1200,
      },
      {
        src: "/images/partners/rice360.png",
        alt: "Rice360 Institute for Global Health Technologies",
        width: 1200,
        height: 353,
      },
      {
        src: "/images/partners/hatch-technologies.png",
        alt: "Hatch Technologies",
        width: 1200,
        height: 1200,
      },
    ],
  },
  news: [
    {
      title: "Research | Low-Cost Glucometer Evaluation",
      href: "/research-low-cost-glucometer-evaluation",
      image: "/images/countries/malawi/news/glucometer.jpg",
      excerpt:
        "NEST360 Research identifies affordable glucometers for use with newborns NEST360 researchers published their findings from a study to systematically evaluate the accuracy and...",
    },
    {
      title:
        "Research | NEST360 team presented NEST360 quality improvement approach at ISQua 2025",
      href: "/research-nest360-team-presented-nest360-quality-improvement-approach-at-isqua-2025",
      image: "/images/news/isqua-2025.jpeg",
      excerpt:
        "NEST360 Research Presentation at ISQua 2025 in BrazilQuality Improvement Approach to Improving Newborn Care NEST360 team members, Nebiyou Hailemariam, Hannah Mwaniki, and Kylie...",
    },
    {
      title: "World Prematurity Day 2024",
      href: "/world-prematurity-day-2024",
      image: "/images/countries/malawi/news/world-prematurity-day.jpg",
      excerpt:
        "This year, The NEST360 countries celebrated World Prematurity Day 2024 with partnering hospitals, representatives from ministries of health, and community leaders. World Prematur...",
    },
  ],
};

export default malawi;
