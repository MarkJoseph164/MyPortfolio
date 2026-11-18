import { NextResponse } from "next/server";
import { projects } from "@/lib/content";
import { probeUrl } from "@/lib/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Only probe URLs that belong to a project in the content file. This keeps
  // the endpoint from being used to fetch arbitrary addresses.
  const known = projects.some((project) => project.url === url);
  if (!known) {
    return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  }

  const status = await probeUrl(url);

  return NextResponse.json(
    { status },
    {
      headers: {
        "cache-control": "no-store, max-age=0",
      },
    },
  );
}
