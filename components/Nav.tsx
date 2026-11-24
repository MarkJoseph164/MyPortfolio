import Link from "next/link";
import { FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";
import { profile } from "@/lib/content";

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

        <NavLinks />

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
