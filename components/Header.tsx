import Image from "next/image";
import Link from "next/link";
import ChevronDown from "@/components/ChevronDown";
import MobileMenu from "@/components/MobileMenu";
import SiteLink from "@/components/SiteLink";
import { mainNav, site } from "@/lib/data/site";

// Global header: logo, navigation, and Donate button. Menu content comes from
// lib/data/site.ts. Wide screens (xl and up) show the full menu with hover
// dropdowns; smaller screens show a menu button instead (MobileMenu).
export default function Header() {
  return (
    <header className="relative z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:py-6">
        <Link href="/" className="shrink-0">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={site.logo.width}
            height={site.logo.height}
            className="h-auto w-36 sm:w-44 xl:w-56"
            priority
          />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 xl:block">
          <ul className="flex gap-2">
            {mainNav.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 font-semibold text-brand-primary group-hover:opacity-70"
                >
                  {item.label}
                  <ChevronDown />
                </Link>
                <ul className="invisible absolute top-full left-0 w-60 border-t-2 border-brand-highlight bg-white py-3 opacity-0 shadow-md transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <SiteLink
                        link={child}
                        className="block px-5 py-2 font-semibold text-brand-primary hover:opacity-70"
                      />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SiteLink
            link={site.donate}
            className="hidden rounded-full bg-brand-accent px-4 py-1.5 font-medium tracking-wider text-white hover:opacity-90 sm:inline-block"
          />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
