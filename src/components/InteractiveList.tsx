import { useMemo } from 'react';

/** Splits after `.`, `!` or `?` when followed by whitespace, keeping the punctuation. */
const SENTENCE_BOUNDARY = /(?<=[.!?])\s+/;

/**
 * Renders a prose string as a bullet list, one bullet per sentence.
 *
 * Content in `content.ts` is authored as flowing prose and split here.
 * Caveat: any abbreviation containing a period ("e.g.", "Ph.D.") would split a
 * bullet mid-sentence — see DESIGN_SYSTEM.md F23.
 */
export function InteractiveList({ text, className = '' }: { text: string; className?: string }) {
  const sentences = useMemo(
    () => text.split(SENTENCE_BOUNDARY).filter((s) => s.trim().length > 0),
    [text],
  );

  return (
    <ul className={`interactive-bullet-list ${className}`}>
      {sentences.map((sentence, i) => (
        <li key={i} className="interactive-bullet-item">
          {sentence}
        </li>
      ))}
    </ul>
  );
}
