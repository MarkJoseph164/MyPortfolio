import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { getProject, projects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — ${project.subtitle}`,
    description: project.tagline,
    openGraph: {
      title: `${project.name} — ${project.subtitle}`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="detail-hero">
        <div className="wrap">
          <Link href="/projects" className="back-link">
            <ArrowLeft size={15} />
            All projects
          </Link>

          <div className="detail-grid">
            <div>
              <div className="chip-row" style={{ marginBottom: 14 }}>
                <StatusBadge status={project.status} url={project.url} />
                {project.year ? <span className="chip">{project.year}</span> : null}
                {project.role ? <span className="chip">{project.role}</span> : null}
              </div>

              <h1 className="detail-title">{project.name}</h1>
              <p
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  marginTop: 8,
                  fontSize: "0.95rem",
                }}
              >
                {project.subtitle}
              </p>
              <p className="hero-lede" style={{ marginTop: 18 }}>
                {project.tagline}
              </p>

              <div className="prose-block" style={{ marginTop: 28 }}>
                {project.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {project.features.length > 0 ? (
                <div style={{ marginTop: 26 }}>
                  <h2 className="section-title" style={{ fontSize: "1.1rem" }}>
                    What it does
                  </h2>
                  <ul className="feature-list">
                    {project.features.map((feature) => (
                      <li key={feature}>
                        <Check />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.challenge ? (
                <div style={{ marginTop: 26 }}>
                  <h2 className="section-title" style={{ fontSize: "1.1rem" }}>
                    Hardest part
                  </h2>
                  <p
                    style={{
                      color: "var(--muted)",
                      marginTop: 8,
                      lineHeight: 1.7,
                      fontSize: "0.92rem",
                      maxWidth: "68ch",
                    }}
                  >
                    {project.challenge}
                  </p>
                </div>
              ) : null}

              {project.screenshots.length > 0 ? (
                <div style={{ marginTop: 30 }}>
                  <h2 className="section-title" style={{ fontSize: "1.1rem" }}>
                    Screenshots
                  </h2>
                  <div className="shot-grid">
                    {project.screenshots.map((shot) => (
                      <div className="shot" key={shot}>
                        <img
                          src={shot}
                          alt={`${project.name} screenshot`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="detail-side">
              <div className="card side-card">
                <div className="side-label">Stack</div>
                <div className="chip-row">
                  {project.tech.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.demo?.label ? (
                <div className="card side-card">
                  <div className="side-label">{project.demo.label}</div>
                  <div className="side-value mono">{project.demo.value}</div>
                </div>
              ) : null}

              <div className="card side-card" style={{ display: "grid", gap: 9 }}>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-block"
                  >
                    <ExternalLink />
                    Open live site
                  </a>
                ) : (
                  <span className="btn btn-ghost btn-block" aria-disabled>
                    <ExternalLink />
                    Not deployed
                  </span>
                )}
                {project.repoPublic && project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-block"
                  >
                    <Code2 />
                    View source
                  </a>
                ) : null}
                <Link href="/cv" className="link-quiet" style={{ justifyContent: "center" }}>
                  See it on my CV
                  <ArrowUpRight />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div style={{ height: 60 }} />
    </>
  );
}
