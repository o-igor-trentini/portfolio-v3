"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import styles from "./Workflow.module.css";

export function Workflow() {
  const { t } = usePortfolio();
  return (
    <Section id="workflow" label={t.workflow.label} note={t.workflow.note}>
      <p className={styles.workflow__body}>{t.workflow.body}</p>
    </Section>
  );
}
