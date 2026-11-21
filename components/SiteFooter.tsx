import Link from "next/link";

import { getFooter } from "@/lib/data/pages";

// Site-wide footer, read from the Footer global. Basic structure: link columns, socials, contact
// email and a bottom line with legal links. Design details get filled in later.
export async function SiteFooter() {
    const footer = await getFooter();

    return (
        <footer className="mt-auto bg-nest-blue text-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
                {footer.columns?.map((column) => (
                    <div key={column.id}>
                        <h2 className="mb-3 font-heading font-semibold">{column.heading}</h2>
                        <ul className="space-y-2 text-sm">
                            {column.links?.map((link) => (
                                <li key={link.id}>
                                    <Link href={link.url} className="hover:text-nest-light-blue">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="space-y-3 text-sm">
                    {footer.socials && footer.socials.length > 0 && (
                        <ul className="flex flex-wrap gap-4">
                            {footer.socials.map((social) => (
                                <li key={social.id}>
                                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-nest-light-blue">
                                        {social.platform}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {footer.contactEmail && (
                        <p>
                            Questions? Email us at{" "}
                            <a href={`mailto:${footer.contactEmail}`} className="underline">{footer.contactEmail}</a>
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-white/20">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 text-xs">
                    <p>© NEST360. All rights reserved.</p>
                    <ul className="flex flex-wrap gap-4">
                        {footer.legalLinks?.map((link) => (
                            <li key={link.id}>
                                <Link href={link.url} className="hover:underline">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
