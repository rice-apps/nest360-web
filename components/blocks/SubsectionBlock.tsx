import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";

import { isDarkColor } from "@/lib/colors";
import type { SubsectionBlock as SubsectionBlockType } from "@/payload-types";
import { richTextClasses, richTextOnDarkClasses } from "./RichTextBlock";

// A title, then an optional subtitle, text and images, on an optional background color
export function SubsectionBlock({ title, subtitle, text, images, backgroundColor }: SubsectionBlockType) {
    // images are just IDs if they weren't populated, so keep only the full ones
    const media = (images ?? []).filter((image) => typeof image === "object");
    // White text on dark backgrounds so it stays readable
    const dark = backgroundColor ? isDarkColor(backgroundColor) : false;

    return (
        // The color fills the full width of the page; the content stays centered inside it
        <section style={backgroundColor ? { backgroundColor } : undefined} className={backgroundColor ? "py-4" : undefined}>
            <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
                <h2 className={`font-heading text-3xl font-bold ${dark ? "text-white" : "text-nest-blue"}`}>{title}</h2>
                {subtitle && <p className={`text-lg ${dark ? "text-white" : "text-nest-neutral-900"}`}>{subtitle}</p>}
                {text && <RichText data={text} className={dark ? richTextOnDarkClasses : richTextClasses} />}

                {media.map((image) =>
                    image.url ? (
                        <Image
                            key={image.id}
                            src={image.url}
                            alt={image.alt}
                            width={image.width ?? 1200}
                            height={image.height ?? 800}
                            sizes="(max-width: 896px) 100vw, 896px"
                            className="h-auto w-full rounded-lg"
                        />
                    ) : null,
                )}
            </div>
        </section>
    );
}