import { ImageResponse } from "next/og";
import { profile, projects } from "@/lib/content";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #121318 0%, #23101a 55%, #191430 100%)",
          padding: "72px",
          color: "#f4f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: "linear-gradient(135deg, #e11d48, #881337)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>
              {profile.displayName}
            </div>
            <div style={{ fontSize: 17, color: "#fda4af" }}>{profile.title}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: -2.4,
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            {profile.headline}
          </div>
          <div style={{ fontSize: 24, color: "#b3b5c0" }}>
            {`${profile.location} · ${projects.length} projects`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["React", "TypeScript", "Node.js", "Python"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: 19,
                color: "#f2eaee",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
