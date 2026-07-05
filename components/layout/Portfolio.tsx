"use client";

import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Terminal } from "./Terminal";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Languages } from "@/components/sections/Languages";
import { Stack } from "@/components/sections/Stack";
import { Projects } from "@/components/sections/Projects";
import { Certs } from "@/components/sections/Certs";
import { Contact } from "@/components/sections/Contact";
import styles from "./Portfolio.module.css";

export function Portfolio() {
  return (
    <PortfolioProvider>
      <div className={styles.page}>
        <Header />
        <main id="top" className={styles.main}>
          <Hero />
          <About />
          <Experience />
          <Languages />
          <Stack />
          <Projects />
          <Certs />
          <Contact />
        </main>
        <Footer />
        <Terminal />
      </div>
    </PortfolioProvider>
  );
}
