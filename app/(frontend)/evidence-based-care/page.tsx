import type { Metadata } from "next";
import Image from "next/image";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Evidence Building | NEST360",
};

// Content recreated word for word from https://nest360.org/evidence-based-care/

const steps = [
  {
    step: "Step 01",
    image: { src: "/images/evidence-based-care/step-01.png", width: 835, height: 834 },
    title: "Service Readiness Checklist",
    paragraphs: [
      "A rapid screening tool to ensure hospitals meet the minimum criteria for NEST technology installation.",
    ],
  },
  {
    step: "Step 02",
    image: { src: "/images/evidence-based-care/step-02.png", width: 835, height: 834 },
    title: "Health Facility Assessment",
    paragraphs: [
      "The Health Facility Assessment tool, co-designed with UNICEF, is used in partnership with the facility to identify gaps in quality of care and enable the facility to provide course correction and intervention.",
    ],
  },
  {
    step: "Step 03",
    image: { src: "/images/evidence-based-care/step-03.png", width: 180, height: 180 },
    title: "Installation & Training",
    paragraphs: [
      "We work with hospitals to help them access and install affordable newborn medical technologies and provide training and support to hospital staff for sustained quality newborn care.",
    ],
  },
  {
    step: "Step 04",
    label: "Data & Dashboard",
    image: { src: "/images/evidence-based-care/step-04.png", width: 834, height: 834 },
    title: "Quality Improvement Process & Tools",
    paragraphs: [
      "We work with governments to co-develop quality improvement tools and processes to track outcomes and quality of care for course correction.",
      "The Facility Quality Improvement Dashboard summarizes outcomes of clinical care enabling stakeholders to improve the quality of service.",
    ],
  },
  {
    step: "Step 05",
    image: { src: "/images/evidence-based-care/step-05.png", width: 834, height: 834 },
    title: "Investment Case",
    paragraphs: [
      "A flexible, modular investment case to support country champions to provide resources for sustained high-quality small and sick newborn care.",
    ],
  },
];

export default function EvidenceBasedCarePage() {
  return (
    <main>
      <h1>EVIDENCE BUILDING</h1>

      <section>
        <h2>Transform Health Systems</h2>
        <p>
          NEST360 works in partnership with hospitals, governments, educational
          institutions, professional societies, and national NGOs to establish
          sustainable, transformative, high-quality hospital care for newborns.
        </p>
        <Image
          src="/images/evidence-based-care/data-systems.png"
          alt="NEST360 data systems diagram"
          width={834}
          height={584}
          style={{ width: 400, height: "auto" }}
        />
        <Image
          src="/images/evidence-based-care/hospital-photo.jpg"
          alt="Newborn care in a NEST360 hospital"
          width={1080}
          height={720}
          style={{ width: 400, height: "auto" }}
        />
      </section>

      <section>
        <h2>Data-Driven Action</h2>
        <p>
          Small and Sick newborns are the most vulnerable, and their care is an
          important indicator of the quality and strength of any healthcare
          system. Through national partnerships, NEST360 transforms how data
          are captured in a healthcare facility to improve quality and measure
          progress in newborn survival and care.
        </p>
        <p>
          Learn more about the{" "}
          <PendingLink to="/project/nest-it-dashboard">
            NEST360 Implementation Tracker
          </PendingLink>
          , NEST-IT.
        </p>
        <iframe
          src="https://www.youtube.com/embed/PJOM8F46WGo"
          title="The NEST360 Implementation Tracker (NEST-IT) Dashboard"
          width={560}
          height={315}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>

      <section>
        <h2>Journey of a Facility</h2>
        {steps.map((step) => (
          <div key={step.step}>
            <Image
              src={step.image.src}
              alt={step.title}
              width={step.image.width}
              height={step.image.height}
              style={{ width: 150, height: "auto" }}
            />
            <h3>{step.step}</h3>
            {step.label && <p>{step.label}</p>}
            <h4>{step.title}</h4>
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
        <p>
          <strong>Newborn Data Collection</strong>{" "}
          <em>
            occurs throughout Baseline Assessment, Implementation, and Sustained
            Use.
          </em>
        </p>
        <p>
          The neonatal inpatient data set monitors key variables to provide a
          snapshot of every newborn for a comparable assessment of the
          intervention’s impact and quality of care.
        </p>
      </section>

      <section>
        <Image
          src="/images/evidence-based-care/nurses-with-equipment.jpg"
          alt="Nurses with newborn care equipment"
          width={1344}
          height={896}
          style={{ width: 400, height: "auto" }}
        />
        <blockquote>
          <p>
            NEST360 has come to revolutionize how we deliver newborn care. Now
            everyone—including hospital staff, hospital administration, policy
            makers, county leaders, and supply chain managers—is talking about
            newborn care because we have created an environment where there is
            continuous conversation about improvement, change, and
            collaboration.
          </p>
          <p>Clinical Training Director, NEST360 Kenya</p>
        </blockquote>
      </section>

      <section>
        <h2>Sustainable National Change</h2>
        <p>
          NEST360 supports the adoption of national policies, guidelines,
          standards, and training for comprehensive newborn care that are
          aligned with the sustainable development goals, and Every Newborn
          Targets, and in support of WHO standards.
        </p>
        <PendingLink to="http://www.newborntoolkit.org">
          <Image
            src="/images/evidence-based-care/toolkit-cog.gif"
            alt="Implementation Toolkit for Small and Sick Newborn Care"
            width={631}
            height={701}
            style={{ width: 200, height: "auto" }}
            unoptimized
          />
        </PendingLink>
      </section>

      <section>
        <h2>Implementation Toolkit for Small and Sick Newborn Care</h2>
        <p>
          Implementation Toolkit for Small &amp; Sick Newborn Care: NEST360 and
          UNICEF co-developed a global Implementation Toolkit for Small &amp;
          Sick Newborn Care that brings together best practices, resources, and
          learnings for implementing small and sick newborn care services. It
          is written for implementers, by implementers, drawing on experiences
          from a multi-partner consortium.
        </p>
        <p>It is continuously updated to include new resources, events, and materials.</p>
        <PendingLink to="https://newborntoolkit.org/">view the toolkit</PendingLink>
      </section>
    </main>
  );
}
