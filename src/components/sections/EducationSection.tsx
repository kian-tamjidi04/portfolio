import { useCallback, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { EducationCard } from '../../content';
import {
  educationEntryVariants,
  educationStepTransition,
  modalItemVariants,
} from '../../motion';
import { InteractiveList } from '../InteractiveList';

const DEFAULT_MODULES_LABEL = 'Key Modules';

/**
 * Horizontal timeline: one entry on screen at a time, stepped through with
 * the overlaid prev/next arrows or by picking a stop on the track. The track
 * always shows every stop so the disabled arrow at either end reads as "you
 * are at the start/end", not as a broken control.
 */
export function EducationSection({ card }: { card: EducationCard }) {
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

  const { entries } = card;
  const entry = entries[activeIndex];
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === entries.length - 1;

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
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= entries.length) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="edu-timeline">
      <motion.ol className="edu-track" variants={modalItemVariants}>
        {entries.map((trackEntry, index) => (
          <li className="edu-track-stop" key={`${trackEntry.institution}-${trackEntry.degree}`}>
            <button
              type="button"
              className={`edu-track-dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-current={index === activeIndex ? 'step' : undefined}
              aria-label={`${trackEntry.degree}, ${trackEntry.institution}, ${trackEntry.dates}`}
            />
            <span className="edu-track-year" aria-hidden="true">
              {trackEntry.dates}
            </span>
          </li>
        ))}
      </motion.ol>

      {/* The live region has to be the stable wrapper, not the entry itself —
          the entry remounts on every step, and a region that appears at the
          same time as its content is not reliably announced. */}
      <motion.div className="edu-stage" variants={modalItemVariants} aria-live="polite">
        <motion.div
          className="edu-viewport"
          animate={{ height: stageHeight }}
          transition={educationStepTransition}
          initial={false}
        >
          {/* popLayout pulls the outgoing entry out of flow, so the incoming
              one takes its place immediately and the two slide past each
              other instead of the container stacking them. */}
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.article
              className="edu-entry"
              key={activeIndex}
              ref={captureEntry}
              custom={direction}
              variants={educationEntryVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="edu-entry-title-row">
                <span className="timeline-role">{entry.degree}</span>
                <span className="timeline-separator"> • </span>
                <span className="timeline-company">{entry.institution}</span>
              </p>
              <InteractiveList items={entry.details} />
              <div className="edu-entry-modules">
                <div className="modal-row-title">
                  {entry.modulesLabel ?? DEFAULT_MODULES_LABEL}
                </div>
                <div className="d-flex flex-wrap gap-2 edu-entry-tags">
                  {entry.modules.map((module) => (
                    <span className="tag" key={`${entry.degree}-${module}`}>
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>

        <button
          type="button"
          className="edu-nav edu-nav-prev"
          onClick={() => goTo(activeIndex - 1)}
          disabled={atStart}
          aria-label="Previous education entry"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          type="button"
          className="edu-nav edu-nav-next"
          onClick={() => goTo(activeIndex + 1)}
          disabled={atEnd}
          aria-label="Next education entry"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </motion.div>
    </div>
  );
}
