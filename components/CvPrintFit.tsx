"use client";

import { useEffect } from "react";

/**
 * Keeps the on-screen CV on exactly one A4 sheet when it is printed from the
 * browser. Before printing we measure the paper and, if the content is taller
 * than A4, zoom it down just enough to fit. The PDF route does the same thing
 * for the downloadable file, so both paths agree.
 */
const MM_PER_INCH = 25.4;
const CSS_PX_PER_INCH = 96;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const px = (mm: number) => (mm / MM_PER_INCH) * CSS_PX_PER_INCH;

export default function CvPrintFit({
  selector = ".cv-paper",
}: {
  selector?: string;
}) {
  useEffect(() => {
    const paper = document.querySelector<HTMLElement>(selector);
    if (!paper) return;

    const reset = () => {
      paper.style.removeProperty("zoom");
      paper.style.removeProperty("width");
      paper.style.removeProperty("max-width");
    };

    const fit = () => {
      reset();
      const height = paper.getBoundingClientRect().height;
      if (!height) return;

      const available = px(A4_HEIGHT_MM);
      if (height <= available) return;

      // 0.985 leaves a hair of headroom so sub-pixel rounding never adds a
      // blank second page.
      const scale = Math.max(0.5, (available / height) * 0.985);
      // `important` so the print stylesheet cannot override the fitted size.
      paper.style.setProperty("zoom", String(scale), "important");
      // Zoom shrinks the layout width too, so widen the box to compensate and
      // keep the printed page edge to edge.
      paper.style.setProperty(
        "width",
        `${(A4_WIDTH_MM / scale).toFixed(2)}mm`,
        "important",
      );
      paper.style.setProperty("max-width", "none", "important");
    };

    window.addEventListener("beforeprint", fit);
    window.addEventListener("afterprint", reset);
    return () => {
      window.removeEventListener("beforeprint", fit);
      window.removeEventListener("afterprint", reset);
      reset();
    };
  }, [selector]);

  return null;
}
