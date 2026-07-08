import type { Metadata, Viewport } from "next";
import { canvas, siteConfig } from "@/site.config";
import { i18n, type Lang } from "@/lib/i18n";
import { contacts, experiences, languages, lastUpdated, stackItems } from "@/lib/content";
import { languageAlternates, locales } from "@/lib/locale";

// Name and role are pulled from siteConfig so they can't drift; the tech tail is
// a curated SEO keyword set (deliberately a highlight reel, not the full stack).
const keywords = [
  siteConfig.name,
  siteConfig.roleShort,
  "Go",
  "Golang",
  "Gin",
  "GORM",
  "distributed systems",
  "microservices",
  "Clean Architecture",
  "PostgreSQL",
  "RabbitMQ",
  "Docker",
  "AWS",
  "software engineer",
  "portfolio",
];

/** Per-locale metadata for each route group's root layout. */
export function buildMetadata(lang: Lang): Metadata {
  const t = i18n[lang];
  const path = locales[lang].path;
  const url = new URL(path, siteConfig.url).toString();
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.seo.title, template: `%s · ${siteConfig.name}` },
    description: t.seo.description,
    applicationName: `${siteConfig.name} · Portfolio`,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    keywords,
    alternates: { canonical: path, languages: languageAlternates },
    openGraph: {
      type: "website",
      url,
      siteName: `${siteConfig.name} · Portfolio`,
      title: t.seo.title,
      description: t.seo.description,
      locale: locales[lang].ogLocale,
      alternateLocale: [locales[lang === "en" ? "pt" : "en"].ogLocale],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.title,
      description: t.seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: canvas.dark },
    { media: "(prefers-color-scheme: light)", color: canvas.light },
  ],
};

/**
 * schema.org graph for the given locale: the person, the site, and the profile
 * page that is about them. Emitted as JSON-LD in the shell.
 */
export function buildJsonLd(lang: Lang): Record<string, unknown> {
  const t = i18n[lang];
  const personId = `${siteConfig.url}/#person`;
  const siteId = `${siteConfig.url}/#website`;
  const inLanguage = locales[lang].htmlLang;

  // Surface the contact email (bare address, not the `mailto:` href) as
  // structured data — a cheap signal for an "open to roles" profile page.
  const email = contacts.find((c) => c.href.startsWith("mailto:"))?.href.replace(/^mailto:/, "");

  const person = {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteConfig.url,
    image: new URL("/apple-icon", siteConfig.url).toString(),
    jobTitle: siteConfig.roleShort,
    description: t.seo.description,
    ...(email ? { email } : {}),
    // Derived from the visible stack (lib/content) so the two never disagree,
    // plus a few concepts that aren't listed as concrete technologies.
    knowsAbout: ["Distributed systems", ...stackItems],
    // Derived from the languages section so the two never disagree.
    knowsLanguage: languages.map((l) => ({ "@type": "Language", name: l.name_en })),
    worksFor: experiences
      .filter((e) => e.end === null)
      .map((e) => ({ "@type": "Organization", name: e.company })),
    alumniOf: experiences
      .filter((e) => e.end !== null)
      .map((e) => ({ "@type": "Organization", name: e.company })),
    sameAs: contacts.filter((c) => c.href.startsWith("http")).map((c) => c.href),
  };

  const website = {
    "@type": "WebSite",
    "@id": siteId,
    url: siteConfig.url,
    name: `${siteConfig.name} · Portfolio`,
    inLanguage,
    publisher: { "@id": personId },
  };

  const profilePage = {
    "@type": "ProfilePage",
    url: new URL(locales[lang].path, siteConfig.url).toString(),
    name: t.seo.title,
    inLanguage,
    dateModified: lastUpdated,
    isPartOf: { "@id": siteId },
    mainEntity: { "@id": personId },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}
