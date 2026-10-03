import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AfricaMap from "@/components/AfricaMap";

export const metadata: Metadata = {
  title: "Where We Work | NEST360",
};

// Content recreated from https://nest360.org/where-we-work/
// Country hrefs match the paths used on nest360.org (Ethiopia lives at /sll360).
const countries = [
  {
    name: "Ethiopia",
    isoNumeric: "231",
    href: "/sll360",
    image: {
      src: "/images/countries/ethiopia.jpg",
      alt: "Ethiopian Mom and Baby in Hawassa University Hospital",
      width: 611,
      height: 406,
    },
  },
  {
    name: "Kenya",
    isoNumeric: "404",
    href: "/kenya",
    image: {
      src: "/images/countries/kenya.jpeg",
      alt: "NEST360 first installed in Kenya in 2020.",
      width: 2048,
      height: 1365,
    },
  },
  {
    name: "Malawi",
    isoNumeric: "454",
    href: "/malawi",
    image: {
      src: "/images/countries/malawi.jpg",
      alt: "Malawian baby in Zomba nursery",
      width: 2100,
      height: 1500,
    },
  },
  {
    name: "Nigeria",
    isoNumeric: "566",
    href: "/nigeria",
    image: {
      src: "/images/countries/nigeria.jpg",
      alt: "NEST360 Clinical training in Nigeria",
      width: 520,
      height: 354,
    },
  },
  {
    name: "Tanzania",
    isoNumeric: "834",
    href: "/tanzania",
    image: {
      src: "/images/countries/tanzania.jpg",
      alt: "Tanzanian Mom and Baby in Amana Hospital",
      width: 1200,
      height: 800,
    },
  },
];

export default function WhereWeWorkPage() {
  return (
    <main>
      <h1>Where We Work</h1>
      <p>
        NEST360 is a multidisciplinary alliance of 23 institutions, 18 of which
        are in Africa, working in partnership with national governments to end
        preventable newborn deaths in Ethiopia, Kenya, Malawi, Nigeria,
        Tanzania, and beyond.
      </p>
      <p>
        Each country has a unique locally driven approach to achieving
        Sustainable Development Goals. Learn more about each country&rsquo;s
        implementation of high-quality small and sick newborn care below.
      </p>

      <section>
        {countries.map((country) => (
          <Link key={country.name} href={country.href}>
            <Image
              src={country.image.src}
              alt={country.image.alt}
              width={country.image.width}
              height={country.image.height}
              style={{ width: 300, height: "auto" }}
            />
            <h3>{country.name}</h3>
          </Link>
        ))}
      </section>

      <section>
        <h2>NEST360 Africa Map</h2>
        <AfricaMap countries={countries} />
      </section>
    </main>
  );
}
