import type { CountryPageData } from "./types";

// Nigeria: content for the /nigeria page, the Nigeria card on Where We Work,
// and Nigeria on the map. Text comes from https://nest360.org/nigeria/.
// Edit the text below to change what the page shows; see ./types.ts for
// what each field means.
//
// Copied as-is from nest360.org: the "Where we work" paragraph says "Ethiopia’s national care guidelines".
const nigeria: CountryPageData = {
  slug: "nigeria",
  name: "Nigeria",
  isoNumeric: "566",
  mapLabelPosition: [8.1, 9.5],
  cardImage: {
    src: "/images/countries/nigeria.jpg",
    alt: "NEST360 Clinical training in Nigeria",
    width: 520,
    height: 354,
  },
  heading: "NEST360 NIGERIA",
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
      category: "Point-of-care Diagnostics",
      devices: ["Glucometers", "Hemoglobinometers"],
    },
  ],
  photos: [
    {
      src: "/images/countries/nigeria/bmet-training.jpeg",
      alt: "Biomedical technician training in Nigeria with UNICEF",
      width: 1040,
      height: 780,
    },
    {
      src: "/images/countries/nigeria.jpg",
      alt: "NEST360 Clinical training in Nigeria",
      width: 520,
      height: 354,
    },
  ],
  contact: {
    intro: "To learn more about the NEST360 program in Nigeria, contact:",
    photo: {
      src: "/images/countries/nigeria/opeyemi-odedere.jpg",
      alt: "Opeyemi Odedere, Country Director",
      width: 175,
      height: 225,
    },
    name: "Opeyemi Odedere",
    role: "Country Director",
    email: "nigeria@nest360.org",
    address:
      "APIN Public Health Initiatives 8, Connal Road, Off Herbert Macaulay Road, Yaba, Lagos",
  },
  training: {
    paragraphs: [
      "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the NEST360 bundle of technologies.",
      "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
      "Participants are typically drawn from NEST360 implementing facilities, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.",
    ],
    biomedicalEngineers: "250+",
    clinicians: "700+",
    footnote: "*All numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN NIGERIA",
    paragraphs: [
      "In Nigeria, NEST360 is being implemented in 20 hospitals, with the support of 6 skills labs and 2 design studios. These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with Ethiopia’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.",
    ],
    map: {
      src: "/images/countries/nigeria/facilities-map.png",
      alt: "Map of Nigeria with NEST360 facilities marked",
      width: 1200,
      height: 849,
    },
    groups: [
      {
        heading: "20 Hospitals",
        items: [
          "Adeoyo Maternity Teaching Hospital",
          "Alimosho General Hospital",
          "Aminu Kano Teaching Hospital",
          "Amuwo Odofin Maternal and Child Centre",
          "Asokoro District Hospital",
          "Bwari General Hospital",
          "Eti Osa Maternal and Child Centre",
          "Ifako-Ijaye General Hospital",
          "Jericho Specialist Hospital (joint site with UNICEF)",
          "Khalifa Sheikh Isyaku Rabiu Paediatric Hospital",
          "Lagos Island Maternity Hospital",
          "Lagos University Teaching Hospital-Lagos",
          "LAUTECH Teaching Hospital",
          "Massey Street Children’s Hospital",
          "Nyanya General Hospital",
          "Oni Memorial Children’s Hospital",
          "Randle General Hospital",
          "University College Hospital-Ibadan",
          "Wuse District Hospital",
          "Yusuf Dantsoho Memorial Hospital (joint site with UNICEF)",
        ],
      },
      {
        heading: "4 Clinical Labs",
        items: [
          "Ahmadu Bello University Teaching Hospital- Zaria, Kaduna",
          "Lagos University Teaching Hospital-Lagos",
          "University College Hospital-Ibadan",
          "University of Nigeria Teaching Hospital-Enugu",
        ],
      },
      {
        heading: "2 Technical Labs",
        items: [
          "Ahmadu Bello University Teaching Hospital, Zaria, Kaduna",
          "Lagos University Teaching Hospital-Lagos",
        ],
      },
      {
        heading: "2 Design Studios",
        items: ["University of Lagos – UNILAG", "University of Ibadan – UI"],
      },
    ],
  },
  partners: {
    heading: "OUR PARTNERS IN NIGERIA",
    paragraph:
      "We work closely with the Federal Ministry of Health, APIN Public Health Initiatives, the University of Ibadan, the University of Lagos, and Hatch Technologies.",
    logos: [
      {
        src: "/images/countries/nigeria/partners/federal-moh.jpeg",
        alt: "Nigeria Federal Ministry of Health",
        width: 400,
        height: 400,
      },
      {
        src: "/images/countries/nigeria/partners/apin.png",
        alt: "APIN Public Health Initiatives",
        width: 500,
        height: 500,
      },
      {
        src: "/images/countries/nigeria/partners/university-of-ibadan.jpeg",
        alt: "University of Ibadan",
        width: 276,
        height: 330,
      },
      {
        src: "/images/countries/nigeria/partners/university-of-lagos.jpeg",
        alt: "University of Lagos",
        width: 400,
        height: 400,
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
      title:
        "Starting Life Too Soon Inspires Teen to Make Big Impact for Newborns",
      href: "/starting-life-too-soon-inspires-teen-to-make-big-impact-for-newborns",
      image: "/images/countries/nigeria/news/teen-impact.jpg",
      excerpt:
        "Eden Jarrett was born prematurely at 29 weeks and under two pounds in a New York hospital a little over 17 years ago. Today, she draws on her own vulnerable beginning to make a big...",
    },
    {
      title:
        "A Day in the Life Of Nurse Gabriel Oluremi, A Neonatal Nurse in the Neonatal Unit of the Lagos University Teaching Hospital, Lagos, Nigeria",
      href: "/a-day-in-the-life-of-nurse-gabriel-oluremi-a-neonatal-nurse-in-the-neonatal-unit-of-the-lagos-university-teaching-hospital-lagos-nigeria",
      image: "/images/countries/nigeria/news/nurse-gabriel.jpg",
      excerpt:
        "Nurse Gabriel Oluremi is among the heroes providing quality care to small and sick babies in the neonatal unit (NNU) at Lagos University Teaching Hospital. She shared with us a typ...",
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

export default nigeria;
