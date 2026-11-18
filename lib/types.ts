export type ProjectStatus =
  | "auto"
  | "live"
  | "paused"
  | "offline"
  | "archived"
  | "wip";

export type ResolvedStatus = Exclude<ProjectStatus, "auto"> | "checking";

export interface Fact {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  displayName: string;
  title: string;
  headline: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  showPhone: boolean;
  github: string;
  linkedin: string;
  facebook: string;
  website: string;
  summary: string;
  facts: Fact[];
  strengths: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export type ExperienceType =
  | "job"
  | "internship"
  | "freelance"
  | "speaking"
  | "seminar"
  | "training"
  | "volunteer"
  | "organization"
  | "award"
  | "other";

export interface Experience {
  type?: ExperienceType;
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  bullets: string[];
  tech: string[];
}

export interface Education {
  school: string;
  program: string;
  start: string;
  end: string;
  note: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  role: string;
  year: string;
  status: ProjectStatus;
  url: string;
  repo: string;
  repoPublic: boolean;
  tech: string[];
  summary: string;
  description: string[];
  features: string[];
  challenge: string;
  screenshots: string[];
  demo: { label: string; value: string };
  featured: boolean;
  coverTheme: number;
  /** True when AI tools were used to help build the project (shown on the CV). */
  aiAssisted?: boolean;
}

export interface Site {
  profile: Profile;
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: string[];
  projects: Project[];
}
