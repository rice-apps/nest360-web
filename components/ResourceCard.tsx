import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';
import { AUDIENCE_TAGS, tagColor } from '@/lib/tagColors';

import { ClickableCard } from './ClickableCard';

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
    // With a link, clicking anywhere on the card opens it but the text can still be highlighted and copied
    // (see ClickableCard). The title is the real link, for keyboard and screen-reader users.
    <ClickableCard
      href={linkUrl}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md focus-within:shadow-md"
    >

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
        <div className="flex cursor-text flex-wrap gap-1.5 self-start">
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

        {/* Underlined while the card is hovered, since clicking the card opens it */}
        <h3 className="text-base font-semibold text-nest-neutral-900">
          {linkUrl ? (
            <Link
              href={linkUrl}
              className="rounded group-hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        {/* A text cursor over the text, which can be selected; the hand everywhere else */}
        <p className="cursor-text text-sm leading-relaxed text-nest-neutral-700">
          {description}
        </p>

        {/* Date and actions */}
        <div className="mt-auto flex flex-col gap-3 pt-3">
          {displayDate && (
            <span className="cursor-text self-start text-xs text-nest-neutral-500">
              Updated: {formatMonthYear(displayDate)}
            </span>
          )}

          {/* No buttons: the whole card opens the project page, where each file can be viewed or downloaded */}
        </div>
      </div>
    </ClickableCard>
  );
}