import type { HeadingWithListBlock as HeadingWithListBlockType } from "@/payload-types";

// A heading and intro, then the items as cards (one column on phones, two on larger screens)
export function HeadingWithListBlock({ heading, intro, items }: HeadingWithListBlockType) {
    return (
        <section className="mx-auto max-w-4xl space-y-6 px-4 py-8">
            <h2 className="font-heading text-3xl font-bold text-nest-blue">{heading}</h2>
            {intro && <p className="text-lg leading-relaxed text-nest-neutral-900">{intro}</p>}

            {items && items.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2">
                    {items.map((item, i) => (
                        <li key={item.id ?? i} className="rounded-lg border border-nest-neutral-200 bg-white p-6">
                            <h3 className="font-heading text-lg font-semibold text-nest-blue">{item.title}</h3>
                            {item.description && <p className="mt-2 text-nest-neutral-900">{item.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
