import { timingSafeEqual } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { site as bundledSite } from "@/lib/content";
import { duplicateSlugs } from "@/lib/slug";
import type { Site } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "content", "site.json");

// `next start` also runs with NODE_ENV=production, so NODE_ENV alone is not a
// reliable way to tell "running on my laptop" from "deployed". VERCEL is set
// only on deployments; CONTENT_MODE can override either way.
const hosted =
  process.env.CONTENT_MODE === "github"
    ? true
    : process.env.CONTENT_MODE === "local"
      ? false
      : Boolean(process.env.VERCEL);

function passwordFor(): string {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return hosted ? "" : "admin";
}

function authorised(request: Request): boolean {
  const expected = passwordFor();
  if (!expected) return false;
  const given = request.headers.get("x-admin-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function readLocal(): Site {
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as Site;
  } catch {
    return bundledSite;
  }
}

function currentMode(): "local" | "github" | "locked" {
  if (!hosted) return "local";
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) return "github";
  return "locked";
}

function validSite(value: unknown): value is Site {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Site>;
  return (
    Boolean(candidate.profile) &&
    typeof candidate.profile?.name === "string" &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.skills) &&
    Array.isArray(candidate.experience) &&
    Array.isArray(candidate.education)
  );
}

async function commitToGithub(site: Site): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    return {
      ok: false,
      error:
        "GITHUB_TOKEN and GITHUB_REPO are not set on this deployment. Add them in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  const api = `https://api.github.com/repos/${repo}/contents/content/site.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-admin",
    "Content-Type": "application/json",
  };

  let sha: string | undefined;
  const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, {
    headers,
    cache: "no-store",
  });

  if (existing.ok) {
    const data = (await existing.json()) as { sha?: string };
    sha = data.sha;
  } else if (existing.status !== 404) {
    return { ok: false, error: `GitHub read failed (${existing.status}).` };
  }

  const content = Buffer.from(`${JSON.stringify(site, null, 2)}\n`).toString("base64");

  const commit = await fetch(api, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `content: update portfolio (${new Date().toISOString()})`,
      content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!commit.ok) {
    const detail = await commit.text().catch(() => "");
    return {
      ok: false,
      error: `GitHub write failed (${commit.status}). ${detail.slice(0, 200)}`,
    };
  }

  return { ok: true };
}

export async function GET() {
  return NextResponse.json({
    site: readLocal(),
    mode: currentMode(),
    hasPassword: Boolean(passwordFor()),
    dev: !hosted && process.env.NODE_ENV === "development",
  });
}

export async function PUT(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const incoming = (body as { site?: unknown })?.site;
  if (!validSite(incoming)) {
    return NextResponse.json(
      { error: "Content is missing required sections." },
      { status: 400 },
    );
  }

  const slugs = incoming.projects.map((project) =>
    typeof project?.slug === "string" ? project.slug.trim() : "",
  );

  if (slugs.some((slug) => !slug)) {
    return NextResponse.json(
      { error: "Every project needs a URL slug. Open the project and fill in the slug field." },
      { status: 400 },
    );
  }

  const dupes = duplicateSlugs(slugs);
  if (dupes.length) {
    return NextResponse.json(
      {
        error: `Two or more projects use the slug "${dupes[0]}". Project slugs must be unique because each one becomes its own page.`,
      },
      { status: 400 },
    );
  }

  const pretty = `${JSON.stringify(incoming, null, 2)}\n`;

  if (!hosted) {
    try {
      writeFileSync(FILE, pretty, "utf8");
    } catch {
      return NextResponse.json(
        {
          error:
            "Could not write content/site.json. If this site is deployed, set CONTENT_MODE=github plus GITHUB_TOKEN and GITHUB_REPO.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const result = await commitToGithub(incoming);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, mode: "github" });
}
