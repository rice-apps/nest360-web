import { RichText } from "@/components/RichText";
import Image from "next/image";

import type { SubsectionBlock as SubsectionBlockType } from "@/payload-types";
import { BlockBackground } from "./BlockBackground";
import { richTextClasses, richTextOnDarkClasses } from "./RichTextBlock";

// The "Subsection" block: a title, then an optional subtitle, text and images,
// on an optional background color (e.g. the sections of the Jobs page)
export function SubsectionBlock({ title, subtitle, text, images, backgroundColor }: SubsectionBlockType) {
    // Images arrive as full objects when the page is fetched with depth 1, or as plain IDs otherwise,
    // so keep only the full ones (they have the url, alt text and size we need)
    const media = (images ?? []).filter((image) => typeof image === "object");

    return (
        // Paints the background color (if any) and tells us whether it's dark
        <BlockBackground color={backgroundColor}>
            {(dark) => (
                <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
                    {/* Title (required): white on dark backgrounds, NEST blue otherwise */}
                    <h2 className={`font-heading text-3xl font-bold ${dark ? "text-white" : "text-nest-blue"}`}>{title}</h2>

                    {/* Subtitle and text are optional, so each is only drawn when filled in */}
                    {subtitle && <p className={`text-lg ${dark ? "text-white" : "text-nest-neutral-900"}`}>{subtitle}</p>}
                    {text && <RichText data={text} className={dark ? richTextOnDarkClasses : richTextClasses} />}

                    {/* Images, full width of the column, one under another */}
                    {media.map((image) =>
                        image.url ? (
                            <Image
                                key={image.id}
                                src={image.url}
                                alt={image.alt}
                                width={image.width ?? 1200}
                                height={image.height ?? 800}
                                // The column is at most 896px wide, so never download a bigger image than that
                                sizes="(max-width: 896px) 100vw, 896px"
                                className="h-auto w-full rounded-lg"
                            />
                        ) : null,
                    )}
                </div>
            )}
        </BlockBackground>
    );
}
