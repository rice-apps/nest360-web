import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';
import { AUDIENCE_TAGS, tagColor } from '@/lib/tagColors';

export type ResourceCardProps = Omit<Resource, 'id'>;

function formatMonthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ResourceCard({
  category,
  title,
  description,
  image,
  icon,
  badgeText,
  tags,
  publishedDate,
  lastModified,
  linkUrl,
}: ResourceCardProps) {
  const picture = image
    ? typeof image === 'string'
      ? { url: image, alt: title }
      : { ...image, alt: image.alt ?? title }
    : null;

  const audience = AUDIENCE_TAGS[category];
  const displayDate = lastModified ?? publishedDate;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image area */}
      {picture ? (
        <div className="relative h-36 w-full">
          <Image
            src={picture.url}
            alt={picture.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center bg-nest-neutral-100">
          {icon && (
            <span className="text-3xl" aria-hidden="true">
              {icon}
            </span>
          )}
          {badgeText && (
            <span className="text-sm font-medium text-nest-neutral-900">
              {badgeText}
            </span>
          )}
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Audience and resource tags */}
        <div className="flex flex-wrap gap-1.5">
          {audience && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${audience.className}`}
            >
              {audience.label}
            </span>
          )}

          {tags?.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-base font-semibold text-nest-neutral-900">
          {linkUrl ? (
            // The link's ::after covers the whole card, so clicking anywhere on it opens the page
            <Link href={linkUrl} className="after:absolute after:inset-0 hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        <p className="text-sm leading-relaxed text-nest-neutral-700">
          {description}
        </p>

        {/* Date and actions */}
        <div className="mt-auto flex flex-col gap-3 pt-3">
          {displayDate && (
            <span className="text-xs text-nest-neutral-500">
              Updated: {formatMonthYear(displayDate)}
            </span>
          )}

          {/* No buttons: the whole card opens the project page, where each file can be viewed or downloaded */}
        </div>
      </div>
    </article>
  );
}