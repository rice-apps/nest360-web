import { RichText } from "@/components/RichText";

import type { RichTextBlock as RichTextBlockType } from "@/payload-types";
import { BlockBackground } from "./BlockBackground";

// Spacing and sizes shared by every block with formatted text, so all of it looks the same:
// paragraph spacing, underlined links, heading sizes and fonts, and bullet/number list styles.
// It has no colors; those come from the two constants below.
const richTextLayout =
    "space-y-4 text-base leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6";

// Text colors for a light background (the default): dark gray body, NEST blue links and headings
export const richTextClasses = `${richTextLayout} text-nest-neutral-900 [&_a]:text-nest-blue [&_h2]:text-nest-blue [&_h3]:text-nest-blue`;

// Text colors for a dark background (e.g. NEST Blue): everything white so it stays readable
export const richTextOnDarkClasses = `${richTextLayout} text-white [&_a]:text-white [&_h2]:text-white [&_h3]:text-white`;

// The "Text" block: a section of formatted text on an optional background color
export function RichTextBlock({ content, backgroundColor }: RichTextBlockType) {
    return (
        // Paints the background color (if any) and tells us whether it's dark
        <BlockBackground color={backgroundColor}>
            {(dark) => (
                // Centered column, narrower than other blocks so long text is comfortable to read
                <div className="mx-auto max-w-3xl px-4 py-8">
                    {/* White text on dark backgrounds, normal colors otherwise */}
                    <RichText data={content} className={dark ? richTextOnDarkClasses : richTextClasses} />
                </div>
            )}
        </BlockBackground>
    );
}
