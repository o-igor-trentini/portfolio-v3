"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";

export function About() {
  const { t } = usePortfolio();
  return (
    <Section id="about" label={t.about.label} solo>
      <p className="about__body">{t.about.body}</p>
    </Section>
  );
}
