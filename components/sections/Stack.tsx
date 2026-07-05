"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { StackGroupCard } from "./StackGroupCard";
import { stackGroups } from "@/lib/content";

export function Stack() {
  const { t } = usePortfolio();
  return (
    <Section id="stack" label={t.stack.label} note={t.stack.note}>
      <div className="stack__grid">
        {stackGroups.map((group) => (
          <StackGroupCard key={group.label_en} group={group} />
        ))}
      </div>
    </Section>
  );
}
