import type { Metadata } from "next";
import Image from "next/image";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Stories | NEST360",
};

// Content recreated word for word from the first page of
// https://nest360.org/stories/ (pagination left out). Story pages, category
// archives, and outside articles aren't built yet, so they use PendingLink.

const categoryPaths: Record<string, string> = {
  "Design Studios": "/category/design-studios",
  "Ethiopia": "/category/ethiopia",
  "Events": "/category/events",
  "Healthcare": "/category/healthcare",
  "Kenya": "/category/kenya",
  "Malawi": "/category/malawi",
  "Media": "/category/media",
  "Newborn Health": "/category/newborn-health",
  "News": "/category/news",
  "Nigeria": "/category/nigeria",
  "Phase 2": "/category/phase-2",
  "Stories": "/category/stories",
  "Tanzania": "/category/tanzania",
  "Technology": "/category/technology",
  "Training": "/category/training",
};

interface Story {
  title: string;
  to: string;
  image: { src: string; width: number; height: number };
  date: string;
  categories: string[];
  teaser?: string;
}

const stories: Story[] = [
  {
    title: "Clean hands saved newborns’ lives in our hospitals: A responsibility for All",
    to: "/clean-hands-saved-newborns-lives-in-our-hospitals-a-responsibility-for-all",
    image: { src: "/images/countries/kenya/news/clean-hands.jpg", width: 400, height: 250 },
    date: "Sep 17, 2026",
    categories: ["Events", "Kenya", "Newborn Health", "News", "Stories"],
  },
  {
    title: "Starting Life Too Soon Inspires Teen to Make Big Impact for Newborns",
    to: "/starting-life-too-soon-inspires-teen-to-make-big-impact-for-newborns",
    image: { src: "/images/countries/nigeria/news/teen-impact.jpg", width: 400, height: 250 },
    date: "Aug 17, 2026",
    categories: ["News", "Nigeria", "Stories", "Technology"],
  },
  {
    title: "A Day in the Life Of Nurse Gabriel Oluremi, A Neonatal Nurse in the Neonatal Unit of the Lagos University Teaching Hospital, Lagos, Nigeria",
    to: "/a-day-in-the-life-of-nurse-gabriel-oluremi-a-neonatal-nurse-in-the-neonatal-unit-of-the-lagos-university-teaching-hospital-lagos-nigeria",
    image: { src: "/images/countries/nigeria/news/nurse-gabriel.jpg", width: 400, height: 250 },
    date: "Aug 15, 2026",
    categories: ["Newborn Health", "News", "Nigeria", "Stories"],
  },
  {
    title: "The First Hours of Life: Why Breast Milk Matters for Newborns",
    to: "/the-first-hours-of-life-why-breast-milk-matters-for-newborns",
    image: { src: "/images/countries/tanzania/news/breast-milk.jpg", width: 400, height: 250 },
    date: "Aug 7, 2026",
    categories: ["Newborn Health", "News", "Stories", "Tanzania"],
  },
  {
    title: "Introducing the feeding module: Supporting every newborn’s feeding journey",
    to: "/introducing-the-feeding-module-supporting-every-newborns-feeding-journey",
    image: { src: "/images/stories/introducing-the-feeding-module-supporting-every-newborns-fee.jpg", width: 400, height: 250 },
    date: "Aug 6, 2026",
    categories: ["Newborn Health", "News", "Stories"],
  },
  {
    title: "Building Spaces that make Kangaroo Mother Care possible",
    to: "/building-spaces-that-make-kangaroo-mother-care-possible",
    image: { src: "/images/stories/building-spaces-that-make-kangaroo-mother-care-possible.jpg", width: 400, height: 250 },
    date: "May 27, 2026",
    categories: ["Newborn Health", "News", "Stories"],
  },
  {
    title: "Research | Lancet Global Health Paper on Costs of Neonatal Care in 4 countries with NEST360",
    to: "/news-lancet-global-health-paper-on-costs-of-neonatal-care-in-4-countries-with-nest360",
    image: { src: "/images/stories/news-lancet-global-health-paper-on-costs-of-neonatal-care-in.jpg", width: 400, height: 250 },
    date: "May 21, 2026",
    categories: ["Newborn Health", "News"],
  },
  {
    title: "Moving Forward, Together: From Commitment to Action. Country Ownership, Financing, and the Road to 2030",
    to: "/moving-forward-together-from-commitment-to-action-country-ownership-financing-and-the-road-to-2030",
    image: { src: "/images/stories/moving-forward-together-from-commitment-to-action-country-ow.jpg", width: 400, height: 250 },
    date: "May 20, 2026",
    categories: ["Events", "News", "Stories"],
  },
  {
    title: "Moving Forward, Together: Systems Win. Single Interventions Do Not",
    to: "/moving-forward-together-systems-win-single-interventions-do-not",
    image: { src: "/images/stories/moving-forward-together-systems-win-single-interventions-do.jpg", width: 400, height: 250 },
    date: "May 13, 2026",
    categories: ["Events", "News", "Stories"],
  },
  {
    title: "Moving Forward, Together: What IMNHC 2026 Meant for Newborn Health",
    to: "/moving-forward-together-what-imnhc-2026-meant-for-newborn-health",
    image: { src: "/images/stories/moving-forward-together-what-imnhc-2026-meant-for-newborn-he.jpg", width: 400, height: 250 },
    date: "May 6, 2026",
    categories: ["Events", "News", "Stories"],
  },
  {
    title: "NEST360 at IMNHC 2026",
    to: "/nest360-at-imnhc-2026",
    image: { src: "/images/stories/nest360-at-imnhc-2026.jpg", width: 400, height: 250 },
    date: "Mar 18, 2026",
    categories: ["Events", "Newborn Health"],
  },
  {
    title: "News | Why Maternal and Newborn Health Must Be the World’s Most Urgent Priority #IWD2026",
    to: "/why-maternal-and-newborn-health-must-be-the-worlds-most-urgent-priority-iwd2026",
    image: { src: "/images/stories/why-maternal-and-newborn-health-must-be-the-worlds-most-urge.jpg", width: 400, height: 250 },
    date: "Mar 10, 2026",
    categories: ["Events", "Media", "Newborn Health", "News", "Stories"],
  },
  {
    title: "International Women’s Day | “I did it. You can do it.” How Women Are Saving Kenya’s Smallest Lives",
    to: "/how-women-are-saving-kenyas-smallest-lives",
    image: { src: "/images/countries/kenya/news/womens-day.jpeg", width: 400, height: 250 },
    date: "Mar 8, 2026",
    categories: ["Events", "Healthcare", "Kenya", "Newborn Health", "Stories"],
  },
  {
    title: "Research | Examining the perceptions of preterm birth in Ethiopia",
    to: "/research-examining-the-perceptions-of-preterm-birth-in-ethiopia",
    image: { src: "/images/countries/ethiopia/news/preterm-birth-perceptions.jpg", width: 400, height: 250 },
    date: "Feb 23, 2026",
    categories: ["Ethiopia", "Media", "News"],
    teaser:
      "Research explores the impact of preterm birth perceptions in Ethiopia Researchers, including NEST360 partners in Ethiopia, recently published a work examining the beliefs, perceptions, and attitudes surrounding preterm births in Ethiopia by applying a socioecological...",
  },
  {
    title: "News | Over 30,000 healthcare professionals across the globe build their skills on newborn breathing support using CPAP",
    to: "/over-30000-healthcare-professionals-across-the-globe-build-their-skills-on-newborn-breathing-support-using-cpap",
    image: { src: "/images/stories/over-30000-healthcare-professionals-across-the-globe-build-t.jpg", width: 400, height: 250 },
    date: "Jan 21, 2026",
    categories: ["Newborn Health", "News", "Technology", "Training"],
  },
  {
    title: "News | Kenya’s National Investment Case for Newborn Care",
    to: "/kenyas-national-investment-case-for-newborn-care",
    image: { src: "/images/countries/kenya/news/investment-case.jpg", width: 400, height: 250 },
    date: "Dec 10, 2025",
    categories: ["Kenya", "Newborn Health", "News"],
    teaser:
      "Kenya Launches Newborn Investment Case to Accelerate Newborn Health Gains On 14th November 2025, the Ministry of Health, together with partners and newborn health stakeholders, officially launched the Kenya Investment Case for Small and Sick Newborns, a comprehensive,...",
  },
  {
    title: "Resources | 2025 Newborn & Maternal Technology Landscape",
    to: "/resources-2025-newborn-maternal-technology-landscape",
    image: { src: "/images/stories/resources-2025-newborn-maternal-technology-landscape.png", width: 400, height: 250 },
    date: "Dec 9, 2025",
    categories: ["Design Studios", "Healthcare", "Newborn Health", "Technology"],
    teaser:
      "NEST360 releases the 2025 Newborn & Maternal Technology Landscape NEST360 researchers have announced the Newborn Technology Landscape | 2025 Edition. The updated Newborn & Maternal Technology Landscape provides an open-access, interactive database of over 130...",
  },
  {
    title: "Research | Low-Cost Glucometer Evaluation",
    to: "/research-low-cost-glucometer-evaluation",
    image: { src: "/images/countries/malawi/news/glucometer.jpg", width: 400, height: 250 },
    date: "Dec 9, 2025",
    categories: ["Healthcare", "Malawi", "Newborn Health", "News"],
    teaser:
      "NEST360 Research identifies affordable glucometers for use with newborns NEST360 researchers published their findings from a study to systematically evaluate the accuracy and reliability of 11 commonly available point-of-care glucometers to determine which could be...",
  },
  {
    title: "News | Keeping small and sick newborns safe starts with safe medical devices",
    to: "/keeping-small-and-sick-newborns-safe-starts-with-safe-medical-devices",
    image: { src: "/images/countries/ethiopia/news/safe-medical-devices.jpg", width: 400, height: 250 },
    date: "Dec 8, 2025",
    categories: ["Ethiopia", "Newborn Health", "News", "Stories", "Technology", "Training"],
  },
  {
    title: "Sharing the Science in Nairobi: Showcasing Innovation Across the Newborn and Maternal Health Continuum",
    to: "/sharing-the-science-in-nairobi-showcasing-innovation-across-the-newborn-and-maternal-health-continuum",
    image: { src: "/images/stories/sharing-the-science-in-nairobi-showcasing-innovation-across.jpeg", width: 400, height: 250 },
    date: "Nov 17, 2025",
    categories: ["News", "Stories", "Training"],
  },
  {
    title: "Research | NEST360 team presented NEST360 quality improvement approach at ISQua 2025",
    to: "/research-nest360-team-presented-nest360-quality-improvement-approach-at-isqua-2025",
    image: { src: "/images/news/isqua-2025.jpeg", width: 400, height: 250 },
    date: "Nov 14, 2025",
    categories: ["Ethiopia", "Healthcare", "Kenya", "Malawi", "Newborn Health", "Nigeria", "Phase 2", "Stories", "Tanzania"],
    teaser:
      "NEST360 Research Presentation at ISQua 2025 in BrazilQuality Improvement Approach to Improving Newborn Care NEST360 team members, Nebiyou Hailemariam, Hannah Mwaniki, and Kylie Dougherty recently attended the 2025 International Society for Quality in Health Care...",
  },
  {
    title: "2025 World Patient Safety Day Recap: Reflections and Takeaways from Tigray, Ethiopia",
    to: "/2025-world-patient-safety-day-recap-reflections-and-takeaways-from-tigray-ethiopia",
    image: { src: "/images/stories/2025-world-patient-safety-day-recap-reflections-and-takeaway.jpg", width: 400, height: 250 },
    date: "Nov 5, 2025",
    categories: ["Ethiopia", "Newborn Health", "News"],
    teaser:
      "World Patient Safety Day (WPSD) marked each year on 17 September, calls for global solidarity and concerted action by all countries and international partners to improve patient safety. This year’s slogan, “Patient safety from the start!”, emphasizes the urgent need...",
  },
  {
    title: "Innovations and Partnerships for Newborns Flourish at the 2025 COINN and ANA Conferences in Africa",
    to: "/innovations-and-partnerships-for-newborns-flourish-at-the-2025-coinn-and-ana-conferences-in-africa",
    image: { src: "/images/stories/innovations-and-partnerships-for-newborns-flourish-at-the-20.jpg", width: 400, height: 250 },
    date: "Sep 15, 2025",
    categories: ["Events", "Newborn Health", "Stories"],
    teaser:
      "Across Africa and beyond, newborn care is being reimagined. At the Council of International Neonatal Nurses (COINN) and the African Neonatal Association (ANA) conferences in August, healthcare professionals, researchers, academicians, global experts, advocates, and...",
  },
  {
    title: "Stories | BMJ Quality & Safety | Conversation with Dr. Kylie Dougherty",
    to: "/stories-bmj-quality-safety-conversation-with-dr-kylie-dougherty",
    image: { src: "/images/stories/stories-bmj-quality-safety-conversation-with-dr-kylie-doughe.jpeg", width: 400, height: 250 },
    date: "Sep 15, 2025",
    categories: ["Healthcare", "Newborn Health", "News", "Stories", "Technology"],
    teaser:
      "BMJ Quality & Safety posted a conversation with NEST360 alliance member, Dr. Kylie Dougherty, a postdoctoral fellow at Northwestern University Feinberg School of Medicine, and new Nurse Scientist at Nationwide Children's Hospital Center for Nursing Excellence,...",
  },
  {
    title: "Resources | New! Infection Prevention & Control TPP & Diagnostic Table",
    to: "/resources-new-infection-prevention-control-tpp-diagnostic-table",
    image: { src: "/images/stories/resources-new-infection-prevention-control-tpp-diagnostic-ta.jpg", width: 400, height: 250 },
    date: "Sep 8, 2025",
    categories: ["Healthcare", "Newborn Health", "Technology"],
    teaser:
      "Target Product Profile for in vitro diagnostic tests for bacterial infection A Target Product Profile (TPP) for in vitro diagnostic tests for serious bacterial infection, including neonatal sepsis, among infants aged 0–59 days, is now available on the WHO...",
  },
  {
    title: "Resource | NEST360 Oxygen Cylinder Safety Guidelines",
    to: "/resource-nest360-oxygen-cylinder-safety-guidelines",
    image: { src: "/images/stories/resource-nest360-oxygen-cylinder-safety-guidelines.jpg", width: 400, height: 250 },
    date: "Aug 29, 2025",
    categories: ["Healthcare", "Newborn Health", "Stories", "Technology", "Training"],
    teaser:
      "NEST360 has published an Oxygen Cylinder Safety Guidelines job aid outlining the correct handling of oxygen cylinders to prevent major accidents and harm to patients and staff in the hospital. The guideline includes a link to an oxygen cylinder safety video prepared...",
  },
  {
    title: "Research | Glucometers Evaluation in BMC Pediatrics",
    to: "/research-glucometers-evaluation-in-bmc-pediatrics",
    image: { src: "/images/stories/research-glucometers-evaluation-in-bmc-pediatrics.jpg", width: 400, height: 250 },
    date: "Aug 29, 2025",
    categories: ["Healthcare", "Newborn Health", "Technology"],
    teaser:
      "NEST360 researchers published a paper in BMC Pediatrics on the evaluation of commercial point-of-care glucometers for detecting and monitoring of neonatal hypoglycemia in resource-constrained settings. According to the UNICEF | NEST360 Target Product Profile for...",
  },
  {
    title: "Research | NEST360 Implementation Research on NEST360 Approach to Small & Sick Newborn Care",
    to: "/research-nest360-implementation-research-on-nest360-approach-to-small-sick-newborn-care",
    image: { src: "/images/stories/research-nest360-implementation-research-on-nest360-approach.jpg", width: 400, height: 250 },
    date: "Aug 18, 2025",
    categories: ["Healthcare", "Newborn Health"],
    teaser:
      "NEST360 researchers published a paper in BMC Global Public Health titled \"From warehouse to ward: applying implementation research methods to the device identification, qualification, distribution, and management process within the Newborn Essential Solutions and...",
  },
  {
    title: "Resources | NEST360 Change Package",
    to: "/nest360-change-package",
    image: { src: "/images/stories/nest360-change-package.jpg", width: 400, height: 250 },
    date: "Aug 18, 2025",
    categories: ["Healthcare", "Newborn Health", "Phase 2", "Training"],
    teaser:
      "NEST360 published a change package to support quality improvements in hospital-based newborn care, adding to the library of global public goods and online resources from NEST360. The NEST360 change package is a collection of evidence-informed knowledge, resources, and...",
  },
  {
    title: "Update! Resources | NEST360 General Instructors Course & Training of Trainer",
    to: "/updates-general-instructors-course-training-of-trainer-from-nest360",
    image: { src: "/images/stories/updates-general-instructors-course-training-of-trainer-from.jpg", width: 400, height: 250 },
    date: "Aug 18, 2025",
    categories: ["Healthcare", "Newborn Health", "Training"],
    teaser:
      "NEST360 updated its content for Generic Instructor Course (GIC) and Training of Trainers (TOT) materials. The GIC is designed to train potential instructors in how to teach providers course material. The principles of how to teach adults in different learning...",
  },
  {
    title: "Midwifery’s men and women share insights from frontline care for moms & babies",
    to: "/midwiferys-men-and-women-share-insights-from-frontline-care-for-moms-babies",
    image: { src: "/images/stories/midwiferys-men-and-women-share-insights-from-frontline-care.jpg", width: 400, height: 250 },
    date: "Jun 3, 2025",
    categories: ["Healthcare", "Newborn Health", "Stories"],
    teaser:
      "On this year’s International Day of the Midwife, we spotlighted the voices of dedicated midwives, both men and women sharing in the profession dedicated to saving lives of moms and babies. Midwives bridge maternal and newborn care in our hospitals. In their words,...",
  },
  {
    title: "A Father’s Journey into Kangaroo Mother Care",
    to: "/a-fathers-journey-into-kangaroo-mother-care",
    image: { src: "/images/stories/a-fathers-journey-into-kangaroo-mother-care.jpg", width: 400, height: 250 },
    date: "May 6, 2025",
    categories: ["Healthcare", "Kenya", "Newborn Health", "Stories"],
  },
  {
    title: "Kangaroo Mother Care (KMC) at Mabwepande District Hospital in Tanzania",
    to: "/kangaroo-mother-care-kmcat-mabwepande-district-hospital-in-tanzania",
    image: { src: "/images/countries/tanzania/news/kmc-mabwepande.jpg", width: 400, height: 250 },
    date: "Apr 1, 2025",
    categories: ["Healthcare", "Stories", "Tanzania"],
  },
  {
    title: "Blog from Ifakara, Partners introduce Tanzania’s first newborn hospital registers",
    to: "https://www.ihi.or.tz/our-events/682/details/",
    image: { src: "/images/stories/blog-from-ifakara-partners-introduce-tanzania-s-first-newbor.jpg", width: 400, height: 250 },
    date: "Mar 4, 2025",
    categories: ["Newborn Health", "Stories", "Tanzania"],
  },
  {
    title: "Strengthening Biomedical Engineering Capacity for Newborn Care in Nigeria",
    to: "/strengthening-biomedical-engineering-capacity-for-newborn-care-in-nigeria",
    image: { src: "/images/stories/strengthening-biomedical-engineering-capacity-for-newborn-ca.jpg", width: 400, height: 250 },
    date: "Mar 4, 2025",
    categories: ["Newborn Health", "Nigeria", "Stories", "Training"],
    teaser:
      "A group photo featuring participants, the Kano State Director of Medical Services (Dr. Shehu Abdullahi), Kano State Director of Public Health (Dr. Ibrahim Umar), Permanent Secretary of Kano State Ministry of Health (Pharm. Aminu Bashir), and facilitators from NEST360...",
  },
  {
    title: "NEST360 team members receive Financial Times Responsible Business Education Award 2025",
    to: "/nest360-team-members-receive-financial-times-responsible-business-education-award-2025",
    image: { src: "/images/stories/nest360-team-members-receive-financial-times-responsible-bus.jpg", width: 400, height: 250 },
    date: "Jan 24, 2025",
    categories: ["Healthcare", "News", "Phase 2", "Stories"],
  },
  {
    title: "World Prematurity Day 2024",
    to: "/world-prematurity-day-2024",
    image: { src: "/images/countries/malawi/news/world-prematurity-day.jpg", width: 400, height: 250 },
    date: "Dec 17, 2024",
    categories: ["Ethiopia", "Events", "Healthcare", "Kenya", "Malawi", "Newborn Health", "Nigeria", "Phase 2", "Stories", "Tanzania"],
  },
  {
    title: "Celebrating World Prematurity Day: SLL360 Hosts KMC Town Hall",
    to: "/celebrating-world-prematurity-day-sll360-hosts-kmc-town-hall",
    image: { src: "/images/stories/celebrating-world-prematurity-day-sll360-hosts-kmc-town-hall.jpg", width: 400, height: 250 },
    date: "Dec 12, 2024",
    categories: ["Ethiopia", "Phase 2", "Stories"],
  },
  {
    title: "Tanzanian MOH praise NEST360 contribution to newborn care",
    to: "https://news.rice.edu/news/2024/tanzanian-officials-praise-nest360-contribution-newborn-care",
    image: { src: "/images/stories/tanzanian-moh-praise-nest360-contribution-to-newborn-care.jpg", width: 400, height: 250 },
    date: "Jul 26, 2024",
    categories: ["Media", "News", "Phase 2", "Tanzania"],
  },
  {
    title: "Announcing a formal partnership between NEST360 and COINN",
    to: "/announcing-a-formal-partnership-between-nest360-and-coinn",
    image: { src: "/images/stories/announcing-a-formal-partnership-between-nest360-and-coinn.jpg", width: 400, height: 250 },
    date: "May 20, 2024",
    categories: ["News", "Phase 2"],
    teaser:
      "COINN and NEST360 join together for newborn lives.May 10, 2024In May 2024, Newborn Essential Solutions and Technologies (NEST360) and the Council of International Neonatal Nurses (COINN), formalised their partnership by signing a Memorandum of Understanding (MOU)....",
  },
  {
    title: "Ethiopia government accelerates newborn health initiatives",
    to: "/ethiopia-government-accelerates-newborn-health-initiatives",
    image: { src: "/images/stories/ethiopia-government-accelerates-newborn-health-initiatives.avif", width: 1450, height: 505 },
    date: "May 9, 2024",
    categories: ["Ethiopia", "News", "Phase 2", "Stories"],
  },
  {
    title: "Introducing the NEST360 Technical Advisory Team",
    to: "/introducing-the-nest360-tat",
    image: { src: "/images/stories/introducing-the-nest360-tat.jpg", width: 400, height: 250 },
    date: "May 6, 2024",
    categories: ["Healthcare", "Newborn Health", "News", "Phase 2", "Stories"],
    teaser:
      "We are pleased to announce a new NEST360 governance structure (Figure 1), which includes the NEST360 Steering Committee and the newly formed NEST360 Technical Advisory Team (TAT), with support from program managers. Alongside NEST360’s country and multi-disciplinary...",
  },
  {
    title: "Celebration of the NEST360 Phase 1 Accomplishments",
    to: "/celebration-of-the-nest360-phase-1-accomplishments",
    image: { src: "/images/stories/celebration-of-the-nest360-phase-1-accomplishments.jpg", width: 338, height: 187 },
    date: "Mar 27, 2024",
    categories: ["Newborn Health"],
    teaser:
      "Here we are in 2024, and while NEST360 teams continue to build on activities started in Phase 1, it is a great time to look at all we have accomplished thus far through the combined individual contributions of our vast team. Only seven years ago, NEST360 came away...",
  },
  {
    title: "NEST360 @ SXSW",
    to: "/nest360-sxsw",
    image: { src: "/images/stories/nest360-sxsw.jpeg", width: 322, height: 156 },
    date: "Mar 1, 2024",
    categories: ["Events"],
  },
  {
    title: "Newborn Toolkit: NEST360 Announces 5 more years with the launch of its Phase 2",
    to: "https://www.newborntoolkit.org/news/nest360-announces-5-more-years-with-the-launch-of-its-phase-2/en?back_action=%2Fwhats-new",
    image: { src: "/images/stories/newborn-toolkit-nest360-announces-5-more-years-with-the-laun.jpg", width: 400, height: 250 },
    date: "Feb 20, 2024",
    categories: ["Healthcare", "News", "Phase 2"],
  },
  {
    title: "NEWBORN HEALTH: NEST360 secures eight-figure global funding for next stage",
    to: "https://ihi.or.tz/our-events/337/details/",
    image: { src: "/images/stories/newborn-health-nest360-secures-eight-figure-global-funding-f.jpg", width: 400, height: 250 },
    date: "Feb 7, 2024",
    categories: ["News", "Phase 2", "Tanzania"],
  },
  {
    title: "Mission to revolutionize newborn care in sub-Saharan Africa",
    to: "https://www.aku.edu/news/Pages/News_Details.aspx?nid=NEWS-003183",
    image: { src: "/images/stories/mission-to-revolutionize-newborn-care-in-sub-saharan-africa.jpg", width: 400, height: 250 },
    date: "Feb 7, 2024",
    categories: ["Kenya", "News", "Phase 2"],
  },
  {
    title: "Announcing 5 more years: NEST360 Phase 2",
    to: "/announcing-5-more-years-nest360-phase-2",
    image: { src: "/images/stories/announcing-5-more-years-nest360-phase-2.jpg", width: 400, height: 250 },
    date: "Jan 24, 2024",
    categories: ["News", "Phase 2", "Stories"],
    teaser:
      "On Tuesday, January 23, 2024, the NEST360 alliance gathered at Rice University in Houston, Texas, to officially announce a $65 million commitment from the Bill & Melinda Gates Foundation, the Children’s Investment Fund Foundation, The ELMA Foundation, and generous...",
  },
  {
    title: "Reducing newborn deaths across Africa enters phase 2 with $65M",
    to: "https://news.rice.edu/news/2024/reducing-newborn-deaths-across-africa-enters-phase-2-65m",
    image: { src: "/images/stories/reducing-newborn-deaths-across-africa-enters-phase-2-with-65.jpg", width: 400, height: 250 },
    date: "Jan 24, 2024",
    categories: ["News", "Phase 2"],
  },
  {
    title: "Global health initiative targeting newborn mortality to announce next phase Jan. 23 with new, 8-figure funding",
    to: "https://news.rice.edu/news/2024/global-health-initiative-targeting-newborn-mortality-announce-next-phase-jan-23-new-8",
    image: { src: "/images/stories/global-health-initiative-targeting-newborn-mortality-to-anno.jpg", width: 400, height: 250 },
    date: "Jan 22, 2024",
    categories: ["News", "Phase 2"],
  },
];

export default function StoriesPage() {
  return (
    <main>
      <h1>STORIES AND NEWS</h1>
      <h2>Stories, News, and More</h2>
      <p>
        Read the latest stories, and news from the NEST360 Alliance of experts
        who advance quality newborn care through innovation, policy, and
        education.
      </p>

      <section>
        {stories.map((story) => (
          <article key={story.to}>
            <PendingLink to={story.to}>
              <Image
                src={story.image.src}
                alt={story.title}
                width={story.image.width}
                height={story.image.height}
                style={{ width: 300, height: "auto" }}
              />
            </PendingLink>
            <h3>
              <PendingLink to={story.to}>{story.title}</PendingLink>
            </h3>
            <p>{story.date}</p>
            <p>
              {story.categories.map((category, i) => (
                <span key={category}>
                  {i > 0 && ", "}
                  <PendingLink to={categoryPaths[category]}>{category}</PendingLink>
                </span>
              ))}
            </p>
            {story.teaser && <p>{story.teaser}</p>}
            <PendingLink to={story.to}>Read More</PendingLink>
          </article>
        ))}
      </section>
    </main>
  );
}
