import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export (`out/`) so the site can be hosted on GitHub Pages.
  output: "export",
  // Emit `out/pt/index.html` (served cleanly at `/pt/`) instead of `out/pt.html`,
  // and keep canonical/hreflang/sitemap URLs consistent with a trailing slash.
  trailingSlash: true,
  // Served from the custom domain igortrentini.dev, so no basePath is needed.
  // Pages' artifact deploy doesn't run Jekyll, but next/image would need a
  // server, so images stay unoptimized in case one is ever added.
  images: { unoptimized: true },
};

export default nextConfig;
