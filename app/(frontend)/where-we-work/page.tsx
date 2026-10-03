import type { Metadata } from "next";
import AfricaMap from "@/components/AfricaMap";
import CountryCard from "@/components/CountryCard";
import { countries } from "@/lib/data/countries";
import { site } from "@/lib/data/site";
import { whereWeWork } from "@/lib/data/where-we-work";

export const metadata: Metadata = {
  title: `${whereWeWork.title} | ${site.name}`,
};

// Content comes from lib/data/where-we-work.ts (text) and lib/data/countries
// (one card and one map highlight per country).
export default function WhereWeWorkPage() {
  return (
    <main className="page-container py-12">
      <h1 className="text-center text-3xl font-semibold">{whereWeWork.title}</h1>
      <div className="mt-6 space-y-2 font-light">
        {whereWeWork.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-semibold text-brand-accent">
          {whereWeWork.mapHeading}
        </h2>
        <div className="mt-8 flex justify-center">
          <AfricaMap countries={countries} />
        </div>
      </section>
    </main>
  );
}
