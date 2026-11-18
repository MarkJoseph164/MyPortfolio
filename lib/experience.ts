import type { ExperienceType } from "./types";

export const experienceTypes: { value: ExperienceType; label: string }[] = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "seminar", label: "Seminar" },
  { value: "training", label: "Training" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organization", label: "Organization" },
  { value: "award", label: "Award" },
  { value: "other", label: "Other" },
];

export function experienceTypeLabel(type?: string): string {
  return experienceTypes.find((item) => item.value === type)?.label ?? "Experience";
}
