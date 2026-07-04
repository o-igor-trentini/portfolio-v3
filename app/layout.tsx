import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { accentMap, siteConfig } from "@/site.config";
import { contacts, experiences } from "@/lib/content";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const title = `${siteConfig.name} — ${siteConfig.roleShort} (Go)`;
const description =
  "Igor Trentini — Backend Developer specialized in Go. Reliable, high-throughput services, APIs and distributed systems with clean, observable, well-tested code.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s · ${siteConfig.name}`,
  },
  description,
  applicationName: `${siteConfig.name} · Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "Igor Trentini",
    "Backend Developer",
    "Go",
    "Golang",
    "gRPC",
    "distributed systems",
    "microservices",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "Docker",
    "AWS",
    "software engineer",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: `${siteConfig.name} · Portfolio`,
    title,
    description,
    locale: "en_US",
    alternateLocale: ["pt_BR"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

// Accent color is a build-time constant; emit it for both themes so the CSS
// custom property is available before any JS runs.
const accent = accentMap[siteConfig.accent];
const accentCss = `:root{--accent:${accent.d}}html[data-theme="light"]{--accent:${accent.l}}`;

// Set data-theme before first paint to avoid a flash of the wrong theme.
const pref = siteConfig.defaultTheme;
const fallback = pref === "light" ? "light" : "dark";
const themeScript = `!function(){try{var d=document.documentElement,s=localStorage.getItem('pf_theme'),t;if(s==='light'||s==='dark'){t=s}else{var p='${pref}';if(p==='light'||p==='dark'){t=p}else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches){t='light'}else{t='dark'}}d.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${fallback}'}}();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Backend Developer",
  description,
  knowsAbout: [
    "Go",
    "gRPC",
    "REST APIs",
    "Distributed systems",
    "Microservices",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "Docker",
    "AWS",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={fallback} suppressHydrationWarning className={jetbrainsMono.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: accentCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
