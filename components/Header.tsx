import Image from "next/image";
import Link from "next/link";
import { DONATE_URL, mainNav } from "@/lib/data/site";

// Global header recreated from nest360.org: logo, desktop navigation with
// hover dropdowns, and the Donate button. Sizes and colors match the live
// site's computed styles.
export default function Header() {
  return (
    <header className="relative z-50 border-b border-gray-200 bg-white font-poppins shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between px-[22.5px] pt-[50px] pb-[30px]">
        <div className="flex items-center">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/shared/nest360-logo.png"
              alt="Full color logo for NEST360"
              width={1665}
              height={437}
              className="h-auto w-[250px]"
              priority
            />
          </Link>
          <nav aria-label="Main" className="ml-2">
            <ul className="flex flex-wrap">
              {mainNav.map((item) => (
                <li key={item.label} className="group relative px-[11px]">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 pb-2 text-base font-semibold text-nest-navy transition-opacity group-hover:opacity-70"
                  >
                    {item.label}
                    <ChevronDown />
                  </Link>
                  <ul className="invisible absolute top-full left-0 w-60 border-t-[3px] border-nest-lilac bg-white py-5 opacity-0 shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block px-5 py-1.5 text-base leading-7 font-semibold text-nest-navy hover:opacity-70"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-3 shrink-0 rounded-[25px] bg-nest-teal px-4 py-[5px] text-base font-medium tracking-[2px] text-white hover:opacity-90"
        >
          Donate
        </a>
      </div>
    </header>
  );
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
