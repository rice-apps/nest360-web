import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";

import type { MediaWithTextBlock as MediaWithTextBlockType } from "@/payload-types";
import { richTextClasses } from "./RichTextBlock";

export function MediaWithTextBlock({ image, content, imagePosition }: MediaWithTextBlockType) {
    // image is just an ID if it wasn't populated 
    const media = typeof image === "object" ? image : null;
    const imageRight = imagePosition === "right";

    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <div className={`flex flex-col gap-8 md:items-center ${imageRight ? "md:flex-row-reverse" : "md:flex-row"}`}>
                {media?.url && (
                    <div className="md:w-1/2">
                        <Image
                            src={media.url}
                            alt={media.alt}
                            width={media.width ?? 1200}
                            height={media.height ?? 800}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="h-auto w-full rounded-lg"
                        />
                    </div>
                )}
                <div className="md:w-1/2">
                    <RichText data={content} className={richTextClasses} />
                </div>
            </div>
        </section>
    );
}
