// Mailing-list signup recreated from the Mailchimp form on nest360.org
// (/resources and /newsletters). Not connected yet: no action, submit disabled.
const interests = [
  "All New Resources",
  "Clinical Resources",
  "Technical Resources",
  "Newborn Technology Landscape",
  "COVID-19 Resources",
  "Newsletters",
];

export default function SubscribeForm() {
  return (
    <form>
      <h2>Subscribe</h2>
      <p>* indicates required</p>
      <p>
        <label htmlFor="subscribe-name">Full Name *</label>{" "}
        <input type="text" id="subscribe-name" name="FNAME" required />
      </p>
      <p>
        <label htmlFor="subscribe-email">Email Address *</label>{" "}
        <input type="email" id="subscribe-email" name="EMAIL" required />
      </p>
      <p>
        <label htmlFor="subscribe-profession">
          Profession (i.e. Engineer, Clinician, Student)
        </label>{" "}
        <input type="text" id="subscribe-profession" name="PROFESSION" />
      </p>
      <fieldset>
        <legend>What do you wish to stay up-to-date on?</legend>
        <ul>
          {interests.map((interest) => (
            <li key={interest}>
              <label>
                <input type="checkbox" name="interests" value={interest} />{" "}
                {interest}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <button type="submit" disabled title="Form must be connected">
        Subscribe
      </button>
    </form>
  );
}
