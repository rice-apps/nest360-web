import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticleBySlug } from "@/lib/data/articles";
import type { Document, Media, Tag } from "@/payload-types";

// Relationships are IDs until populated; the article is fetched with enough depth to populate them
function populated<T extends object>(value: number | T | null | undefined): T | null {
    return value && typeof value === "object" ? value : null;
}

// Matches the admin's date format, e.g. "Sep 17, 2026". UTC so the day doesn't shift by time zone.
function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
}

function formatSize(bytes: number) {
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Search results and link previews use the SEO fields, falling back to the article's own
export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return {};

    const image = populated<Media>(article.meta?.image) ?? populated<Media>(article.featuredImage);
    return {
        title: article.meta?.title || article.title,
        description: article.meta?.description || article.excerpt,
        openGraph: image?.url ? { images: [{ url: image.url, alt: image.alt }] } : undefined,
    };
}

//the page preview directs you to
export default async function ArticlePage({ params }: PageProps<"/stories/[slug]">) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) notFound();

    const image = populated<Media>(article.featuredImage);
    const tags = article.tags.map((tag) => populated<Tag>(tag)).filter((tag) => tag !== null);
    const authors = article.authors ?? [];
    const attachments = (article.attachments ?? [])
        .map((file) => populated<Document>(file))
        .filter((file): file is Document => Boolean(file?.url));

    return (
        <main className="min-h-screen bg-slate-50 pb-16">
            <article className="max-w-3xl mx-auto px-4 py-12 space-y-8">
                <header className="space-y-4">
                    <Link href="/stories" className="text-sm text-[#41B6C4] hover:underline">
                        ← All stories
                    </Link>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl font-bold text-[#0A4162]">{article.title}</h1>

                    <p className="text-lg leading-relaxed text-gray-600">{article.excerpt}</p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
                        <time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time>
                        {authors.map((author) => (
                            <div key={author.id ?? author.name}>
                                <p className="font-medium text-gray-800">{author.name}</p>
                                {author.role && <p className="text-xs">{author.role}</p>}
                            </div>
                        ))}
                    </div>
                </header>

                {image?.url && (
                    <Image
                        src={image.url}
                        alt={image.alt}
                        width={image.width ?? 1200}
                        height={image.height ?? 675}
                        sizes="(max-width: 768px) 100vw, 768px"
                        priority
                        className="h-auto w-full rounded-lg"
                    />
                )}

                <RichText
                    data={article.content}
                    className="space-y-4 text-base leading-relaxed text-gray-700 [&_a]:text-[#41B6C4] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#41B6C4] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A4162] [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0A4162] [&_h4]:font-semibold [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />

                {attachments.length > 0 && (
                    <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-bold text-[#0A4162]">Downloads</h2>
                        <ul className="divide-y divide-gray-100">
                            {attachments.map((file) => {
                                const preview = populated<Media>(file.preview);
                                return (
                                    <li key={file.id} className="flex items-center gap-4 py-3">
                                        {preview?.url && (
                                            <Image
                                                src={preview.url}
                                                alt={preview.alt}
                                                width={preview.width ?? 60}
                                                height={preview.height ?? 85}
                                                className="h-auto w-[60px] shrink-0 rounded border border-gray-200"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <a href={file.url!} className="font-medium text-[#41B6C4] hover:underline">
                                                {file.filename}
                                            </a>
                                            {file.filesize && (
                                                <p className="text-xs text-gray-500">PDF · {formatSize(file.filesize)}</p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}
            </article>
        </main>
    );
}
