import { RichText } from "@payloadcms/richtext-lexical/react";

import type { RichTextBlock as RichTextBlockType } from "@/payload-types";

// Shared with MediaWithTextBlock so all formatted text on a page looks the same
export const richTextClasses =
    "space-y-4 text-base leading-relaxed text-gray-700 [&_a]:text-[#41B6C4] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#41B6C4] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A4162] [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0A4162] [&_h4]:font-semibold [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6";

export function RichTextBlock({ content }: RichTextBlockType) {
    return (
        <section className="max-w-3xl mx-auto px-4 py-8">
            <RichText data={content} className={richTextClasses} />
        </section>
    );
}
