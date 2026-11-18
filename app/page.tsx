import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { GithubIcon } from "@/components/BrandIcons";
import { featuredProjects, profile, site, socials } from "@/lib/content";
import { experienceTypeLabel } from "@/lib/experience";

function CodeCard() {
  return (
    <div className="code-card float-slow rise rise-2">
      <div className="code-head">
        <span />
        <span />
        <span />
        <em>developer.ts</em>
      </div>
      <div className="code-body">
        <pre>
          <span className="tok-key">const</span> mark = {"{"}
          {"\n  "}
          <span className="tok-prop">role</span>:{" "}
          <span className="tok-str">&quot;Web developer&quot;</span>,{"\n  "}
          <span className="tok-prop">studying</span>:{" "}
          <span className="tok-str">&quot;BS Computer Science&quot;</span>,{"\n  "}
          <span className="tok-prop">stack</span>: [
          <span className="tok-str">&quot;React&quot;</span>,{" "}
          <span className="tok-str">&quot;TypeScript&quot;</span>,{"\n           "}
          <span className="tok-str">&quot;Node&quot;</span>,{" "}
          <span className="tok-str">&quot;Python&quot;</span>],{"\n  "}
          <span className="tok-prop">building</span>: [
          <span className="tok-str">&quot;Lakbay&quot;</span>,{" "}
          <span className="tok-str">&quot;BookMark&quot;</span>],{"\n  "}
          <span className="tok-prop">openTo</span>:{" "}
          <span className="tok-str">&quot;Internships &amp; junior roles&quot;</span>,
          {"\n"}
          {"}"} <span className="tok-key">satisfies</span>{" "}
          <span className="tok-fn">Developer</span>;
          {"\n\n"}
          <span className="tok-com">
            {"// currently shipping something new"}
          </span>
        </pre>
      </div>
      <div className="code-foot">
        <span>
          <b>●</b> online
        </span>
        <span>Quezon City · UTC+8</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const experience = site.experience;

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="rise">
            <span className="avail">
              <span className="dot" />
              {profile.availability}
            </span>

            <h1 className="hero-title">
              {profile.displayName.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="grad-text">
                {profile.displayName.split(" ").slice(-1)}
              </span>
            </h1>

            <p className="hero-lede">
              <strong style={{ color: "var(--text)" }}>{profile.headline}</strong>
              <br />
              {profile.summary}
            </p>

            <div className="hero-actions">
              <Link href="/#projects" className="btn btn-primary">
                View projects
                <ArrowRight />
              </Link>
              <a
                href="/cv.pdf"
                className="btn btn-ghost"
                download="Mark-Joseph-A-Alborez-CV.pdf"
              >
                <Download />
                Download CV
              </a>
              {profile.github ? (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
              ) : null}
            </div>

            <dl className="hero-meta">
              {profile.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <CodeCard />
        </div>
      </section>

      <section className="section" id="projects">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="section-title">Projects</h2>
              <p className="section-sub">
                Things I designed, built, and broke until they worked. Status is
                checked against the live deployment.
              </p>
            </div>
            <Link href="/projects" className="link-quiet">
              All projects
              <ArrowUpRight />
            </Link>
          </div>

          <div className="proj-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Toolkit</p>
              <h2 className="section-title">Skills</h2>
              <p className="section-sub">
                The languages, frameworks, and tools I reach for when building.
              </p>
            </div>
          </div>

          <div className="skill-grid">
            {site.skills.map((group) => (
              <div key={group.group} className="card skill-group">
                <div className="skill-name">{group.group}</div>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {profile.strengths.length > 0 ? (
            <div className="strength-row">
              {profile.strengths.map((strength) => (
                <span key={strength} className="strength">
                  {strength}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Background</p>
              <h2 className="section-title">Experience</h2>
              <p className="section-sub">
                Internships, seminars, volunteer work, and roles — updated as I go.
              </p>
            </div>
          </div>

          {experience.length > 0 ? (
            <div className="timeline">
              {experience.map((job, index) => (
                <div className="tl-item" key={`${job.company}-${index}`}>
                  <div className="tl-top">
                    <div>
                      <div className="tl-role">{job.role}</div>
                      <div className="tl-company">
                        {[experienceTypeLabel(job.type), job.company, job.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="tl-date">
                      {[job.start, job.end].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                  {job.bullets.length > 0 ? (
                    <ul className="tl-list">
                      {job.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {job.tech.length > 0 ? (
                    <div className="chip-row" style={{ marginTop: 10 }}>
                      {job.tech.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No experience or activities yet.</strong> I&apos;m currently
              a Computer Science student at Eclaro Academy, open to internships
              and junior web development roles. Seminars, training, and volunteer
              work will show up here as they come.
            </div>
          )}
        </div>
      </section>

      <section className="section" id="education">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Academics</p>
              <h2 className="section-title">Education</h2>
            </div>
          </div>

          <div className="edu-list">
            {site.education.map((entry, index) => (
              <div className="edu-item" key={`${entry.school}-${index}`}>
                <div className="edu-date">
                  {[entry.start, entry.end].filter(Boolean).join(" — ")}
                </div>
                <div>
                  <div className="edu-school">{entry.program}</div>
                  <div className="edu-program">{entry.school}</div>
                  {entry.note ? <p className="edu-note">{entry.note}</p> : null}
                </div>
              </div>
            ))}
          </div>

          {site.certifications.length > 0 ? (
            <div className="skill-grid" style={{ marginTop: 22 }}>
              {site.certifications.map((cert, index) => (
                <div className="card skill-group" key={`${cert.name}-${index}`}>
                  <div className="skill-name">{cert.year || "Certification"}</div>
                  <div className="edu-school">{cert.name}</div>
                  <div className="edu-note">{cert.issuer}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="contact-card">
            <p className="eyebrow" style={{ position: "relative" }}>
              <Sparkles size={13} />
              Let&apos;s talk
            </p>
            <h2 className="contact-title" style={{ marginTop: 12 }}>
              Have a project, an internship, or a role in mind?
            </h2>
            <p className="contact-copy">
              I&apos;m {profile.location.split(",")[0]}-based and happy to talk
              about web development, school projects, or anything that needs
              building. The fastest way to reach me is email.
            </p>

            <div className="contact-actions">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                <Mail />
                Email me
              </a>
              {socials.map((social) =>
                social.key === "github" ? (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                  >
                    <GithubIcon size={16} />
                    {social.label}
                  </a>
                ) : (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                  >
                    <ArrowUpRight />
                    {social.label}
                  </a>
                ),
              )}
            </div>

            <a href={`mailto:${profile.email}`} className="contact-mail">
              <Mail size={13} />
              {profile.email}
              <span style={{ opacity: 0.5 }}>·</span>
              <MapPin size={13} />
              {profile.location}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
