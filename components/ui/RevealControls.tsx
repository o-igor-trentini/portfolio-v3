"use client";

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
    <div className="controls">
      {hasMore && (
        <button type="button" className="btn btn-ghost" onClick={onMore}>
          <span className="accent">▾</span>
          {moreLabel} <span className="muted">(+{remaining})</span>
        </button>
      )}
      {canCollapse && (
        <button type="button" className="btn btn-link" onClick={onCollapse}>
          {lessLabel}
        </button>
      )}
    </div>
  );
}
