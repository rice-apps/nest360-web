import { getHeader } from "@/lib/data/pages";

import { HeaderNav } from "./HeaderNav";

// Site-wide header, read from the Header global. Fetches on the server, then hands the data
// to HeaderNav, the only part that needs JavaScript (the mobile menu button).
export async function SiteHeader() {
    const header = await getHeader();
    const logo = typeof header.logo === "object" ? header.logo : null; // full image, or null if not set

    return (
        <HeaderNav
            logo={logo?.url ? { url: logo.url, alt: logo.alt, width: logo.width, height: logo.height } : null}
            navItems={header.navItems ?? []}
            donate={header.donate?.url ? { label: header.donate.label || "Donate", url: header.donate.url } : null}
        />
    );
}
