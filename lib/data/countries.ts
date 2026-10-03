// Country page content, recreated word for word from the nest360.org country
// pages (/kenya, /malawi, /nigeria, /tanzania). Ethiopia lives at /sll360 and
// has its own page file.
//
// Known quirks copied as-is from the live site so content is preserved:
// - Malawi lists "Thermal Management" under Respiratory Support, and its
//   "20 Clinical Lab" heading has 19 entries.
// - Nigeria's "Where we work" paragraph says "Ethiopia's national care
//   guidelines".
// - Tanzania lists Misungwi District Hospital twice.

export interface PageImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface TechnologyGroup {
  category: string;
  devices: string[];
}

// A list entry is either a facility name or an in-list note such as
// "(in partnership with Kenya Paediatric Fellowship Program)".
export type FacilityEntry = string | { note: string };

export interface FacilityGroup {
  heading: string;
  items: FacilityEntry[];
}

export interface NewsItem {
  title: string;
  href: string;
  image: string;
  excerpt?: string;
}

export interface CountryPageData {
  slug: string;
  name: string;
  heading: string;
  intro: string;
  technologies: TechnologyGroup[];
  photos: PageImage[];
  contact: {
    intro: string;
    photo: PageImage;
    name: string;
    role: string;
    phone?: string;
    email: string;
    address: string;
  };
  training: {
    paragraphs: string[];
    biomedicalEngineers: string;
    clinicians: string;
    footnote: string;
  };
  whereWeWork: {
    heading: string;
    paragraphs: string[];
    map: PageImage;
    groups: FacilityGroup[];
  };
  partners: {
    heading: string;
    paragraph: string;
    logos: PageImage[];
    // Logos per row on desktop; nest360.org uses 4 for Malawi, 5 elsewhere.
    columns?: 4 | 5;
  };
  news: NewsItem[];
}

const INTRO =
  "Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.";

const STANDARD_TECHNOLOGIES: TechnologyGroup[] = [
  { category: "Hydration, Nutrition & Drug Delivery", devices: ["Syringe pump"] },
  { category: "Jaundice Management", devices: ["Bilirubinometer", "Phototherapy"] },
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
    devices: ["Conductive Warmer", "Continuous Temperature Monitor", "Radiant Warmer"],
  },
  { category: "Point-of-care Diagnostics", devices: ["Glucometers", "Hemoglobinometers"] },
];

const trainingParagraphs = (implementing: "facilities" | "hospitals") => [
  "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the NEST360 bundle of technologies.",
  "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
  `Participants are typically drawn from NEST360 implementing ${implementing}, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.`,
];

const skillsLabsParagraph = (country: string) =>
  `These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with ${country}’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.`;

const HATCH: PageImage = {
  src: "/images/partners/hatch-technologies.png",
  alt: "Hatch Technologies",
  width: 1200,
  height: 1200,
};

const RICE360: PageImage = {
  src: "/images/partners/rice360.png",
  alt: "Rice360 Institute for Global Health Technologies",
  width: 1200,
  height: 353,
};

const ISQUA_NEWS: NewsItem = {
  title:
    "Research | NEST360 team presented NEST360 quality improvement approach at ISQua 2025",
  href: "/research-nest360-team-presented-nest360-quality-improvement-approach-at-isqua-2025",
  image: "/images/news/isqua-2025.jpeg",
  excerpt:
    "NEST360 Research Presentation at ISQua 2025 in BrazilQuality Improvement Approach to Improving Newborn Care NEST360 team members, Nebiyou Hailemariam, Hannah Mwaniki, and Kylie...",
};

const kenya: CountryPageData = {
  slug: "kenya",
  name: "Kenya",
  heading: "NEST360 KENYA",
  intro: INTRO,
  technologies: STANDARD_TECHNOLOGIES,
  photos: [
    {
      src: "/images/countries/kenya/minister-announcement.png",
      alt: "Kenya Minister of Health announcing the comprehensive newborn care protocols.",
      width: 936,
      height: 624,
    },
    {
      src: "/images/countries/kenya.jpeg",
      alt: "NEST360 first installed in Kenya in 2020.",
      width: 2048,
      height: 1365,
    },
  ],
  contact: {
    intro: "To learn more about the NEST360 program in Kenya, contact:",
    photo: {
      src: "/images/countries/kenya/george-okello.jpg",
      alt: "George Okello, Country Director",
      width: 1200,
      height: 1052,
    },
    name: "George Okello",
    role: "Country Director",
    phone: "+254 780 521 314",
    // The live site links this address to nigeria@nest360.org by mistake.
    email: "kenya@nest360.org",
    address: "11th floor, The Address Muthangari Drive Nairobi, Kenya",
  },
  training: {
    paragraphs: trainingParagraphs("facilities"),
    biomedicalEngineers: "400+",
    clinicians: "2,000",
    footnote: "*numbers above are cumulative since 2019",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN KENYA",
    paragraphs: [
      "In Kenya, NEST360 is being implemented in 18 hospitals, with the support of 12 skills labs. " +
        skillsLabsParagraph("Kenya"),
    ],
    map: {
      src: "/images/countries/kenya/facilities-map.png",
      alt: "Map of Kenya with NEST360 facilities marked",
      width: 1013,
      height: 1200,
    },
    groups: [
      {
        heading: "18 Hospitals",
        items: [
          "Bungoma County Referral Hospital",
          "Embu County Referral Hospital",
          "Jaramogi Oginga Odinga Teaching and Referral Hospital",
          "Kakamega County Referral Hospital",
          "Kenyatta National Hospital (KNH)",
          "Kerugoya County Referral Hospital",
          "Kiambu County Referral Hospital",
          "Machakos County Referral Hospital",
          "Mama Lucy Kibaki Hospital",
          "Nakuru County Referral Hospital",
          "Nyeri County Referral Hospital",
          "Pumwani Maternity Hospital",
          "Thika Level 5 Hospital",
          { note: "(in partnership with Kenya Paediatric Fellowship Program)" },
          "Engineer County Referral",
          "Kisii County Referral Hospital",
          "Marsabit County Referral Hospital",
          "Mbagathi Referral Hospital",
          "Msambweni County Referral Hospital",
        ],
      },
      {
        heading: "4 Clinical Labs",
        items: [
          "Eldoret Kenya Medical Training College (KMTC)",
          "Kisumu KMTC",
          "Nairobi KMTC",
          "KNH School of Nursing",
        ],
      },
      {
        heading: "8 Technical Labs",
        items: [
          "KMTC Eldoret",
          "KMTC Kilifi",
          "KMTC Kisumu",
          "KMTC Meru",
          "KMTC Nairobi",
          "KMTC Oloitoktok",
          "Kenyatta University School of Engineering & Technology",
          "Technical University of Mombasa",
        ],
      },
    ],
  },
  partners: {
    heading: "OUR PARTNERS IN KENYA",
    paragraph:
      "We work closely with the Ministry of Health, County Departments of Health, Aga Khan University, KEMRI Wellcome Trust Research Programme, Kenyatta University, and Hatch Technologies.",
    logos: [
      { src: "/images/countries/kenya/partners/moh-kenya.jpg", alt: "Ministry of Health Kenya", width: 245, height: 206 },
      { src: "/images/countries/kenya/partners/aga-khan-university.gif", alt: "Aga Khan University", width: 463, height: 200 },
      { src: "/images/countries/kenya/partners/kemri-wellcome-trust.jpeg", alt: "KEMRI Wellcome Trust Research Programme", width: 600, height: 71 },
      { src: "/images/countries/kenya/partners/kenyatta-university.png", alt: "Kenyatta University", width: 300, height: 287 },
      HATCH,
    ],
  },
  news: [
    {
      title: "Clean hands saved newborns’ lives in our hospitals: A responsibility for All",
      href: "/clean-hands-saved-newborns-lives-in-our-hospitals-a-responsibility-for-all",
      image: "/images/countries/kenya/news/clean-hands.jpg",
      excerpt:
        "On this World Patient Safety Day, let us commit to a culture of “regular hand washing, peer accountability, and a ban to shortcuts and culture of silence. The survival of our new...",
    },
    {
      title:
        "International Women’s Day | “I did it. You can do it.” How Women Are Saving Kenya’s Smallest Lives",
      href: "/how-women-are-saving-kenyas-smallest-lives",
      image: "/images/countries/kenya/news/womens-day.jpeg",
      excerpt:
        "In neonatal wards across Kenya, some of the most powerful leaders are mothers. On International Women’s Day, we celebrate women who lead, nurture, and change systems often withou...",
    },
    {
      title: "News | Kenya’s National Investment Case for Newborn Care",
      href: "/kenyas-national-investment-case-for-newborn-care",
      image: "/images/countries/kenya/news/investment-case.jpg",
      excerpt:
        "Kenya Launches Newborn Investment Case to Accelerate Newborn Health Gains On 14th November 2025, the Ministry of Health, together with partners and newborn health stakeholders,...",
    },
  ],
};

const malawi: CountryPageData = {
  slug: "malawi",
  name: "Malawi",
  heading: "NEST360 MALAWI",
  intro: INTRO,
  technologies: [
    STANDARD_TECHNOLOGIES[0],
    STANDARD_TECHNOLOGIES[1],
    {
      category: "Respiratory Support",
      devices: [...STANDARD_TECHNOLOGIES[2].devices, "Thermal Management"],
    },
    {
      category: "Thermal Management",
      devices: ["Conductive Warmer", "Continuous Temperature Monitor", "Radiant warmer"],
    },
    STANDARD_TECHNOLOGIES[4],
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
    paragraphs: trainingParagraphs("facilities"),
    biomedicalEngineers: "600+",
    clinicians: "6,000+",
    footnote: "*all numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN MALAWI",
    paragraphs: [
      "Malawi is the first country implementing with NEST360 to achieve national scale in comprehensive small and sick newborn care. The initiative spans 38 hospitals across the country and is supported by 22 clinical skills labs and 2 innovation design studios .",
      skillsLabsParagraph("Malawi"),
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
      { src: "/images/countries/malawi/partners/moh-malawi.png", alt: "Ministry of Health Malawi", width: 1165, height: 1200 },
      { src: "/images/countries/malawi/partners/kamuzu-university.jpg", alt: "Kamuzu University of Health Sciences", width: 1200, height: 849 },
      { src: "/images/countries/malawi/partners/mubas.jpg", alt: "Malawi University of Business and Applied Sciences", width: 225, height: 225 },
      { src: "/images/countries/malawi/partners/must.jpg", alt: "Malawi University of Science and Technology", width: 961, height: 1200 },
      RICE360,
      HATCH,
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
    ISQUA_NEWS,
    {
      title: "World Prematurity Day 2024",
      href: "/world-prematurity-day-2024",
      image: "/images/countries/malawi/news/world-prematurity-day.jpg",
    },
  ],
};

const nigeria: CountryPageData = {
  slug: "nigeria",
  name: "Nigeria",
  heading: "NEST360 NIGERIA",
  intro: INTRO,
  technologies: STANDARD_TECHNOLOGIES,
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
    paragraphs: trainingParagraphs("facilities"),
    biomedicalEngineers: "250+",
    clinicians: "700+",
    footnote: "*All numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN NIGERIA",
    paragraphs: [
      "In Nigeria, NEST360 is being implemented in 20 hospitals, with the support of 6 skills labs and 2 design studios. " +
        skillsLabsParagraph("Ethiopia"),
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
      { src: "/images/countries/nigeria/partners/federal-moh.jpeg", alt: "Nigeria Federal Ministry of Health", width: 400, height: 400 },
      { src: "/images/countries/nigeria/partners/apin.png", alt: "APIN Public Health Initiatives", width: 500, height: 500 },
      { src: "/images/countries/nigeria/partners/university-of-ibadan.jpeg", alt: "University of Ibadan", width: 276, height: 330 },
      { src: "/images/countries/nigeria/partners/university-of-lagos.jpeg", alt: "University of Lagos", width: 400, height: 400 },
      HATCH,
    ],
  },
  news: [
    {
      title: "Starting Life Too Soon Inspires Teen to Make Big Impact for Newborns",
      href: "/starting-life-too-soon-inspires-teen-to-make-big-impact-for-newborns",
      image: "/images/countries/nigeria/news/teen-impact.jpg",
    },
    {
      title:
        "A Day in the Life Of Nurse Gabriel Oluremi, A Neonatal Nurse in the Neonatal Unit of the Lagos University Teaching Hospital, Lagos, Nigeria",
      href: "/a-day-in-the-life-of-nurse-gabriel-oluremi-a-neonatal-nurse-in-the-neonatal-unit-of-the-lagos-university-teaching-hospital-lagos-nigeria",
      image: "/images/countries/nigeria/news/nurse-gabriel.jpg",
    },
    ISQUA_NEWS,
  ],
};

const tanzania: CountryPageData = {
  slug: "tanzania",
  name: "Tanzania",
  heading: "NEST360 Tanzania",
  intro: INTRO,
  technologies: [
    ...STANDARD_TECHNOLOGIES.slice(0, 4),
    { category: "Point-of-Care Diagnostics", devices: ["Glucometers", "Hemoglobinometers"] },
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
    paragraphs: trainingParagraphs("hospitals"),
    biomedicalEngineers: "500+",
    clinicians: "1200+",
    footnote: "*All numbers reported above are cumulative since 2019.",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN TANZANIA",
    paragraphs: [
      "In Tanzania, NEST360 is being implemented in 25 hospitals, with the support of 14 skills labs and 1 design studio. " +
        skillsLabsParagraph("Tanzania"),
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
      { src: "/images/countries/tanzania/partners/moh-tanzania.jpeg", alt: "Ministry of Health Tanzania", width: 263, height: 192 },
      { src: "/images/countries/tanzania/partners/po-ralg.png", alt: "President’s Office – Regional Administration and Local Government", width: 200, height: 300 },
      { src: "/images/countries/tanzania/partners/dit.jpg", alt: "Dar es Salaam Institute of Technology", width: 400, height: 400 },
      HATCH,
      { src: "/images/countries/tanzania/partners/ifakara.jpg", alt: "Ifakara Health Institute", width: 1200, height: 296 },
      { src: "/images/countries/tanzania/partners/lshtm.jpg", alt: "London School of Hygiene and Tropical Medicine", width: 496, height: 268 },
      RICE360,
      { src: "/images/countries/tanzania/partners/muhas.jpg", alt: "Muhimbili University of Health and Allied Sciences", width: 528, height: 498 },
    ],
  },
  news: [
    {
      title: "The First Hours of Life: Why Breast Milk Matters for Newborns",
      href: "/the-first-hours-of-life-why-breast-milk-matters-for-newborns",
      image: "/images/countries/tanzania/news/breast-milk.jpg",
    },
    ISQUA_NEWS,
    {
      title: "Kangaroo Mother Care (KMC) at Mabwepande District Hospital in Tanzania",
      href: "/kangaroo-mother-care-kmcat-mabwepande-district-hospital-in-tanzania",
      image: "/images/countries/tanzania/news/kmc-mabwepande.jpg",
    },
  ],
};

export const countryPages: Record<string, CountryPageData> = {
  kenya,
  malawi,
  nigeria,
  tanzania,
};
