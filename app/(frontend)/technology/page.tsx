import type { Metadata } from "next";
import Image from "next/image";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Technology | NEST360",
};

// Content recreated word for word from https://nest360.org/technology/

interface Device {
  name: string;
  // Where the device name should link once its page exists. Conductive Warmer
  // has no link on nest360.org.
  to?: string;
  image: { src: string; alt: string; width: number; height: number };
  models: string[];
}

const devices: Device[] = [
  {
    name: "Syringe Pump",
    to: "/project/syringe-pump",
    image: { src: "/images/technology/syringe-pump.png", alt: "Mindray BeneFusion SP3 syringe pump", width: 1200, height: 800 },
    models: ["Heyer HK-400", "Medcaptain SYS-50", "Mindray BeneFusion SP3"],
  },
  {
    name: "Bilirubinometer",
    to: "/project/bilirubinometer",
    image: { src: "/images/technology/bilirubinometer.png", alt: "BiliDx bilirubinometer", width: 500, height: 500 },
    models: ["BiliDx Bilirubinometer", "Calmark AB Neo-Bilirubin"],
  },
  {
    name: "Phototherapy Light",
    to: "/project/phototherapy",
    image: { src: "/images/technology/phototherapy-light.jpg", alt: "Phoenix Brilliance Pro phototherapy light", width: 500, height: 500 },
    models: [
      "Bistos BT-400",
      "David NingBo XHZ-90S",
      "Fanem Bilitron Sky 5006",
      "MTTS Colibri Phototherapy",
      "MTTS Firefly",
      "Phoenix Brilliance Pro",
    ],
  },
  {
    name: "Glucometer",
    to: "/project/glucometer",
    image: { src: "/images/technology/glucometer.png", alt: "Glucometer", width: 500, height: 500 },
    models: [
      "Accu-Chek Active",
      "Accu-Chek Guide",
      "Accu-Chek Instant",
      "Accu-Chek Performa",
      "Nova StatStrip Glucose Hospital Meter System",
      "Nova StatStrip Xpress2",
    ],
  },
  {
    name: "Hemoglobinometer",
    to: "/project/hemoglobinometers",
    image: { src: "/images/technology/hemoglobinometer.jpeg", alt: "EKF Diaspect hemoglobinometer", width: 260, height: 194 },
    models: ["EKF Diaspect™", "HemoCue 201+"],
  },
  {
    name: "CPAP",
    to: "/project/cpap",
    image: { src: "/images/technology/cpap.png", alt: "Diamedica bubble CPAP", width: 500, height: 500 },
    models: ["Diamedica UK Baby CPAP 10", "Pumani bubbleCPAP"],
  },
  {
    name: "Flow Splitter",
    to: "/project/flow-splitter",
    image: { src: "/images/technology/flow-splitter.jpg", alt: "Longfian flow splitter", width: 500, height: 500 },
    models: ["Caire Chart SureFlow Oxygen Flow Station", "Longfian 5-way Flow Spitter"],
  },
  {
    name: "Oxygen Concentrator",
    to: "/project/oxygen-concentrator",
    image: { src: "/images/technology/oxygen-concentrator.png", alt: "Longfian oxygen concentrator", width: 500, height: 500 },
    models: [
      "CAIRE Airsep NewLife Intensity 10",
      "Drive DeVilbiss Sanrai PulmO2",
      "Longfian Jay-10 Dual Flow",
    ],
  },
  {
    name: "Suction Pump",
    to: "/project/suction-pump",
    image: { src: "/images/technology/suction-pump.png", alt: "3A Aspeed suction pump", width: 500, height: 500 },
    models: ["3A Aspeed Professional", "Ca-Mi New Aspiret", "Fazzini F-18"],
  },
  {
    name: "Pulse Oximeter",
    to: "/project/pulse-oximeter",
    image: { src: "/images/technology/pulse-oximeter.png", alt: "Bistos pulse oximeter", width: 500, height: 500 },
    models: [
      "Acare Lifebox",
      "Bistos BT-710",
      "Edan H100B",
      "Masimo Rad-G",
      "Mindray PM-60",
      "Neopenda neoGuard",
    ],
  },
  {
    name: "Respiratory Rate Monitor",
    // nest360.org links this to the Continuous Temperature Monitor page.
    to: "/project/continuous-temperature-monitor",
    image: { src: "/images/technology/respiratory-rate-monitor.jpg", alt: "Masimo Rad-G monitor", width: 211, height: 300 },
    models: ["Masimo Rad-G", "Neopenda neoGuard"],
  },
  {
    name: "Continuous Temperature Monitor",
    to: "/project/continuous-temperature-monitor",
    image: { src: "/images/technology/continuous-temperature-monitor.png", alt: "Photo of Celsi Monitor", width: 1200, height: 1100 },
    models: ["Celsi Monitor", "Neopenda neoGuard"],
  },
  {
    name: "Radiant Warmer",
    to: "/project/radiant-warmer",
    image: { src: "/images/technology/radiant-warmer.png", alt: "MTTS Wallaby radiant warmer", width: 500, height: 500 },
    models: [
      "David NingBo HKN-9010",
      "Fanem Ampla 2085 LED Heated Cradle",
      "MTTS Wallaby",
      "Phoenix NWS-101",
    ],
  },
  {
    name: "Conductive Warmer",
    image: { src: "/images/technology/conductive-warmer.png", alt: "Celsi conductive warmer", width: 1200, height: 941 },
    models: ["Celsi Warmer"],
  },
];

export default function TechnologyPage() {
  return (
    <main>
      <h1>NEST360 Qualified Technologies</h1>
      <p>
        NEST360 uses a eight-step process to evaluate technology for newborn
        care in low-resource settings. Rigorous performance and usability
        testing is conducted on devices that are available for purchase and
        have regulatory approval.
      </p>
      <p>
        <PendingLink to="/project/qualified-technologies">
          NEST360 Qualified Technologies
        </PendingLink>{" "}
        are robust, durable and suitable for low-resource settings and meet
        pre-defined performance metrics based on the{" "}
        <PendingLink to="/project/target-product-profiles">
          Target Product Profiles
        </PendingLink>{" "}
        (developed in collaboration with UNICEF). The technologies submitted
        align with our Pathways of Care.
      </p>
      <p>
        Using the{" "}
        <PendingLink to="https://www.technologylandscape.org/submit-your-technology">
          Technology Landscaping Survey
        </PendingLink>
        , device manufacturers apply for inclusion in the next edition of the
        NEST360{" "}
        <PendingLink to="/project/ntl">Newborn Technology Landscape</PendingLink>,
        a compendium of newborn healthcare technologies, both commercially
        available and in development, suited for use in resource-limited
        settings.
      </p>

      <section>
        {devices.map((device) => (
          <div key={device.name}>
            {device.to ? (
              <PendingLink to={device.to}>
                <Image
                  src={device.image.src}
                  alt={device.image.alt}
                  width={device.image.width}
                  height={device.image.height}
                  style={{ width: 200, height: "auto" }}
                />
              </PendingLink>
            ) : (
              <Image
                src={device.image.src}
                alt={device.image.alt}
                width={device.image.width}
                height={device.image.height}
                style={{ width: 200, height: "auto" }}
              />
            )}
            <h4>
              {device.to ? (
                <PendingLink to={device.to}>{device.name}</PendingLink>
              ) : (
                device.name
              )}
            </h4>
            <ul>
              {device.models.map((model) => (
                <li key={model}>{model}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <PendingLink to="https://www.hatch-tech.org/">Find a Vendor</PendingLink>
    </main>
  );
}
