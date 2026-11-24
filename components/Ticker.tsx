"use client";

import { usePathname } from "next/navigation";

const ITEMS = [
  "System online",
  "BS Computer Science",
  "Open to internships",
  "React · TypeScript · Node · Python",
  "Building for the web",
  "Quezon City · UTC+8",
  "Always compiling, always learning",
];

/** Scrolling status strip that sits directly under the nav on public pages. */
export default function Ticker() {
  const pathname = usePathname();
  if (pathname.startsWith("/cv") || pathname.startsWith("/admin")) return null;

  const line = ITEMS.join("  ·  ");

  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
