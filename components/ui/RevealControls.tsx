"use client";

import { Button } from "./Button";
import styles from "./RevealControls.module.css";

interface RevealControlsProps {
  hasMore: boolean;
  canCollapse: boolean;
  remaining: number;
  moreLabel: string;
  lessLabel: string;
  onMore: () => void;
  onCollapse: () => void;
}

/** Shared "show more (+N) / show less" controls for paginated sections. */
export function RevealControls({
  hasMore,
  canCollapse,
  remaining,
  moreLabel,
  lessLabel,
  onMore,
  onCollapse,
}: RevealControlsProps) {
  if (!hasMore && !canCollapse) return null;

  return (
    <div className={styles.controls}>
      {hasMore && (
        <Button variant="ghost" onClick={onMore}>
          <span className="accent">▾</span>
          {moreLabel} <span className="muted">(+{remaining})</span>
        </Button>
      )}
      {canCollapse && (
        <Button variant="link" onClick={onCollapse}>
          {lessLabel}
        </Button>
      )}
    </div>
  );
}
