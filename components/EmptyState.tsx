"use client";

import { usePortfolio } from "./PortfolioProvider";

/**
 * On-brand "content pending" placeholder for sections that are visible but
 * whose data isn't ready yet (e.g. an empty certifications list). Reusable
 * across any section — pass a custom `message` or fall back to the shared
 * i18n string.
 */
export function EmptyState({ message }: { message?: string }) {
  const { t } = usePortfolio();
  return (
    <div className="empty" role="status">
      <span className="empty__prompt">$</span>
      <span className="empty__text">{message ?? t.common.wip}</span>
      <span className="caret" aria-hidden="true" />
    </div>
  );
}
