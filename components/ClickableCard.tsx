'use client';

import React, { useRef } from 'react';

// A card that opens its link when clicked anywhere, while its text can still be highlighted and copied.
// The card's title holds the real link, marked with data-card-link: that's what keyboard and screen-reader users
// reach, and what opens in a new tab on a middle-click. This only adds the mouse shortcut for the rest of the
// card, by clicking that same link, so the card behaves exactly like it: a page on this site opens with Next's
// fast navigation, and an outside site or a file opens like any normal link.
// - a click that ended a text selection inside the card does nothing, so the text can be copied
// - clicks on links and buttons inside the card are left to them
// - Ctrl/Cmd-click opens the link in a new tab, as it would on the link itself
// Without a link (a card with nowhere to go) it's a plain card.
export function ClickableCard({
  linked,
  className = '',
  children,
}: {
  // Whether the card contains a [data-card-link] to open
  linked: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const card = useRef<HTMLElement>(null);

  const onClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && card.current?.contains(selection.anchorNode)) return;
    const link = card.current?.querySelector<HTMLAnchorElement>('a[data-card-link]');
    if (!link) return;
    if (event.ctrlKey || event.metaKey) window.open(link.href, '_blank', 'noopener');
    else link.click();
  };

  return (
    <article ref={card} onClick={linked ? onClick : undefined} className={`${linked ? 'cursor-pointer' : ''} ${className}`}>
      {children}
    </article>
  );
}
