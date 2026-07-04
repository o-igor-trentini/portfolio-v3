"use client";

import { PortfolioProvider } from "./PortfolioProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Terminal } from "./Terminal";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Experience } from "./sections/Experience";
import { Languages } from "./sections/Languages";
import { Stack } from "./sections/Stack";
import { Projects } from "./sections/Projects";
import { Certs } from "./sections/Certs";
import { Contact } from "./sections/Contact";
import { siteConfig } from "@/site.config";

export function Portfolio() {
  return (
    <PortfolioProvider>
      <div className="page">
        <Header />
        <main id="top" className="main">
          <Hero />
          <About />
          <Experience />
          <Languages />
          <Stack />
          {siteConfig.showProjects && <Projects />}
          {siteConfig.showCerts && <Certs />}
          <Contact />
        </main>
        <Footer />
        <Terminal />
      </div>
    </PortfolioProvider>
  );
}
