import type { Metadata } from "next";
import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import Link from "next/link";
import { portfolioUrl, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${site.profile.name}.`,
};

export default function CvPage() {
  const { profile, skills, experience, education, certifications, languages } =
    site;
  const socialLinks = [
    profile.github,
    profile.linkedin,
    profile.website,
  ].filter(Boolean);

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
              Generated from the same data as the projects on this site, so it
              never falls out of date.
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
          <header>
            <h2 className="cv-name">{profile.name}</h2>
            <p className="cv-role">{profile.title}</p>
            <div className="cv-contact">
              <span>
                <MapPin />
                {profile.location}
              </span>
              <span>
                <Mail />
                {profile.email}
              </span>
              {profile.showPhone ? (
                <span>
                  <Phone />
                  {profile.phone}
                </span>
              ) : null}
              {profile.github ? (
                <span>
                  <GithubIcon size={12} />
                  {profile.github.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              ) : null}
              {portfolioUrl ? (
                <span>
                  <Globe />
                  Portfolio: {portfolioUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </span>
              ) : null}
              {profile.linkedin ? (
                <span>
                  <LinkedinIcon size={12} />
                  {profile.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              ) : null}
            </div>
          </header>

          <div className="cv-rule" />

          <section>
            <h3 className="cv-h">Summary</h3>
            <p className="cv-text">{profile.summary}</p>
          </section>

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

          {experience.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Experience</h3>
              {experience.map((job, index) => (
                <div className="cv-job" key={`${job.company}-${index}`}>
                  <div className="cv-job-top">
                    <div>
                      <div className="cv-job-role">{job.role}</div>
                      <div className="cv-job-org">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </div>
                    </div>
                    <div className="cv-job-date">
                      {[job.start, job.end].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                  {job.bullets.length > 0 ? (
                    <ul className="cv-bullets">
                      {job.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          <section className="cv-section">
            <h3 className="cv-h">Projects</h3>
            {site.projects.map((project) => (
              <div className="cv-proj" key={project.slug}>
                <div className="cv-job-top">
                  <div>
                    <span className="cv-proj-name">{project.name}</span>
                    <span className="cv-proj-sub"> — {project.subtitle}</span>
                  </div>
                  <div className="cv-job-date">
                    {[project.role, project.year].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <p className="cv-proj-desc">{project.summary}</p>
                {project.tech.length > 0 ? (
                  <p className="cv-tech">
                    Technologies: {project.tech.join(", ")}
                  </p>
                ) : null}
                {project.url ? (
                  <p className="cv-tech">{project.url.replace(/^https?:\/\//, "")}</p>
                ) : null}
              </div>
            ))}
          </section>

          {education.length > 0 ? (
            <section className="cv-section">
              <h3 className="cv-h">Education</h3>
              {education.map((entry, index) => (
                <div className="cv-skill-row" key={`${entry.school}-${index}`}>
                  <span className="cv-skill-key">
                    {[entry.start, entry.end].filter(Boolean).join(" – ")}
                  </span>
                  <span className="cv-skill-val">
                    <strong>{entry.program}</strong>
                    <br />
                    {entry.school}
                  </span>
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

          {socialLinks.length > 0 ? (
            <p className="cv-text" style={{ marginTop: 22, fontSize: "0.72rem" }}>
              References available upon request.
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
