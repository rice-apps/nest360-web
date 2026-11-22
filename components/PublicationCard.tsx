import Image from 'next/image';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';
import { tagColor } from '@/lib/tagColors';

function formatMonthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// One card in the Research Publications gallery (Figma): picture on the left; tags, title, summary and
// date on the right. The whole card opens the paper's file or outside link in a new tab.
export function PublicationCard({ title, description, image, tags, publishedDate, linkUrl }: Resource) {
  const picture = image ? (typeof image === 'string' ? { url: image, alt: title } : image) : null;

  return (
    <article className="group relative flex h-full flex-col gap-5 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:p-5">
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} (opens in a new tab)`}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nest-blue"
        />
      )}

      {/* The thumbnail or PDF preview; without one, the navy-to-mint block from the design */}
      <div className="relative aspect-[11/10] w-full shrink-0 overflow-hidden bg-linear-to-b from-nest-blue from-30% to-[#d9fbf8] sm:w-[38%]">
        {picture && (
          <Image
            src={picture.url}
            alt={picture.alt ?? ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 260px"
            className="object-cover object-top"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${tagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-base font-semibold text-nest-blue group-hover:underline">{title}</h3>
        <p className="text-sm leading-relaxed text-nest-neutral-700">{description}</p>

        {publishedDate && (
          <p className="mt-auto pt-3 text-xs text-nest-neutral-500">Posted: {formatMonthYear(publishedDate)}</p>
        )}
      </div>
    </article>
  );
}
