"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { ProseSection } from "../ui/ProseSection";
import styles from "./Workflow.module.css";

export function Workflow() {
  const { t } = usePortfolio();
  return (
    <ProseSection
      id="workflow"
      label={t.workflow.label}
      note={t.workflow.note}
      body={t.workflow.body}
      bodyClassName={styles.workflow__body}
    />
  );
}
