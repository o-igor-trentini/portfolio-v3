"use client";

import { JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { accentMap, siteConfig, PROMPT } from "@/site.config";
import styles from "./global-not-found.module.css";

// Root-level client error boundary. Like global-not-found it replaces the whole
// document, so it renders its own <html>/<body> and re-declares the font/accent.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const accent = accentMap[siteConfig.accent];
const accentCss = `:root{--accent:${accent.d}}`;

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" data-theme="dark" className={jetbrainsMono.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: accentCss }} />
      </head>
      <body>
        <main className={styles.wrap}>
          <div className={styles.card}>
            <p className={styles.line}>
              <span className={styles.prompt}>{PROMPT}</span> ./portfolio
            </p>
            <p className={styles.line}>segmentation fault (core dumped)</p>
            <p className={styles.code}>500</p>
            <p className={styles.msg}>something crashed on this page.</p>
            <button type="button" className={styles.home} onClick={reset}>
              <span className={styles.prompt} aria-hidden="true">
                $
              </span>{" "}
              retry
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
