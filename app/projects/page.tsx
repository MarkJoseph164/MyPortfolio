import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Web applications, academic projects, and experiments by Mark Joseph Alborez.",
};

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="wrap">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} />
          Back home
        </Link>

        <div className="section-head">
          <div>
            <p className="eyebrow">Everything</p>
            <h1 className="section-title">All projects</h1>
            <p className="section-sub">
              {projects.length} projects so far — academic work, web apps, and
              whatever I&apos;m building next. Status reflects the real deployment.
            </p>
          </div>
        </div>

        <div className="proj-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
