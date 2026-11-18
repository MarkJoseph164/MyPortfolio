import fs from "node:fs";
import path from "node:path";

/**
 * The CV photo is a plain file in `public/`, so it can be replaced from the
 * GitHub web UI without touching any code. This helper reads the bytes for the
 * PDF renderer, which cannot fetch a relative URL.
 */
const candidates = [
  { file: "cv-photo.jpg", mime: "image/jpeg" },
  { file: "cv-photo.jpeg", mime: "image/jpeg" },
  { file: "cv-photo.png", mime: "image/png" },
];

export function getCvPhotoDataUrl(): string | null {
  for (const { file, mime } of candidates) {
    try {
      const fullPath = path.join(process.cwd(), "public", file);
      if (!fs.existsSync(fullPath)) continue;
      const bytes = fs.readFileSync(fullPath);
      if (bytes.length === 0) continue;
      return `data:${mime};base64,${bytes.toString("base64")}`;
    } catch {
      // Missing or unreadable file — fall back to the placeholder frame.
    }
  }
  return null;
}
