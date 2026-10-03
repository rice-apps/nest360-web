"use client";

import { useState } from "react";
import ChevronDown from "@/components/ChevronDown";
import SiteLink from "@/components/SiteLink";
import { mainNav, site } from "@/lib/data/site";

// Menu button and fold-out menu for screens narrower than xl, where the full
// navigation doesn't fit. Each top-level item expands to show its links; the
// menu closes when a link is tapped.
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded text-brand-primary hover:bg-gray-100"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-t-2 border-brand-highlight bg-white px-4 pb-6 shadow-md"
        >
          <ul>
            {mainNav.map((item) => {
              const isOpen = expanded === item.label;
              return (
                <li key={item.label} className="border-b border-gray-100">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className="flex w-full items-center justify-between py-3 text-left font-semibold text-brand-primary"
                  >
                    {item.label}
                    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <ul className="pb-3 pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <SiteLink
                            link={child}
                            onClick={close}
                            className="block py-2 text-brand-primary hover:opacity-70"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          {/* On the smallest screens the header has no room for Donate, so it lives here. */}
          <SiteLink
            link={site.donate}
            onClick={close}
            className="mt-5 inline-block rounded-full bg-brand-accent px-5 py-2 font-medium tracking-wider text-white sm:hidden"
          />
        </nav>
      )}
    </div>
  );
}
