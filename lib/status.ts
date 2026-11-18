import type { ResolvedStatus } from "./types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const PAUSED_MARKERS = [
  "deployment_paused",
  "deployment is paused",
  "deployment has been paused",
  "this deployment is paused",
  "deployment paused",
];

const cache = new Map<string, { at: number; status: ResolvedStatus }>();
// Short enough that pausing a deployment is reflected on the next visit,
// long enough to avoid probing the same URL repeatedly for every badge.
const TTL = 30 * 1000;

/**
 * Probes a deployed URL and reports whether it is serving.
 *
 * A paused Vercel deployment answers with HTTP 402 or 503 and a page
 * containing "DEPLOYMENT_PAUSED". Anything that resolves to a real response
 * counts as live; network failures and 5xx count as paused.
 */
export async function probeUrl(url: string): Promise<ResolvedStatus> {
  if (!url) return "paused";

  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return hit.status;

  let status: ResolvedStatus = "paused";

  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });

    const body =
      response.status >= 400
        ? (await response.text().catch(() => "")).slice(0, 5000).toLowerCase()
        : "";

    const explicitlyPaused =
      response.status === 402 ||
      PAUSED_MARKERS.some((marker) => body.includes(marker));

    if (explicitlyPaused) status = "paused";
    else if (response.status >= 500) status = "paused";
    else status = "live";
  } catch {
    status = "paused";
  }

  cache.set(url, { at: Date.now(), status });
  return status;
}
