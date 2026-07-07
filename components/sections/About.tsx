"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { withYears } from "@/lib/content";
import styles from "./About.module.css";

export function About() {
  const { t } = usePortfolio();
  return (
    <Section id="about" label={t.about.label}>
      <p className={styles.about__body} suppressHydrationWarning>
        {withYears(t.about.body)}
      </p>
    </Section>
  );
}
