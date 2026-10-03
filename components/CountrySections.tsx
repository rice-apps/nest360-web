import Image from "next/image";
import PendingLink from "@/components/PendingLink";
import type { NewsItem, PageImage } from "@/lib/data/countries";
import { countryPageText as text } from "@/lib/data/countries/shared";

// "Our partners in <country>" and "Latest news" sections of a country page.

export function PartnersSection({
  heading,
  paragraph,
  logos,
  columns = 5,
}: {
  heading: string;
  paragraph: string;
  logos: PageImage[];
  columns?: 4 | 5;
}) {
  return (
    <section className="py-12">
      <h2 className="text-center text-2xl font-semibold text-brand-accent">{heading}</h2>
      <p className="mt-4 text-center text-lg font-light">{paragraph}</p>
      <ul
        className={`mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 ${
          columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"
        }`}
      >
        {logos.map((logo) => (
          <li key={logo.src} className="flex justify-center">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-auto max-h-20 w-auto max-w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LatestNews({ news }: { news: NewsItem[] }) {
  return (
    <section className="border-t border-brand-primary py-12">
      <h2 className="text-xl font-semibold tracking-wider text-brand-accent uppercase">
        {text.latestNewsHeading}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
        {news.map((item) => (
          <article key={item.href}>
            <PendingLink to={item.href} className="block w-full">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={250}
                className="aspect-[16/10] w-full object-cover"
              />
            </PendingLink>
            <h3 className="mt-4 font-medium text-brand-primary">
              <PendingLink to={item.href}>{item.title}</PendingLink>
            </h3>
            {item.excerpt && <p className="mt-2 text-sm font-light">{item.excerpt}</p>}
            <p className="mt-2 text-sm font-medium text-brand-primary uppercase">
              <PendingLink to={item.href}>{text.readMore}</PendingLink>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
