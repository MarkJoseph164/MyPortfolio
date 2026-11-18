"use client";

import { useEffect, useState } from "react";
import type { ProjectStatus, ResolvedStatus } from "@/lib/types";
import { labelFor } from "@/lib/status-label";

export default function StatusBadge({
  status,
  url,
}: {
  status: ProjectStatus;
  url: string;
}) {
  const initial: ResolvedStatus =
    status === "auto" ? (url ? "checking" : "paused") : status;
  const [resolved, setResolved] = useState<ResolvedStatus>(initial);

  useEffect(() => {
    if (status !== "auto" || !url) return;
    let alive = true;

    const check = () => {
      fetch(`/api/status?url=${encodeURIComponent(url)}`, {
        cache: "no-store",
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (alive && data?.status) setResolved(data.status as ResolvedStatus);
        })
        .catch(() => {
          if (alive) setResolved("paused");
        });
    };

    check();

    // Re-check when the tab comes back into view, and periodically while it
    // stays open, so a deployment paused mid-session updates without a reload.
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    const timer = window.setInterval(check, 60 * 1000);

    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
      window.clearInterval(timer);
    };
  }, [status, url]);

  return (
    <span className="status" data-status={resolved}>
      <span className="dot" />
      {labelFor(resolved)}
    </span>
  );
}
