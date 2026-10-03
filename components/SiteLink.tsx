import Link from "next/link";
import type { ReactNode } from "react";
import type { NavLink } from "@/lib/data/site";

// A link from the site data: internal pages use Next.js <Link>, links marked
// `external` open in a new tab.
export default function SiteLink({
  link,
  className,
  onClick,
  children,
}: {
  link: NavLink;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const content = children ?? link.label;

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}
