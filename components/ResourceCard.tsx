import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Resource } from '@/app/(frontend)/resources/types';
import { AUDIENCE_TAGS, tagColor } from '@/lib/tagColors';

// id isn't shown: the grid uses it as the key. category shows as the audience pill.
export type ResourceCardProps = Omit<Resource, 'id'>;

// Resource.image can be a plain URL or a { url, alt, width, height } object
function imageOf(image: Resource['image'], title: string) {
  if (!image) return null;
  return typeof image === 'string' ? { url: image, alt: title } : { ...image, alt: image.alt ?? title };
}

// e.g. "November 2026". UTC so the month doesn't shift by the reader's timezone.
function formatMonthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// One resource in a grid, laid out as in the Figma mockup: a picture area, the audience and tag pills, the
// title (a link to the resource) and description, then "Updated: Month Year" and Download pinned to the
// bottom so they line up across a row.
export function ResourceCard({
  category,
  title,
  description,
  badgeText,
  image,
  icon,
  linkUrl,
  downloadUrl,
  lastModified,
  tags,
}: ResourceCardProps) {
  const picture = imageOf(image, title);
  const audience = AUDIENCE_TAGS[category];
  // Outside links open in a new tab; links within the site don't
  const external = linkUrl?.startsWith('http');

  return (
    // h-full keeps cards in a row the same height
    <article className="flex h-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {picture ? (
          <Image
            src={picture.url}
            alt={picture.alt}
            width={picture.width ?? 400}
            height={picture.height ?? 300}
            // object-top, so a PDF first-page preview shows its heading rather than the blank middle of the page
            className="h-40 w-full object-cover object-top"
          />
        ) : (
          // An empty picture area, as in the mockup, until the resource has an image
          <div className="flex h-40 items-center justify-center bg-white">
            {icon && <Image src={icon} alt="" width={32} height={32} className="h-8 w-8" />}
          </div>
        )}
        {badgeText && (
          <span className="absolute left-3 top-3 rounded-[30px] bg-nest-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-nest-neutral-900">
            {badgeText}
          </span>
        )}
      </div>

      {/* pt-4 keeps the tags off the picture */}
      <div className="flex flex-1 flex-col justify-between gap-5 border-t border-gray-100 px-4 pb-4 pt-4">
        <div>
          {(audience || (tags && tags.length > 0)) && (
            <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Tags">
              {audience && (
                <li className={`rounded-[30px] px-2.5 py-0.5 text-[10px] font-medium ${audience.className}`}>
                  {audience.label}
                </li>
              )}
              {tags?.map((tag) => (
                <li key={tag} className={`rounded-[30px] px-2.5 py-0.5 text-[10px] font-medium ${tagColor(tag)}`}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <h3 className="mb-2 text-[15px] font-bold leading-snug text-nest-blue">
            {linkUrl ? (
              <Link
                href={linkUrl}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="hover:underline"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          <p className="text-xs leading-relaxed text-gray-600">{description}</p>
        </div>

        {(lastModified || downloadUrl) && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">{lastModified && `Updated: ${formatMonthYear(lastModified)}`}</p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="rounded-[30px] bg-nest-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-nest-light-blue"
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
