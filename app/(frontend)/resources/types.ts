export type ResourceCategory =
  | 'healthcare'
  | 'innovators'
  | 'families'
  | 'implementors'
  | 'dashboards'
  | 'library'; // individual resources from the Resources collection (they have no audience)

export interface ResourceMedia {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;

  badgeText?: string;
  image?: ResourceMedia | string;
  icon?: string;

  linkUrl?: string;
  opensInNewTab?: boolean; // for files and outside links, rather than pages on this site
  downloadUrl?: string;
  publishedDate?: string;
  lastModified?: string; // ISO date of the last change in the admin, shown on the card as "Month Year"
  authorOrOrganization?: string;
  tags?: string[];

  searchText?: string; // extra words the search box matches but the card doesn't show (e.g. a paper's authors and DOI)

  contentTypes?: string[];
  topics?: string[];
}
