import Image from "next/image";
import { LatestNews, PartnersSection } from "@/components/CountrySections";
import PendingLink from "@/components/PendingLink";
import SiteLink from "@/components/SiteLink";
import type { CountryPageData } from "@/lib/data/countries";
import { countryPageText as text } from "@/lib/data/countries/shared";

// Layout for every country page (/sll360, /kenya, ...). Country content comes
// from that country's file in lib/data/countries; wording shared by all
// country pages comes from lib/data/countries/shared.ts.
export default function CountryPage({ country }: { country: CountryPageData }) {
  const { contact, training, whereWeWork, partners } = country;

  return (
    <main className="page-container py-12">
      <h1 className="text-3xl font-semibold text-brand-primary">{country.heading}</h1>
      <p className="mt-4 text-lg font-light">{country.intro}</p>

      <section className="mt-10">
        <p>
          {text.technologiesIntro.before}{" "}
          <PendingLink to={text.technologiesIntro.linkTo}>{text.technologiesIntro.linkText}</PendingLink>{" "}
          {text.technologiesIntro.after}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {country.technologies.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-brand-primary">{group.category}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {group.devices.map((device) => (
                  <li key={device}>{device}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {country.photos.map((photo) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        ))}
      </div>

      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <p>{contact.intro}</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={contact.photo.src}
              alt={contact.photo.alt}
              width={contact.photo.width}
              height={contact.photo.height}
              className="h-32 w-32 rounded-full object-cover"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-brand-primary">{contact.name}</h3>
              <p className="font-medium">{contact.role}</p>
              {contact.phone && (
                <p>
                  {text.contactLabels.phone} {contact.phone}
                </p>
              )}
              <p>
                {text.contactLabels.email}{" "}
                <a href={`mailto:${contact.email}`} className="underline">
                  {contact.email}
                </a>
              </p>
              <p>
                {text.contactLabels.address} {contact.address}
              </p>
              {contact.website && (
                <p>
                  {text.contactLabels.website}{" "}
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="underline">
                    {contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-primary">{text.training.heading}</h3>
          <div className="mt-2 space-y-2">
            {training.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                {text.training.tableHeadings.map((heading) => (
                  <th key={heading} className="py-2 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">{text.training.biomedicalEngineersLabel}</td>
                <td className="py-2">{training.biomedicalEngineers}</td>
              </tr>
              <tr>
                <td className="py-2">{text.training.cliniciansLabel}</td>
                <td className="py-2">{training.clinicians}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm">{training.footnote}</p>
        </div>
      </section>

      <section className="mt-12 bg-surface-muted p-6 text-center">
        <h2 className="text-xl font-semibold text-brand-primary">{text.resources.heading}</h2>
        <p className="mt-2">{text.resources.text}</p>
        <SiteLink
          link={text.resources.link}
          className="mt-4 inline-block rounded-full bg-brand-accent px-5 py-2 font-medium text-white hover:opacity-90"
        />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-brand-primary">{whereWeWork.heading}</h2>
        <div className="mt-4 space-y-2">
          {whereWeWork.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {whereWeWork.footnote && <p className="text-sm">{whereWeWork.footnote}</p>}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Image
            src={whereWeWork.map.src}
            alt={whereWeWork.map.alt}
            width={whereWeWork.map.width}
            height={whereWeWork.map.height}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {whereWeWork.groups.map((group) => (
              <div key={group.heading}>
                <h3 className="font-semibold text-brand-primary">{group.heading}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {group.items.map((item, i) =>
                    typeof item === "string" ? (
                      <li key={i}>{item}</li>
                    ) : (
                      <li key={i} className="list-none italic">
                        {item.note}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersSection
        heading={partners.heading}
        paragraph={partners.paragraph}
        logos={partners.logos}
        columns={partners.columns}
      />

      <LatestNews news={country.news} />
    </main>
  );
}
