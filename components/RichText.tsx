import {
    type JSXConvertersFunction,
    LinkJSXConverter,
    RichText as PayloadRichText,
} from "@payloadcms/richtext-lexical/react";
import type { ComponentProps } from "react";

type InternalDocToHref = NonNullable<Parameters<typeof LinkJSXConverter>[0]["internalDocToHref"]>;

// Where each linkable collection lives on the site
const pathFor: Record<string, (slug: string) => string> = {
    pages: (slug) => `/${slug}`,
    articles: (slug) => `/stories/${slug}`,
    projects: (slug) => `/resources/${slug}`,
};

// Editors can link to another document ("link to the Jobs page") instead of pasting a URL.
// Payload stores that as the document itself, so turn it into the page's URL here.
const internalDocToHref: InternalDocToHref = ({ linkNode }) => {
    const { relationTo, value } = linkNode.fields.doc ?? {};
    // value is the full document when it was loaded with the page, or just its ID when it wasn't
    const slug = value && typeof value === "object" && "slug" in value ? value.slug : null;
    const toPath = relationTo ? pathFor[relationTo] : undefined;
    if (typeof slug === "string" && toPath) return toPath(slug);
    // A linked image or file has no page of its own, but it has a URL
    if (value && typeof value === "object" && "url" in value && typeof value.url === "string") return value.url;
    return "#";
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
});

// Payload's rich text renderer, set up so internal links point at the right page.
// Use this instead of importing RichText from @payloadcms/richtext-lexical/react directly.
export function RichText(props: Omit<ComponentProps<typeof PayloadRichText>, "converters">) {
    return <PayloadRichText converters={converters} {...props} />;
}
