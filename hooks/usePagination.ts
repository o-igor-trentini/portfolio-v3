import { useCallback, useState } from "react";

export interface Pagination<T> {
  /** The items currently visible (first `visible` of the input list). */
  shown: T[];
  /** There are still items hidden beyond `shown`. */
  hasMore: boolean;
  /** Showing more than the initial page, so it can be collapsed back. */
  canCollapse: boolean;
  /** How many items remain hidden. */
  remaining: number;
  showMore: () => void;
  collapse: () => void;
}

/**
 * Incremental "show more / show less" pagination over a static list.
 * Reveals `page` items at a time and collapses back to the first page.
 */
export function usePagination<T>(items: readonly T[], page: number): Pagination<T> {
  const [visible, setVisible] = useState(page);

  const showMore = useCallback(() => setVisible((v) => v + page), [page]);
  const collapse = useCallback(() => setVisible(page), [page]);

  return {
    shown: items.slice(0, visible),
    hasMore: visible < items.length,
    canCollapse: visible > page,
    remaining: Math.max(0, items.length - visible),
    showMore,
    collapse,
  };
}
