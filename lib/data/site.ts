// TODO: Implement
// export async function getCountries(): Promise<Country[]>
// export async function getImpactStats(): Promise<ImpactStat[]>

import type { Pillar } from "@/lib/types";
import type { ImpactStat} from '@/lib/types'

const pillars: Pillar[] = [
  {
    title: "Innovative Lifesaving Technologies",
    body: "We test, qualify, and distribute newborn health technologies that are effective, affordable, rugged, and suitable for hospitals in Africa.",
    link: { label: "Learn more", href: "/what-we-do/technology" },
  },
  {
    title: "Hands-On Education",
    body: "We strengthen university and on-the-job education for physicians, nurses, biomedical engineers, and technicians to support quality newborn care and device maintenance.",
    link: { label: "Learn more", href: "/what-we-do/education" },
  },
  {
    title: "Data-Driven Action",
    body: "We support hospitals and governments with developing locally-owned data dashboards that turn routine clinical and contextual data into actionable insights for the improved care of the small and sick newborns.",
    link: { label: "Learn more", href: "/what-we-do/data" },
  },
];

const impactStats: ImpactStat[] = [
  { value: "160,000+", label: "Newborn hospital admissions Annually" },
  { value: "750,000+", label: "Infant Births (Annual National Average)" },
  { value: "41,000+", label: "Healthcare Professionals & Students trained" },
];

export async function getImpactStats(): Promise<ImpactStat[]> {
  return impactStats;
}
export async function getPillars(): Promise<Pillar[]> {
  return pillars;
}