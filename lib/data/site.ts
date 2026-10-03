import { countries } from "@/lib/data/countries";

// Site-wide content: name, logo, header menu, and footer. Edit the text and
// links here; the header and footer components only handle layout.

// TODO: Implement
// export async function getImpactStats(): Promise<ImpactStat[]>

export interface NavLink {
  label: string;
  href: string;
  // Opens in a new tab (use for links to other websites)
  external?: boolean;
}

export interface NavItem extends NavLink {
  children: NavLink[];
}

export const site = {
  name: "NEST360",
  description:
    "NEST360 works with governments in Africa to end preventable newborn deaths in hospitals.",
  logo: {
    src: "/images/shared/nest360-logo.png",
    alt: "NEST360 logo",
    width: 1665,
    height: 437,
  },
  contactEmail: "info@nest360.org",
  donate: {
    label: "Donate",
    href: "https://www.every.org/nest360?theme_color=094267&designation=NEST360+Website&utm_campaign=donate-link#/donate",
    external: true,
  } satisfies NavLink,
};

// Header menu. Each item has a main link and a dropdown of links. The Where We
// Work dropdown is built from the country list in lib/data/countries.
export const mainNav: NavItem[] = [
  {
    label: "Who We Are",
    href: "/about",
    children: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/our-leadership" },
      { label: "Contact us", href: "/connect" },
    ],
  },
  {
    label: "Where We Work",
    href: "/where-we-work",
    children: [
      { label: "All countries", href: "/where-we-work" },
      ...countries.map((country) => ({
        label: country.name,
        href: `/${country.slug}`,
      })),
    ],
  },
  {
    label: "What We Do",
    href: "/what-we-do",
    children: [
      { label: "Our approach", href: "/what-we-do" },
      { label: "Technology", href: "/technology" },
      { label: "Education", href: "/education" },
      { label: "Data for action & improving quality", href: "/evidence-based-care" },
    ],
  },
  {
    label: "Knowledge Hub",
    href: "/resources",
    children: [
      { label: "Resources", href: "/resources" },
      { label: "Research publications", href: "/publications" },
    ],
  },
  {
    label: "News & Highlight",
    href: "/news",
    children: [
      { label: "Stories & news", href: "/stories" },
      { label: "Annual highlights", href: "/annual-highlights" },
      { label: "Newsletters", href: "/newsletters" },
    ],
  },
];

// Footer link columns, left to right.
export const footerColumns: NavLink[][] = [
  [
    { label: "About us", href: "/about" },
    { label: "Leadership", href: "/our-leadership" },
    { label: "Knowledge Hub", href: "/resources" },
    { label: "Publications", href: "/publications" },
    { label: "Careers", href: "/jobs" },
  ],
  [
    { label: "Annual Highlights", href: "/annual-highlights" },
    { label: "Connect", href: "/connect" },
    { label: "Newsletters", href: "/newsletters" },
    { label: "Newborn Toolkit", href: "https://www.newborntoolkit.org", external: true },
  ],
];

export const socialLinks = {
  intro: "Join the conversation, and follow us on social media!",
  // `icon` must match one of the icons in components/SocialIcon.tsx
  links: [
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/NEST360org" },
    { label: "X", icon: "x", href: "https://www.twitter.com/NEST360org" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/NEST360org" },
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/nest360org" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@NEST360org" },
  ],
} as const;

export const footerLegal = {
  questions: "Questions? Email us at",
  copyright: "© NEST360. All rights reserved.",
  links: [
    { label: "Privacy and Copyright policies", href: "/policies" },
    { label: "Cookie Policy (EU)", href: "/cookie-policy-eu" },
  ] satisfies NavLink[],
};
