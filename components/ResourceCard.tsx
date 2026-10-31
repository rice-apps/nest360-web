import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';

// id and category aren't shown: the grid uses id as the key, and category picks the card's section
export type ResourceCardProps = Omit<Resource, 'id' | 'category'>;

// Resource.image can be a plain URL or a { url, alt, width, height } object
function imageOf(image: Resource['image'], title: string) {
  if (!image) return null;
  return typeof image === 'string' ? { url: image, alt: title } : { ...image, alt: image.alt ?? title };
}

// e.g. "Sep 17, 2026", matching the rest of the site. UTC so the day doesn't shift by the reader's timezone.
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// One resource in a grid: a picture (or a Nest Blue panel with the title when there is none), then the
// details, with the view and download links pinned to the bottom so they line up across a row.
export function ResourceCard({
  title,
  description,
  badgeText,
  image,
  icon,
  linkUrl,
  downloadUrl,
  publishedDate,
  authorOrOrganization,
  tags,
}: ResourceCardProps) {
  const picture = imageOf(image, title);
  const meta = [authorOrOrganization, publishedDate && formatDate(publishedDate)].filter(Boolean).join(' · ');
  // Outside links open in a new tab; links within the site don't
  const external = linkUrl?.startsWith('http');

  return (
    // h-full keeps cards in a row the same height. Not one big link, because it can hold two (view and download).
    <article className="flex h-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {picture ? (
          <Image
            src={picture.url}
            alt={picture.alt}
            width={picture.width ?? 400}
            height={picture.height ?? 300}
            // object-top, so a PDF first-page preview shows its heading rather than the blank middle of the page
            className="h-44 w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-44 flex-col items-center justify-center gap-3 bg-nest-blue p-4">
            {/* Resource.icon is an image URL. 32px until the design system settles icon sizes. */}
            {icon && <Image src={icon} alt="" width={32} height={32} className="h-8 w-8" />}
            <span className="text-center font-heading text-xs font-semibold uppercase tracking-wider text-white">
              {title}
            </span>
          </div>
        )}
        {badgeText && (
          <span className="absolute left-3 top-3 rounded-[30px] bg-nest-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-nest-neutral-900">
            {badgeText}
          </span>
        )}
      </div>

      {/* justify-between pushes the links to the bottom, so they line up across a row */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          {meta && <p className="mb-1 text-xs text-gray-500">{meta}</p>}
          {/* Nest Blue, not light blue: light blue is too faint for text on white */}
          <h3 className="mb-2 font-heading text-base font-semibold text-nest-blue">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
          {tags && tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="rounded-[30px] bg-nest-neutral-200 px-2.5 py-0.5 text-[11px] text-gray-600">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {(linkUrl || downloadUrl) && (
          <div className="flex flex-wrap gap-2">
            {linkUrl && (
              <Link
                href={linkUrl}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="rounded-[30px] bg-nest-light-blue px-4 py-2 text-sm font-semibold text-nest-blue transition-colors hover:bg-nest-accent"
              >
                View resource
              </Link>
            )}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="rounded-[30px] border border-nest-blue px-4 py-2 text-sm font-semibold text-nest-blue transition-colors hover:bg-nest-neutral-100"
              >
                Download
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
