import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  async rewrites() {
    return [{ source: "/cv.pdf", destination: "/api/cv" }];
  },
};

export default nextConfig;
