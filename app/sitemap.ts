import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { lastUpdated } from "@/lib/content";
import { locales } from "@/lib/locale";

// Required by `output: export`: emit this route as a static file at build time.
export const dynamic = "force-static";

const abs = (path: string) => new URL(path, siteConfig.url).toString();
const en = abs(locales.en.path);
const pt = abs(locales.pt.path);

// Both locale URLs, each carrying the reciprocal hreflang cluster (English is
// x-default). Trailing slashes match `trailingSlash: true` and the emitted files.
const languages = {
  [locales.en.htmlLang]: en,
  [locales.pt.htmlLang]: pt,
  "x-default": en,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: en,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: pt,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
