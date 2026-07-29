import type { TagItem } from '../content';

/**
 * Horizontal wrap of tag pills. `primary` tags get the accent treatment.
 * Bootstrap utility classes are passed through so callers keep control of
 * their own surrounding spacing.
 */
export function TagList({
  items,
  className = 'd-flex flex-wrap gap-2',
}: {
  items: TagItem[];
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((tag) => (
        <span className={`tag ${tag.primary ? 'is-primary' : ''}`} key={tag.name}>
          {tag.name}
        </span>
      ))}
    </div>
  );
}
