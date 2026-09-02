import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import type { ExternalLink, ProjectsCard } from '../../content';
import { modalBodyVariants, modalItemVariants } from '../../motion';
import { InteractiveList } from '../InteractiveList';
import { ProjectDeck } from '../ProjectDeck';
import { TagList } from '../TagList';

const CHALLENGES_PLACEHOLDER = ['Information coming soon...'];

/** Source-code links get the GitHub mark and the primary treatment. */
function isSourceLink(link: ExternalLink) {
  const label = link.label.toLowerCase();
  return label.includes('github') || label.includes('source');
}

/**
 * Two views in one modal. It opens on the index — every project as a card in a
 * grid — and picking one deals that project to the front of a deck you can
 * step through with the arrows or the track above it (see `ProjectDeck`).
 *
 * The front card follows the Certifications/Education type hierarchy via the
 * shared `.modal-row-title` and `.tag` recipes, and shows its technologies and
 * challenges outright. Both used to sit behind accordions, which hid the two
 * things that actually distinguish one project from another behind a click.
 */
export function ProjectsSection({ card }: { card: ProjectsCard }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // The grid card the deck was opened from, so closing the deck puts focus
  // back where it left rather than dropping it on the body — the modal is a
  // focus trap, and a lost focus there strands the keyboard at its start.
  const returnFocusIndex = useRef<number | null>(null);
  const indexRef = useRef<HTMLDivElement | null>(null);
  const rowCapCleanupRef = useRef<(() => void) | null>(null);

  // A callback ref, not a plain ref read from a `[openIndex]` effect: the
  // index grid and the deck share one AnimatePresence in `mode="wait"`, so
  // the grid doesn't remount until the deck's exit animation finishes on a
  // later frame — an effect keyed on `openIndex` fires before that and reads
  // a stale/null ref. A callback ref fires exactly when the node itself
  // mounts, whichever frame that lands on.
  const setIndexRef = useCallback((node: HTMLDivElement | null) => {
    indexRef.current = node;
    rowCapCleanupRef.current?.();
    rowCapCleanupRef.current = null;
    if (!node) return;

    if (returnFocusIndex.current !== null) {
      const cards = node.querySelectorAll<HTMLButtonElement>('.project-index-card');
      cards[returnFocusIndex.current]?.focus();
      returnFocusIndex.current = null;
    }

    // Caps the index grid at three rows, scrolling any more (FlipCard's
    // computeHeight then measures the grid's own — capped — height directly,
    // so the modal hugs 1-3 rows exactly and only grows a scrollbar past
    // that). Row height is content-driven (a title can wrap to a second line)
    // and the column count is itself responsive (the @container queries on
    // .project-index below), so this is measured off the actual rendered
    // cards rather than assumed uniform or hardcoded per breakpoint. Below
    // three total rows it clears the cap entirely so the grid just hugs.
    const applyRowCap = () => {
      const cards = Array.from(node.querySelectorAll<HTMLElement>('.project-index-card'));
      if (cards.length === 0) return;

      const columns =
        getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      const rowCount = Math.ceil(cards.length / columns);
      if (rowCount <= 3) {
        node.style.maxHeight = '';
        return;
      }

      const lastVisibleCard = cards[3 * columns - 1];
      const gridTop = node.getBoundingClientRect().top;
      const paddingBottom = parseFloat(getComputedStyle(node).paddingBottom) || 0;
      // Kept under the CSS `max-height: 100%` safety valve as well, so a
      // viewport too short for three rows still scrolls rather than overflowing.
      node.style.maxHeight = `min(${
        lastVisibleCard.getBoundingClientRect().bottom - gridTop + paddingBottom
      }px, 100%)`;
    };

    applyRowCap();

    // Observe the wrapper, not the grid: the cap is a write to the grid's own
    // height, so watching the grid would have it retrigger itself. The wrapper
    // is pinned to the modal's height and only ever changes width, which is
    // exactly the change the cap needs to be recomputed for.
    const wrapper = node.parentElement;
    if (!wrapper) return;
    const observer = new ResizeObserver(applyRowCap);
    observer.observe(wrapper);
    rowCapCleanupRef.current = () => observer.disconnect();
  }, []);

  const stops = card.items.map((item) => ({ id: item.id, label: item.title }));

  return (
    <div className="projects-view">
      <AnimatePresence mode="wait" initial={false}>
        {openIndex === null ? (
          <motion.div
            className="project-index"
            key="index"
            ref={setIndexRef}
            // Nominates this grid as the element FlipCard measures the modal's
            // height from — the deck that replaces it has no readable height
            // of its own (see computeHeight, FlipCard.tsx).
            data-modal-measure
            variants={modalBodyVariants}
            initial="hidden"
            exit="hidden"
          >
            {card.items.map((item, index) => (
              <motion.button
                className="project-index-card"
                key={item.id}
                variants={modalItemVariants}
                onClick={() => setOpenIndex(index)}
                type="button"
              >
                <h3 className="project-index-title">{item.title}</h3>
                {/* The first summary bullet doubles as the card's blurb,
                    clamped in CSS rather than cut here, so the grid stays a
                    view of the same content instead of a second copy of it. */}
                <p className="project-index-blurb">{item.summary[0]}</p>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="deck"
            variants={modalBodyVariants}
            initial="hidden"
            exit="hidden"
          >
            <ProjectDeck
              stops={stops}
              initialIndex={openIndex}
              backLabel="All projects"
              prevLabel="Previous project"
              nextLabel="Next project"
              onBack={() => {
                returnFocusIndex.current = openIndex;
                setOpenIndex(null);
              }}
            >
              {(activeIndex) => {
                const project = card.items[activeIndex];
                return (
                  <>
                    <div className="project-card-header">
                      <h3 className="project-card-title">{project.title}</h3>
                      {project.grade && (
                        <p className="project-card-grade">
                          Grade Achieved: {project.grade}
                        </p>
                      )}
                    </div>

                    <InteractiveList
                      items={project.summary}
                      className="interactive-bullet-list--plain"
                    />

                    <div className="modal-row-title">Technologies and Skills</div>
                    <TagList items={project.stack} className="d-flex flex-wrap gap-2" />

                    <div className="modal-row-title">Challenges Faced</div>
                    <InteractiveList
                      items={project.challenges ?? CHALLENGES_PLACEHOLDER}
                      className="interactive-bullet-list--plain"
                    />

                    {(project.links?.length || project.figmaComingSoon) && (
                      <div className="project-card-actions">
                        {project.links?.map((link) => (
                          <a
                            href={link.href}
                            key={link.label}
                            target="_blank"
                            rel="noreferrer"
                            className={`project-action-btn ${
                              isSourceLink(link)
                                ? 'project-action-btn-primary'
                                : 'project-action-btn-secondary'
                            }`}
                          >
                            {isSourceLink(link) ? (
                              <img src="./github.svg" alt="" className="project-action-icon-svg" />
                            ) : (
                              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                            )}
                            {link.label}
                          </a>
                        ))}
                        {project.figmaComingSoon && (
                          <div className="project-action-btn project-action-btn-primary project-action-btn-coming-soon">
                            <img src="./figma.svg" alt="" className="project-action-icon-svg" />
                            Figma coming soon
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              }}
            </ProjectDeck>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
