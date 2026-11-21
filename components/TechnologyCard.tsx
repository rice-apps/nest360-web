import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { TechnologyCardData } from '@/lib/data/technologies';
import { tagColor } from '@/lib/tagColors';
import { categoryLabel } from '@/lib/technologyCategories';

import { ClickableCard } from './ClickableCard';

// One technology in the /technology gallery: photo, category of care, name and its qualified products.
// Clicking anywhere on the card opens the technology's page, but its text can still be highlighted and copied
// (see ClickableCard). The title is the real link, for keyboard and screen-reader users.
export function TechnologyCard({ title, slug, categoryOfCare, image, products }: TechnologyCardData) {
  const category = categoryLabel(categoryOfCare);
  const href = `/technology/${slug}`;

  return (
    // On hover the card lifts with a shadow, the photo zooms a little and the title changes colour
    <ClickableCard
      linked
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition duration-300 hover:border-[#41B6C4] hover:shadow-xl focus-within:border-[#41B6C4] focus-within:shadow-xl motion-safe:hover:-translate-y-1"
    >
      {/* Device photos are product shots, so show the whole device on white rather than cropping it */}
      <div className="relative h-44 w-full overflow-hidden border-b border-gray-100 bg-white">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-500 motion-safe:group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-nest-neutral-100 text-sm font-medium text-nest-neutral-900">
            {title}
          </div>
        )}
      </div>

      {/* A text cursor over the text, which can be selected; the hand everywhere else */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {category && (
          <div>
            <span
              className={`inline-flex cursor-text items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${tagColor(category)}`}
            >
              {category}
            </span>
          </div>
        )}

        <h3 className="font-heading text-lg font-semibold">
          <Link
            href={href}
            data-card-link
            className="rounded text-nest-blue transition-colors duration-300 group-hover:text-[#2a8f9b] group-hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {title}
          </Link>
        </h3>

        {products.length > 0 && (
          <div className="cursor-text">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">NEST360 Qualified</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-gray-700">
              {products.map((product, index) => (
                <li key={`${product}-${index}`}>{product}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ClickableCard>
  );
}
