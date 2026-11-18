import { renderToBuffer } from "@react-pdf/renderer";
import CvDocument from "@/components/CvDocument";
import { profile, portfolioUrl, site } from "@/lib/content";
import { getCvPhotoDataUrl } from "@/lib/cv-photo";

export const runtime = "nodejs";
export const revalidate = 3600;

/** Smallest scale we will shrink to before accepting a second page. */
const MIN_SCALE = 0.68;
/** Binary-search passes; six passes resolve the scale to well under 1%. */
const PASSES = 6;

function countPages(buffer: Buffer): number {
  const text = buffer.toString("latin1");
  return (text.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

async function render(photo: string | null, scale: number) {
  return renderToBuffer(
    <CvDocument
      site={site}
      portfolioUrl={portfolioUrl}
      photo={photo}
      scale={scale}
    />,
  );
}

export async function GET() {
  const photo = getCvPhotoDataUrl();

  let buffer = await render(photo, 1);

  // A CV belongs on one A4 sheet. If the content overflows, shrink the type in
  // small steps until it fits instead of spilling onto page two.
  if (countPages(buffer) > 1) {
    const smallest = await render(photo, MIN_SCALE);

    if (countPages(smallest) <= 1) {
      // Smallest size fits, so search for the largest scale that also fits to
      // keep the text as readable as possible.
      let low = MIN_SCALE;
      let high = 1;
      buffer = smallest;

      for (let pass = 0; pass < PASSES; pass += 1) {
        const mid = (low + high) / 2;
        const attempt = await render(photo, mid);
        if (countPages(attempt) <= 1) {
          low = mid;
          buffer = attempt;
        } else {
          high = mid;
        }
      }
    } else {
      // Even the smallest readable size overflows; ship it two-page rather than
      // shrinking into unreadable type.
      buffer = smallest;
    }
  }

  const filename = `${profile.name.replace(/[^a-zA-Z0-9]+/g, "-")}-CV.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${filename}"`,
      "cache-control": "no-store, max-age=0",
    },
  });
}
