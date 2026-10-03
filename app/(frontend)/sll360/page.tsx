import type { Metadata } from "next";
import Image from "next/image";
import { LatestNews, PartnersSection } from "@/components/CountrySections";
import PendingLink from "@/components/PendingLink";
import type { NewsItem, PageImage } from "@/lib/data/countries";

export const metadata: Metadata = {
  title: "Ethiopia (SLL360) | NEST360",
};

// Content recreated word for word from https://nest360.org/sll360/
// Internal links use the same paths as nest360.org; they resolve once those
// pages are built.

const technologies = [
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
];

const hospitals = [
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
];

const skillsLabs = [
  "Adama Teaching Hospital",
  "Ayder Comprehensive Specialized Hospital",
  "Felege Hiwot Referral Hospital",
  "Hawassa University Comprehensive Specialized Hospital",
];

const partnerLogos: PageImage[] = [
  { src: "/images/countries/ethiopia/partners/moh-ethiopia.png", alt: "Ministry of Health Ethiopia", width: 705, height: 210 },
  { src: "/images/countries/ethiopia/partners/unicef.png", alt: "UNICEF", width: 220, height: 124 },
  { src: "/images/countries/ethiopia/partners/who.png", alt: "World Health Organization", width: 436, height: 137 },
  { src: "/images/countries/ethiopia/partners/global-financing-facility.png", alt: "Global Financing Facility", width: 226, height: 110 },
  { src: "/images/countries/ethiopia/partners/gates-foundation.jpg", alt: "Gates Foundation", width: 521, height: 134 },
  { src: "/images/countries/ethiopia/partners/laerdal-foundation.png", alt: "Laerdal Foundation", width: 368, height: 216 },
  { src: "/images/countries/ethiopia/partners/addis-ababa-university.jpg", alt: "Addis Ababa University", width: 358, height: 238 },
  { src: "/images/countries/ethiopia/partners/hawassa-university.png", alt: "Hawassa University", width: 748, height: 375 },
  { src: "/images/countries/ethiopia/partners/emory-university.png", alt: "Emory University", width: 332, height: 188 },
  { src: "/images/countries/ethiopia/partners/many-more.jpg", alt: "+ many more...", width: 450, height: 92 },
];

const news: NewsItem[] = [
  {
    title: "Research | Examining the perceptions of preterm birth in Ethiopia",
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
    image: "/images/countries/ethiopia/news/isqua-2025.jpeg",
    excerpt:
      "NEST360 Research Presentation at ISQua 2025 in BrazilQuality Improvement Approach to Improving Newborn Care NEST360 team members, Nebiyou Hailemariam, Hannah Mwaniki, and Kylie...",
  },
];

export default function EthiopiaPage() {
  return (
    <main>
      <h1>SAVING LITTLE LIVES 360 ETHIOPIA</h1>
      <p>
        In Ethiopia,{" "}
        <PendingLink to="/ethiopia-government-accelerates-newborn-health-initiatives">
          NEST360 has partnered with the government-led Saving Little Lives
        </PendingLink>{" "}
        (SLL) initiative to form SLL360. In collaboration with the Ethiopia
        Ministry of Health (MOH), SLL360 brings together expertise from SLL and
        NEST360 to scale up high-quality newborn care nationwide. The initiative
        focuses on four critical areas: care at birth and safe referral,
        neonatal intensive care, Kangaroo Mother Care Plus, and specialized
        support for small and sick newborns.
      </p>
      <p>
        Every hospital implementing NEST360 has installed a package of{" "}
        <PendingLink to="/qualified-technologies">NEST360 Qualified</PendingLink>{" "}
        technologies that includes a selection of devices from each of the
        categories listed below. The specific device types may vary between
        hospitals based on their individual needs and requirements.
      </p>

      <section>
        {technologies.map((group) => (
          <div key={group.category}>
            <h4>{group.category}</h4>
            <ul>
              {group.devices.map((device) => (
                <li key={device}>{device}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Image
        src="/images/countries/ethiopia.jpg"
        alt="Ethiopian Mom and Baby in Hawassa University Hospital"
        width={611}
        height={406}
        style={{ width: 400, height: "auto" }}
      />
      <Image
        src="/images/countries/ethiopia/nurse-monitoring.jpg"
        alt="Nurse monitoring a newborn"
        width={1200}
        height={802}
        style={{ width: 400, height: "auto" }}
      />

      <section>
        <p>For more information about the SLL360 program in ETHIOPIA, contact:</p>
        <Image
          src="/images/countries/ethiopia/abiy-seifu-estifanos.jpg"
          alt="Abiy Seifu Estifanos, Country Lead"
          width={625}
          height={625}
          style={{ width: 150, height: "auto" }}
        />
        <h3>Abiy Seifu Estifanos</h3>
        <h4>Country Lead</h4>
        <p>
          Email: <a href="mailto:SLL360@aau.edu.et">SLL360@aau.edu.et</a> .
        </p>
        <p>Address:</p>
        <p>Center for Implementation Sciences</p>
        <p>Addis Ababa University</p>
        <p>Addis Ababa, Ethiopia</p>
        <p>
          Website: <a href="https://cis.aau.edu.et">cis.aau.edu.et</a>
        </p>
      </section>

      <section>
        <h4>Pre-service and in-service education</h4>
        <p>
          We provide pre-service and in-service training packages that help
          educate clinicians and biomedical technicians to use, maintain, and
          repair the SLL360 bundle of technologies.
        </p>
        <p>
          Training for both professions is spread out over one week and covers
          both theory and hands-on application followed by assessment and
          certification. By learning together professional silos are broken
          down, leading to better understanding, respect, and appreciation of
          each other&rsquo;s roles.
        </p>
        <p>
          Participants are typically drawn from SLL360 implementing facilities,
          and medical training colleges, as well as teaching institutions, i.e.
          biomedical engineering department staff.
        </p>
        <table>
          <thead>
            <tr>
              <th>Category of personnel</th>
              <th>Number trained</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Biomedical Engineers</td>
              <td>100+</td>
            </tr>
            <tr>
              <td>Clinicians</td>
              <td>900+</td>
            </tr>
          </tbody>
        </table>
        <p>*All numbers reported above are cumulative until-July 2026.</p>
      </section>

      <section>
        <h2>ACCESS NEST360 CLINICAL AND TECHNICAL RESOURCES</h2>
        <p>
          Our publicly available clinical and technical education materials
          are designed to be adapted and embedded in locally-developed
          in-service and pre-service training courses.
        </p>
        <PendingLink to="/resources">Our Resources</PendingLink>
      </section>

      <section>
        <h2>WHERE WE WORK IN ETHIOPIA</h2>
        <p>
          In Ethiopia, SLL360 is being implemented in 16 hospitals, with the
          support of 4 skills labs and 1 design studio. These skills labs
          provide hands-on learning opportunities for healthcare professionals
          and biomedical technicians that are aligned with Ethiopia&rsquo;s
          national care guidelines. Through the labs, doctors, nurses, and
          clinical officers receive hands-on training in advanced newborn care
          techniques using qualified technologies, while biomedical engineers
          and technicians gain experience in managing and maintaining newborn
          care equipment.
        </p>
        <p>*Information on facilities updated as of July 2026.</p>
        <Image
          src="/images/countries/ethiopia/facilities-map.png"
          alt="Map of Ethiopia with NEST360 facilities marked"
          width={1200}
          height={907}
          style={{ width: 500, height: "auto" }}
        />

        <h4>16 HOSPITALS</h4>
        <ul>
          {hospitals.map((hospital) => (
            <li key={hospital}>{hospital}</li>
          ))}
        </ul>

        <h4>Design Studio</h4>
        <ul>
          <li>Addis Ababa Institute of Technology &ndash; AAiT</li>
        </ul>

        <h4>4 Technical Skills Labs</h4>
        <ul>
          {skillsLabs.map((lab) => (
            <li key={lab}>{lab}</li>
          ))}
        </ul>
      </section>

      <PartnersSection
        heading="OUR PARTNERS IN ETHIOPIA"
        paragraph="We work closely with the Federal Ministry of Health, Addis Ababa University – Institute of Technology Addis Ababa University – Aklilu Lema Health Research Institute, Center for Implementation Sciences, Emory University, London School of Hygiene and Tropical Medicine, Mekelle University, Hawassa University, Hatch Technologies, and Rice360 Institute for Global Health Technologies."
        logos={partnerLogos}
      />

      <LatestNews news={news} />
    </main>
  );
}
