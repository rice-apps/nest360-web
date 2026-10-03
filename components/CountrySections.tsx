import Image from "next/image";
import PendingLink from "@/components/PendingLink";
import type { NewsItem, PageImage } from "@/lib/data/countries";

// "Our partners in <country>" and "Latest news" sections shared by every
// country page (including /sll360). Layout mirrors the nest360.org country
// pages: centered partner intro with a row of logos, then a divider and a
// three-across grid of news cards.

export function PartnersSection({
  heading,
  paragraph,
  logos,
  columns = 5,
}: {
  heading: string;
  paragraph: string;
  logos: PageImage[];
  // nest360.org lays Malawi's logos out four per row; others are five.
  columns?: 4 | 5;
}) {
  return (
    <section className="mx-auto w-4/5 max-w-[1280px] pt-10 pb-24 font-poppins">
      <h2 className="text-center text-[22px] font-semibold text-nest-teal">
        {heading}
      </h2>
      <p className="mt-6 text-center text-lg font-light text-black">
        {paragraph}
      </p>
      <ul
        className={`mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 ${
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
              className="h-auto max-h-[90px] w-auto max-w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LatestNews({ news }: { news: NewsItem[] }) {
  return (
    <section className="mx-auto w-4/5 max-w-[1280px] pb-16 font-poppins">
      <hr className="border-nest-navy" />
      <h4 className="mt-16 text-xl font-semibold tracking-[2px] text-nest-teal">
        LATEST NEWS
      </h4>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-3">
        {news.map((item) => (
          <article key={item.href}>
            <PendingLink to={item.href} className="block w-full">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={250}
                className="aspect-[359/224] w-full object-cover"
              />
            </PendingLink>
            <h5 className="mt-5 text-[15px] leading-[18px] font-medium text-nest-navy">
              <PendingLink to={item.href}>{item.title}</PendingLink>
            </h5>
            {item.excerpt && (
              <p className="mt-3 text-[13px] leading-[18px] font-light text-black">
                {item.excerpt}
              </p>
            )}
            <p className="mt-3 text-[13px] font-medium text-nest-navy uppercase">
              <PendingLink to={item.href}>Read More</PendingLink>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
