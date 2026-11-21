import type { HeadingWithListBlock as HeadingWithListBlockType } from "@/payload-types";
import { BlockBackground } from "./BlockBackground";

// The "Heading with list" block: a heading and optional intro, then the items as cards
// (one column on phones, two on larger screens), on an optional background color
export function HeadingWithListBlock({ heading, intro, items, backgroundColor }: HeadingWithListBlockType) {
    return (
        // Paints the background color (if any) and tells us whether it's dark
        <BlockBackground color={backgroundColor}>
            {(dark) => (
                <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
                    {/* Heading and intro sit directly on the background, so they turn white when it's dark */}
                    <h2 className={`font-heading text-3xl font-bold ${dark ? "text-white" : "text-nest-blue"}`}>{heading}</h2>
                    {intro && <p className={`text-lg leading-relaxed ${dark ? "text-white" : "text-nest-neutral-900"}`}>{intro}</p>}

                    {/* The list: only drawn when there's at least one item */}
                    {items && items.length > 0 && (
                        <ul className="grid gap-4 sm:grid-cols-2">
                            {items.map((item, i) => (
                                // Each item is a white card, so its text stays dark on any background color
                                <li key={item.id ?? i} className="rounded-lg border border-nest-neutral-200 bg-white p-6">
                                    <h3 className="font-heading text-lg font-semibold text-nest-blue">{item.title}</h3>
                                    {item.description && <p className="mt-2 text-nest-neutral-900">{item.description}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </BlockBackground>
    );
}
