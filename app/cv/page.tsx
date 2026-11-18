import type { Metadata } from "next";
import { Download } from "lucide-react";
import Link from "next/link";
import CvPhoto from "@/components/CvPhoto";
import CvPrintFit from "@/components/CvPrintFit";
import { portfolioUrl, site } from "@/lib/content";
import { experienceTypeLabel } from "@/lib/experience";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${site.profile.name}.`,
};

function stripUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function dateRange(start: string, end: string) {
  return [start, end].filter(Boolean).join(" – ");
}

export default function CvPage() {
  const { profile, skills, experience, education, certifications, languages } =
    site;

  const contacts = [
    profile.location ? { text: profile.location } : null,
    profile.email
      ? { text: profile.email, href: `mailto:${profile.email}` }
      : null,
    profile.showPhone && profile.phone ? { text: profile.phone } : null,
    profile.github
      ? { text: stripUrl(profile.github), href: profile.github }
      : null,
    profile.linkedin
      ? { text: stripUrl(profile.linkedin), href: profile.linkedin }
      : null,
    portfolioUrl ? { text: stripUrl(portfolioUrl), href: portfolioUrl } : null,
  ].filter(Boolean) as { text: string; href?: string }[];

  return (
    <section className="section">
      <div className="wrap">
        <div className="cv-toolbar no-print">
          <div>
            <p className="eyebrow">Resume</p>
            <h1 className="section-title" style={{ marginTop: 8 }}>
              Curriculum Vitae
            </h1>
            <p className="cv-note">
              Generated from the same data as this site, so it never falls out of
              date.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/admin" className="btn btn-ghost no-print">
              Edit CV
            </Link>
            <a
              href="/cv.pdf"
              className="btn btn-primary"
              download="Mark-Joseph-A-Alborez-CV.pdf"
            >
              <Download />
              Download PDF
            </a>
          </div>
        </div>

        <article className="cv-paper">
          <CvPrintFit />
          <header className="cv-head">
            <div className="cv-head-main">
              <h2 className="cv-name">{profile.name}</h2>
              <p className="cv-role">{profile.title}</p>
              <div className="cv-contact">
                {contacts.map((item) => (
                  <span className="cv-contact-item" key={item.text}>
                    {item.href ? (
                      <a href={item.href}>{item.text}</a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <CvPhoto />
          </header>

          <div className="cv-rule" />

          <section className="cv-section">
            <h3 className="cv-h">Profile</h3>
            <p className="cv-text">{profile.summary}</p>
          </section>

          {education.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Education</h3>
              {education.map((entry, index) => (
                <div className="cv-entry" key={`${entry.school}-${index}`}>
                  <div className="cv-entry-head">
                    <div>
                      <div className="cv-entry-title">{entry.program}</div>
                      <div className="cv-entry-sub">{entry.school}</div>
                    </div>
                    <div className="cv-entry-date">
                      {dateRange(entry.start, entry.end)}
                    </div>
                  </div>
                  {entry.note ? (
                    <p className="cv-entry-note">{entry.note}</p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {experience.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Experience &amp; Activities</h3>
              {experience.map((job, index) => (
                <div className="cv-entry" key={`${job.company}-${index}`}>
                  <div className="cv-entry-head">
                    <div>
                      <div className="cv-entry-title">{job.role}</div>
                      <div className="cv-entry-sub">
                        {[experienceTypeLabel(job.type), job.company, job.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="cv-entry-date">
                      {dateRange(job.start, job.end)}
                    </div>
                  </div>
                  {job.bullets.length > 0 ? (
                    <ul className="cv-bullets">
                      {job.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {job.tech.length > 0 ? (
                    <p className="cv-tech">
                      Topics: {job.tech.join(", ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {site.projects.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Projects</h3>
              {site.projects.map((project) => (
                <div className="cv-entry" key={project.slug}>
                  <div className="cv-entry-head">
                    <div>
                      <span className="cv-entry-title">{project.name}</span>
                      {project.subtitle ? (
                        <span className="cv-proj-sub"> — {project.subtitle}</span>
                      ) : null}
                    </div>
                    <div className="cv-entry-date">
                      {[project.role, project.year].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <p className="cv-entry-note">{project.summary}</p>
                  {project.tech.length > 0 ? (
                    <p className="cv-tech">
                      Technologies: {project.tech.join(", ")}
                    </p>
                  ) : null}
                  {project.aiAssisted ? (
                    <p className="cv-tech">
                      AI tools: used as a development aid for coding, debugging,
                      and documentation.
                    </p>
                  ) : null}
                  {project.url ? (
                    <p className="cv-tech">{stripUrl(project.url)}</p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {skills.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Technical Skills</h3>
              {skills.map((group) => (
                <div className="cv-skill-row" key={group.group}>
                  <span className="cv-skill-key">{group.group}</span>
                  <span className="cv-skill-val">{group.items.join(", ")}</span>
                </div>
              ))}
            </section>
          ) : null}

          {certifications.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Certifications &amp; Awards</h3>
              {certifications.map((cert, index) => (
                <div className="cv-skill-row" key={`${cert.name}-${index}`}>
                  <span className="cv-skill-key">{cert.year}</span>
                  <span className="cv-skill-val">
                    {cert.name}
                    {cert.issuer ? ` — ${cert.issuer}` : ""}
                  </span>
                </div>
              ))}
            </section>
          ) : null}

          {languages.length > 0 || profile.strengths.length > 0 ? (
            <section className="cv-section">
              <div className="cv-two">
                {languages.length > 0 ? (
                  <div>
                    <h3 className="cv-h">Languages</h3>
                    <p className="cv-text">{languages.join(", ")}</p>
                  </div>
                ) : null}
                {profile.strengths.length > 0 ? (
                  <div>
                    <h3 className="cv-h">Strengths</h3>
                    <p className="cv-text">{profile.strengths.join(" · ")}</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <p className="cv-references">References available upon request.</p>
        </article>
      </div>
    </section>
  );
}
