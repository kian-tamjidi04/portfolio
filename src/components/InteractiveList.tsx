/** Renders pre-split prose as a bullet list, one bullet per array entry. */
export function InteractiveList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`interactive-bullet-list ${className}`}>
      {items.map((item) => (
        <li key={item} className="interactive-bullet-item">
          {item}
        </li>
      ))}
    </ul>
  );
}
