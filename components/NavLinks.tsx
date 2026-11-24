"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { id: "projects", href: "/#projects", label: "Projects" },
  { id: "skills", href: "/#skills", label: "Skills" },
  { id: "experience", href: "/#experience", label: "Experience" },
  { id: "education", href: "/#education", label: "Education" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

/**
 * Section links that light up while you scroll through their section,
 * and replay their underline animation every time the active section changes.
 */
export default function NavLinks() {
  const [active, setActive] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = "";

      for (const link of links) {
        const section = document.getElementById(link.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top + window.scrollY <= line) {
          current = link.id;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <nav className="nav-links" aria-label="Sections">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-link${active === link.id ? " is-active" : ""}`}
          aria-current={active === link.id ? "true" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
