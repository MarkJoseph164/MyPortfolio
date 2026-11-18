import { renderToBuffer } from "@react-pdf/renderer";
import CvDocument from "@/components/CvDocument";
import { profile, portfolioUrl, site } from "@/lib/content";
import { getCvPhotoDataUrl } from "@/lib/cv-photo";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const buffer = await renderToBuffer(
    <CvDocument
      site={site}
      portfolioUrl={portfolioUrl}
      photo={getCvPhotoDataUrl()}
    />,
  );
  const filename = `${profile.name.replace(/[^a-zA-Z0-9]+/g, "-")}-CV.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${filename}"`,
      "cache-control": "no-store, max-age=0",
    },
  });
}
