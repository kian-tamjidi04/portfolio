import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { modalItemVariants } from '../motion';

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
 * Which of the four slot roles a depth is playing. Depth 0 is the face-up
 * card and depth −1 the one being dealt away — both are real cards carrying
 * real content, since the card swiping off the deck has to have something on
 * it. The rest are scenery. The two buffers (`-1` in front, `stackDepth + 1`
 * behind the deepest ghost) are the invisible slots cards mount and unmount
 * in. Each role's resting geometry lives in index.css, keyed off the
 * `--deck-depth` set alongside this class.
 */
function deckSlotClass(depth: number, stackDepth: number) {
  if (depth === -1) return 'project-deck-card project-deck-dealt';
  if (depth === 0) return 'project-deck-card';
  if (depth > stackDepth) return 'project-deck-ghost project-deck-ghost-buffer';
  return 'project-deck-ghost';
}

/**
 * The projects deck: a back button and a horizontal track of dots above a
 * stack of cards, with one card face-up at a time and an arrow either side.
 *
 * Every card visible in the stack — the face-up one and the ghosts behind it
 * — is a real element keyed by its project id, not a painted backdrop. A step
 * re-labels each one's depth and CSS carries it to the new resting position
 * (`--deck-depth`, index.css), so stepping forward swipes the face-up card
 * off to the right while every ghost advances one depth toward the front and
 * a new one fades in at the back; stepping back mirrors that exactly. A deck
 * has no ends, so both arrows wrap rather than disabling — unlike the
 * vertical timeline, where a disabled arrow is what tells you you're at the
 * start or end.
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

  // The rendered window, back to front: one buffer slot behind the deepest
  // visible ghost, the ghosts, the face-up card at depth 0, and one buffer
  // slot in front at depth -1 — the off-deck position a card is dealt to.
  //
  // The two buffers are what let the whole shuffle be a CSS transition with
  // nothing to animate on mount or unmount. Both render at zero opacity, so
  // the only cards that appear or disappear do it where nobody can see, and
  // every card you *can* see is an element that stays mounted through the
  // step and simply changes depth. That is the entire fix for the deck
  // stranding its first few cards at the depth they mounted at.
  //
  // Listed in order of how much the deck needs each slot, because a deck with
  // fewer projects than slots can't fill them all without showing the same
  // project twice and colliding its React keys: the face-up card first, then
  // the one being dealt away, then the ghosts front to back, and the back
  // buffer last — the only slot whose absence costs nothing but a card
  // appearing at the back rather than fading in there.
  const slotsByNeed = [
    0,
    -1,
    ...Array.from({ length: stackDepth }, (_, i) => i + 1),
    stackDepth + 1,
  ].slice(0, total);

  // Sorted back-to-front for the DOM, so the dealt card is last and paints
  // over the deck it is leaving, and depth 0 paints over its own ghosts.
  const stackSlots = slotsByNeed
    .sort((a, b) => b - a)
    .map((depth) => ({
      depth,
      // Modulo both ways round again: depth -1 is the card *before* the
      // face-up one, which for the first project is the last in the deck.
      projectIndex: (((activeIndex + depth) % total) + total) % total,
    }));

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
          {stackSlots.map(({ depth, projectIndex }) => (
            <article
              className={deckSlotClass(depth, stackDepth)}
              key={stops[projectIndex].id}
              // Depth is handed to CSS rather than animated here. Paint order
              // is stated rather than left to DOM order, so a card on its way
              // off the deck stays above the stack reshuffling underneath it:
              // it runs 0 (the back buffer) up to stackDepth + 2 (the card
              // being dealt away), kept off negative values, which would paint
              // a slot behind the stack's own box, not just behind a sibling.
              style={
                {
                  zIndex: stackDepth + 1 - depth,
                  '--deck-depth': depth,
                } as CSSProperties
              }
              aria-hidden={depth === 0 ? undefined : 'true'}
              // The card being dealt away carries a second copy of a
              // project's content, links and all, purely so you can see what
              // is leaving. `inert` is what keeps that copy out of the tab
              // order — `aria-hidden` alone would hide it from the reader
              // while leaving its links focusable.
              inert={depth === 0 ? undefined : true}
            >
              {/* Ghosts and the back buffer are inert scenery: no content, no
                  tab stop, hidden from the reader, which already gets the
                  deck's size and position from the track. */}
              {depth === 0 || depth === -1 ? children(projectIndex) : null}
            </article>
          ))}
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
