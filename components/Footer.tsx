import Image from "next/image";
import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import SocialIcon from "@/components/SocialIcon";
import { footerColumns, footerLegal, site, socialLinks } from "@/lib/data/site";

// Global footer. Content comes from lib/data/site.ts. Columns stack on phones,
// sit two-by-two on tablets, and line up in one row on wide screens.
export default function Footer() {
  return (
    <footer className="border-t-4 border-brand-accent bg-surface-muted text-brand-primary">
      <div className="page-container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src={site.logo.src}
                alt={site.logo.alt}
                width={site.logo.width}
                height={site.logo.height}
                className="h-auto w-44"
              />
            </Link>
            <div className="mt-5">
              <SiteLink
                link={site.donate}
                className="inline-block rounded-full bg-brand-accent px-4 py-1.5 font-medium tracking-wider text-white hover:opacity-90"
              />
            </div>
          </div>

          {footerColumns.map((column, i) => (
            <ul key={i} className="space-y-3">
              {column.map((link) => (
                <li key={link.label}>
                  <SiteLink link={link} className="font-medium underline hover:opacity-70" />
                </li>
              ))}
            </ul>
          ))}

          <div>
            <p className="font-medium">{socialLinks.intro}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socialLinks.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded bg-brand-primary text-white hover:opacity-80"
                  >
                    <SocialIcon name={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-2 text-sm font-medium lg:text-right">
          <p>
            {footerLegal.questions}{" "}
            <a href={`mailto:${site.contactEmail}`} className="underline hover:opacity-70">
              {site.contactEmail}
            </a>
          </p>
          <p className="italic">
            {footerLegal.copyright}
            {footerLegal.links.map((link) => (
              <span key={link.href}>
                {" | "}
                <SiteLink link={link} className="underline hover:opacity-70" />
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
