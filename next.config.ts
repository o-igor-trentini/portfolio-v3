import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export (`out/`) so the site can be hosted on GitHub Pages.
  output: "export",
  // Served from the custom domain igortrentini.dev, so no basePath is needed.
  // Pages' artifact deploy doesn't run Jekyll, but next/image would need a
  // server, so images stay unoptimized in case one is ever added.
  images: { unoptimized: true },
};

export default nextConfig;
