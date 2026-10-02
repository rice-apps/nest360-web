// this is a draft, will likely be changed later

export type ResourceType =
  | "guide"
  | "training"
  | "video"
  | "report"
  | "tool"
  | "story";

export type Audience = "donor" | "policymaker" | "clinician" | "engineer";

export type Language = "en" | "fr" | "pt" | "sw";

export type ResourceSource =
  | { kind: "file"; url: string; format: "pdf" | "docx" | "xlsx" | "pptx"; sizeBytes: number }
  | { kind: "link"; url: string }
  | { kind: "video"; vimeoId: string; durationSeconds?: number };

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  audiences: Audience[];
  topics: string[];
  language: Language;
  publishedAt: string; // ISO date, e.g. "2025-03-14"
  source: ResourceSource;
  thumbnailUrl?: string;
}

export interface ResourceFilters {
  type?: ResourceType;
  audience?: Audience;
  language?: Language;
  topic?: string;
}

export interface Country {
  code: string; // ISO 3166-1 alpha-2, e.g. "KE"
  name: string;
  summary: string;
  facilityCount?: number;
}

export interface ImpactStat {
  label: string;
  value: string;
}