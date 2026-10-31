import type { HeadingWithListBlock as HeadingWithListBlockType } from "@/payload-types";

export function HeadingWithListBlock({ heading, intro, items }: HeadingWithListBlockType) {
    return (
        <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h2 className="text-3xl font-bold text-[#0A4162]">{heading}</h2>
            {intro && <p className="text-lg leading-relaxed text-gray-600">{intro}</p>}

            {items && items.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2">
                    {items.map((item, i) => (
                        <li key={item.id ?? i} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#0A4162]">{item.title}</h3>
                            {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
