import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "About | NEST360",
};

// Content recreated word for word from https://nest360.org/about/
// The "75" in the circle counter comes from the live widget's data value.

const model = [
  {
    title: "Deliver Innovative Lifesaving Technologies",
    href: "/technology",
    icon: "/images/about/model-technology.png",
    text: "We test, qualify, and distribute newborn health technologies that are effective, affordable, rugged, and suitable for hospitals in Africa.",
  },
  {
    title: "Adapt and Integrate Learnings",
    href: "/education",
    icon: "/images/about/model-education.png",
    text: "We strengthen hands-on education for healthcare professionals and biomedical engineers to support quality newborn care and device maintenance.",
  },
  {
    title: "Data-Driven Action",
    href: "/evidence-based-care",
    icon: "/images/about/model-data.png",
    text: "We enable clinicians, hospital managers, and ministries of health to use locally-owned data to monitor performance, identify gaps, and drive quality improvement with the aim of increasing investment and policy change for newborn care.",
  },
];

const countries = [
  { name: "Ethiopia", href: "/sll360", src: "/images/countries/ethiopia.jpg", alt: "Ethiopian Mom and Baby in Hawassa University Hospital", width: 611, height: 406 },
  { name: "Kenya", href: "/kenya", src: "/images/countries/kenya.jpeg", alt: "NEST360 first installed in Kenya in 2020.", width: 2048, height: 1365 },
  { name: "Malawi", href: "/malawi", src: "/images/countries/malawi.jpg", alt: "Malawian baby in Zomba nursery", width: 2100, height: 1500 },
  { name: "Nigeria", href: "/nigeria", src: "/images/countries/nigeria.jpg", alt: "NEST360 Clinical training in Nigeria", width: 520, height: 354 },
  { name: "Tanzania", href: "/tanzania", src: "/images/countries/tanzania.jpg", alt: "Tanzanian Mom and Baby in Amana Hospital", width: 1200, height: 800 },
];

const africaMembers = [
  "Addis Ababa University – Institute of Technology",
  "Addis Ababa University – School of Public Health",
  "Aga Khan University",
  "APIN Public Health Initiatives",
  "Dar es Salaam Institute of Technology",
  "Hatch Technologies",
  "Hawassa University",
  "Ifakara Health Institute",
  "Kamuzu University of Health Sciences",
  "Kenyatta University",
  "Malawi University of Business and Applied Sciences",
  "Malawi University of Science and Technology",
  "Mekelle University",
  "Muhimbili University of Health and Allied Sciences",
  "University of Ibadan",
  "University of Lagos",
  "University of Lagos – College of Medicine",
  "University of Oxford – KEMRI Wellcome Trust",
];

const globalMembers = [
  "3rd Stone Design",
  "Emory University",
  "London School of Hygiene & Tropical Medicine",
  "Northwestern University",
  "Rice360 Institute for Global Health Technologies",
];

const UNICEF_REPORT =
  "https://www.unicef.org/media/77166/file/Ending-preventable-newborn-deaths-and-stillbirths-by-2030-universal-health-coverage-in-2020%E2%80%932025.pdf";

export default function AboutPage() {
  return (
    <main>
      <section id="thechallenge">
        <h2>Neonatal conditions are the leading cause of death and disability</h2>
        <h2>in low-income countries.&sup1;</h2>
        <ul>
          <li>
            <a href="#thechallenge">The Challenge</a>
          </li>
          <li>
            <a href="#ourmodel">Our Model</a>
          </li>
          <li>
            <a href="#nestalliance">NEST Alliance</a>
          </li>
        </ul>
        <h5>
          In Africa, most births are in hospitals, yet 1.1 million newborns die
          annually, &sup2; 75% from preventable causes.&sup3;
        </h5>
        <p>75%</p>
        <h2>
          Although more women in Africa deliver their babies in health
          facilities, the hospitals often lack the right technology, equipment,
          and trained staff to care for preterm and sick newborns in distress.
        </h2>
        <h2>
          The United Nations set a Global Sustainable Development goal (SDG) to
          end preventable newborn deaths by 2030, but 60 countries will miss
          this target. Overall, progress in each country in Africa must triple
          to meet this SDG target by 2030.
        </h2>
        <PendingLink to={UNICEF_REPORT}>
          <Image
            src="/images/about/global-targets.png"
            alt="Global targets for ending preventable newborn deaths by 2030"
            width={1200}
            height={172}
            style={{ width: 600, height: "auto" }}
          />
        </PendingLink>
        <Image
          src="/images/about/sdg-heart-icon.png"
          alt="SDG heart icon"
          width={449}
          height={385}
          style={{ width: 100, height: "auto" }}
        />
        <h4>OUR GOAL</h4>
        <p>Reduce newborn mortality in African hospitals by 50%</p>
      </section>

      <section id="ourmodel">
        <h5>OUR MODEL</h5>
        <h2>
          We work in partnership with governments to scale proven
          interventions, build sustainable health systems, and empower local
          healthcare teams across hospitals in Africa.
        </h2>
        {model.map((pillar) => (
          <div key={pillar.title}>
            <Link href={pillar.href}>
              <Image
                src={pillar.icon}
                alt=""
                width={606}
                height={324}
                style={{ width: 200, height: "auto" }}
              />
            </Link>
            <h4>
              <Link href={pillar.href}>{pillar.title}</Link>
            </h4>
            <p>{pillar.text}</p>
          </div>
        ))}
      </section>

      <section>
        <h5>WHERE WE WORK</h5>
        {countries.map((country) => (
          <Link key={country.name} href={country.href}>
            <Image
              src={country.src}
              alt={country.alt}
              width={country.width}
              height={country.height}
              style={{ width: 300, height: "auto" }}
            />
            <h3>{country.name}</h3>
          </Link>
        ))}
      </section>

      <section id="nestalliance">
        <h5>NEST360 ALLIANCE</h5>
        <h2>
          NEST360 is an international alliance of clinical, biomedical, and
          public health experts from 23 leading institutions and organizations,
          18 of which are based in Africa.
        </h2>
        <h4>Africa</h4>
        <ul>
          {africaMembers.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
        <h4>Global</h4>
        <ul>
          {globalMembers.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Our Leadership</h4>
        <p>
          NEST360 leadership is a multidisciplinary alliance of newborn care
          experts committed to ending preventable newborn deaths in African
          hospitals. Through our cross-cutting programs &amp; leadership, we
          aim to achieve SDG 3.2 across the five NEST360 countries
        </p>
        <p>Learn more about our leadership below.</p>
        <Link href="/our-leadership">Our Leadership</Link>
      </section>

      <section>
        <h6>Citations</h6>
        <p>
          1. Vos, T., Lim, S. S., Abbafati, C., Abbas, K. M., Abbasi, M.,
          Abbasifard, M., Abbasi-Kangevari, M., Abbastabar, H., Abd-Allah, F.,
          Abdelalim, A., Abdollahi, M., Abdollahpour, I., Abolhassani, H.,
          Aboyans, V., Abrams, E. M., Abreu, L. G., Abrigo, M. R.,
          Abu-Raddad, L. J., Abushouk, A. I., &hellip; Murray, C. J. (2020,
          October). Global burden of 369 diseases and injuries in 204 countries
          and territories, 1990&ndash;2019: a systematic analysis for the
          Global Burden of Disease Study 2019. <em>The Lancet</em>,{" "}
          <em>396</em> (10258), 1204&ndash;1222.{" "}
          <PendingLink to="https://doi.org/10.1016/s0140-6736(20)30925-9">
            https://doi.org/10.1016/s0140-6736(20)30925-9
          </PendingLink>
        </p>
        <p>
          2. Healthy Newborn Network. (n.d.). Database: Global and National
          Newborn Health Data and Indicators .{" "}
          <PendingLink to="https://www.healthynewbornnetwork.org/resource/database-global-and-national-newborn-health-data-and-indicators/">
            https://www.healthynewbornnetwork.org/resource/database-global-and-national-newborn-health-data-and-indicators/
          </PendingLink>
        </p>
        <p>
          3. World Heath Organization. (2014, July). Every Newborn: an action
          plan to end preventable deaths .{" "}
          <PendingLink to="http://www.healthynewbornnetwork.org/hnn-content/uploads/Every_Newborn_Action_Plan-ENGLISH_updated_July2014.pdf">
            http://www.healthynewbornnetwork.org/hnn-content/uploads/Every_Newborn_Action_Plan-ENGLISH_updated_July2014.pdf
          </PendingLink>
        </p>
        <p>
          4. World Health Organization. (n.d.). Global Health Observatory (GHO)
          data: Neonatal mortality .{" "}
          <PendingLink to="https://www.who.int/data/gho/data/indicators/indicator-details/GHO/neonatal-mortality-rate-(per-1000-live-births)">
            https://www.who.int/gho/ child_health/mortality/neonatal_text/en/https://www.who.int/data/gho/data/indicators/indicator-details/GHO/neonatal-mortality-rate-(per-1000-live-births)
          </PendingLink>
        </p>
      </section>
    </main>
  );
}
