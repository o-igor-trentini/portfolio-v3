"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { ProseSection } from "../ui/ProseSection";
import { withYears } from "@/lib/content";
import styles from "./About.module.css";

export function About() {
  const { t } = usePortfolio();
  // Body carries the build-time `{years}` token, so mark it dynamic.
  return (
    <ProseSection
      id="about"
      label={t.about.label}
      body={withYears(t.about.body)}
      bodyClassName={styles.about__body}
      dynamic
    />
  );
}
