import type { CountryPageData } from "./types";

// Tanzania: content for the /tanzania page, the Tanzania card on Where We Work,
// and Tanzania on the map. Text comes from https://nest360.org/tanzania/.
// Edit the text below to change what the page shows; see ./types.ts for
// what each field means.
//
// Copied as-is from nest360.org: Misungwi District Hospital is listed twice.
const tanzania: CountryPageData = {
  slug: "tanzania",
  name: "Tanzania",
  isoNumeric: "834",
  mapLabelPosition: [34.8, -6.4],
  cardImage: {
    src: "/images/countries/tanzania.jpg",
    alt: "Tanzanian Mom and Baby in Amana Hospital",
    width: 1200,
    height: 800,
  },
  heading: "NEST360 Tanzania",
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
      category: "Point-of-Care Diagnostics",
      devices: ["Glucometers", "Hemoglobinometers"],
    },
  ],
  photos: [
    {
      src: "/images/countries/tanzania/amana-nurse.jpg",
      alt: "Nurse checking on baby in Amana Hospital, Dar es Salaam, Tanzania",
      width: 1200,
      height: 800,
    },
    {
      src: "/images/countries/tanzania/ground-breaking.jpg",
      alt: "NEST360 Tanzania country team at a ground-breaking",
      width: 850,
      height: 664,
    },
  ],
  contact: {
    intro: "To learn more about the NEST360 program in Tanzania, contact:",
    photo: {
      src: "/images/countries/tanzania/mariam-johari.jpg",
      alt: "Mariam Johari, Country Director",
      width: 800,
      height: 800,
    },
    name: "Mariam Johari",
    role: "Country Director",
    phone: "+255 222 774 756",
    email: "Tanzania@nest360.org",
    address:
      "P.O. Box 78, 373 5th Floor, PSSF Commercial Complex, Sam Nujoma Road Dar es Salaam, Tanzania",
  },
  training: {
    paragraphs: [
      "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the NEST360 bundle of technologies.",
      "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
      "Participants are typically drawn from NEST360 implementing hospitals, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.",
    ],
    biomedicalEngineers: "500+",
    clinicians: "1200+",
    footnote: "*All numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN TANZANIA",
    paragraphs: [
      "In Tanzania, NEST360 is being implemented in 25 hospitals, with the support of 14 skills labs and 1 design studio. These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with Tanzania’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.",
    ],
    map: {
      src: "/images/countries/tanzania/facilities-map.png",
      alt: "Map of Tanzania with NEST360 facilities marked",
      width: 1200,
      height: 1191,
    },
    groups: [
      {
        heading: "25 Hospitals",
        items: [
          "Amana Regional Referral Hospital",
          "Buchosa District Hospital",
          "Bugando Medical Center",
          "Hai District Hospital",
          "Kigamboni District Hospital",
          "Kilimanjaro Christian Medical Centre",
          "Kivule District Hospital",
          "Mabwepande District Hospital",
          "Mawenzi Regional Referral Hospital",
          "Mbeya Regional Referral Hospital",
          "Mbeya Zonal Referral Hospital",
          "Misungwi District Hospital",
          "Muhimbili National Hospital Upanga",
          "Muhimbili National Hospital Mloganzila",
          "Misungwi District Hospital",
          "Mwananyamala Regional Referral Hospital",
          "Nyamagana District Hospital",
          "Rombo District Hospital",
          "Same District Hospital",
          "Sekou-Toure Regional Referral Hospital",
          "Sengerema Designated District Hospital",
          "Siha District Hospital",
          "Temeke Regional Referral Hospital",
          "Tukuyu District Hospital",
          "Ubungo District Hospital",
          "Yombo Vituka Health Centre",
        ],
      },
      {
        heading: "7 Clinical Labs",
        items: [
          "Kilimanjaro College of Health and Allied Sciences",
          "Lumumba Regional Hospital-Zanzibar",
          "Mbeya College of Health and Allied Sciences",
          "Muhimbili National Hospital-Mloganzila",
          "Muhimbili National Hospital-Upanga",
          "Muhimbili University of Health and Allied Sciences",
          "The State University of Zanzibar (SUZA) -Zanzibar",
        ],
      },
      {
        heading: "7 Technical Labs",
        items: [
          "Arusha Technical College",
          "Bugando Medical Centre",
          "Dar es Salaam Institute of Technology",
          "Dodoma Calibration Centre",
          "Karume Institute of Science and Technology (KIST) -Zanzibar",
          "Mbeya University of Science and Technology",
          "Muhimbili University of Health and Allied Sciences",
        ],
      },
      {
        heading: "1 Design Studio",
        items: ["Dar es Salaam Institute of Technology – DIT"],
      },
    ],
  },
  partners: {
    heading: "OUR PARTNERS IN TANZANIA",
    paragraph:
      "We work closely with the Ministry of Health and Prime Minister’s Office- Regional Administration and Local Governments (PMO-RALG), Dar Es Salaam Institute of Technology, Ifkara Health Institute, London School of Hygiene and Tropical Medicine, Muhimbilli University of Health and Allied Sciences, Hatch Technologies, and Rice360 Institute for Global Health Technologies.",
    logos: [
      {
        src: "/images/countries/tanzania/partners/moh-tanzania.jpeg",
        alt: "Ministry of Health Tanzania",
        width: 263,
        height: 192,
      },
      {
        src: "/images/countries/tanzania/partners/po-ralg.png",
        alt: "President’s Office – Regional Administration and Local Government",
        width: 200,
        height: 300,
      },
      {
        src: "/images/countries/tanzania/partners/dit.jpg",
        alt: "Dar es Salaam Institute of Technology",
        width: 400,
        height: 400,
      },
      {
        src: "/images/partners/hatch-technologies.png",
        alt: "Hatch Technologies",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/countries/tanzania/partners/ifakara.jpg",
        alt: "Ifakara Health Institute",
        width: 1200,
        height: 296,
      },
      {
        src: "/images/countries/tanzania/partners/lshtm.jpg",
        alt: "London School of Hygiene and Tropical Medicine",
        width: 496,
        height: 268,
      },
      {
        src: "/images/partners/rice360.png",
        alt: "Rice360 Institute for Global Health Technologies",
        width: 1200,
        height: 353,
      },
      {
        src: "/images/countries/tanzania/partners/muhas.jpg",
        alt: "Muhimbili University of Health and Allied Sciences",
        width: 528,
        height: 498,
      },
    ],
  },
  news: [
    {
      title: "The First Hours of Life: Why Breast Milk Matters for Newborns",
      href: "/the-first-hours-of-life-why-breast-milk-matters-for-newborns",
      image: "/images/countries/tanzania/news/breast-milk.jpg",
      excerpt:
        "Tanzania is making significant progress towards establishing its first Human Milk Bank at Muhimbili National Hospital, Mloganzila aspart of a broader effort in Tanzania to improve ...",
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
      title:
        "Kangaroo Mother Care (KMC) at Mabwepande District Hospital in Tanzania",
      href: "/kangaroo-mother-care-kmcat-mabwepande-district-hospital-in-tanzania",
      image: "/images/countries/tanzania/news/kmc-mabwepande.jpg",
      excerpt:
        "Mabwepande District Hospital officially launched its Neonatal Care Unit (NCU) following a major renovation supported by NEST360. This initiative marked a significant milestone in s...",
    },
  ],
};

export default tanzania;
