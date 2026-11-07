import { RichText } from "@payloadcms/richtext-lexical/react";

import type { RichTextBlock as RichTextBlockType } from "@/payload-types";

// Shared by every block with formatted text, so all of it looks the same
export const richTextClasses =
    "space-y-4 text-base leading-relaxed text-nest-neutral-900 [&_a]:text-nest-blue [&_a]:underline [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-nest-blue [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-nest-blue [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6";

export function RichTextBlock({ content }: RichTextBlockType) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-8">
            <RichText data={content} className={richTextClasses} />
        </section>
    );
}
