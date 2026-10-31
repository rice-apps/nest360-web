import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RenderBlocks } from "@/components/RenderBlocks";
import { getPageBySlug } from "@/lib/data/pages";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    return page ? { title: page.title } : {};
}

// e.g. /name: the page the admin Preview button links to
export default async function Page({ params }: PageProps<"/[slug]">) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) notFound();

    return (
        <main className="min-h-screen bg-slate-50 pb-16">
            <header className="max-w-6xl mx-auto px-4 pt-12">
                <h1 className="text-4xl font-bold text-[#0A4162]">{page.title}</h1>
            </header>
            <RenderBlocks blocks={page.layout} />
        </main>
    );
}
