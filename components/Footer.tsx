import Link from "next/link";
import { profile, socials } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
        <div className="footer-links">
          <Link href="/cv">CV</Link>
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              {social.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}
