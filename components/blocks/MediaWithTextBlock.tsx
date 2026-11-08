import { RichText } from "@/components/RichText";
import Image from "next/image";

import type { MediaWithTextBlock as MediaWithTextBlockType } from "@/payload-types";
import { BlockBackground } from "./BlockBackground";
import { richTextClasses, richTextOnDarkClasses } from "./RichTextBlock";

// The "Image with text" block: an image and text side by side on desktop, stacked on phones,
// on an optional background color
export function MediaWithTextBlock({ image, content, imagePosition, backgroundColor }: MediaWithTextBlockType) {
    // The image arrives as a full object when the page is fetched with depth 1, or as a plain ID otherwise
    const media = typeof image === "object" ? image : null;
    // The editor chooses which side the image sits on; "left" is the default
    const imageRight = imagePosition === "right";

    return (
        // Paints the background color (if any) and tells us whether it's dark
        <BlockBackground color={backgroundColor}>
            {(dark) => (
                // Centered container, wider than the text blocks so image and text fit side by side
                <div className="mx-auto max-w-6xl px-4 py-8">
                    {/* Stacked on phones (flex-col); a row from md up, reversed when the image goes on the right */}
                    <div className={`flex flex-col gap-8 md:items-center ${imageRight ? "md:flex-row-reverse" : "md:flex-row"}`}>
                        {/* Image half: skipped if the image is missing or not populated */}
                        {media?.url && (
                            <div className="md:w-1/2">
                                <Image
                                    src={media.url}
                                    alt={media.alt}
                                    width={media.width ?? 1200}
                                    height={media.height ?? 800}
                                    // Full screen width on phones, half on larger screens, so phones download a smaller file
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="h-auto w-full rounded-lg"
                                />
                            </div>
                        )}
                        {/* Text half: white on dark backgrounds, normal colors otherwise */}
                        <div className="md:w-1/2">
                            <RichText data={content} className={dark ? richTextOnDarkClasses : richTextClasses} />
                        </div>
                    </div>
                </div>
            )}
        </BlockBackground>
    );
}
