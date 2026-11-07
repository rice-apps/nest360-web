import { RichText } from "@/components/RichText";

import type { RichTextBlock as RichTextBlockType } from "@/payload-types";

// Spacing and sizes shared by every block with formatted text, so all of it looks the same
const richTextLayout =
    "space-y-4 text-base leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6";

// Colors for text on a light background (the default)
export const richTextClasses = `${richTextLayout} text-nest-neutral-900 [&_a]:text-nest-blue [&_h2]:text-nest-blue [&_h3]:text-nest-blue`;

// Colors for text on a dark background, e.g. a Subsection with a NEST Blue background
export const richTextOnDarkClasses = `${richTextLayout} text-white [&_a]:text-white [&_h2]:text-white [&_h3]:text-white`;

// A plain section of formatted text
export function RichTextBlock({ content }: RichTextBlockType) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-8">
            <RichText data={content} className={richTextClasses} />
        </section>
    );
}