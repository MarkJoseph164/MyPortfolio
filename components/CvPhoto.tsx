"use client";

import { useState } from "react";

/**
 * Square photo slot at the top right of the CV. Drop a square image at
 * `public/cv-photo.jpg` and it shows up here and in the generated PDF.
 */
export default function CvPhoto({ src = "/cv-photo.jpg" }: { src?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="cv-photo" aria-label="Photo">
      {failed ? (
        <span className="cv-photo-empty">
          1 × 1
          <br />
          Photo
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" onError={() => setFailed(true)} />
      )}
    </div>
  );
}
