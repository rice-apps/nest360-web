import { RichText } from "@/components/RichText";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { richTextClasses } from "@/components/blocks/RichTextBlock";
import { getArticleBySlug } from "@/lib/data/articles";
import { tagColor } from "@/lib/tagColors";
import type { Author, Document, Media, Tag } from "@/payload-types";

// Same text styles as the Text block on CMS pages, so an article reads like the rest of the site. Articles
// also use quotes and inline images, which pages don't style.
const articleTextClasses = `${richTextClasses} [&_blockquote]:border-l-4 [&_blockquote]:border-nest-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h4]:font-heading [&_h4]:font-semibold [&_h4]:text-nest-blue [&_img]:rounded-lg`;

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
    // Authors from the Authors collection; each is a full object (with its photo) because of depth 2
    const authors = (article.byline ?? []).map((author) => populated<Author>(author)).filter((author) => author !== null);
    const attachments = (article.attachments ?? [])
        .map((file) => populated<Document>(file))
        .filter((file): file is Document => Boolean(file?.url));

    return (
        // Same frame as CMS pages: white, filling the space above the footer, in the 3xl reading column the
        // Text block uses
        <main className="flex-1 pb-16">
            <article className="mx-auto max-w-3xl space-y-10 px-4 pt-8 sm:pt-12">
                <header className="space-y-5">
                    <Link
                        href="/stories"
                        className="inline-block text-sm font-medium text-nest-blue hover:underline"
                    >
                        <span aria-hidden="true">←</span> All stories
                    </Link>

                    {/* Pills in the same colors as the resource cards' tags */}
                    {tags.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <li
                                    key={tag.id}
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${tagColor(tag.name)}`}
                                >
                                    {tag.name}
                                </li>
                            ))}
                        </ul>
                    )}

                    <h1 className="font-heading text-3xl font-bold leading-tight text-nest-blue sm:text-4xl">
                        {article.title}
                    </h1>

                    <p className="text-lg leading-relaxed text-nest-neutral-900">{article.excerpt}</p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-nest-neutral-200 pt-5 text-sm text-gray-600">
                        <time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time>
                        {authors.map((author) => {
                            const photo = populated<Media>(author.photo);
                            return (
                                <div key={author.id} className="flex items-center gap-2">
                                    {photo?.url && (
                                        <Image
                                            src={photo.url}
                                            alt={photo.alt}
                                            width={36}
                                            height={36}
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">{author.name}</p>
                                        {author.bio && <p className="text-xs">{author.bio}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </header>

                {image?.url && (
                    <Image
                        src={image.url}
                        alt={image.alt}
                        width={image.width ?? 1200}
                        height={image.height ?? 675}
                        sizes="(max-width: 768px) 100vw, 768px"
                        // `priority` is deprecated in Next 16; this is the page's largest image, so load it first
                        preload
                        className="h-auto w-full rounded-lg"
                    />
                )}

                <RichText data={article.content} className={articleTextClasses} />

                {/* A white card like the Heading with list block's, with file rows like a resource page's */}
                {attachments.length > 0 && (
                    <section className="rounded-lg border border-nest-neutral-200 bg-white p-6">
                        <h2 className="mb-2 font-heading text-xl font-bold text-nest-blue sm:text-2xl">Downloads</h2>
                        <ul className="divide-y divide-nest-neutral-200">
                            {attachments.map((file) => {
                                const preview = populated<Media>(file.preview);
                                return (
                                    <li key={file.id} className="flex items-center gap-4 py-4">
                                        {preview?.url && (
                                            <Image
                                                src={preview.url}
                                                alt={preview.alt}
                                                width={preview.width ?? 90}
                                                height={preview.height ?? 127}
                                                className="h-auto w-[72px] shrink-0 rounded border border-gray-200 sm:w-[90px]"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            {/* File names are often one long word, so let them wrap anywhere on phones */}
                                            <a
                                                href={file.url!}
                                                className="font-medium text-nest-blue wrap-anywhere hover:underline"
                                            >
                                                {file.filename}
                                            </a>
                                            {file.filesize && (
                                                <p className="text-xs text-gray-600">PDF · {formatSize(file.filesize)}</p>
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
