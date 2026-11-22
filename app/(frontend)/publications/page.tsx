import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import React from 'react';

import { PublicationBrowser } from '@/components/PublicationBrowser';
import { getPublications, publicationToListed } from '@/lib/data/resources';
import { parseFilters, type Listed } from '@/lib/resourceFilters';

export const metadata: Metadata = {
  title: 'Research Publications',
  description: 'Stay informed about the latest neonatal research from the NEST360 Alliance.',
};

// The Research Publications gallery: every published Resource whose type is "Publication". These are the
// same records the /resources library lists, so a paper is entered once in Payload and shows up in both.
// Rendered on every request, so a newly published paper appears on the next page load.
// ?page=2 → 2; anything missing or not a positive whole number → 1
function pageOf(value: string | string[] | undefined) {
  const page = Number([value].flat()[0]);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function PublicationsPage({ searchParams }: PageProps<'/publications'>) {
  await connection();
  const params = await searchParams;

  let items: Listed[] = [];
  let failed = false;
  try {
    items = (await getPublications()).map(publicationToListed);
  } catch (error) {
    console.error("Couldn't load publications", error);
    failed = true;
  }

  return (
    <main className="pb-16">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
        <ol className="flex items-center gap-3 text-sm font-semibold text-nest-neutral-900 sm:text-base">
          <li>
            <Link href="/resources" className="hover:underline">
              Knowledge Hub
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">Research Publications</li>
        </ol>
      </nav>

      <header className="px-4 pb-6 pt-10 text-center sm:pt-14">
        <h1 className="font-heading text-3xl font-bold text-nest-blue sm:text-5xl">Research Publications</h1>
        <p className="mt-4 text-base text-nest-neutral-900">Stay informed about the latest neonatal research.</p>
      </header>

      {failed ? (
        <p role="alert" className="py-16 text-center text-gray-600">
          Publications couldn&apos;t load right now. Please try again in a moment.
        </p>
      ) : (
        <PublicationBrowser items={items} initialFilters={parseFilters(params)} initialPage={pageOf(params.page)} />
      )}
    </main>
  );
}
