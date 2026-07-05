"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { TagList } from "../ui/TagList";
import { Button } from "../ui/Button";
import { stackLabel, type StackGroup } from "@/lib/content";
import { ITEM_CAP } from "@/site.config";

/** One technology group in the Stack section: a capped chip list with a
 *  show-more/less toggle. Domain-specific, so it lives with the section. */
export function StackGroupCard({ group }: { group: StackGroup }) {
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
          <Button className="chip-btn" aria-label={moreAria} onClick={() => setExpanded((e) => !e)}>
            {moreLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
