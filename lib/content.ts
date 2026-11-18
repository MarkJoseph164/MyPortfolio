import rawSite from "@/content/site.json";
import type { Project, Site } from "./types";

export const site = rawSite as unknown as Site;

export const profile = site.profile;
export const projects = [...site.projects];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const socials = [
  { key: "github", label: "GitHub", href: profile.github },
  { key: "linkedin", label: "LinkedIn", href: profile.linkedin },
  { key: "facebook", label: "Facebook", href: profile.facebook },
  { key: "website", label: "Website", href: profile.website },
].filter((social) => Boolean(social.href));

/**
 * The live portfolio URL shown on the CV. Uses the URL set in the editor, or
 * falls back to the deployed site URL once NEXT_PUBLIC_SITE_URL is configured.
 */
const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(envSiteUrl);

export const portfolioUrl =
  profile.website || (isLocal ? "" : envSiteUrl) || "https://myportfolio-app-eta.vercel.app";

export type SocialKey = (typeof socials)[number]["key"];

// redeploy-trigger: CV text cleanup
// redeploy-trigger: CV text cleanup
