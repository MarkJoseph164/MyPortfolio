import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";

function initials(project: Project): string {
  const words = project.subtitle
    .replace(/[^a-zA-Z ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return project.name.slice(0, 2).toUpperCase();
}

export default function ProjectCard({ project }: { project: Project }) {
  const screenshot = project.screenshots[0];

  return (
    <article className="card proj-card">
      <Link
        href={`/projects/${project.slug}`}
        className={`cover cover-${project.coverTheme || 1}`}
        aria-label={`${project.name} details`}
      >
        {screenshot ? (
          <img
            src={screenshot}
            alt={`${project.name} screenshot`}
            className="cover-img"
            loading="lazy"
          />
        ) : (
          <div className="cover-inner">
            <div className="cover-mono">{initials(project)}</div>
            <div className="cover-sub">{project.subtitle}</div>
          </div>
        )}
      </Link>

      <div className="proj-body">
        <div className="proj-head">
          <div>
            <h3 className="proj-name">{project.name}</h3>
            <p className="proj-sub">{project.subtitle}</p>
          </div>
          <StatusBadge status={project.status} url={project.url} />
        </div>

        <p className="proj-tag">{project.tagline}</p>

        <div className="chip-row">
          {project.tech.slice(0, 4).map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="proj-foot">
          <div className="proj-links">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="link-quiet"
              >
                <ExternalLink />
                Visit
              </a>
            ) : null}
            {project.repoPublic && project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="link-quiet"
              >
                <Code2 />
                Code
              </a>
            ) : null}
          </div>
          <Link href={`/projects/${project.slug}`} className="link-quiet">
            Details
            <ArrowUpRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
