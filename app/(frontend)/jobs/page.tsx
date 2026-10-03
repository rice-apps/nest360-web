import type { Metadata } from "next";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Careers | NEST360",
};

// Content recreated word for word from https://nest360.org/jobs/

export default function JobsPage() {
  return (
    <main>
      <h1>Careers at NEST360</h1>
      <p>
        Do you have a passion for newborn and maternal health? Are you
        interested in joining the NEST360 alliance? View our available job
        postings below.
      </p>
      <p>
        <PendingLink to="https://www.sri-executive.com/opportunities/executive-director-7/">
          NEST360 Alliance Executive Director
        </PendingLink>
      </p>
    </main>
  );
}
