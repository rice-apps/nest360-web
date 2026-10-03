import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryPage from "@/components/CountryPage";
import { countryPages } from "@/lib/data/countries";

// Country pages for Kenya, Malawi, Nigeria, and Tanzania, at the same paths
// as nest360.org. Ethiopia has its own page at /sll360.

// Only the slugs in countryPages are valid; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(countryPages).map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[country]">): Promise<Metadata> {
  const { country } = await params;
  return { title: `${countryPages[country].name} | NEST360` };
}

export default async function Page({ params }: PageProps<"/[country]">) {
  const { country } = await params;
  const data = countryPages[country];
  if (!data) notFound();

  return <CountryPage country={data} />;
}
