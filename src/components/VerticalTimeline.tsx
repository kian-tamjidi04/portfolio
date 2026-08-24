import { useCallback, useLayoutEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { modalItemVariants, timelineEntryVariants, timelineStepTransition } from '../motion';

/** One stop on the track: the dot, its year label, and its accessible name. */
export interface TimelineStop {
  /** Stable identity for the React key. */
  id: string;
  /** Short date range shown beside the dot. */
  year: string;
  /** Full description of the stop, read out by the dot button. */
  label: string;
}

/**
 * Vertical timeline: track, entry, nav column left to right, with one entry
 * on screen at a time — stepped through with the up/down arrows or by picking
 * a stop on the track. The track always shows every stop so the disabled
 * arrow at either end reads as "you are at the start/end", not as a broken
 * control.
 *
 * Shared by the Education and Experience modals; the caller owns what an entry
 * looks like and passes it through `children`, keyed by index.
 */
export function VerticalTimeline({
  stops,
  navLabel,
  prevLabel,
  nextLabel,
  children,
}: {
  stops: TimelineStop[];
  /** Accessible name for the arrow pair, e.g. "Timeline navigation". */
  navLabel: string;
  prevLabel: string;
  nextLabel: string;
  children: (activeIndex: number) => ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Which way the last step went, so the outgoing entry is pushed out on the
  // side the incoming one arrives from. Starts at 0 (first paint, no slide).
  const [direction, setDirection] = useState(0);
  // Measured height of the entry currently in flow. The viewport animates to
  // this so the modal grows/shrinks in step with the slide instead of
  // snapping to the new entry's height the instant it mounts.
  const [stageHeight, setStageHeight] = useState<number | 'auto'>('auto');
  const [entryEl, setEntryEl] = useState<HTMLElement | null>(null);

  // AnimatePresence keeps the outgoing entry mounted while it slides out, so
  // both entries briefly share this ref. Detaching the outgoing one would
  // null it even though it now points at the incoming entry — only ever
  // record a live node.
  const captureEntry = useCallback((node: HTMLElement | null) => {
    if (node) setEntryEl(node);
  }, []);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === stops.length - 1;

  // ResizeObserver fires once on observe(), so the initial height arrives
  // through the callback — no synchronous setState in the effect body. It
  // also keeps firing if the entry reflows (modal resize, font swap).
  useLayoutEffect(() => {
    if (!entryEl) return undefined;
    const observer = new ResizeObserver(() => setStageHeight(entryEl.offsetHeight));
    observer.observe(entryEl);
    return () => observer.disconnect();
  }, [entryEl]);

  const goTo = (nextIndex: number) => {
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= stops.length) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="vtimeline">
      <motion.ol className="vtimeline-track" variants={modalItemVariants}>
        {stops.map((stop, index) => (
          <li className="vtimeline-track-stop" key={stop.id}>
            <button
              type="button"
              className={`vtimeline-track-dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-current={index === activeIndex ? 'step' : undefined}
              aria-label={stop.label}
            />
            <span className="vtimeline-track-year" aria-hidden="true">
              {stop.year}
            </span>
          </li>
        ))}
      </motion.ol>

      {/* The live region has to be the stable wrapper, not the entry itself —
          the entry remounts on every step, and a region that appears at the
          same time as its content is not reliably announced. */}
      <motion.div className="vtimeline-stage" variants={modalItemVariants} aria-live="polite">
        <motion.div
          className="vtimeline-viewport"
          animate={{ height: stageHeight }}
          transition={timelineStepTransition}
          initial={false}
        >
          {/* popLayout pulls the outgoing entry out of flow, so the incoming
              one takes its place immediately and the two slide past each
              other instead of the container stacking them. */}
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.article
              className="vtimeline-entry"
              key={activeIndex}
              ref={captureEntry}
              custom={direction}
              variants={timelineEntryVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children(activeIndex)}
            </motion.article>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Sits between the entry and the modal edge rather than overlaying the
          panel, so the entry keeps even padding and its content is never
          sandwiched between the two controls. Outside the live region above,
          which should announce the entry, not the buttons. */}
      <motion.div
        className="vtimeline-nav-column"
        variants={modalItemVariants}
        role="group"
        aria-label={navLabel}
      >
        <button
          type="button"
          className="vtimeline-nav vtimeline-nav-prev"
          onClick={() => goTo(activeIndex - 1)}
          disabled={atStart}
          aria-label={prevLabel}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button
          type="button"
          className="vtimeline-nav vtimeline-nav-next"
          onClick={() => goTo(activeIndex + 1)}
          disabled={atEnd}
          aria-label={nextLabel}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </motion.div>
    </div>
  );
}
