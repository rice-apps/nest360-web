import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryPage from "@/components/CountryPage";
import { countries, getCountry } from "@/lib/data/countries";
import { site } from "@/lib/data/site";

// One page per country in lib/data/countries, at /<slug> (e.g. /kenya,
// /sll360 for Ethiopia). Any other address shows "page not found".
export const dynamicParams = false;

export function generateStaticParams() {
  return countries.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[country]">): Promise<Metadata> {
  const { country } = await params;
  return { title: `${getCountry(country)?.name} | ${site.name}` };
}

export default async function Page({ params }: PageProps<"/[country]">) {
  const { country } = await params;
  const data = getCountry(country);
  if (!data) notFound();

  return <CountryPage country={data} />;
}
