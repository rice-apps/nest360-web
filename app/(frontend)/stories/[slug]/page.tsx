import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/articles";

//the page preview directs you to
export default async function ArticlePage({ params }: PageProps<"/stories/[slug]">) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) notFound();

    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-[#0A4162]">{article.title}</h1>
            {/* render article content*/}
        </main>
    );
}
