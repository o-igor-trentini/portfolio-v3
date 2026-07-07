"use client";

import { Fragment, type ReactNode } from "react";
import { Section } from "./Section";
import { EmptyState } from "./EmptyState";
import { RevealControls } from "./RevealControls";
import { usePagination } from "@/hooks/usePagination";
import { track } from "@/lib/analytics";
import { PAGE } from "@/site.config";

interface PaginatedSectionProps<T> {
  id: string;
  label: string;
  note: string;
  items: readonly T[];
  /** Wrapper class for the rendered list/grid. */
  listClassName: string;
  moreLabel: string;
  lessLabel: string;
  /** Section name sent with the `show_more` analytics event. */
  trackSection: string;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}

/**
 * A Section whose body is a paginated list with an EmptyState fallback and the
 * shared show-more/less controls (wiring the `show_more` event). Unifies the
 * Projects and Certs sections, which differ only in how each item renders.
 */
export function PaginatedSection<T>({
  id,
  label,
  note,
  items,
  listClassName,
  moreLabel,
  lessLabel,
  trackSection,
  getKey,
  renderItem,
}: PaginatedSectionProps<T>) {
  const { shown, hasMore, canCollapse, remaining, showMore, collapse } = usePagination(items, PAGE);

  return (
    <Section id={id} label={label} note={note}>
      {items.length === 0 && <EmptyState />}

      {items.length > 0 && (
        <div className={listClassName}>
          {shown.map((item) => (
            <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
          ))}
        </div>
      )}

      <RevealControls
        hasMore={hasMore}
        canCollapse={canCollapse}
        remaining={remaining}
        moreLabel={moreLabel}
        lessLabel={lessLabel}
        onMore={() => {
          track({ name: "show_more", params: { section: trackSection } });
          showMore();
        }}
        onCollapse={collapse}
      />
    </Section>
  );
}
