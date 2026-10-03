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
    <main className="mx-auto w-4/5 max-w-[1280px] py-16 font-poppins">
      <h1 className="text-center text-[30px] font-semibold text-[#333]">
        Where We Work
      </h1>
      <p className="mt-8 font-light text-black">
        NEST360 is a multidisciplinary alliance of 23 institutions, 18 of which
        are in Africa, working in partnership with national governments to end
        preventable newborn deaths in Ethiopia, Kenya, Malawi, Nigeria,
        Tanzania, and beyond.
      </p>
      <p className="font-light text-black">
        Each country has a unique locally driven approach to achieving
        Sustainable Development Goals. Learn more about each country&rsquo;s
        implementation of high-quality small and sick newborn care below.
      </p>

      {/* Three-across card grid, matching nest360.org/where-we-work */}
      <section className="mt-8 grid grid-cols-1 gap-x-[5.5%] gap-y-16 py-[30px] sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Link
            key={country.name}
            href={country.href}
            className="block w-full bg-white p-2.5 shadow-[0_12px_18px_-6px_rgba(0,0,0,0.3)] transition-opacity hover:opacity-90"
          >
            <Image
              src={country.image.src}
              alt={country.image.alt}
              width={country.image.width}
              height={country.image.height}
              className="aspect-[329/239] w-full object-cover py-2.5"
            />
            <h3 className="text-xl font-semibold tracking-[2px] text-nest-navy uppercase">
              {country.name}
            </h3>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-center text-[22px] font-semibold text-nest-teal">
          NEST360 Africa Map
        </h2>
        <div className="mt-8 flex justify-center">
          <AfricaMap countries={countries} />
        </div>
      </section>
    </main>
  );
}
