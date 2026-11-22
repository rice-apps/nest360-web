import React from 'react';

// Page numbers to show: all of them up to 7 pages; beyond that the first, the last and the ones around the
// current page, with "…" for the gaps, e.g. 1 … 4 5 6 … 12
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const around = [current - 1, current, current + 1].filter((page) => page > 1 && page < total);
  return [
    1,
    ...(around[0] > 2 ? ['…' as const] : []),
    ...around,
    ...(around[around.length - 1] < total - 1 ? ['…' as const] : []),
    total,
  ];
}

const BOX = 'flex h-11 min-w-11 items-center justify-center rounded-[4px] border px-3 text-lg';

interface PaginationProps {
  page: number;
  totalPages: number;
  // The link for each page, so pages work without JavaScript and can be opened in a new tab
  hrefFor: (page: number) => string;
  onChange: (page: number) => void;
}

// ‹ 1 2 3 4 › under the cards (Figma). Shown only when there is more than one page.
export function Pagination({ page, totalPages, hrefFor, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const link = (target: number, label: React.ReactNode, ariaLabel: string, current = false) => (
    <a
      href={hrefFor(target)}
      aria-label={ariaLabel}
      aria-current={current ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault();
        onChange(target);
      }}
      className={`${BOX} ${
        current
          ? 'border-nest-blue bg-nest-blue text-white'
          : 'border-gray-300 bg-white text-nest-neutral-900 hover:border-nest-blue'
      }`}
    >
      {label}
    </a>
  );

  const disabled = (label: string, ariaLabel: string) => (
    <span aria-label={ariaLabel} aria-disabled="true" className={`${BOX} border-gray-200 bg-white text-gray-300`}>
      {label}
    </span>
  );

  return (
    <nav aria-label="Pages" className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
      {page > 1 ? link(page - 1, '‹', 'Previous page') : disabled('‹', 'Previous page')}
      {pageList(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-gray-500" aria-hidden="true">
            …
          </span>
        ) : (
          <React.Fragment key={item}>{link(item, item, `Page ${item}`, item === page)}</React.Fragment>
        ),
      )}
      {page < totalPages ? link(page + 1, '›', 'Next page') : disabled('›', 'Next page')}
    </nav>
  );
}
