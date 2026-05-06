import type { NextConfig } from "next";

// `basePath` is required when deploying to a project page like
// https://USERNAME.github.io/REPO/. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to the repo name automatically.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static export — required for GitHub Pages.
  output: "export",
  // GitHub Pages serves static files; no Next image optimizer.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
