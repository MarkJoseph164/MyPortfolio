import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/api/cv": [
      "./public/cv-photo.jpg",
      "./public/cv-photo.jpeg",
      "./public/cv-photo.png",
    ],
  },
  async rewrites() {
    return [{ source: "/cv.pdf", destination: "/api/cv" }];
  },
};

export default nextConfig;
