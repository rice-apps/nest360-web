import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Leadership | NEST360",
};

// Content recreated word for word from https://nest360.org/our-leadership/
// Names and affiliations are kept exactly as on the live site, including
// "Araya Medhanyle" and Natasha Rhoda / Mekdes Shifeta having no affiliation.

interface Leader {
  name: string;
  affiliation?: string;
  image: string;
  width: number;
  height: number;
}

const steeringCommittee: Leader[] = [
  { name: "Msandeni Chiume", affiliation: "Kamuzu Central Hospital Malawi", image: "/images/our-leadership/msandeni-chiume.jpg", width: 625, height: 625 },
  { name: "Abiy Seifu Estifanos", affiliation: "Addis Ababa University Ethiopia", image: "/images/countries/ethiopia/abiy-seifu-estifanos.jpg", width: 625, height: 625 },
  { name: "Chinyere Ezeaka", affiliation: "University of Lagos Nigeria", image: "/images/our-leadership/chinyere-ezeaka.jpg", width: 625, height: 625 },
  { name: "Joy Lawn", affiliation: "LSHTM Global – The United Kingdom", image: "/images/our-leadership/joy-lawn.png", width: 625, height: 625 },
  { name: "William Macharia", affiliation: "Aga Khan University Kenya", image: "/images/our-leadership/william-macharia.png", width: 625, height: 625 },
  { name: "Nahya Salim Masoud", affiliation: "Muhimbili University of Health & Allied Sciences Tanzania", image: "/images/our-leadership/nahya-salim-masoud.jpg", width: 625, height: 625 },
  { name: "Maria Oden", affiliation: "Rice360 Global – United States", image: "/images/our-leadership/maria-oden.png", width: 625, height: 625 },
  { name: "Kara Palamountain", affiliation: "Northwestern University Global – United States", image: "/images/our-leadership/kara-palamountain.jpg", width: 625, height: 625 },
  { name: "Rebecca Richards-Kortum", affiliation: "Rice360 Global – United States", image: "/images/our-leadership/rebecca-richards-kortum.jpg", width: 625, height: 625 },
];

const countryLeaders: Leader[] = [
  { name: "Mehiret Adillo", affiliation: "Addis Ababa University, SLL360 Ethiopia", image: "/images/our-leadership/mehiret-adillo.jpg", width: 450, height: 450 },
  { name: "Aba Asibon", affiliation: "NEST360 Technical Advisory Team Global – Ghana", image: "/images/our-leadership/aba-asibon.jpg", width: 625, height: 625 },
  { name: "Christine Bohne", affiliation: "Rice360 Global – Tanzania", image: "/images/our-leadership/christine-bohne.jpg", width: 625, height: 625 },
  { name: "Fitsum Woldegabriel Belay", affiliation: "Hawassa University Ethiopia", image: "/images/our-leadership/fitsum-woldegabriel-belay.png", width: 625, height: 625 },
  { name: "Sara Desai", affiliation: "NEST360 Technical Advisory Team Global – United States", image: "/images/our-leadership/sara-desai.jpg", width: 800, height: 800 },
  { name: "Gurmesa Tura Debelew", affiliation: "Emory University Ethiopia", image: "/images/our-leadership/gurmesa-tura-debelew.jpg", width: 640, height: 640 },
  { name: "Queen Dube", affiliation: "WHO Malawi", image: "/images/our-leadership/queen-dube.png", width: 625, height: 625 },
  { name: "Abebe Gebremariam", affiliation: "Emory University Ethiopia", image: "/images/our-leadership/abebe-gebremariam.jpeg", width: 1189, height: 1200 },
  { name: "Edith Gicheha", affiliation: "Rice360 Global – Kenya", image: "/images/our-leadership/edith-gicheha.png", width: 625, height: 625 },
  { name: "Lisa Hirschhorn", affiliation: "Northwestern University Global – United States", image: "/images/our-leadership/lisa-hirschhorn.jpg", width: 625, height: 625 },
  { name: "Mariam Johari", affiliation: "Rice360 Tanzania", image: "/images/countries/tanzania/mariam-johari.jpg", width: 800, height: 800 },
  { name: "Kondwani Kawaza", affiliation: "Kamuzu University of Health Sciences Malawi", image: "/images/our-leadership/kondwani-kawaza.jpg", width: 625, height: 625 },
  { name: "Danica Kumara", affiliation: "NEST360 Technical Advisory Team Global – United States", image: "/images/our-leadership/danica-kumara.png", width: 625, height: 625 },
  { name: "Honorati Masanja", affiliation: "Ifakara Health Institute Tanzania", image: "/images/our-leadership/honorati-masanja.png", width: 625, height: 625 },
  { name: "Cathy Magombo", affiliation: "Rice360 Malawi", image: "/images/our-leadership/cathy-magombo.jpeg", width: 592, height: 592 },
  { name: "Araya Medhanyle", affiliation: "Mekelle University Ethiopia", image: "/images/our-leadership/araya-medhanyie.jpg", width: 512, height: 512 },
  { name: "Robert Miros", affiliation: "3rd Stone Design Global – United States", image: "/images/our-leadership/robert-miros.png", width: 625, height: 625 },
  { name: "Theresa Mkandawire", affiliation: "Malawi University of Business and Applied Sciences Malawi", image: "/images/our-leadership/theresa-mkandawire.jpg", width: 625, height: 625 },
  { name: "Elizabeth Molyneux", affiliation: "Queen Elizabeth Central Hospital Global – United Kingdom", image: "/images/our-leadership/elizabeth-molyneux.png", width: 625, height: 625 },
  { name: "Martha Mulerwa", affiliation: "Rice360 Global – Uganda", image: "/images/our-leadership/martha-mulerwa.jpeg", width: 720, height: 720 },
  { name: "Jonah Musa", affiliation: "Northwestern University Nigeria", image: "/images/our-leadership/jonah-musa.jpg", width: 1000, height: 1000 },
  { name: "Samuel Ngwala", affiliation: "Rice360 Malawi", image: "/images/our-leadership/samuel-ngwala.jpg", width: 1188, height: 1200 },
  { name: "Opeyemi Odedere", affiliation: "Rice360 Nigeria", image: "/images/our-leadership/opeyemi-odedere.png", width: 625, height: 625 },
  { name: "George Okello", affiliation: "Rice360 Kenya", image: "/images/our-leadership/george-okello.jpg", width: 625, height: 625 },
  { name: "Dick Oranja", affiliation: "Hatch Technologies Global – Kenya", image: "/images/our-leadership/dick-oranja.jpg", width: 625, height: 625 },
  { name: "Cate Paul", affiliation: "NEST360 Technical Advisory Team Global – Tanzania", image: "/images/our-leadership/cate-paul.jpg", width: 625, height: 625 },
  { name: "Natasha Rhoda", image: "/images/our-leadership/natasha-rhoda.png", width: 1200, height: 1200 },
  { name: "Mekdes Shifeta", image: "/images/our-leadership/mekdes-shifeta.jpg", width: 960, height: 973 },
];

function LeaderList({ leaders }: { leaders: Leader[] }) {
  return (
    <ul>
      {leaders.map((leader) => (
        <li key={leader.name}>
          <Image
            src={leader.image}
            alt={`Headshot of ${leader.name}`}
            width={leader.width}
            height={leader.height}
            style={{ width: 150, height: "auto" }}
          />
          <h4>{leader.name}</h4>
          {leader.affiliation && <p>{leader.affiliation}</p>}
        </li>
      ))}
    </ul>
  );
}

export default function OurLeadershipPage() {
  return (
    <main>
      <h1>Our Leadership</h1>
      <p>
        Our leadership team is a dedicated and passionate group of engineers,
        clinicians, researchers, and device manufacturers committed to ending
        preventable newborn deaths in African hospitals.
      </p>

      <section>
        <h2>Steering Committee</h2>
        <LeaderList leaders={steeringCommittee} />
      </section>

      <section>
        <h2>Country &amp; Multi-disciplinary leaders</h2>
        <LeaderList leaders={countryLeaders} />
      </section>
    </main>
  );
}
