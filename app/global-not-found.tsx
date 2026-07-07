import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "@/app/globals.css";
import { accentMap, siteConfig, PROMPT } from "@/site.config";
import styles from "./global-not-found.module.css";

// This page bypasses the app's root layouts (the app has multiple, one per
// locale route group), so it must render its own <html>/<body> and re-declare
// the font, accent and pre-paint theme that RootShell normally provides.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const accent = accentMap[siteConfig.accent];
const accentCss = `:root{--accent:${accent.d}}html[data-theme="light"]{--accent:${accent.l}}`;

const pref = siteConfig.defaultTheme;
const fallback = pref === "light" ? "light" : "dark";
const themeScript = `!function(){try{var d=document.documentElement,s=localStorage.getItem('pf_theme'),t;if(s==='light'||s==='dark'){t=s}else{var p='${pref}';if(p==='light'||p==='dark'){t=p}else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches){t='light'}else{t='dark'}}d.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${fallback}'}}();`;

export const metadata: Metadata = {
  title: `404 — page not found · ${siteConfig.name}`,
  description: "This route does not exist.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-theme={fallback}
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: accentCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className={styles.wrap}>
          <div className={styles.card}>
            <p className={styles.line}>
              <span className={styles.prompt}>{PROMPT}</span> cd $_
            </p>
            <p className={styles.line}>cd: no such file or directory</p>
            <p className={styles.code}>404</p>
            <p className={styles.msg}>this route doesn&apos;t exist.</p>
            <Link href="/" className={styles.home}>
              <span className={styles.prompt} aria-hidden="true">
                $
              </span>{" "}
              cd ~ · back home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
