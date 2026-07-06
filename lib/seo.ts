import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/site.config";
import { i18n, type Lang } from "@/lib/i18n";
import { contacts, experiences } from "@/lib/content";

/** Canonical path and hreflang code per locale. English lives at the root. */
const localePath: Record<Lang, string> = { en: "/", pt: "/pt/" };
const ogLocale: Record<Lang, string> = { en: "en_US", pt: "pt_BR" };
const htmlLang: Record<Lang, string> = { en: "en", pt: "pt-BR" };

// Same hreflang cluster on every page: en at `/`, pt-BR at `/pt/`, English as
// x-default. Google requires the alternates to be reciprocal across the set.
const languageAlternates = {
  en: localePath.en,
  "pt-BR": localePath.pt,
  "x-default": localePath.en,
};

const keywords = [
  "Igor Trentini",
  "Backend Developer",
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
  const path = localePath[lang];
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
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[lang === "en" ? "pt" : "en"]],
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
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
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
  const inLanguage = htmlLang[lang];

  const person = {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Backend Developer",
    description: t.seo.description,
    knowsAbout: [
      "Go",
      "REST APIs",
      "Distributed systems",
      "Microservices",
      "Clean Architecture",
      "PostgreSQL",
      "RabbitMQ",
      "Keycloak",
      "Docker",
      "AWS",
      "Google Cloud",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Portuguese" },
      { "@type": "Language", name: "English" },
    ],
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
    url: new URL(localePath[lang], siteConfig.url).toString(),
    name: t.seo.title,
    inLanguage,
    isPartOf: { "@id": siteId },
    mainEntity: { "@id": personId },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}
