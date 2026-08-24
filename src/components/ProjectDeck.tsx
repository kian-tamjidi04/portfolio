import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { deckCardVariants, modalItemVariants } from '../motion';

/** One card in the deck: enough to label its dot on the track. */
export interface DeckStop {
  /** Stable identity for the React key. */
  id: string;
  /** Full description of the card, read out by the dot button. */
  label: string;
}

/** How many card edges peek out from behind the front card. */
const VISIBLE_STACK_DEPTH = 2;

/**
 * The projects deck: a back button and a horizontal track of dots above a
 * stack of cards, with one card face-up at a time and an arrow either side.
 *
 * Stepping forward swipes the front card off to the right and sends it to the
 * back of the deck, pushing the next card forward into its place; stepping
 * back mirrors that exactly (see `deckCardVariants`). A deck has no ends, so
 * both arrows wrap rather than disabling — unlike the vertical timeline, where
 * a disabled arrow is what tells you you're at the start or end.
 *
 * The caller owns what a card looks like and passes it through `children`,
 * keyed by index — the same arrangement `VerticalTimeline` has with the
 * Education and Experience modals.
 */
export function ProjectDeck({
  stops,
  initialIndex = 0,
  backLabel,
  prevLabel,
  nextLabel,
  onBack,
  children,
}: {
  stops: DeckStop[];
  /** Which card is face-up when the deck opens — the one picked in the grid. */
  initialIndex?: number;
  /** Visible text of the button that returns to the index grid. */
  backLabel: string;
  prevLabel: string;
  nextLabel: string;
  onBack: () => void;
  children: (activeIndex: number) => ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // Which way the last step went, so the outgoing card leaves the way the
  // incoming one arrives from. Starts at 0 (first paint, no deal).
  const [direction, setDirection] = useState(0);

  const total = stops.length;

  // The grid card that opened the deck has just unmounted, so pick focus up
  // here rather than letting it fall to the body inside the modal's trap.
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  const goTo = (nextIndex: number, stepDirection: number) => {
    if (nextIndex === activeIndex) return;
    setDirection(stepDirection);
    setActiveIndex(nextIndex);
  };

  // Modulo both ways round — the deck loops, so the card after the last is the
  // first, and the card before the first is the one at the back.
  const step = (delta: number) => goTo((activeIndex + delta + total) % total, delta);

  return (
    <div className="project-deck">
      <motion.div className="project-deck-bar" variants={modalItemVariants}>
        <button type="button" className="project-deck-back" onClick={onBack} ref={backRef}>
          <FontAwesomeIcon icon={faArrowLeft} />
          {backLabel}
        </button>

        <ol className="htimeline-track">
          {stops.map((stop, index) => (
            <li className="htimeline-stop" key={stop.id}>
              <button
                type="button"
                className={`htimeline-dot ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                aria-current={index === activeIndex ? 'step' : undefined}
                aria-label={stop.label}
              />
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.div className="project-deck-stage" variants={modalItemVariants}>
        {/* Sits between the card and the modal edge rather than overlaying
            the deck, so the card keeps even padding and its content is never
            sandwiched between the two controls. */}
        <button
          type="button"
          className="deck-nav deck-nav-prev"
          onClick={() => step(-1)}
          aria-label={prevLabel}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* The live region has to be this stable wrapper, not the card itself —
            the card remounts on every step, and a region that appears at the
            same time as its content is not reliably announced. */}
        <div className="project-deck-stack" aria-live="polite">
          {/* The rest of the deck, showing as card edges behind the front one.
              Inert scenery: no content, no tab stop, hidden from the reader,
              which already gets the deck's size and position from the track. */}
          {Array.from({ length: Math.min(VISIBLE_STACK_DEPTH, total - 1) }, (_, depth) => (
            <div
              className="project-deck-ghost"
              key={depth}
              style={{ '--deck-depth': depth + 1 } as CSSProperties}
              aria-hidden="true"
            />
          ))}

          {/* popLayout pulls the outgoing card out of flow so the two move
              past each other instead of the stack laying them out in a row. */}
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.article
              className="project-deck-card"
              key={activeIndex}
              custom={direction}
              variants={deckCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children(activeIndex)}
            </motion.article>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="deck-nav deck-nav-next"
          onClick={() => step(1)}
          aria-label={nextLabel}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </motion.div>
    </div>
  );
}
