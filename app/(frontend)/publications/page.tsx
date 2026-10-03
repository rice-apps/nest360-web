import type { Metadata } from "next";
import PendingLink from "@/components/PendingLink";

export const metadata: Metadata = {
  title: "Research Publications | NEST360",
};

// Citations recreated word for word from https://nest360.org/publications/
// Two links on the live site are broken: one points at a Chrome PDF-viewer URL
// (replaced below with the article's DOI) and one at an Apple Notes note.
const publications = [
  {
    citation:
      " Blood culture versus antibiotic use for neonatal inpatients in 61 hospitals implementing with the NEST360 Alliance in Kenya, Malawi, Nigeria, and Tanzania: a cross-sectional study. Murless-Collins S, Kawaza K, Salim N, et al. BMC Pediatr . 2023;23(Suppl 2):568. Published 2023 Nov 15. doi:10.1186/s12887-023-04343-0",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04343-0",
  },
  {
    citation:
      " Neonatal inpatient dataset for small and sick newborn care in low- and middle-income countries: systematic development and multi-country operationalisation with NEST360. Cross JH, Bohne C, Ngwala SK, et al. BMC Pediatr . 2023;23(Suppl 2):567. Published 2023 Nov 15. doi:10.1186/s12887-023-04341-2",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04341-2",
  },
  {
    citation:
      " Target product profiles for neonatal care devices: systematic development and outcomes with NEST360 and UNICEF. Kirby RP, Molyneux EM, Dube Q, et al. BMC Pediatr . 2023;23(Suppl 2):564. Published 2023 Nov 15. doi:10.1186/s12887-023-04342-1",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04342-1",
  },
  {
    citation:
      " Using interprofessional education to build dynamic teams to help drive collaborative, coordinated and effective newborn care. Langton J, Liaghati-Mobarhan S, Gicheha E, et al. BMC Pediatr . 2023;23(Suppl 2):565. Published 2023 Nov 15. doi:10.1186/s12887-023-04373-8",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04373-8",
  },
  {
    citation:
      " Devices and furniture for small and sick newborn care: systematic development of a planning and costing tool. Tarus A, Msemo G, Kamuyu R, et al. BMC Pediatr . 2023;23(Suppl 2):566. Published 2023 Nov 15. doi:10.1186/s12887-023-04363-w",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04363-w",
  },
  {
    citation:
      " Avoid equipment graveyards: rigorous process to improve identification and procurement of effective, affordable, and usable newborn devices in low-resource hospital settings. Asma E, Heenan M, Banda G, et al. BMC Pediatr . 2023;23(Suppl 2):569. Published 2023 Nov 15. doi:10.1186/s12887-023-04362-x",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04362-x",
  },
  {
    citation:
      " Protecting small and sick newborn care in the COVID-19 pandemic: multi-stakeholder qualitative data from four African countries with NEST360. Steege R, Mwaniki H, Ogueji IA, et al. BMC Pediatr . 2023;23(Suppl 2):572. Published 2023 Nov 16. doi:10.1186/s12887-023-04358-7",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04358-7",
  },
  {
    citation:
      " Investment case for small and sick newborn care in Tanzania: systematic analyses. Kamuyu R, Tarus A, Bundala F, et al. BMC Pediatr . 2023;23(Suppl 2):632. Published 2023 Dec 14. doi:10.1186/s12887-023-04414-2",
    href: "https://link.springer.com/article/10.1186/s12887-023-04414-2",
  },
  {
    citation:
      " Health facility assessment of small and sick newborn care in low- and middle-income countries: systematic tool development and operationalisation with NEST360 and UNICEF. Penzias RE, Bohne C, Ngwala SK, et al. BMC Pediatr . 2024;23(Suppl 2):655. Published 2024 Mar 7. doi:10.1186/s12887-023-04495-z",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-023-04495-z",
  },
  {
    citation:
      " Quantifying health facility service readiness for small and sick newborn care: comparing standards-based and WHO level-2 + scoring for 64 hospitals implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania. Penzias RE, Bohne C, Gicheha E, et al. BMC Pediatr . 2024;23(Suppl 2):656. Published 2024 Mar 12. doi:10.1186/s12887-024-04578-5",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-024-04578-5",
  },
  {
    citation:
      " COVID-19 pandemic effects on neonatal inpatient admissions and mortality: interrupted time series analysis of facilities implementing NEST360 in Kenya, Malawi, Nigeria, and Tanzania. Malla, L., Ohuma, E.O., Shabani, J. et al. BMC Pediatr . 2023; 23 (Suppl 2):657. https://doi.org/10.1186/s12887-024-04873-1",
    href: "https://doi.org/10.1186/s12887-024-04873-1",
  },
  {
    citation:
      " Infection prevention and care bundles addressing health care-associated infections in neonatal care in low-middle income countries: a scoping review. Molina García A, Cross JH, Fitchett EJA, et al. EClinicalMedicine . 2022;44:101259. Published 2022 Jan 10. doi:10.1016/j.eclinm.2021.101259",
    href: "https://pubmed.ncbi.nlm.nih.gov/35059614/",
  },
  {
    citation:
      " Donor aid mentioning newborns and stillbirths, 2002-19: an analysis of levels, trends, and equity. Kumar MB, Bath D, Binyaruka P, Novignon J, Lawn JE, Pitt C. Lancet Glob Health . 2023;11(11):e1785-e1793. doi:10.1016/S2214-109X(23)00378-9",
    href: "https://pubmed.ncbi.nlm.nih.gov/37858588/",
  },
  {
    citation:
      " Ending Preventable Neonatal Deaths: Multicountry Evidence to Inform Accelerated Progress to the Sustainable Development Goal by 2030. Lawn JE, Bhutta ZA, Ezeaka C, Saugstad O. Neonatology . 2023;120(4):491-499. doi:10.1159/000530496",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10614465/",
  },
  {
    citation:
      " Leveraging an Open-Access Digital Design Notebook for Graduate Biomedical Engineering Education in Nigeria. Casserly, P, Dare, A, Onuh, J, et al. Biomed Eng Education (2024). https://doi.org/10.1007/s43683-024-00136-8",
    href: "https://link.springer.com/article/10.1007/s43683-024-00136-8",
  },
  {
    citation:
      " Quality of inpatient paediatric and newborn care in district hospitals – Authors’ reply. English M, Aluvaala J, Maina M, Duke T, Irimu G. Lancet Glob Health . 2023;11(10):e1514-e1515. doi:10.1016/S2214-109X(23)00370-4",
    href: "https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(23)00370-4/fulltext",
  },
  {
    citation:
      " Evaluation of a Point-of-Care Test for Bilirubin in Malawi. Shapiro A, Anderson J, Mtenthaonga P, et al. Pediatrics . 2022;150(2):e2021053928. doi:10.1542/peds.2021-053928",
    href: "https://publications.aap.org/pediatrics/article/150/2/e2021053928/188493/Evaluation-of-a-Point-of-Care-Test-for-Bilirubin?autologincheck=redirected",
  },
  {
    citation:
      " Neonatal CPAP for Respiratory Distress Across Malawi and Mortality. Carns J, Kawaza K, Liaghati-Mobarhan S, et al. Pediatrics . 2019;144(4):e20190668. doi:10.1542/peds.2019-0668",
    href: "https://publications.aap.org/pediatrics/article/144/4/e20190668/38453/Neonatal-CPAP-for-Respiratory-Distress-Across",
  },
  {
    citation:
      " A neonatal ward-strengthening program improves survival for neonates treated with CPAP at district hospitals in Malawi. Carns J, Liaghati-Mobarhan S, Asibon A, et al. PLOS Glob Public Health . 2022;2(2):e0000195. Published 2022 Feb 18. doi:10.1371/journal.pgph.0000195",
    href: "https://journals.plos.org/globalpublichealth/article?id=10.1371/journal.pgph.0000195",
  },
  {
    citation:
      " National scale of neonatal CPAP to district hospitals in Malawi improves survival for neonates weighing between 1.0 and 1.3 kg. Carns J, Liaghati-Mobarhan S, Asibon A, et al. Arch Dis Child . 2022;107(6):553-557. doi:10.1136/archdischild-2021-322964",
    href: "https://doi.org/10.1136/archdischild-2021-322964",
  },
  {
    citation:
      " Design and field evaluation of a lateral flow cassette device for point-of-care bilirubin measurement. Shapiro A, Mtenthaonga P, Mjumira R, et al. PLOS Glob Public Health . 2023;3(8):e0002262. Published 2023 Aug 8. doi:10.1371/journal.pgph.0002262",
    href: "https://journals.plos.org/globalpublichealth/article?id=10.1371/journal.pgph.0002262",
  },
  {
    citation:
      " Born too soon: decade of action on preterm birth. Geneva: World Health Organization; 2023. License: CC BY-NC-SA 3.0 IGO. (https://creativecommons.org/licenses/ by-nc-sa/3.0/igo/)",
    href: "https://www.who.int/publications/i/item/9789240073890",
  },
  {
    citation:
      " A call to bridge the diagnostic gap: diagnostic solutions for neonatal sepsis in low- and middle-income countries. Gleeson B, Ferreyra C, Palamou ntain K, Neonatal Sepsis Diagnostic Working Group , et al. BMJ Global Health . 2024; 9: e015862. doi: 10.1136/bmjgh-2024-015862",
    href: "https://gh.bmj.com/content/9/9/e015862",
  },
  {
    citation:
      " Neonatal indicator data in Tanzania District Health Information System: evaluation of availability and quality of selected newborn indicators, 2015-2022. Shabani J, Salim N, Bohne C, Day LT, Kumalija C, Mohamed Makuwani A, Bundala F, Ismail H, Lawn JE and Ohuma EO. BMC Pediatr . 2025; 23(Suppl 2) :658. 23 January 2025. doi: 10.1186/s12887-025-05417-x",
    href: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-025-05417-x",
  },
  {
    citation:
      " From warehouse to ward: applying implementation research methods to the device identification, qualification, distribution, and management process within the Newborn Essential Solutions and Technologies (NEST360)alliance. Dougherty K, Kirby RP, Claud K, Palamountain KM, Asma E, Alooh M, Kumara D, Gate V, Khalid A, Banda G, Peter HD, Osuagwu C, Richards-Kortum R, Oden ZM, Bohne CA, Hirschhorn LR. From warehouse to ward: applying implementation research methods to the device identification, qualification, distribution, and management process within the Newborn Essential Solutions and Technologies (NEST360) alliance. BMC Glob Public Health. 2025 Aug 2;3(1):67. doi: 10.1186/s44263-025-00185-3. PMID: 40750904; PMCID: PMC12317598.",
    href: "https://link.springer.com/epdf/10.1186/s44263-025-00185-3?sharing_token=yd55CsTCTlttwO0_2RtHg2_BpE1tBhCbnbw3BuzI2ROU0zQeeZnuxOry2ivszQ2a83CJRH5i_GEDIzLWpuvHJ2cm9cOnxR0ix1cFDiNX7tjvHFVhKMrzZ0vFHJG8Emmk3q6DHadQvDH4kHvLztzNnctB-5g8ZaywKCcmnMG1YQI%3D",
  },
  {
    citation:
      " Evaluation of commercial point-of-care glucometers for detection and monitoring of neonatal hypoglycemia in resource-constrained settings. Bond M, Asma E, Peterson J, Oparah L, Alooh M, Kumara D, Oden ZM, Ezeaka C, Molyneux E, Richards-Kortum R. BMC Pediatr. 2025 Aug 16;25(1):624. doi: 10.1186/s12887-025-05934-9. PMID: 40818947; PMCID: PMC12357331.",
    href: "https://pubmed.ncbi.nlm.nih.gov/40818947/",
  },
  {
    citation:
      " Small and sick newborn care: Changes in service readiness scoring between baseline and 2023 for 65 neonatal units implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania. Penzias RE, Ogero MO, Tillya R, Kassim I, Dosunmu O, Odedere O, Mwaniki H, Ochieng VO, Mochache D, Ngwala SK, Zimba E, Soko GT, Bohne C, Gathara D, Cross JH, Shabani J, Paul C, Shamba D, Masanja H, Salim N, Osuagwu C, Idowu A, Ogueji IA, Tongo O, Okunlola Ogunsola O, Ezeaka VC, Rashid E, Okello G, Wainaina J, Macharia WM, Chiume M, Chalira A, Dube Q, Gicheha E, Molyneux EM, Alooh M, Cousens S, Oden M, Richards-Kortum R, Lawn JE, Ohuma EO. PLOS Glob Public Health. 2025 Jun 25;5(6):e0004367. doi: 10.1371/journal.pgph.0004367. PMID: 40561081; PMCID: PMC12193846.",
    href: "https://journals.plos.org/globalpublichealth/article?id=10.1371/journal.pgph.0004367",
  },
  {
    citation:
      " Neonatal unit human resources: coverage for six cadres and trends for staff-to-baby ratios in 65 neonatal units implementing with NEST360 in Kenya, Malawi, Nigeria, and Tanzania. Penzias RE, Ohuma EO, Odedere O, Dosunmu O, Okello G, Mwaniki H, Tillya R, Shabani J, Ngwala SK, Zimba E, Ogero MO, Bohne CA, Tongo O, Ezeaka VC, Ochieng VO, Rashid E, Macharia WM, Wainaina J, Kassim I, Shamba D, Salim N, Soko GT, Chiume M, Tarus A, Gicheha E, Thomas J, Jenkins G, Cross JH, Kamuyu R, Chen J, Cousens S, Molyneux EM, Oden M, Richards-Kortum R, Lawn JE, Gathara D; with the Data Collection Learning Collaborative Group. Hum Resour Health. 2025 Nov 12;23(1):64. doi: 10.1186/s12960-025-01031-1. PMID: 41225478; PMCID: PMC12613486.",
    href: "https://link.springer.com/article/10.1186/s12960-025-01031-1",
  },
  {
    citation:
      " Cost of health systems strengthening for small and sick newborn care in four sub-Saharan African countries implemented with NEST360: incremental cost analyses. Tarus A, Kumar M, Penzias R, Kamuyu R, Cross JH, Sipalo M, Gicheha E, Bohn CA, Okello G, Macharia WM, Paul C, Salim N, Shamba D, Ngwala SK, Zimba E, Chiume M, Odedere O, Ezeaka VC, Gathara D, Alooh M, Barasa E, Powell-Jackson T, Oden M, Richards-Kortum R, Lawn JE, and the NEST360 incremental cost data collaborative author group. The Lancet Global Health, 2026.",
    href: "https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(26)00058-6/fulltext",
  },
  {
    citation:
      " Neonatal admissions and mortality: a statistical adjustment approach using birthweight-specific curves to address bias due to underreporting in 65 hospitals in four African countries. Malla L, Wong SN, Ngwala S, Zimba E, Chiume M, Lufesi N, Kawaza K, Masanja H, Shabani J, Mshana P, Tillya R, Salim N, Wainaina J, Thomas J, Chen J, Okech F, Okello G, Macharia W, Dosunmu O, Ezeaka C, Odedere O, Ogero M, Cross JH, Penzias RE, Bohne C, Richards-Kortum R, Oden M, Ohuma EO, Lawn JE & with NEST360 Collaborative authorship group. Popul Health Metrics (2026). https://doi.org/10.1186/s12963-026-00496-z",
    href: "https://link.springer.com/article/10.1186/s12963-026-00496-z",
  },
  {
    citation:
      " Co-design of the Implementation Toolkit for Small and Sick Newborn Care: a global open-access knowledge management web platform and linked community targeting the know-do gap. Allison LE, Sipalo M, Whatley T, Griffiths Z, Gathara D, Murless-Collins S, Ezeaka C, Bolaji O, Chiume M, Salim N, Walker K, Stevenson A, Hale R, Ndiaye O, Magge H, Salvadori M, Cassera F, Khadka N, Hailegebriel TD, Richards-Kortum R, Oden M, Lincetto O, Liaghati-Mobarhan S, Ruysen H, Cocoman O, Gibson A, Gupta G, Lawn JE; Implementation Toolkit for Small and Sick Newborn Care Co-Design Group. BMC Pediatr. 2026 Aug 24;26(Suppl 1):780. doi: 10.1186/s12887-026-07420-2. PMID: 42638094; PMCID: PMC13501554.",
    href: "https://link.springer.com/article/10.1186/s12887-026-07420-2",
  },
  {
    citation:
      " Small and sick newborn care: learning for implementation across Africa and beyond . Guest Editors: Bogale Worku, Muhammed Zuman, Tanya Doherty, Joy E. Lawn, and Sarah Murless-Collins; Managing Editor: Caroline Noxon. Volume 23, Issue 2 supplement. BMC Pediatrics (2023).",
    href: "(broken link on nest360.org)",
  },
];

export default function PublicationsPage() {
  return (
    <main>
      <h2>Research Publications</h2>
      <ul>
        {publications.map((publication) => (
          <li key={publication.citation}>
            <PendingLink to={publication.href}>{publication.citation}</PendingLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
