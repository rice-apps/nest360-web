import { RichText } from "@/components/RichText";
import Image from "next/image";

import type { SubsectionBlock as SubsectionBlockType } from "@/payload-types";
import { richTextClasses } from "./RichTextBlock";

// A title, then an optional subtitle, text and images
export function SubsectionBlock({ title, subtitle, text, images }: SubsectionBlockType) {
    // images are just IDs if they weren't populated, so keep only the full ones
    const media = (images ?? []).filter((image) => typeof image === "object");

    return (
        <section className="mx-auto max-w-4xl space-y-4 px-4 py-8">
            <h2 className="font-heading text-3xl font-bold text-nest-blue">{title}</h2>
            {subtitle && <p className="text-lg text-nest-neutral-900">{subtitle}</p>}
            {text && <RichText data={text} className={richTextClasses} />}

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
        </section>
    );
}
