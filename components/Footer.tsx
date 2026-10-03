import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  CONTACT_EMAIL,
  DONATE_URL,
  NEWBORN_TOOLKIT_URL,
  footerLinks,
  socialLinks,
} from "@/lib/data/site";

// Brand square color and icon for each social link, matching nest360.org.
const socialStyles: Record<string, { bg: string; icon: ReactNode }> = {
  Facebook: {
    bg: "#3b5998",
    icon: (
      <path
        fill="currentColor"
        d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z"
      />
    ),
  },
  X: {
    bg: "#000000",
    icon: (
      <path
        fill="currentColor"
        d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z"
      />
    ),
  },
  Instagram: {
    bg: "#ea2c59",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17" cy="7" r="0.6" fill="currentColor" />
      </g>
    ),
  },
  LinkedIn: {
    bg: "#007bb6",
    icon: (
      <path
        fill="currentColor"
        d="M5 9h3v11H5V9zm1.5-5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 9h2.9v1.5c.4-.8 1.4-1.7 3-1.7 3.1 0 3.6 2 3.6 4.7V20h-3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20h-3V9z"
      />
    ),
  },
  YouTube: {
    bg: "#a82400",
    icon: (
      <path
        fill="currentColor"
        d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"
      />
    ),
  },
};

const linkClass = "text-base font-medium text-nest-navy underline hover:opacity-70";

// Global footer recreated from nest360.org.
export default function Footer() {
  // Same split as the live footer: five links, then the rest + Newborn Toolkit.
  const firstColumn = footerLinks.slice(0, 5);
  const secondColumn = footerLinks.slice(5);

  return (
    <footer className="border-t-4 border-nest-teal bg-[#f7f7f7] font-poppins text-nest-navy">
      <div className="mx-auto w-4/5 max-w-[1280px]">
        <div className="grid grid-cols-1 gap-8 pt-[30px] pb-[5px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div className="pt-[30px]">
            <Link href="/">
              <Image
                src="/images/shared/nest360-logo.png"
                alt="Full color logo for NEST360"
                width={1665}
                height={437}
                className="h-auto w-[200px]"
              />
            </Link>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-[30px] bg-nest-teal px-4 py-[5px] text-base font-medium tracking-[2px] text-white hover:opacity-90"
            >
              Donate
            </a>
          </div>

          <ul className="space-y-3.5 pt-[30px]">
            {firstColumn.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-3.5 pt-[30px]">
            {secondColumn.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={NEWBORN_TOOLKIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Newborn Toolkit
              </a>
            </li>
          </ul>

          <div className="pt-[30px]">
            <p className="text-base font-medium">
              Join the conversation, and follow us on social media!
            </p>
            <ul className="mt-[30px] flex gap-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-8 w-8 items-center justify-center rounded-[3px] text-white hover:opacity-80"
                    style={{ backgroundColor: socialStyles[link.label].bg }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]">
                      {socialStyles[link.label].icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 py-[30px] text-[15px] font-medium lg:text-right">
          <p>
            Questions? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:opacity-70">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="italic">
            &copy; NEST360. All rights reserved. |{" "}
            <Link href="/policies" className="underline hover:opacity-70">
              Privacy and Copyright policies.
            </Link>{" "}
            |{" "}
            <Link href="/cookie-policy-eu" className="underline hover:opacity-70">
              Cookie Policy (EU)
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
