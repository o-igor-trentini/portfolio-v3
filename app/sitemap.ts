import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// Required by `output: export`: emit this route as a static file at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
