import { describe, expect, it } from "vitest";
import { buildJsonLd, buildMetadata, viewport } from "./seo";
import { i18n } from "./i18n";
import { contacts, experiences, languages } from "./content";
import { siteConfig } from "@/site.config";

describe("buildMetadata", () => {
  it("sets the per-locale canonical path (en at root, pt at /pt/)", () => {
    expect(buildMetadata("en").alternates?.canonical).toBe("/");
    expect(buildMetadata("pt").alternates?.canonical).toBe("/pt/");
  });

  it("carries the locale-specific title and description", () => {
    const en = buildMetadata("en");
    expect(en.description).toBe(i18n.en.seo.description);
    // title is an object { default, template }
    expect(en.title).toMatchObject({ default: i18n.en.seo.title });

    const pt = buildMetadata("pt");
    expect(pt.description).toBe(i18n.pt.seo.description);
    expect(pt.title).toMatchObject({ default: i18n.pt.seo.title });
  });

  it("exposes a reciprocal hreflang cluster identical on both locales", () => {
    const expected = { en: "/", "pt-BR": "/pt/", "x-default": "/" };
    expect(buildMetadata("en").alternates?.languages).toEqual(expected);
    expect(buildMetadata("pt").alternates?.languages).toEqual(expected);
  });

  it("builds an absolute OpenGraph url with matching locale/alternateLocale", () => {
    const en = buildMetadata("en");
    expect(en.openGraph?.url).toBe(new URL("/", siteConfig.url).toString());
    expect(en.openGraph).toMatchObject({ locale: "en_US", alternateLocale: ["pt_BR"] });

    const pt = buildMetadata("pt");
    expect(pt.openGraph?.url).toBe(new URL("/pt/", siteConfig.url).toString());
    expect(pt.openGraph).toMatchObject({ locale: "pt_BR", alternateLocale: ["en_US"] });
  });

  it("marks the page indexable", () => {
    expect(buildMetadata("en").robots).toMatchObject({ index: true, follow: true });
  });
});

describe("viewport", () => {
  it("declares a theme color for each color scheme", () => {
    const colors = viewport.themeColor;
    expect(Array.isArray(colors)).toBe(true);
    expect(colors).toHaveLength(2);
  });
});

describe("buildJsonLd", () => {
  it("emits a schema.org graph of Person + WebSite + ProfilePage", () => {
    const graph = buildJsonLd("en")["@graph"] as Array<Record<string, unknown>>;
    expect(graph.map((n) => n["@type"])).toEqual(["Person", "WebSite", "ProfilePage"]);
    expect(buildJsonLd("en")["@context"]).toBe("https://schema.org");
  });

  it("derives worksFor from ongoing roles and alumniOf from past roles", () => {
    const [person] = buildJsonLd("en")["@graph"] as Array<Record<string, unknown>>;
    const worksFor = person.worksFor as Array<{ name: string }>;
    const alumniOf = person.alumniOf as Array<{ name: string }>;

    expect(worksFor.map((o) => o.name)).toEqual(
      experiences.filter((e) => e.end === null).map((e) => e.company),
    );
    expect(alumniOf.map((o) => o.name)).toEqual(
      experiences.filter((e) => e.end !== null).map((e) => e.company),
    );
  });

  it("derives sameAs from the http(s) contact links only", () => {
    const [person] = buildJsonLd("en")["@graph"] as Array<Record<string, unknown>>;
    expect(person.sameAs).toEqual(
      contacts.filter((c) => c.href.startsWith("http")).map((c) => c.href),
    );
  });

  it("derives jobTitle from siteConfig and knowsLanguage from the languages section", () => {
    const [person] = buildJsonLd("en")["@graph"] as Array<Record<string, unknown>>;
    expect(person.jobTitle).toBe(siteConfig.roleShort);
    expect(person.knowsLanguage).toEqual(
      languages.map((l) => ({ "@type": "Language", name: l.name_en })),
    );
  });

  it("stamps the correct inLanguage per locale", () => {
    const enGraph = buildJsonLd("en")["@graph"] as Array<Record<string, unknown>>;
    const ptGraph = buildJsonLd("pt")["@graph"] as Array<Record<string, unknown>>;
    // WebSite node (index 1) carries inLanguage
    expect(enGraph[1].inLanguage).toBe("en");
    expect(ptGraph[1].inLanguage).toBe("pt-BR");
  });
});
