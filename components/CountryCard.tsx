import Image from "next/image";
import Link from "next/link";
import type { CountryPageData } from "@/lib/data/countries";

// A country's photo and name, linking to its page. Used on Where We Work.
export default function CountryCard({ country }: { country: CountryPageData }) {
  const { cardImage } = country;

  return (
    <Link
      href={`/${country.slug}`}
      className="block w-full bg-white p-3 shadow-md transition-shadow hover:shadow-lg"
    >
      <Image
        src={cardImage.src}
        alt={cardImage.alt}
        width={cardImage.width}
        height={cardImage.height}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3] w-full object-cover"
      />
      <h3 className="mt-3 text-xl font-semibold tracking-wider text-brand-primary uppercase">
        {country.name}
      </h3>
    </Link>
  );
}
