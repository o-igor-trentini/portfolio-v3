interface TagListProps {
  items: readonly string[];
  /** Class applied to each tag span. */
  className: string;
}

/** Renders each item as a `<span className={className}>` — no wrapper element,
 *  so callers keep their own container (and can append siblings, e.g. Stack's button). */
export function TagList({ items, className }: TagListProps) {
  return (
    <>
      {items.map((item) => (
        <span key={item} className={className}>
          {item}
        </span>
      ))}
    </>
  );
}
