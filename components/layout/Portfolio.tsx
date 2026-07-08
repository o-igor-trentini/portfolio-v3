"use client";

import dynamic from "next/dynamic";
import { i18n, type Lang } from "@/lib/i18n";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { TerminalProvider } from "@/components/providers/TerminalProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ConsentBanner } from "./ConsentBanner";

// The terminal is an interaction-only overlay (renders null until opened), so
// its chunk is split out of the initial bundle and loaded on the client.
const Terminal = dynamic(() => import("./Terminal").then((m) => m.Terminal));
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Workflow } from "@/components/sections/Workflow";
import { Experience } from "@/components/sections/Experience";
import { Languages } from "@/components/sections/Languages";
import { Stack } from "@/components/sections/Stack";
import { Projects } from "@/components/sections/Projects";
import { Certs } from "@/components/sections/Certs";
import { Contact } from "@/components/sections/Contact";
import styles from "./Portfolio.module.css";

export function Portfolio({ initialLang }: { initialLang: Lang }) {
  return (
    <PortfolioProvider initialLang={initialLang}>
      <TerminalProvider>
        <div className={styles.page}>
          <a href="#top" className={styles["skip-link"]}>
            {i18n[initialLang].a11y.skip}
          </a>
          <Header />
          <main id="top" tabIndex={-1} className={styles.main}>
            <Hero />
            <About />
            <Workflow />
            <Experience />
            <Languages />
            <Stack />
            <Projects />
            <Certs />
            <Contact />
          </main>
          <Footer />
          <Terminal />
          <ConsentBanner />
        </div>
      </TerminalProvider>
    </PortfolioProvider>
  );
}
