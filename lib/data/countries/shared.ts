// Text that appears on every country page (same wording for each country).
// Country-specific text lives in each country's own file.

export const countryPageText = {
  technologiesIntro: {
    before: "Every hospital implementing NEST360 has installed a package of",
    linkText: "NEST360 Qualified",
    // Page this link will point to once it exists
    linkTo: "/qualified-technologies",
    after:
      "technologies that includes a selection of devices from each of the categories listed below. The specific device types may vary between hospitals based on their individual needs and requirements.",
  },
  contactLabels: {
    phone: "Phone:",
    email: "Email:",
    address: "Address:",
    website: "Website:",
  },
  training: {
    heading: "Pre-service and in-service education",
    tableHeadings: ["Category of personnel", "Number trained"],
    biomedicalEngineersLabel: "Biomedical Engineers",
    cliniciansLabel: "Clinicians",
  },
  resources: {
    heading: "ACCESS NEST360 CLINICAL AND TECHNICAL RESOURCES",
    text: "Our publicly available clinical and technical education materials are designed to be adapted and embedded in locally-developed in-service and pre-service training courses.",
    link: { label: "Our Resources", href: "/resources" },
  },
  latestNewsHeading: "Latest news",
  readMore: "Read More",
};
