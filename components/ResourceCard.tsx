// CLAUDE CHANGE: new file. The card markup that was repeated in resources/page.tsx (three times) and in the
// "Related resources" section of resources/[slug]/page.tsx, now laid out from the fields in
// app/(frontend)/resources/types.ts and styled with the Figma design system tokens in globals.css.
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';

// CLAUDE CHANGE: the props are the Resource fields from types.ts. id and category aren't shown on the card
// (the grid uses id as the key, and category decides which section a card is in).
export type ResourceCardProps = Omit<Resource, 'id' | 'category'>;

// CLAUDE CHANGE: Resource.image can be a plain URL or a { url, alt, width, height } object
function imageOf(image: Resource['image'], title: string) {
  if (!image) return null;
  return typeof image === 'string' ? { url: image, alt: title } : { ...image, alt: image.alt ?? title };
}

// CLAUDE CHANGE: matches the date format used elsewhere on the site, e.g. "Sep 17, 2026". UTC so the day
// doesn't shift by the reader's timezone.
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
  // CLAUDE CHANGE: outside links open in a new tab; links within the site don't
  const external = linkUrl?.startsWith('http');

  return (
    // CLAUDE CHANGE: rounded-[10px] is the Figma "10px for cards" corner. h-full keeps cards in a row the
    // same height. The card is no longer one big link, because it can now hold two (view and download).
    <article className="flex h-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {picture ? (
          <Image
            src={picture.url}
            alt={picture.alt}
            width={picture.width ?? 400}
            height={picture.height ?? 300}
            // CLAUDE CHANGE: object-top, so a PDF first-page preview shows its heading rather than the blank
            // middle of the page
            className="h-44 w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-44 flex-col items-center justify-center gap-3 bg-nest-blue p-4">
            {/* CLAUDE CHANGE: assumes Resource.icon is an image URL. The Figma icon sizes are still "... px",
                so 32px is a placeholder. */}
            {icon && <Image src={icon} alt="" width={32} height={32} className="h-8 w-8" />}
            <span className="text-center font-heading text-xs font-semibold uppercase tracking-wider text-white">
              {title}
            </span>
          </div>
        )}
        {/* CLAUDE CHANGE: new. badgeText (e.g. "New", "Video") sits on the top-left of the picture */}
        {badgeText && (
          <span className="absolute left-3 top-3 rounded-[30px] bg-nest-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-nest-neutral-900">
            {badgeText}
          </span>
        )}
      </div>

      {/* CLAUDE CHANGE: the wrapper <div> with justify-between is back. The top group holds the text, and the
          bottom group holds the links, which justify-between pushes to the bottom of the card. */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          {meta && <p className="mb-1 text-xs text-gray-500">{meta}</p>}
          {/* CLAUDE CHANGE: Figma "Body 1 (SemiBold 16pt)". Title was teal (#41B6C4); the Figma light blue
              (#6CCAD0) is too faint for text on white, so titles use Nest Blue and the light blue goes on the
              button instead. */}
          <h3 className="mb-2 font-heading text-base font-semibold text-nest-blue">{title}</h3>
          {/* CLAUDE CHANGE: Figma "Smaller Body Text (Regular 14pt)" */}
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
          {/* CLAUDE CHANGE: new. tags as small pills */}
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

        {/* CLAUDE CHANGE: new. View and download links; rounded-[30px] is the Figma "30px for buttons" corner */}
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
