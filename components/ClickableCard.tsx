'use client';

import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

// A card that opens `href` when clicked anywhere, while its text can still be highlighted and copied.
// The card's title should be the real <Link> to `href`: that's what keyboard and screen-reader users reach,
// and what opens in a new tab on a middle-click. This only adds the mouse shortcut for the rest of the card:
// - a click opens the page, unless it ended a text selection inside the card (then nothing happens)
// - clicks on links and buttons inside the card are left to them
// - Ctrl/Cmd-click opens the page in a new tab, like it would on a link
// Without an href (a card with nowhere to go) it's a plain <article>.
export function ClickableCard({
  href,
  className = '',
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const card = useRef<HTMLElement>(null);

  const onClick = (event: React.MouseEvent) => {
    if (!href) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && card.current?.contains(selection.anchorNode)) return;
    if (event.ctrlKey || event.metaKey) window.open(href, '_blank', 'noopener');
    else router.push(href);
  };

  return (
    <article ref={card} onClick={onClick} className={`${href ? 'cursor-pointer' : ''} ${className}`}>
      {children}
    </article>
  );
}
