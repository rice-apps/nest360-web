import Image from "next/image";
import Link from "next/link";

import { SearchBox } from "@/components/SearchBox";
import { SearchError } from "@/components/SearchError";
import { StoryCard } from "@/components/StoryCard";
import { getPublishedArticles } from "@/lib/data/articles";
import { search } from "@/lib/data/search";
import { loadStories, withSimulatedFailure } from "@/lib/searchLoaders";
import { simulatedFailure } from "@/lib/simulatedFailure";
import { storiesHref } from "@/lib/storiesHref";
import type { Article, Tag } from "@/payload-types";

// The /stories gallery. Shows every published article as a card. The search box and the tag buttons put
// ?q=… and ?tag=… in the URL, and the page reads them on the server. The search box applies the text after a
// short pause in typing; without client JavaScript, pressing Search still works.
// The page is rendered on every request (it reads searchParams), so a newly published story shows up on
// the next page load.

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

    // Every published article (also the source of the tag buttons), and the ones matching the search and tag.
    // If the database or the search index fails or doesn't answer in time, `loaded` says so and the page shows
    // an error with Try again instead of "no stories" (lib/searchLoaders.ts). In development the failure can
    // be simulated.
    const loaded = await loadStories(
        { query, tag },
        withSimulatedFailure({ getPublishedArticles, search }, await simulatedFailure()),
    );
    const articles: Article[] = loaded.ok ? loaded.data.articles : [];
    const shown: Article[] = loaded.ok ? loaded.data.shown : [];

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

            {/* Search: applies the typed text after a short pause, keeping the chosen tag (see SearchBox) */}
            <div className="mb-10 px-4">
                <SearchBox
                    initialQuery={query}
                    placeholder="Search stories, topics or authors..."
                    label="Search stories"
                />
            </div>

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
                {!loaded.ok ? (
                    // Error state: the data couldn't be loaded, which is different from "nothing matched".
                    // Try again reloads exactly this address, so the search and tag are kept.
                    <div className="mx-auto max-w-2xl py-8">
                        <SearchError noun="stories" failure={loaded.failure} retryHref={storiesHref(query, tag)} />
                    </div>
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
