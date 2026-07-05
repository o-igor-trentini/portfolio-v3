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
