// TODO: Implement
// export async function getCountries(): Promise<Country[]>
// export async function getImpactStats(): Promise<ImpactStat[]>

// Header and footer links, recreated from the nest360.org header and footer.
// Internal paths match nest360.org.

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  children: NavLink[];
}

export const DONATE_URL =
  "https://www.every.org/nest360?theme_color=094267&designation=NEST360+Website&utm_campaign=donate-link#/donate";

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
      { label: "Ethiopia", href: "/sll360" },
      { label: "Kenya", href: "/kenya" },
      { label: "Malawi", href: "/malawi" },
      { label: "Nigeria", href: "/nigeria" },
      { label: "Tanzania", href: "/tanzania" },
    ],
  },
  {
    label: "What We Do",
    href: "/what-we-do",
    children: [
      { label: "Our approach", href: "/what-we-do" },
      { label: "Technology", href: "/technology" },
      { label: "Education", href: "/education" },
      {
        label: "Data for action & improving quality",
        href: "/evidence-based-care",
      },
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

// Footer links, in the same order as the nest360.org footer.
export const footerLinks: NavLink[] = [
  { label: "About us", href: "/about" },
  { label: "Leadership", href: "/our-leadership" },
  { label: "Knowledge Hub", href: "/resources" },
  { label: "Publications", href: "/publications" },
  { label: "Careers", href: "/jobs" },
  { label: "Annual Highlights", href: "/annual-highlights" },
  { label: "Connect", href: "/connect" },
  { label: "Newsletters", href: "/newsletter" },
];

export const NEWBORN_TOOLKIT_URL = "https://www.newborntoolkit.org";

export const socialLinks: NavLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/NEST360org" },
  { label: "X", href: "https://www.twitter.com/NEST360org" },
  { label: "Instagram", href: "https://www.instagram.com/NEST360org" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/nest360org" },
  { label: "YouTube", href: "https://www.youtube.com/@NEST360org" },
];

export const CONTACT_EMAIL = "info@nest360.org";
