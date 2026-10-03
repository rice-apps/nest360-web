import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect | NEST360",
};

// Content recreated word for word from https://nest360.org/connect/
// The live page's contact map is only a plugin placeholder image (its email
// tooltips are hidden), so it is left out. The live Ethiopia entry also has an
// empty extra link to tanzania@nest360.org, which is dropped.

const countryContacts = [
  { country: "Ethiopia", name: "Mehiret Abate", email: "Mehiret.abate@aau.edu.et", phone: "+251 911 960 741" },
  { country: "Kenya", name: "George Okello", email: "kenya@nest360.org", phone: "+254 780 521 314" },
  { country: "Malawi", name: "Samuel Ngwala", email: "malawi@nest360.org", phone: "+265 018 1194" },
  { country: "Nigeria", name: "Opeyemi Odedere", email: "nigeria@nest360.org", phone: "+234 012 915 962" },
  { country: "Tanzania", name: "Mariam Johari", email: "tanzania@nest360.org", phone: "+255 222 774 756" },
];

export default function ConnectPage() {
  return (
    <main>
      <h1>Connect</h1>
      <h1>Have a question?</h1>

      <form>
        <p>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Name" />
        </p>
        <p>
          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            name="email"
            type="text"
            placeholder="Email Address"
          />
        </p>
        <p>
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Message" />
        </p>
        <button type="submit" disabled title="Form must be connected">
          Submit
        </button>
      </form>

      <section>
        <p>Country Contacts</p>
        {countryContacts.map((contact) => (
          <div key={contact.country}>
            <h5>{contact.country}</h5>
            <p>{contact.name}</p>
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <p>{contact.phone}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
