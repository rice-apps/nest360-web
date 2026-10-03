import type { Metadata } from "next";
import PendingLink from "@/components/PendingLink";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Newsletters | NEST360",
};

// Content recreated word for word from https://nest360.org/newsletters/
// ("suscribe" is spelled that way on the live site.)
const archive = [
  {
    year: "2025",
    issues: [
      { title: "New Year Newsletter", href: "https://mailchi.mp/260a499cdbbd/nest360-quarterly-newsletter-11036178" },
      { title: "World Health Day Newsletter", href: "https://mailchi.mp/6dc31d7514ed/nest360-quarterly-newsletter-11037932" },
      { title: "KMC Day Newsletter", href: "https://mailchi.mp/332aff2bbad9/nest360-quarterly-newsletter-11038665" },
      { title: "End of Year Newsletter", href: "https://mailchi.mp/61376f3e8f6f/nest360-quarterly-newsletter-11043433" },
    ],
  },
  {
    year: "2024",
    issues: [
      { title: "Mid-Year Newsletter", href: "https://mailchi.mp/5f29245b3f32/nest360-quarterly-newsletter-10699401" },
    ],
  },
  {
    year: "2023",
    issues: [
      { title: "Mid-Year Newsletter", href: "https://mailchi.mp/c2e0f317f1f6/nest360-quarterly-newsletter-10698213" },
      { title: "End of Year Newsletter", href: "https://mailchi.mp/88268b09e329/nest360-quarterly-newsletter-10676010" },
      { title: "World Prematurity Day Newsletter", href: "https://mailchi.mp/7b6f65a8c441/nest360-quarterly-newsletter-10677686" },
    ],
  },
  {
    year: "2022",
    issues: [
      { title: "Q1 Newsletter", href: "https://mailchi.mp/64357cb67d70/nest360-quarterly-newsletter-6325081" },
      { title: "Q2 Newsletter", href: "https://mailchi.mp/638cd3b766e3/nest360-quarterly-newsletter-8992117" },
      { title: "Q3 & Q4 Newsletter", href: "https://mailchi.mp/60884ffd6963/nest360-quarterly-newsletter-10161781" },
    ],
  },
  {
    year: "2021",
    issues: [
      { title: "Q1 Newsletter", href: "https://mailchi.mp/b92ebf82d4ef/nest360-newsletter-1" },
      { title: "Q2 Newsletter", href: "https://mailchi.mp/a796d8f1adcb/nest360-newsletter-4138946" },
      { title: "Q3 Newsletter", href: "https://mailchi.mp/01337a067df7/nest360-quarterly-newsletter" },
      { title: "Q4 Newsletter", href: "https://mailchi.mp/2f8c30b4cee0/nest360-quarterly-newsletter-4201638" },
    ],
  },
];

export default function NewslettersPage() {
  return (
    <main>
      <h1>Newsletters</h1>
      <p>
        Each quarter we update our community on the accomplishments and
        highlights from our team. Our highlights include stories from our
        country teams, new qualified newborn technologies, clinical studies,
        events, conferences and more!
      </p>
      <p>
        Follow along, and suscribe! You can also view our archived newsletters
        below.
      </p>

      {archive.map((group) => (
        <section key={group.year}>
          <h5>{group.year}</h5>
          <ul>
            {group.issues.map((issue) => (
              <li key={issue.href}>
                <PendingLink to={issue.href}>{issue.title}</PendingLink>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <SubscribeForm />
    </main>
  );
}
