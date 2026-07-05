"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { TagList } from "../ui/TagList";
import { stackGroups, stackLabel, type StackGroup } from "@/lib/content";
import { ITEM_CAP } from "@/site.config";

function StackGroupCard({ group }: { group: StackGroup }) {
  const { lang } = usePortfolio();
  const [expanded, setExpanded] = useState(false);

  const hidden = Math.max(0, group.items.length - ITEM_CAP);
  const itemsShown = expanded ? group.items : group.items.slice(0, ITEM_CAP);
  const moreLabel = expanded ? `− ${lang === "pt" ? "menos" : "less"}` : `+${hidden}`;
  const moreAria = expanded
    ? lang === "pt"
      ? "mostrar menos"
      : "show less"
    : lang === "pt"
      ? `mostrar mais ${hidden}`
      : `show ${hidden} more`;

  return (
    <div>
      <div className="stackgroup__label">{stackLabel(group, lang)}</div>
      <div className="stackgroup__items">
        <TagList items={itemsShown} className="chip" />
        {hidden > 0 && (
          <button
            type="button"
            className="btn chip-btn"
            aria-label={moreAria}
            onClick={() => setExpanded((e) => !e)}
          >
            {moreLabel}
          </button>
        )}
      </div>
    </div>
  );
}

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
