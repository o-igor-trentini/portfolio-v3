import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// Static export: no request-time API here, so this emits `manifest.webmanifest`
// at build. Kept minimal — a personal portfolio, not an installable app.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const themeColor = siteConfig.defaultTheme === "light" ? "#fafaf9" : "#0c0c0e";
  return {
    name: `${siteConfig.name} · Portfolio`,
    short_name: siteConfig.name,
    description: `${siteConfig.name} — ${siteConfig.roleShort} (Go).`,
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0e",
    theme_color: themeColor,
    // The generated icon routes are emitted as extensionless files (`/icon`,
    // `/apple-icon`) under `output: export` — reference those, not `*.png`.
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
