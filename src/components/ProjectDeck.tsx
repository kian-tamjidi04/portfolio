import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { deckCardVariants, modalItemVariants, type DeckCardCustom } from '../motion';

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
 * Every card visible in the stack — the face-up one and the ghosts behind it
 * — is a real element keyed by its project id, not a painted backdrop. A step
 * re-targets each one's `animate` to a new depth (see `deckCardVariants`), so
 * stepping forward swipes the face-up card off to the right while every ghost
 * advances one depth toward the front and a new one fades in at the back;
 * stepping back mirrors that exactly. A deck has no ends, so both arrows wrap
 * rather than disabling — unlike the vertical timeline, where a disabled
 * arrow is what tells you you're at the start or end.
 *
 * The caller owns what the face-up card looks like and passes it through
 * `children`, keyed by index — the same arrangement `VerticalTimeline` has
 * with the Education and Experience modals.
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
  const total = stops.length;

  // The grid card that opened the deck has just unmounted, so pick focus up
  // here rather than letting it fall to the body inside the modal's trap.
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  // Modulo both ways round — the deck loops, so the card after the last is the
  // first, and the card before the first is the one at the back.
  const step = (delta: number) => setActiveIndex((current) => (current + delta + total) % total);

  // How many ghosts fit behind the face-up card without repeating a project:
  // a two-project deck shows one ghost, not VISIBLE_STACK_DEPTH's usual two.
  const stackDepth = Math.min(VISIBLE_STACK_DEPTH, total - 1);

  // The visible window: the face-up card (depth 0) plus every ghost behind
  // it, each carrying the real project index it currently shows rather than
  // an anonymous slot. Built back-to-front so depth 0 is last in the array
  // and therefore last in the DOM, painting on top of its own ghosts.
  const stackSlots = Array.from({ length: stackDepth + 1 }, (_, i) => {
    const depth = stackDepth - i;
    return { depth, projectIndex: (activeIndex + depth) % total };
  });

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
                onClick={() => setActiveIndex(index)}
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

        {/* The live region has to be this stable wrapper, not any one card —
            every card in the stack moves or remounts on a step, and a region
            that appears at the same time as its own content is not reliably
            announced. */}
        <div className="project-deck-stack" aria-live="polite">
          {/*
            `mode="sync"` — the default, kept explicit here — rather than
            `popLayout`: every card is already `position: absolute` in CSS, so
            there's no sibling layout for popLayout to protect, and sync is
            what lets the persisting, entering, and exiting cards all animate
            together, which is what a shuffle needs. `initial={false}` skips
            this animation for whatever's on screen at first mount, so opening
            the deck from the index grid doesn't play a spurious deal.

            No `custom` on the AnimatePresence itself: React freezes an exiting
            element's props at the render before it left, so anything describing
            the *step* rather than the card would be stale by the time it's
            read, and one value at this level would be applied to every card
            leaving in the same step. Each card's own `custom` carries only its
            depth, which is exactly the position it is leaving from — correct
            frozen, and correct for however many cards a jump removes at once. */}
          <AnimatePresence mode="sync" initial={false}>
            {stackSlots.map(({ depth, projectIndex }) => (
              <motion.article
                className={depth === 0 ? 'project-deck-card' : 'project-deck-ghost'}
                key={stops[projectIndex].id}
                style={depth === 0 ? undefined : ({ '--deck-depth': depth } as CSSProperties)}
                custom={{ depth } satisfies DeckCardCustom}
                variants={deckCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                aria-hidden={depth === 0 ? undefined : 'true'}
              >
                {/* Ghosts are inert scenery: no content, no tab stop, hidden
                    from the reader, which already gets the deck's size and
                    position from the track. */}
                {depth === 0 ? children(projectIndex) : null}
              </motion.article>
            ))}
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
