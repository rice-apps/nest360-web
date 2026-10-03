import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import PendingLink from "@/components/PendingLink";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Resources | NEST360",
};

// Content recreated word for word from https://nest360.org/resources/
// Every resource card links to a page or file we haven't built yet, so the
// links are PendingLinks. Search and subscribe forms aren't connected.

interface ResourceCard {
  title: string;
  to: string;
  image: { src: string; width: number; height: number };
  description: ReactNode;
}

const sections: { id: string; heading: string; cards: ResourceCard[] }[] = [
  {
    id: "clinical-and-technical",
    heading: "Resources for healthcare professionals & BMETs",
    cards: [
      {
        title: "Training Videos",
        to: "/project/training-videos",
        image: { src: "/images/resources/training-videos.jpg", width: 568, height: 468 },
        description: "Training videos demonstrate model-specific equipment setup, use, and maintenance and are used as training aids in clinical and technical training.",
      },
      {
        title: "BME/T Job Aids",
        to: "/project/technical-job-aids",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "BME/T job aids act as a reference for biomedical engineers and technicians during practical demonstrations, learning and technical use.",
      },
      {
        title: "BME Workshop Guidelines",
        to: "/project/bmet-workshop-guidelines",
        image: { src: "/images/resources/bme-workshop-guidelines.jpg", width: 1000, height: 599 },
        description: "The BME Workshop Guidelines provide an overview of setup & workflow for BME activities in secondary-level healthcare facilities.",
      },
      {
        title: "Warming Series",
        to: "/project/warming-series",
        image: { src: "/images/resources/warming-series.jpg", width: 1200, height: 800 },
        description: "A series of posters recommending how to keep babies warm, and how to maintain room temperature–for use in the newborn care unit and labour ward.",
      },
      {
        title: "Orientation for Staff Video",
        to: "https://www.youtube.com/watch?v=A3g8NtfLTSM&ab_channel=NEST360",
        image: { src: "/images/resources/orientation-for-staff-video.jpg", width: 1134, height: 640 },
        description: "This orientation video introduces healthcare workers and students to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.",
      },
      {
        title: "Clinical Job Aids",
        to: "/project/clinical-job-aids",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "Clinical job aids act as a reference for hospital staff and students during practical demonstrations, learning, and clinical use.",
      },
      {
        title: "Oxygen Cylinder Safety",
        to: "/project/oxygen-cylinder-safety-guidelines",
        image: { src: "/images/resources/oxygen-cylinder-safety.jpg", width: 1200, height: 800 },
        description: "This job aid outlines how to correctly handle oxygen cylinders to prevent major accidents and harm from patients and staff in the newborn care unit.",
      },
      {
        title: "Course Registration: Mastering the Use of CPAP Devices",
        to: "/project/cpap-course",
        image: { src: "/images/resources/course-registration-mastering-the-use-of-cpap-devi.jpg", width: 516, height: 486 },
        description: "Designed for new staff and students, the course offers a strong foundation in CPAP use. This is a WCEA-accredited course.",
      },
      {
        title: "Clinical Modules",
        to: "/project/clinical-modules",
        image: { src: "/images/resources/clinical-modules.jpg", width: 550, height: 320 },
        description: "Clinical education modules prepare healthcare staff and students to understand when and how to safely and effectively use equipment essential to newborn care.",
      },
      {
        title: "Clinical Scenarios",
        to: "/project/clinical-scenarios",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "Clinical education scenarios provide example situations for facilitated discussions on the clinical use of technologies for newborn care in resource limited settings.",
      },
      {
        title: "Generic Instructor Course (GIC) & ToT",
        to: "/project/gic-tot",
        image: { src: "/images/resources/generic-instructor-course-gic-tot.jpg", width: 1200, height: 762 },
        description: "The Generic Instructor Course (GIC) is designed to train potential instructors in how to teach providers’ course material.",
      },
      {
        title: "BME/T Modules",
        to: "/project/technical-modules",
        image: { src: "/images/resources/bme-t-modules.jpg", width: 550, height: 320 },
        description: "BME/T education modules prepare biomedical technicians on the technical use of technologies for newborn care in resource limited settings.",
      },
      {
        title: "BME/T Scenarios",
        to: "/project/technical-scenarios",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "BME/T education scenarios provide example situations for facilitated discussions on the technical use of technologies for newborn care in resource limited settings.",
      },
      {
        title: "IPC Ward Posters",
        to: "/project/ipc-ward-posters",
        image: { src: "/images/resources/ipc-ward-posters.jpg", width: 350, height: 250 },
        description: "A collection of posters on infection prevention and control to be used in newborn units and health facilities.",
      },
    ],
  },
  {
    id: "technology",
    heading: "Resources for innovators & manufacturers",
    cards: [
      {
        title: "Target Product Profiles for Newborn Care",
        to: "/project/target-product-profiles",
        image: { src: "/images/resources/target-product-profiles-for-newborn-care.png", width: 568, height: 468 },
        description: (
          <>
            In collaboration with{" "}
            <PendingLink to="https://www.unicef.org/supply/documents/target-product-profile-newborn-care">
              UNICEF
            </PendingLink>
            , NEST360 developed the target product profiles (TPPs) which list a
            proposed set of performance &amp; operational characteristics for 16
            newborn products.
          </>
        ),
      },
      {
        title: "Innovation Landscape",
        to: "/project/innovation-landscape",
        image: { src: "/images/resources/innovation-landscape.jpg", width: 1200, height: 982 },
        description: "A document that features solutions designed by African innovators that solve local healthcare challenges. This landscape is a resource for investors interested in supporting rising leaders in Africa.",
      },
      {
        title: "NEST360 Qualified Technologies for Small & Sick Newborn Care",
        to: "/project/qualified-technologies",
        image: { src: "/images/resources/nest360-qualified-technologies-for-small-sick-newb.jpg", width: 568, height: 468 },
        description: "The NEST360 Qualified Technologies are a lists of newborn care technologies best suited for use in low-resource setting hospitals, including being effective, affordable, rugged, and simple to use.",
      },
      {
        title: "Innovation Landscape Submission Form",
        to: "https://forms.gle/iraoqS4MLc4BEHHJ7",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "If you have an innovation to be considered for inclusion in the next edition of the Innovation Landscape, complete the Submission Form!",
      },
      {
        title: "Newborn & Maternal Technology Landscape",
        to: "https://www.technologylandscape.org/#new_tab",
        image: { src: "/images/resources/newborn-maternal-technology-landscape.jpg", width: 1200, height: 982 },
        description: "A compendium of newborn & maternal healthcare technologies, both commercially available and in development, suited for use in resource-limited settings.",
      },
      {
        title: "Newborn & Maternal Technology Landscape Survey",
        to: "/project/survey-template",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "Do you have a technology that you would like to be considered for the next edition of the Newborn & Maternal Technology Landscape? If so, please fill out our survey form.",
      },
    ],
  },
  {
    id: "implementation",
    heading: "Resources for implementors",
    cards: [
      {
        title: "Implementation Toolkit",
        to: "http://www.newborntoolkit.org",
        image: { src: "/images/resources/implementation-toolkit.jpg", width: 550, height: 450 },
        description: "The Implementation Toolkit for small and sick newborn care, codesigned by UNICEF and NEST360, is an open-access, online toolkit enabling implementors to reach every newborn.",
      },
      {
        title: "NEST360 Change Package",
        to: "/project/nest360-change-package",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "The NEST360 change package supports quality improvement by linking common gaps in newborn care to practical change ideas used by NEST360-supported hospitals.",
      },
      {
        title: "Health Facility Assessment (HFA)",
        to: "/project/hfa",
        image: { src: "/images/resources/health-facility-assessment-hfa.jpg", width: 550, height: 450 },
        description: "The HFA resources are developed to assess service readiness for small and sick newborn care. They are codesigned by UNICEF, African Governments and other key experts.",
      },
      {
        title: "NEST360 Implementation Tracker (NEST-IT)",
        to: "/project/nest-it-dashboard",
        image: { src: "/images/resources/nest360-implementation-tracker-nest-it.jpg", width: 936, height: 484 },
        description: "The NEST360 Implementation Tracker (NEST-IT) dashboard is an open-source data platform designed to support the improvement of care for small and sick newborns by turning routine clinical and hospital data into actionable insights for decision-makers at every level of the health system.",
      },
      {
        title: "Neonatal Inpatient Dataset (NID)",
        to: "/project/nid",
        image: { src: "/images/resources/neonatal-inpatient-dataset-nid.jpg", width: 550, height: 450 },
        description: "Co-designed to assess the quality of care for each newborn, with the purpose of informing quality improvement, measuring impact, and enabling actionable initiatives in neonatal units providing Level 2+CPAP care.",
      },
      {
        title: "Newborn Mortality Interim Results – Updated May 2026",
        to: "/project/nest360-mortality-interim-results-for-africas-newborns",
        image: { src: "/images/resources/survey-placeholder.jpg", width: 1200, height: 982 },
        description: "This is an updated interim results report of the data showing a statistically significant mortality reduction for admitted newborns across 65 hospitals in Kenya, Malawi, Nigeria, & Tanzania, comparing September 2025 with 2021/2022.",
      },
    ],
  },
  {
    id: "families",
    heading: "Resources for families",
    cards: [
      {
        title: "Orientation for New Families Video",
        to: "https://www.youtube.com/watch?v=fc4_SfD9BS4",
        image: { src: "/images/resources/orientation-for-new-families-video.jpg", width: 1134, height: 638 },
        description: "This orientation video introduces new families and parents to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main>
      <h2>Resources</h2>
      <form>
        <label htmlFor="resources-search">Search for:</label>{" "}
        <input type="text" id="resources-search" name="s" />{" "}
        <button type="submit" disabled title="Form must be connected">
          Search
        </button>
      </form>
      <p>
        Our resources support clinicians, engineers, and administrators to
        implement an evidence-based model for sustainable, high-quality
        hospital-based newborn care in limited-resource settings.
      </p>
      <ul>
        <li>
          <a href="#clinical-and-technical">For healthcare professionals</a>
        </li>
        <li>
          <a href="#technology">For innovators &amp; manufacturers</a>
        </li>
        <li>
          <a href="#implementation">For implementors</a>
        </li>
        <li>
          <a href="#families">For families</a>
        </li>
        <li>
          <PendingLink to="/project/dashboards">Dashboards</PendingLink>
        </li>
      </ul>
      <p>
        Want to stay up to date on our latest resources? Provide your email
        below for regular updates.
      </p>
      <SubscribeForm />

      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.heading}</h2>
          {section.cards.map((card) => (
            <article key={card.title}>
              <PendingLink to={card.to}>
                <Image
                  src={card.image.src}
                  alt={`${card.title} preview`}
                  width={card.image.width}
                  height={card.image.height}
                  style={{ width: 250, height: "auto" }}
                />
              </PendingLink>
              <h4>
                <PendingLink to={card.to}>{card.title}</PendingLink>
              </h4>
              <p>{card.description}</p>
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}
