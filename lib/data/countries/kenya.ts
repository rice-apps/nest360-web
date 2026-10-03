import type { CountryPageData } from "./types";

// Kenya: content for the /kenya page, the Kenya card on Where We Work,
// and Kenya on the map. Text comes from https://nest360.org/kenya/.
// Edit the text below to change what the page shows; see ./types.ts for
// what each field means.
//
// The live site links the Kenya email to nigeria@nest360.org by mistake; this uses kenya@nest360.org.
const kenya: CountryPageData = {
  slug: "kenya",
  name: "Kenya",
  isoNumeric: "404",
  mapLabelPosition: [37.9, 0.4],
  cardImage: {
    src: "/images/countries/kenya.jpeg",
    alt: "NEST360 first installed in Kenya in 2020.",
    width: 2048,
    height: 1365,
  },
  heading: "NEST360 KENYA",
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
    email: "kenya@nest360.org",
    address: "11th floor, The Address Muthangari Drive Nairobi, Kenya",
  },
  training: {
    paragraphs: [
      "We provide pre-service and in-service training packages that help educate clinicians and biomedical technicians to use, maintain, and repair the NEST360 bundle of technologies.",
      "Training for both professions is spread out over one week and covers both theory and hands-on application followed by assessment and certification. By learning together professional silos are broken down, leading to better understanding, respect, and appreciation of each other’s roles.",
      "Participants are typically drawn from NEST360 implementing facilities, and medical training colleges, as well as teaching institutions, i.e. biomedical engineering department staff.",
    ],
    biomedicalEngineers: "400+",
    clinicians: "2,000",
    footnote: "*numbers above are cumulative since 2019",
  },
  whereWeWork: {
    heading: "WHERE WE WORK IN KENYA",
    paragraphs: [
      "In Kenya, NEST360 is being implemented in 18 hospitals, with the support of 12 skills labs. These skills labs provide hands-on learning opportunities for healthcare professionals and biomedical technicians that are aligned with Kenya’s national care guidelines. Through the labs, doctors, nurses, and clinical officers receive hands-on training in advanced newborn care techniques using qualified technologies, while biomedical engineers and technicians gain experience in managing and maintaining newborn care equipment.",
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
          {
            note: "(in partnership with Kenya Paediatric Fellowship Program)",
          },
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
      {
        src: "/images/countries/kenya/partners/moh-kenya.jpg",
        alt: "Ministry of Health Kenya",
        width: 245,
        height: 206,
      },
      {
        src: "/images/countries/kenya/partners/aga-khan-university.gif",
        alt: "Aga Khan University",
        width: 463,
        height: 200,
      },
      {
        src: "/images/countries/kenya/partners/kemri-wellcome-trust.jpeg",
        alt: "KEMRI Wellcome Trust Research Programme",
        width: 600,
        height: 71,
      },
      {
        src: "/images/countries/kenya/partners/kenyatta-university.png",
        alt: "Kenyatta University",
        width: 300,
        height: 287,
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
        "Clean hands saved newborns’ lives in our hospitals: A responsibility for All",
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

export default kenya;
