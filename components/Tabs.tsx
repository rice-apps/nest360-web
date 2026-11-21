'use client';

import React, { useId, useRef, useState } from 'react';

type Tab = { id: string; label: string; content: React.ReactNode };

// A row of tabs over one panel, as on nest360.org's technology pages: inactive tabs in slate blue, the open one
// in NEST blue, with a light-blue bar that slides in under the tab being hovered. The panels are rendered on the
// server and passed in; this only switches which one shows.
// Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs.
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const select = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key]);
    }
  };

  return (
    <div className="bg-white shadow-lg">
      <div role="tablist" aria-label={label} className="flex flex-col sm:flex-row">
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              // Tall, full-width targets with a pointer cursor (Tailwind's reset gives buttons the plain arrow)
              className={`relative flex min-h-20 flex-1 cursor-pointer items-center justify-center border-b border-white px-6 py-6 text-center font-heading text-lg font-semibold text-white transition-colors duration-300 select-none active:brightness-90 sm:min-h-24 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:text-xl ${
                selected ? 'bg-nest-blue' : 'bg-[#7B9BB0] hover:bg-[#5F8299]'
              } after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:origin-left after:bg-nest-light-blue after:transition-transform after:duration-300 ${
                selected ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              } focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          // The animation replays each time a panel is shown, so switching tabs eases the new one in
          className="p-6 motion-safe:animate-fade-in-up sm:p-10"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
