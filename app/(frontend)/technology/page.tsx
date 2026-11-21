import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { TechnologyCard } from "@/components/TechnologyCard";
import { getTechnologies, type TechnologyCardData } from "@/lib/data/technologies";
import { TECHNOLOGY_CATEGORIES } from "@/lib/technologyCategories";

export const metadata: Metadata = {
    title: "NEST360 Qualified Technologies",
    description:
        "Newborn care technologies that passed NEST360's eight-step evaluation for robustness, durability and use in low-resource settings.",
};

// A link in the intro text to a page on another site (nest360.org or the Technology Landscape), opened in a
// new tab. Styled like the links in a project page's description.
function IntroLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#41B6C4] underline underline-offset-2 transition-colors duration-300 hover:text-nest-blue">
            {children}
        </a>
    );
}

// The /technology gallery: one card per technology in the Technologies collection, linking to its page.
// The category buttons put ?category=… in the URL and the page reads it on the server (like the tag
// buttons on /stories), so filtering works without client JavaScript and a filtered view can be shared.
// Rendered on every request (it reads searchParams), so a technology saved in the admin shows up on the
// next page load.
export default async function TechnologyPage({ searchParams }: PageProps<"/technology">) {
    const params = await searchParams;
    const category = typeof params.category === "string" ? params.category : "";

    let technologies: TechnologyCardData[] = [];
    let failed = false;
    try {
        technologies = await getTechnologies();
    } catch (error) {
        console.error("Couldn't load technologies", error);
        failed = true;
    }

    // Only the categories that have at least one technology get a button
    const categories = TECHNOLOGY_CATEGORIES.filter((option) =>
        technologies.some((technology) => technology.categoryOfCare === option.value),
    );
    const shown = category ? technologies.filter((technology) => technology.categoryOfCare === category) : technologies;

    return (
        <main className="flex-1 bg-slate-50 pb-16">
            <section className="border-b border-gray-100 bg-white px-4 py-12">
                <div className="mx-auto max-w-4xl space-y-4">
                    <h1 className="font-heading text-4xl font-bold text-nest-blue">NEST360 Qualified Technologies</h1>
                    <p className="text-xl leading-relaxed text-gray-700">
                        NEST360 uses an eight-step process to evaluate technology for newborn care in low-resource
                        settings. Rigorous performance and usability testing is conducted on devices that are
                        available for purchase and have regulatory approval.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600">
                        <IntroLink href="https://nest360.org/project/qualified-technologies/">
                            NEST360 Qualified Technologies
                        </IntroLink>{" "}
                        are robust, durable and suitable for low-resource settings and meet pre-defined performance
                        metrics based on the{" "}
                        <IntroLink href="https://nest360.org/project/target-product-profiles/">
                            Target Product Profiles
                        </IntroLink>{" "}
                        (developed in collaboration with UNICEF). The technologies submitted align with our Pathways
                        of Care.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600">
                        Using the{" "}
                        <IntroLink href="https://www.technologylandscape.org/submit-your-technology">
                            Technology Landscaping Survey
                        </IntroLink>
                        , device manufacturers apply for inclusion in the next edition of the NEST360{" "}
                        <IntroLink href="https://www.technologylandscape.org/">Newborn Technology Landscape</IntroLink>,
                        a compendium of newborn healthcare technologies, both commercially available and in
                        development, suited for use in resource-limited settings.
                    </p>
                    <a
                        href="https://www.hatch-tech.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 rounded-lg bg-[#41B6C4] px-8 py-4 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-[#3298a4] hover:shadow-xl motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nest-blue"
                    >
                        Find a vendor
                        <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                </div>
            </section>

            {/* Category filters: links, so the chosen one is in the URL and can be shared */}
            {categories.length > 1 && (
                <nav aria-label="Filter by category of care" className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 px-4">
                    {[{ value: "", label: "All" }, ...categories].map((option) => {
                        const active = option.value === category;
                        return (
                            <Link
                                key={option.value || "all"}
                                href={option.value ? `/technology?category=${option.value}` : "/technology"}
                                // Stay where the visitor is: only the cards below change, so jumping to the
                                // top of the page would lose their place
                                scroll={false}
                                aria-current={active ? "page" : undefined}
                                className={
                                    active
                                        ? "rounded-full bg-[#41B6C4] px-5 py-2 text-base font-medium text-white shadow-sm"
                                        : "rounded-full border border-gray-300 bg-white px-5 py-2 text-base font-medium text-gray-700 transition duration-300 hover:border-[#41B6C4] hover:text-[#2a8f9b] hover:shadow-md motion-safe:hover:-translate-y-0.5"
                                }
                            >
                                {option.label}
                            </Link>
                        );
                    })}
                </nav>
            )}

            <div className="mx-auto max-w-6xl px-4 py-10">
                {failed ? (
                    // Error state: Payload or the database didn't answer
                    <p role="alert" className="py-16 text-center text-gray-600">
                        Technologies couldn&apos;t load right now. Please try again in a moment.
                    </p>
                ) : technologies.length === 0 ? (
                    <p className="py-16 text-center text-gray-600">No technologies have been added yet. Check back soon.</p>
                ) : shown.length === 0 ? (
                    // Empty state: an old or mistyped ?category= link
                    <div className="py-16 text-center text-gray-600">
                        <p>No technologies in this category.</p>
                        <Link href="/technology" scroll={false} className="mt-2 inline-block text-[#41B6C4] hover:underline">
                            Show all technologies
                        </Link>
                    </div>
                ) : (
                    // A list, so screen readers announce how many technologies there are
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {shown.map((technology) => (
                            <li key={technology.id}>
                                <TechnologyCard {...technology} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
