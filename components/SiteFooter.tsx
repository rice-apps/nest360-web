import Image from "next/image";
import Link from "next/link";

import { isDarkColor } from "@/lib/colors";
import { getFooter } from "@/lib/data/pages";

import { SocialIcon, socialColors } from "./SocialIcon";

// Site-wide footer, read from the Footer global. Layout: optional logo + Donate | link columns |
// social media, then the contact email and the copyright line with legal links.
export async function SiteFooter() {
    const footer = await getFooter();
    const logo = typeof footer.logo === "object" && footer.logo?.url ? footer.logo : null; // null if not set
    const donate = footer.donate?.url ? { label: footer.donate.label || "Donate", url: footer.donate.url } : null;
    // Footer → Donate → Color; without one, the teal classes below apply
    const donateStyle = footer.donate?.color
        ? { backgroundColor: footer.donate.color, color: isDarkColor(footer.donate.color) ? "#ffffff" : undefined }
        : undefined;

    return (
        <footer className="mt-auto bg-nest-neutral-100 text-nest-blue">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
                {(logo || donate) && (
                    <div className="space-y-6">
                        {logo && (
                            <Link href="/" className="inline-block">
                                <Image
                                    src={logo.url!}
                                    alt={logo.alt}
                                    width={logo.width ?? 200}
                                    height={logo.height ?? 48}
                                    className="h-12 w-auto"
                                />
                            </Link>
                        )}
                        {donate && (
                            <Link
                                href={donate.url}
                                style={donateStyle}
                                className="block w-fit rounded-full bg-nest-light-blue px-6 py-2 font-semibold tracking-widest text-white"
                            >
                                {donate.label}
                            </Link>
                        )}
                    </div>
                )}

                {footer.columns?.map((column) => (
                    <div key={column.id}>
                        {column.heading && <h2 className="mb-3 font-heading font-semibold">{column.heading}</h2>}
                        <ul className="space-y-3">
                            {column.links?.map((link) => (
                                <li key={link.id}>
                                    <Link href={link.url} className="underline hover:text-nest-light-blue">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {footer.socials && footer.socials.length > 0 && (
                    <div className="space-y-5">
                        {footer.socialsHeading && <p>{footer.socialsHeading}</p>}
                        <ul className="flex flex-wrap gap-3">
                            {footer.socials.map((social) => (
                                <li key={social.id}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ backgroundColor: socialColors[social.platform] }}
                                        className="flex h-11 w-11 items-center justify-center rounded text-white hover:opacity-80"
                                    >
                                        <span className="sr-only">{social.platform}</span>
                                        <SocialIcon platform={social.platform} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mx-auto max-w-6xl space-y-3 px-4 pb-10 text-sm md:text-right">
                {footer.contactEmail && (
                    <p>
                        {footer.contactLabel || "Questions? Email us at"}{" "}
                        <a href={`mailto:${footer.contactEmail}`} className="underline">{footer.contactEmail}</a>
                    </p>
                )}
                <p className="italic">
                    {footer.copyright || "© NEST360. All rights reserved."}
                    {footer.legalLinks?.map((link) => (
                        <span key={link.id}>
                            {" | "}
                            <Link href={link.url} className="underline">{link.label}</Link>
                        </span>
                    ))}
                </p>
            </div>
        </footer>
    );
}
