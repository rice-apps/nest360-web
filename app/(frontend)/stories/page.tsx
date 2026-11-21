import Image from "next/image";
import Link from "next/link";

import { StoryCard } from "@/components/StoryCard";
import { getPublishedArticles } from "@/lib/data/articles";
import { search } from "@/lib/data/search";
import type { Article, Tag } from "@/payload-types";

// The /stories gallery. Shows every published article as a card. The search box and the tag buttons put
// ?q=… and ?tag=… in the URL, and the page reads them on the server, so it works without client JavaScript.
// The page is rendered on every request (it reads searchParams), so a newly published story shows up on
// the next page load.

// Builds a /stories link that keeps the current search and/or tag
function storiesHref(query: string, tag: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    return qs ? `/stories?${qs}` : "/stories";
}

// The tags used by at least one published article, for the filter buttons
function tagsOf(articles: Article[]) {
    const tags = new Map<number, Tag>();
    for (const article of articles) {
        for (const tag of article.tags) {
            if (typeof tag === "object") tags.set(tag.id, tag);
        }
    }
    return [...tags.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function StoriesPage({ searchParams }: PageProps<"/stories">) {
    const params = await searchParams;
    const query = typeof params.q === "string" ? params.q.trim() : "";
    const tag = typeof params.tag === "string" ? params.tag : "";

    let articles: Article[] = []; // every published article (also the source of the tag buttons)
    let shown: Article[] = []; // the ones matching the search and tag
    let failed = false;
    try {
        articles = await getPublishedArticles();
        shown = articles;
        if (query || tag) {
            // The site search (lib/data/search.ts) only holds published articles, so drafts can't match.
            // It returns slugs; the cards come from the full list so they keep the newest-first order.
            const results = await search({ query, tags: tag ? [tag] : [], collections: ["articles"], limit: 200 });
            const slugs = new Set(results.map((result) => result.slug));
            shown = articles.filter((article) => slugs.has(article.slug));
        }
    } catch (error) {
        console.error("Couldn't load stories", error);
        failed = true;
    }

    const tags = tagsOf(articles);

    return (
        <div>
            <div className="relative h-64 w-full">
                <Image
                    src="/story_banner.jpg"
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                />
                {/* px-4 keeps the text inside the banner on phones; the wide right padding only applies on large screens */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 xl:pr-200 text-center text-white">
                    <h1 className="text-4xl font-bold">Stories and News</h1>
                    <p className="mt-2 text-lg">Add stuff to here as needed</p>
                </div>
            </div>

            {/* Search: a plain GET form, so pressing Search loads /stories?q=… (keeping the chosen tag) */}
            <form
                action="/stories"
                role="search"
                className="flex max-w-2xl mx-4 sm:mx-auto mt-6 shadow-sm rounded-md overflow-hidden border border-gray-200 mb-10"
            >
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search stories, topics or authors..."
                    aria-label="Search stories"
                    className="flex-1 min-w-0 px-4 py-3 outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
                {tag && <input type="hidden" name="tag" value={tag} />}
                <button
                    type="submit"
                    className="bg-[#41B6C4] text-white px-8 font-medium hover:bg-[#3298a4] transition-colors text-sm"
                >
                    Search
                </button>
            </form>

            {/* Tag filters: links, so the chosen one is in the URL and can be shared */}
            {tags.length > 0 && (
                <nav aria-label="Filter by topic" className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-10 px-4">
                    {[{ slug: "", name: "All" }, ...tags].map((t) => {
                        const active = t.slug === tag;
                        return (
                            <Link
                                key={t.slug || "all"}
                                href={storiesHref(query, t.slug ?? "")}
                                aria-current={active ? "page" : undefined}
                                className={
                                    active
                                        ? "px-4 py-1.5 rounded-full text-sm font-medium bg-[#41B6C4] text-white"
                                        : "px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-[#41B6C4] hover:text-[#41B6C4] transition-colors"
                                }
                            >
                                {t.name}
                            </Link>
                        );
                    })}
                </nav>
            )}

            <div className="inset-0 flex flex-col text-center text-black px-4">
                <h1 className="text-4xl font-bold">Stories, News, and More!</h1>
                <p className="mt-2 text-lg">Read the latest stories, and news from the NEST360 Alliance of experts who advance quality newborn care </p>
                <p className="mt-2 text-lg">through innovation, policy, and education.</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {failed ? (
                    // Error state: Payload or the database didn't answer
                    <p role="alert" className="py-16 text-center text-gray-600">
                        Stories couldn&apos;t load right now. Please try again in a moment.
                    </p>
                ) : articles.length === 0 ? (
                    // Empty state: nothing published yet
                    <p className="py-16 text-center text-gray-600">No stories yet. Check back soon.</p>
                ) : shown.length === 0 ? (
                    // Empty state: the search or tag matched nothing
                    <div className="py-16 text-center text-gray-600">
                        <p>No stories match {query ? <>&ldquo;{query}&rdquo;</> : "this topic"}.</p>
                        <Link href="/stories" className="mt-2 inline-block text-[#41B6C4] hover:underline">
                            Show all stories
                        </Link>
                    </div>
                ) : (
                    // A list, so screen readers announce how many stories there are
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {shown.map((article) => (
                            <li key={article.id}>
                                <StoryCard article={article} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
