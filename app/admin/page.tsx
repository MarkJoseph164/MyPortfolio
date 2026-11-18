"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Plus, Save, Trash2 } from "lucide-react";
import { duplicateSlugs, slugify, uniqueSlug } from "@/lib/slug";
import { experienceFieldLabelsFor, experienceTypes } from "@/lib/experience";
import type { ExperienceType, Site } from "@/lib/types";

type Mode = "local" | "github" | "locked";

function Text({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="input"
        style={mono ? { fontFamily: "var(--font-mono), monospace" } : undefined}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {hint ? (
          <em style={{ textTransform: "none", letterSpacing: 0, opacity: 0.7 }}>
            {" "}
            — {hint}
          </em>
        ) : null}
      </span>
      <textarea
        className="textarea"
        rows={rows}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className="field"
      style={{ gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 8 }}
    >
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span style={{ textTransform: "none", letterSpacing: 0 }}>{label}</span>
    </label>
  );
}

const csv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("local");
  const [dev, setDev] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let stored = "";
    try {
      stored = sessionStorage.getItem("admin-pw") ?? "";
    } catch {
      /* ignore */
    }
    setPassword(stored);

    fetch("/api/content")
      .then((response) => response.json())
      .then((data) => {
        setSite(data.site as Site);
        setMode(data.mode as Mode);
        setDev(Boolean(data.dev));
        if (!stored && data.mode === "local") setPassword("admin");
      })
      .catch(() => setError("Could not load content."));
  }, []);

  function mutate(change: (draft: Site) => void) {
    setSite((previous) => {
      if (!previous) return previous;
      const next = structuredClone(previous);
      change(next);
      return next;
    });
  }

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 4000);
  }

  function addProject() {
    const stamp = Date.now().toString(36);
    const slug = uniqueSlug(
      `project-${stamp}`,
      (site?.projects ?? []).map((project) => project.slug),
    );

    mutate((d) => {
      d.projects.push({
        slug,
        name: "New project",
        subtitle: "",
        tagline: "",
        role: "",
        year: new Date().getFullYear().toString(),
        status: "auto",
        url: "",
        repo: "",
        repoPublic: false,
        tech: [],
        summary: "",
        description: [""],
        features: [],
        challenge: "",
        screenshots: [],
        demo: { label: "", value: "" },
        featured: true,
        coverTheme: 1,
        aiAssisted: true,
      });
    });

    flash("Project added — fill in the fields, then hit Save changes.");
    window.setTimeout(() => {
      const panel = document.querySelector<HTMLDetailsElement>(
        `details[data-slug="${slug}"]`,
      );
      if (!panel) return;
      panel.open = true;
      panel.scrollIntoView({ behavior: "instant", block: "start" });
      panel.querySelector<HTMLInputElement>(".input")?.focus({ preventScroll: true });
    }, 250);
  }

  async function save() {
    if (!site) return;

    const dupes = duplicateSlugs(site.projects.map((project) => project.slug));
    if (dupes.length) {
      setError(
        `Two or more projects use the slug "${dupes[0]}". Every project needs its own URL slug — fix the highlighted field, then save again.`,
      );
      return;
    }

    setBusy(true);
    setError("");
    try {
      sessionStorage.setItem("admin-pw", password);
    } catch {
      /* ignore */
    }

    const response = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ site }),
    });

    const data = await response.json().catch(() => ({}));
    setBusy(false);

    if (!response.ok) {
      setError(data.error ?? "Save failed.");
      return;
    }

    flash(
      data.mode === "github"
        ? "Saved. Vercel is redeploying — the site updates in about a minute."
        : dev
          ? "Saved. Changes are live now — open the site to check."
          : "Saved to content/site.json. Run npm run dev to see it on the site.",
    );
  }

  function downloadBackup() {
    if (!site) return;
    const blob = new Blob([`${JSON.stringify(site, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "site-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!site) {
    return (
      <section className="section">
        <div className="wrap">
          <p style={{ color: "var(--muted)" }}>
            {error || "Loading content…"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 980 }}>
        <Link href="/" className="back-link">
          <ArrowLeft size={15} />
          Back to site
        </Link>

        <div className="admin-head">
          <div>
            <p className="eyebrow">Content editor</p>
            <h1 className="section-title" style={{ marginTop: 8 }}>
              Edit my portfolio
            </h1>
            <p className="cv-note">
              Everything here feeds the website, the project pages, and the CV
              PDF. One save updates all of them.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" type="button" onClick={downloadBackup}>
              <Download />
              Backup JSON
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={save}
              disabled={busy || mode === "locked"}
            >
              <Save />
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {mode === "locked" ? (
          <div className="banner">
            Live saving is not configured. Set <code>ADMIN_PASSWORD</code>,{" "}
            <code>GITHUB_TOKEN</code>, and <code>GITHUB_REPO</code> in Vercel →
            Settings → Environment Variables, then redeploy. Local edits still
            work when running the site on your machine.
          </div>
        ) : null}

        {error ? <div className="banner">{error}</div> : null}

        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-head">
            <span className="panel-title">Admin password</span>
            <span className="chip">
              {mode === "github" ? "saves via GitHub" : mode === "local" ? "local file" : "read only"}
            </span>
          </div>
          <div className="panel-body">
            <Text
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="The ADMIN_PASSWORD you set"
              mono
            />
            <p className="cv-note" style={{ fontSize: "0.75rem" }}>
              Kept in this browser tab only. Local default is{" "}
              <code>admin</code> when no environment variable is set.
              {mode === "local"
                ? " Local saves write content/site.json — run npm run dev to see them instantly on this machine."
                : ""}
            </p>
          </div>
        </div>

        {/* Profile ------------------------------------------------------- */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Profile</span>
          </div>
          <div className="panel-body">
            <div className="grid-2">
              <Text
                label="Full name"
                value={site.profile.name}
                onChange={(value) => mutate((d) => (d.profile.name = value))}
              />
              <Text
                label="Display name"
                value={site.profile.displayName}
                onChange={(value) => mutate((d) => (d.profile.displayName = value))}
              />
              <Text
                label="Title"
                value={site.profile.title}
                onChange={(value) => mutate((d) => (d.profile.title = value))}
              />
              <Text
                label="Availability"
                value={site.profile.availability}
                onChange={(value) => mutate((d) => (d.profile.availability = value))}
              />
              <Text
                label="Location"
                value={site.profile.location}
                onChange={(value) => mutate((d) => (d.profile.location = value))}
              />
              <Text
                label="Headline"
                value={site.profile.headline}
                onChange={(value) => mutate((d) => (d.profile.headline = value))}
              />
              <Text
                label="Email"
                value={site.profile.email}
                onChange={(value) => mutate((d) => (d.profile.email = value))}
              />
              <Text
                label="Phone"
                value={site.profile.phone}
                onChange={(value) => mutate((d) => (d.profile.phone = value))}
              />
              <Text
                label="GitHub URL"
                value={site.profile.github}
                onChange={(value) => mutate((d) => (d.profile.github = value))}
              />
              <Text
                label="LinkedIn URL"
                value={site.profile.linkedin}
                onChange={(value) => mutate((d) => (d.profile.linkedin = value))}
              />
              <Text
                label="Portfolio / website URL"
                value={site.profile.website}
                onChange={(value) => mutate((d) => (d.profile.website = value))}
                placeholder="Leave empty to use this site's own URL"
              />
              <Text
                label="Strengths"
                value={site.profile.strengths.join(", ")}
                onChange={(value) => mutate((d) => (d.profile.strengths = csv(value)))}
              />
            </div>
            <Check
              label="Show phone number on the website and CV"
              checked={site.profile.showPhone}
              onChange={(value) => mutate((d) => (d.profile.showPhone = value))}
            />
            <Area
              label="Summary"
              rows={4}
              value={site.profile.summary}
              onChange={(value) => mutate((d) => (d.profile.summary = value))}
            />
          </div>
        </div>

        {/* Projects ----------------------------------------------------- */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Projects ({site.projects.length})</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={addProject}
            >
              <Plus />
              Add project
            </button>
          </div>
          <div className="panel-body">
            {site.projects.map((project, index) => (
              <details
                className="subpanel"
                key={index}
                data-slug={project.slug}
              >
                <summary className="subpanel-head" style={{ cursor: "pointer" }}>
                  <span>
                    {project.name}
                    <span className="chip" style={{ marginLeft: 8 }}>
                      {project.status}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="link-quiet"
                    onClick={(event) => {
                      event.preventDefault();
                      if (!confirm(`Delete ${project.name}?`)) return;
                      mutate((d) => d.projects.splice(index, 1));
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </summary>

                <div className="grid-2" style={{ marginTop: 10 }}>
                  <Text
                    label="Name"
                    value={project.name}
                    onChange={(value) =>
                      mutate((d) => {
                        const target = d.projects[index];
                        // Keep following the name until the slug is customised.
                        const stillAuto =
                          !target.slug ||
                          target.slug === slugify(target.name) ||
                          /^project-[a-z0-9]+$/.test(target.slug);
                        target.name = value;
                        if (stillAuto && value.trim()) {
                          const taken = d.projects
                            .filter((_, otherIndex) => otherIndex !== index)
                            .map((other) => other.slug);
                          target.slug = uniqueSlug(value, taken);
                        }
                      })
                    }
                  />
                  <Text
                    label="Subtitle"
                    value={project.subtitle}
                    onChange={(value) => mutate((d) => (d.projects[index].subtitle = value))}
                  />
                  <div>
                    <Text
                      label="URL slug"
                      value={project.slug}
                      onChange={(value) =>
                        mutate(
                          (d) =>
                            (d.projects[index].slug = value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, "-")
                              .replace(/^-|-$/g, "")),
                        )
                      }
                    />
                    {site.projects.some(
                      (other, otherIndex) =>
                        otherIndex !== index && other.slug === project.slug,
                    ) ? (
                      <p className="field-warn">
                        Another project already uses this slug. Both would share
                        one page — rename this one before saving.
                      </p>
                    ) : null}
                  </div>
                  <label className="field">
                    <span>Status</span>
                    <select
                      className="select"
                      value={project.status}
                      onChange={(event) =>
                        mutate((d) => {
                          d.projects[index].status = event.target.value as typeof project.status;
                        })
                      }
                    >
                      <option value="auto">Auto — check the live URL</option>
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                      <option value="offline">Offline</option>
                      <option value="archived">Archived</option>
                      <option value="wip">In progress</option>
                    </select>
                  </label>
                  <Text
                    label="Live URL"
                    value={project.url}
                    onChange={(value) => mutate((d) => (d.projects[index].url = value))}
                    placeholder="https://…vercel.app"
                  />
                  <Text
                    label="Repo URL"
                    value={project.repo}
                    onChange={(value) => mutate((d) => (d.projects[index].repo = value))}
                  />
                  <Text
                    label="Role"
                    value={project.role}
                    onChange={(value) => mutate((d) => (d.projects[index].role = value))}
                  />
                  <Text
                    label="Year"
                    value={project.year}
                    onChange={(value) => mutate((d) => (d.projects[index].year = value))}
                  />
                  <Text
                    label="Tech stack"
                    value={project.tech.join(", ")}
                    onChange={(value) => mutate((d) => (d.projects[index].tech = csv(value)))}
                  />
                  <Text
                    label="Screenshots"
                    value={project.screenshots.join(", ")}
                    onChange={(value) =>
                      mutate((d) => (d.projects[index].screenshots = csv(value)))
                    }
                    placeholder="/projects/lakbay/home.png"
                  />
                  <Text
                    label="Demo login label"
                    value={project.demo.label}
                    onChange={(value) =>
                      mutate((d) => (d.projects[index].demo.label = value))
                    }
                    placeholder="e.g. Demo account"
                  />
                  <Text
                    label="Demo login value"
                    value={project.demo.value}
                    onChange={(value) =>
                      mutate((d) => (d.projects[index].demo.value = value))
                    }
                  />
                </div>
                <Check
                  label="Show on the home page"
                  checked={project.featured}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].featured = value))
                  }
                />
                <Check
                  label="Repo is public (show the Code link)"
                  checked={project.repoPublic}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].repoPublic = value))
                  }
                />
                <Check
                  label="AI used as a development tool (noted on the CV)"
                  checked={Boolean(project.aiAssisted)}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].aiAssisted = value))
                  }
                />
                <Area
                  label="Tagline"
                  rows={2}
                  value={project.tagline}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].tagline = value))
                  }
                />
                <Area
                  label="Short summary"
                  hint="used on the CV"
                  rows={3}
                  value={project.summary}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].summary = value))
                  }
                />
                <Area
                  label="Description"
                  hint="one paragraph per line"
                  rows={4}
                  value={project.description.join("\n")}
                  onChange={(value) =>
                    mutate(
                      (d) =>
                        (d.projects[index].description = value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)),
                    )
                  }
                />
                <Area
                  label="Features"
                  hint="one per line"
                  rows={3}
                  value={project.features.join("\n")}
                  onChange={(value) =>
                    mutate(
                      (d) =>
                        (d.projects[index].features = value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)),
                    )
                  }
                />
                <Area
                  label="Hardest part"
                  rows={2}
                  value={project.challenge}
                  onChange={(value) =>
                    mutate((d) => (d.projects[index].challenge = value))
                  }
                />
              </details>
            ))}

            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={addProject}
              style={{ marginTop: 4 }}
            >
              <Plus />
              Add another project
            </button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Experience &amp; activities ({site.experience.length})</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                mutate((d) => {
                  d.experience.push({
                    type: "job",
                    company: "",
                    role: "",
                    start: "",
                    end: "",
                    location: "",
                    bullets: [""],
                    tech: [],
                  });
                })
              }
            >
              <Plus />
              Add experience
            </button>
          </div>
          <div className="panel-body">
            {site.experience.length === 0 ? (
              <p className="cv-note" style={{ fontSize: "0.8rem" }}>
                Empty for now — the site shows a short note and the CV simply
                skips this section.
              </p>
            ) : null}
            {site.experience.map((job, index) => (
              <details className="subpanel" key={index}>
                <summary className="subpanel-head" style={{ cursor: "pointer" }}>
                  <span>{job.role || "New experience"}</span>
                  <button
                    type="button"
                    className="link-quiet"
                    onClick={(event) => {
                      event.preventDefault();
                      mutate((d) => d.experience.splice(index, 1));
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </summary>
                <div className="grid-2" style={{ marginTop: 10 }}>
                  <label className="field">
                    <span>Type</span>
                    <select
                      className="select"
                      value={job.type ?? "job"}
                      onChange={(event) =>
                        mutate(
                          (d) =>
                            (d.experience[index].type = event.target
                              .value as ExperienceType),
                        )
                      }
                    >
                      {experienceTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Text
                    label={experienceFieldLabelsFor(job.type).role}
                    value={job.role}
                    onChange={(value) => mutate((d) => (d.experience[index].role = value))}
                  />
                  <Text
                    label={experienceFieldLabelsFor(job.type).company}
                    value={job.company}
                    onChange={(value) =>
                      mutate((d) => (d.experience[index].company = value))
                    }
                  />
                  <Text
                    label="Start"
                    value={job.start}
                    onChange={(value) => mutate((d) => (d.experience[index].start = value))}
                  />
                  <Text
                    label="End"
                    value={job.end}
                    onChange={(value) => mutate((d) => (d.experience[index].end = value))}
                    placeholder="Present"
                  />
                  <Text
                    label="Location"
                    value={job.location}
                    onChange={(value) =>
                      mutate((d) => (d.experience[index].location = value))
                    }
                  />
                  <Text
                    label="Tags / topics"
                    value={job.tech.join(", ")}
                    onChange={(value) => mutate((d) => (d.experience[index].tech = csv(value)))}
                  />
                </div>
                <Area
                  label={experienceFieldLabelsFor(job.type).bullets}
                  hint="one per line"
                  rows={4}
                  value={job.bullets.join("\n")}
                  onChange={(value) =>
                    mutate(
                      (d) =>
                        (d.experience[index].bullets = value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)),
                    )
                  }
                />
              </details>
            ))}
          </div>
        </div>

        {/* Skills ------------------------------------------------------- */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Skills</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                mutate((d) => {
                  d.skills.push({ group: "New group", items: [] });
                })
              }
            >
              <Plus />
              Add group
            </button>
          </div>
          <div className="panel-body">
            {site.skills.map((group, index) => (
              <div className="subpanel" key={index}>
                <div className="grid-2">
                  <Text
                    label="Group"
                    value={group.group}
                    onChange={(value) => mutate((d) => (d.skills[index].group = value))}
                  />
                  <Text
                    label="Items (comma separated)"
                    value={group.items.join(", ")}
                    onChange={(value) => mutate((d) => (d.skills[index].items = csv(value)))}
                  />
                </div>
                <button
                  type="button"
                  className="link-quiet"
                  onClick={() => mutate((d) => d.skills.splice(index, 1))}
                >
                  <Trash2 size={14} />
                  Remove group
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education ---------------------------------------------------- */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Education</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                mutate((d) => {
                  d.education.push({ school: "", program: "", start: "", end: "", note: "" });
                })
              }
            >
              <Plus />
              Add school
            </button>
          </div>
          <div className="panel-body">
            {site.education.map((entry, index) => (
              <div className="subpanel" key={index}>
                <div className="grid-2">
                  <Text
                    label="Program"
                    value={entry.program}
                    onChange={(value) => mutate((d) => (d.education[index].program = value))}
                  />
                  <Text
                    label="School"
                    value={entry.school}
                    onChange={(value) => mutate((d) => (d.education[index].school = value))}
                  />
                  <Text
                    label="Start"
                    value={entry.start}
                    onChange={(value) => mutate((d) => (d.education[index].start = value))}
                  />
                  <Text
                    label="End"
                    value={entry.end}
                    onChange={(value) => mutate((d) => (d.education[index].end = value))}
                  />
                </div>
                <Area
                  label="Note"
                  rows={2}
                  value={entry.note}
                  onChange={(value) => mutate((d) => (d.education[index].note = value))}
                />
                <button
                  type="button"
                  className="link-quiet"
                  onClick={() => mutate((d) => d.education.splice(index, 1))}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & languages ----------------------------------- */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Certifications &amp; languages</span>
          </div>
          <div className="panel-body">
            <div className="grid-2">
              <Text
                label="Languages spoken"
                value={site.languages.join(", ")}
                onChange={(value) => mutate((d) => (d.languages = csv(value)))}
              />
            </div>
            {site.certifications.map((cert, index) => (
              <div className="grid-2" key={index}>
                <Text
                  label="Certification"
                  value={cert.name}
                  onChange={(value) =>
                    mutate((d) => (d.certifications[index].name = value))
                  }
                />
                <Text
                  label="Issuer"
                  value={cert.issuer}
                  onChange={(value) =>
                    mutate((d) => (d.certifications[index].issuer = value))
                  }
                />
                <Text
                  label="Year"
                  value={cert.year}
                  onChange={(value) =>
                    mutate((d) => (d.certifications[index].year = value))
                  }
                />
                <button
                  type="button"
                  className="link-quiet"
                  onClick={() => mutate((d) => d.certifications.splice(index, 1))}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ justifySelf: "start" }}
              onClick={() =>
                mutate((d) => {
                  d.certifications.push({ name: "", issuer: "", year: "" });
                })
              }
            >
              <Plus />
              Add certification
            </button>
          </div>
        </div>

        {error ? (
          <div className="banner" style={{ marginTop: 16 }}>
            {error}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <button
            className="btn btn-primary"
            type="button"
            onClick={save}
            disabled={busy || mode === "locked"}
          >
            <Save />
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>

        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </section>
  );
}
