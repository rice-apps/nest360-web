import type { Metadata } from "next";
import Image from "next/image";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Annual Highlights | NEST360",
};

// Content recreated word for word from https://nest360.org/annual-highlights/
// Reports are listed in the same order as the live page.

const reports = [
  { label: "2025 Annual Highlights (PDF)", to: "/annual-highlights-2025", image: "/images/annual-highlights/2025-cover.jpg", width: 232, height: 300 },
  { label: "2022 Annual Highlights (PDF)", to: "/n360-annual-highlights-2022_final", image: "/images/annual-highlights/2022-cover.jpg", width: 791, height: 1024 },
  { label: "2020 Annual Highlights (PDF)", to: "/2020-impact-report", image: "/images/annual-highlights/2020-cover.jpg", width: 1933, height: 1095 },
  { label: "2024 Annual Highlights (PDF)", to: "/annual-highlights-2025_web", image: "/images/annual-highlights/2024-cover.jpg", width: 791, height: 1024 },
  { label: "2021 Annual Highlights (PDF)", to: "/nest360_highlights_2021_final", image: "/images/annual-highlights/2021-cover.jpg", width: 1200, height: 927 },
];

export default function AnnualHighlightsPage() {
  return (
    <main>
      <h2>Annual Highlights</h2>
      <PendingLink to="https://nest360.org/wp-content/uploads/2026/09/Annual-Highlights-2025.pdf">
        Download our 2025 Report (PDF)
      </PendingLink>
      <p>
        Our annual highlights bring our mission to life, provide information
        on our award-winning programs and technology advancements, and
        spotlight our partnerships with organizations in low-resource settings
        to fulfill our commitment to improving neonatal care.
      </p>

      {reports.map((report) => (
        <div key={report.label}>
          <Image
            src={report.image}
            alt={`Cover of the ${report.label.replace(" (PDF)", "")}`}
            width={report.width}
            height={report.height}
            style={{ width: 200, height: "auto" }}
          />
          <p>
            <PendingLink to={report.to}>{report.label}</PendingLink>
          </p>
        </div>
      ))}
    </main>
  );
}
