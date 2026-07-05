import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// Required by `output: export`: emit this route as a static file at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
