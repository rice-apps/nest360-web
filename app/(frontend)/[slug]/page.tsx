import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RenderBlocks } from "@/components/RenderBlocks";
import { getPageBySlug } from "@/lib/data/pages";

// Tab title and search-result text
export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) return {};
    return { title: page.title, description: page.description ?? undefined };
}

// Any page from the Pages collection, e.g. /what-we-do or /jobs. Fixed routes such as
// /stories and /resources take priority over this one.
export default async function Page({ params }: PageProps<"/[slug]">) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) notFound(); // no page with this slug, or it's an unpublished draft

    return (
        <main className="flex-1 pb-16">
            <header className="mx-auto max-w-6xl px-4 pt-12">
                <h1 className="font-heading text-4xl font-bold text-nest-blue">{page.title}</h1>
            </header>
            <RenderBlocks blocks={page.layout} />
        </main>
    );
}
