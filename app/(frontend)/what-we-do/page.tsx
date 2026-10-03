import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Approach | NEST360",
};

// Content recreated word for word from https://nest360.org/what-we-do/

const pillars = [
  {
    title: "Deliver a Package of Innovative Lifesaving Technologies Innovation",
    href: "/technology",
    description:
      "We test, qualify, and distribute newborn health technologies that are effective, affordable, rugged, and suitable for hospitals in Africa.",
    image: {
      src: "/images/what-we-do/technology-pillar.jpg",
      alt: "2 babies in african hospital on CPAP machine",
    },
  },
  {
    title: "Develop an Education Ecosystem",
    href: "/education",
    description:
      "We foster education ecosystems and deliver clinical, and technical training to support newborn care.",
    image: {
      src: "/images/what-we-do/education-pillar.jpg",
      alt: "Women in purple sweater pointing at a phototherapy machine during a training.",
    },
  },
  {
    title: "Data Drive Action",
    href: "/evidence-based-care",
    description:
      "We enable locally-owned data to drive action to improve quality newborn care, increase investment and change policy.",
    image: {
      src: "/images/what-we-do/data-pillar.jpg",
      alt: "Nurse in scrubs in Nigerian hospital, checking a babies vitals",
    },
  },
];

export default function WhatWeDoPage() {
  return (
    <main>
      <h1>OUR APPROACH</h1>
      <p>
        We support governments in Africa with implementing a package of care
        that includes lifesaving technologies, hands-on education for
        healthcare professionals and biomedical engineers, and the use of
        locally-owned data across countries to drive action to improve quality
        newborn care, increase investment, and change policy.
      </p>
      <p>
        Through partnerships with facilities and governments we catalyze
        country-led change to:
      </p>

      <section>
        {pillars.map((pillar) => (
          <div key={pillar.href}>
            <Image
              src={pillar.image.src}
              alt={pillar.image.alt}
              width={366}
              height={277}
              style={{ width: 300, height: "auto" }}
            />
            <h4>
              <Link href={pillar.href}>{pillar.title}</Link>
            </h4>
            <p>{pillar.description}</p>
            <Link href={pillar.href}>Learn more</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
