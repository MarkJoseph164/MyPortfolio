import type { ExperienceType } from "./types";

interface ExperienceTypeOption {
  value: ExperienceType;
  /** Shown in the admin dropdown. */
  label: string;
  /** Shown on the site and CV. Falls back to label. */
  display?: string;
}

export const experienceTypes: ExperienceTypeOption[] = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "speaking", label: "Speaker / talk", display: "Speaker" },
  { value: "seminar", label: "Seminar (attended)" },
  { value: "training", label: "Training" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organization", label: "Organization" },
  { value: "award", label: "Award" },
  { value: "other", label: "Other" },
];

/**
 * Badge shown before the organisation on the site and CV.
 * Jobs stay unlabelled so the timeline reads the same as before.
 */
export function experienceTypeLabel(type?: string): string {
  if (!type || type === "job") return "";
  const option = experienceTypes.find((item) => item.value === type);
  return option?.display ?? option?.label ?? "";
}

export interface ExperienceFieldLabels {
  role: string;
  company: string;
  bullets: string;
}

const fieldLabels: Partial<Record<ExperienceType, ExperienceFieldLabels>> = {
  speaking: {
    role: "Talk title",
    company: "Event / organizer",
    bullets: "Talk summary or key points",
  },
  seminar: {
    role: "Seminar title",
    company: "Organizer / host",
    bullets: "Topics covered or takeaways",
  },
  training: {
    role: "Training title",
    company: "Provider / organizer",
    bullets: "Skills learned",
  },
  volunteer: {
    role: "Role",
    company: "Organization",
    bullets: "What you did",
  },
  organization: {
    role: "Position",
    company: "Organization",
    bullets: "Responsibilities",
  },
  award: {
    role: "Award",
    company: "Awarded by",
    bullets: "What it was for",
  },
};

const defaultFieldLabels: ExperienceFieldLabels = {
  role: "Role / title",
  company: "Company / organization",
  bullets: "Responsibilities and results",
};

export function experienceFieldLabelsFor(type?: string): ExperienceFieldLabels {
  return fieldLabels[type as ExperienceType] ?? defaultFieldLabels;
}
