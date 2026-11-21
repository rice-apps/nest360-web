import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Article, Author, Media } from '@/payload-types';

// Relationships are IDs until populated; the gallery loads articles with depth 1, which fills them in
function populated<T extends object>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null;
}

// Same format as the article page, e.g. "Sep 17, 2026". UTC so the day doesn't shift by time zone.
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// One story in the /stories gallery: featured image, date, title, excerpt and authors.
// The whole card is a link to the article page.
export function StoryCard({ article }: { article: Article }) {
  const image = populated<Media>(article.featuredImage);
  const authors = (article.byline ?? [])
    .map((author) => populated<Author>(author)?.name)
    .filter(Boolean);

  return (
    <Link
      href={`/stories/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {/* Image area (a plain grey box if the image is missing) */}
      <div className="relative h-48 w-full bg-nest-neutral-100">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <time dateTime={article.publishedDate} className="text-xs text-gray-500">
          {formatDate(article.publishedDate)}
        </time>

        <h2 className="text-lg font-semibold text-nest-blue group-hover:underline">{article.title}</h2>

        {authors.length > 0 && <p className="text-sm text-gray-600">By {authors.join(', ')}</p>}

        <p className="text-sm leading-relaxed text-gray-700">{article.excerpt}</p>

        <span className="mt-auto pt-2 text-sm font-medium text-[#41B6C4]">Read more →</span>
      </div>
    </Link>
  );
}
