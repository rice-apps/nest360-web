// What a country entry contains. Each country has its own file in this folder
// (ethiopia.ts, kenya.ts, ...) that fills in these fields.

export interface PageImage {
  // Path to the image, starting from the public/ folder (e.g. "/images/x.jpg")
  src: string;
  // Short description of the image, read aloud by screen readers
  alt: string;
  // The image file's real size in pixels (used to reserve space while loading)
  width: number;
  height: number;
}

export interface TechnologyGroup {
  category: string;
  devices: string[];
}

// A facility list entry is either a facility name, or a note shown in the
// list, written as { note: "..." }.
export type FacilityEntry = string | { note: string };

export interface FacilityGroup {
  heading: string;
  items: FacilityEntry[];
}

export interface NewsItem {
  title: string;
  // Where the story will live on this site once its page exists
  href: string;
  image: string;
  excerpt?: string;
}

export interface CountryPageData {
  // The page address: "kenya" means the page is at /kenya
  slug: string;
  // Country name, used in the menu, the Where We Work card, and the map
  name: string;
  // ISO 3166-1 numeric country code, used to find the country on the map
  isoNumeric: string;
  // Where the country's name appears on the map on hover: [longitude, latitude]
  mapLabelPosition: [number, number];
  // Photo on the country's Where We Work card
  cardImage: PageImage;

  // ----- Country page content, top to bottom -----
  heading: string;
  intro: string;
  technologies: TechnologyGroup[];
  photos: PageImage[];
  contact: {
    intro: string;
    photo: PageImage;
    name: string;
    role: string;
    phone?: string;
    email: string;
    address: string;
    website?: string;
  };
  training: {
    paragraphs: string[];
    biomedicalEngineers: string;
    clinicians: string;
    footnote: string;
  };
  whereWeWork: {
    heading: string;
    paragraphs: string[];
    footnote?: string;
    map: PageImage;
    groups: FacilityGroup[];
  };
  partners: {
    heading: string;
    paragraph: string;
    logos: PageImage[];
    // Logos per row on wide screens (defaults to 5)
    columns?: 4 | 5;
  };
  news: NewsItem[];
}
