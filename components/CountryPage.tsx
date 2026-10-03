import Image from "next/image";
import PendingLink from "@/components/PendingLink";
import type { CountryPageData } from "@/lib/data/countries";

// Renders a country page in the same section order as the nest360.org
// country pages. Content comes from lib/data/countries.ts.
export default function CountryPage({ country }: { country: CountryPageData }) {
  const { contact, training, whereWeWork, partners } = country;

  return (
    <main>
      <h1>{country.heading}</h1>
      <p>{country.intro}</p>
      <p>
        Every hospital implementing NEST360 has installed a package of{" "}
        <PendingLink to="/qualified-technologies">NEST360 Qualified</PendingLink>{" "}
        technologies that includes a selection of devices from each of the
        categories listed below. The specific device types may vary between
        hospitals based on their individual needs and requirements.
      </p>

      <section>
        {country.technologies.map((group) => (
          <div key={group.category}>
            <h4>{group.category}</h4>
            <ul>
              {group.devices.map((device) => (
                <li key={device}>{device}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {country.photos.map((photo) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          style={{ width: 400, height: "auto" }}
        />
      ))}

      <section>
        <p>{contact.intro}</p>
        <Image
          src={contact.photo.src}
          alt={contact.photo.alt}
          width={contact.photo.width}
          height={contact.photo.height}
          style={{ width: 150, height: "auto" }}
        />
        <h3>{contact.name}</h3>
        <h4>{contact.role}</h4>
        {contact.phone && <p>Phone: {contact.phone}</p>}
        <p>
          Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <p>Address: {contact.address}</p>
      </section>

      <section>
        <h4>Pre-service and in-service education</h4>
        {training.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <table>
          <thead>
            <tr>
              <th>Category of personnel</th>
              <th>Number trained</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Biomedical Engineers</td>
              <td>{training.biomedicalEngineers}</td>
            </tr>
            <tr>
              <td>Clinicians</td>
              <td>{training.clinicians}</td>
            </tr>
          </tbody>
        </table>
        <p>{training.footnote}</p>
      </section>

      <section>
        <h2>ACCESS NEST360 CLINICAL AND TECHNICAL RESOURCES</h2>
        <p>
          Our publicly available clinical and technical education materials
          are designed to be adapted and embedded in locally-developed
          in-service and pre-service training courses.
        </p>
        <PendingLink to="/resources">Our Resources</PendingLink>
      </section>

      <section>
        <h2>{whereWeWork.heading}</h2>
        {whereWeWork.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Image
          src={whereWeWork.map.src}
          alt={whereWeWork.map.alt}
          width={whereWeWork.map.width}
          height={whereWeWork.map.height}
          style={{ width: 500, height: "auto" }}
        />
        {whereWeWork.groups.map((group) => (
          <div key={group.heading}>
            <h4>{group.heading}</h4>
            <ul>
              {group.items.map((item, i) =>
                typeof item === "string" ? (
                  <li key={i}>{item}</li>
                ) : (
                  <li key={i}>
                    <em>{item.note}</em>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>{partners.heading}</h2>
        <p>{partners.paragraph}</p>
        {partners.logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            style={{ width: 150, height: "auto" }}
          />
        ))}
      </section>

      <section>
        <h4>LATEST NEWS</h4>
        {country.news.map((item) => (
          <article key={item.href}>
            <PendingLink to={item.href}>
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={250}
                style={{ width: 300, height: "auto" }}
              />
            </PendingLink>
            <h4>
              <PendingLink to={item.href}>{item.title}</PendingLink>
            </h4>
            {item.excerpt && <p>{item.excerpt}</p>}
            <PendingLink to={item.href}>Read More</PendingLink>
          </article>
        ))}
      </section>
    </main>
  );
}
