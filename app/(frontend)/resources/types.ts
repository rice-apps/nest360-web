export type ResourceCategory = 
    | 'healthcare'
    | 'innovators'
    | 'families'
    | 'implementors'
    | 'dashboards'; 

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
    downloadUrl?: string; 
    publishedDate?: string; 
    authorOrOrganization?: string; 
    tags?: string[];

}

