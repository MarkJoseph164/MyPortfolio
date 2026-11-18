import Link from "next/link";
import { FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const links = [
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="Home">
          <span className="brand-mark">M</span>
          <span>
            {profile.displayName}
            <span className="brand-sub">CS Student · Web Developer</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Sections">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/cv" className="btn btn-ghost btn-sm">
            <FileText />
            CV
          </Link>
          <a
            href="/cv.pdf"
            className="btn btn-primary btn-sm hidden sm:inline-flex"
            download="Mark-Joseph-A-Alborez-CV.pdf"
          >
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
