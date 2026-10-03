import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Education | NEST360",
};

// Content recreated word for word from https://nest360.org/education/
// nest360.org shows the four Invention Education cards twice (the first copy
// spells "Innovation Ecosytsem"); they appear once here, correctly spelled.

const inventionCards = [
  {
    title: "Innovation Ecosystem",
    icon: "/images/education/icon-innovation-ecosystem.png",
    text: "Inventors need knowledge, support, and resources to explore different solutions to the world’s greatest challenges. NEST360 partners with technical universities to establish engineering design studios equipped with curriculum, infrastructure, and tools to rapidly prototype solutions to real world problems.",
  },
  {
    title: "Faculty Leadership",
    icon: "/images/education/icon-faculty-leadership.png",
    text: "Faculty play an important role in shaping, inspiring, and preparing the inventors of tomorrow. We lead faculty workshops where they can further their knowledge of designing engineering courses, improving invention curriculum and can exchange ideas with fellow educators.",
  },
  {
    title: "Design for Scale",
    icon: "/images/education/icon-design-for-scale.png",
    text: "Global health technologies must account for the design challenges in low-resource settings, such as cost, suitability for the environment, and scalability for commercial production. Our curricula are designed to lead early technology development towards commercialization while addressing the design challenges for low-resource settings.",
  },
  {
    title: "Community Connection",
    icon: "/images/education/icon-community-connection.png",
    text: "Bringing a product from the lab-bench to everyday use takes a village. Invention education programs connect student inventors with local and international entrepreneurs, industries, and non-profit organizations to develop technologies that reach under-served and under-resourced communities.",
  },
];

const designStudioImages = [
  { src: "/images/education/design-studio-2.png", width: 423, height: 317 },
  { src: "/images/education/design-studio-3.png", width: 423, height: 317 },
  { src: "/images/education/design-studio-photo-1.jpg", width: 2560, height: 1920 },
  { src: "/images/education/design-studio-1.png", width: 423, height: 317 },
  { src: "/images/education/design-studio-4.png", width: 423, height: 317 },
  { src: "/images/education/design-studio-photo-2.jpg", width: 2560, height: 1441 },
];

export default function EducationPage() {
  return (
    <main>
      <h1>EDUCATION</h1>

      <section>
        <h2>Clinical and Technical Training</h2>
        <p>
          We work in partnership with national governments, professional
          societies, and academic institutions to develop a pre-service and
          in-service training package to strengthen hands-on education for the
          healthcare professionals and biomedical engineers who support quality
          newborn care and device maintenance.
        </p>
        <p>
          Our publicly available clinical and biomedical education materials
          are designed so that they can be adapted and embedded in
          locally-developed in-service and pre-service training courses.
        </p>
        <Link href="/resources">All Resources</Link>
        <p>Among our clinical and technical resources, you will find:</p>
        <table>
          <tbody>
            <tr>
              <td>
                <p>Clinical</p>
                <ul>
                  <li>
                    <PendingLink to="/project/clinical-modules">Clinical Modules</PendingLink>
                  </li>
                  <li>
                    <PendingLink to="/project/clinical-scenarios">Clinical Scenarios</PendingLink>
                  </li>
                  <li>
                    <PendingLink to="/project/clinical-job-aids">Clinical Job Aids</PendingLink>
                  </li>
                </ul>
                <p>Biomedical</p>
                <ul>
                  <li>
                    <PendingLink to="/project/technical-modules">Technical Modules</PendingLink>
                  </li>
                  <li>
                    <PendingLink to="/project/technical-scenarios">Technical Scenarios</PendingLink>
                  </li>
                </ul>
              </td>
              <td>
                <p>Online Courses</p>
                <ul>
                  <li>
                    <PendingLink to="/project/training-videos">Training Videos</PendingLink>
                  </li>
                </ul>
                <p>GIC Courses</p>
                <ul>
                  <li>
                    <PendingLink to="/project/gic">Generic Instructor Course</PendingLink>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <Image
          src="/images/countries/kenya.jpeg"
          alt="NEST360 first installed in Kenya in 2020."
          width={2048}
          height={1365}
          style={{ width: 400, height: "auto" }}
        />
      </section>

      <section>
        <h2>Invention Education</h2>
        <p>
          NEST360’s Invention Education program enables students and faculty to
          develop and deliver inventions that solve local and global challenges
          through international collaboration among universities, industries,
          hospitals, and non-profit organizations.
        </p>
        {inventionCards.map((card) => (
          <div key={card.title}>
            <Image src={card.icon} alt="" width={124} height={125} style={{ width: 62, height: "auto" }} />
            <h4>{card.title}</h4>
            <p>{card.text}</p>
          </div>
        ))}
        <p>
          As of December 2025, The Invention Education Africa program has
          reached over 2,300 students and faculty, training 170 faculty members
          in active learning and engineering design strategies.
        </p>
      </section>

      <section>
        <h2>See Our Design Studios</h2>
        <p>
          NEST360 is building an ecosystem of innovators to create the next
          generation of technologies to support newborn care and other global
          health needs. In partnership with local universities, we have
          established six design studios in Ethiopia, Malawi, Nigeria, and
          Tanzania.
        </p>
        {designStudioImages.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            alt="NEST360 design studio"
            width={image.width}
            height={image.height}
            style={{ width: 300, height: "auto" }}
          />
        ))}
        <PendingLink to="https://nest360.org/wp-content/uploads/2022/12/IvE-Overview_2022.pdf">
          Learn More
        </PendingLink>
      </section>
    </main>
  );
}
