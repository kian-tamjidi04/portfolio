import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  faAward,
  faBook,
  faBriefcase,
  faBullhorn,
  faCircleUser,
  faCircleXmark,
  faHammer,
  faRocket,
  faScrewdriverWrench,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { portfolioCards, type PortfolioCard, type ProjectPreviewItem } from './content';

/* ─── Helpers ────────────────────────────────────────────────────── */

function getModalRect() {
  const pad = 42;
  const w = Math.min(900, window.innerWidth - pad * 2);
  const h = Math.min(760, window.innerHeight - pad * 2);
  return {
    left: (window.innerWidth - w) / 2,
    top: (window.innerHeight - h) / 2,
    width: w,
    height: h,
  };
}

/* ─── Shared transition ──────────────────────────────────────────── */
const FLIP_DURATION = 0.58; // seconds
const FLIP_EASE = [0.4, 0, 0.2, 1] as const;
const CONTENT_REVEAL_DELAY = 0.24; // seconds, starts during card expansion
const CONTENT_STAGGER = 0.08; // seconds

/* ─── Modal body content ─────────────────────────────────────────── */

const modalItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.2, 0, 0, 1] as const },
  },
};

const modalBodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: CONTENT_STAGGER } },
};

const cardPreviewIcons = {
  certifications: faAward,
  about: faCircleUser,
  social: faBullhorn,
  experience: faBriefcase,
  education: faBook,
  skills: faScrewdriverWrench,
  projects: faHammer,
  vision: faRocket,
} as const;

function ModalBody({
  card,
  onProjectPreviewClick,
  focusedProjectId,
}: {
  card: PortfolioCard;
  onProjectPreviewClick: (item: ProjectPreviewItem, el: HTMLButtonElement) => void;
  focusedProjectId: string | null;
}) {
  if (card.type === 'certifications') {
    return (
      <>
        {card.certs.map((cert) => (
          <motion.section className="modal-section modal-section-plain" key={cert.name} variants={modalItemVariants}>
            <div className="cert-row">
              <div className="cert-badge" aria-hidden="true">✦</div>
              <div>
                <div className="modal-row-title">{cert.name}</div>
                <div className="modal-row-subtitle">{cert.issuer}</div>
                <div className="cert-date">{cert.date}</div>
              </div>
            </div>
          </motion.section>
        ))}
      </>
    );
  }

  if (card.type === 'social') {
    return (
      <>
        {card.links.map((link) => (
          <motion.section key={link.platform} variants={modalItemVariants}>
            <a
              className="social-row"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="social-icon" aria-hidden="true">
                {link.icon
                  ? <img src={link.icon} alt={`${link.platform} icon`} className="social-icon-image" height={32} width={32} />
                  : <span>{link.platform}</span>}
              </div>
              <div>
                <div className="modal-row-title">{link.platform}</div>
                <div className="modal-row-subtitle">{link.handle}</div>
                {/* <div className="modal-text">{link.description}</div> */}
              </div>
            </a>
          </motion.section>
        ))}
      </>
    );
  }

  if (card.type === 'about') {
    return (
      <>
        {card.bio.map((p) => (
          <motion.section className="modal-section" key={p} variants={modalItemVariants}>
            <p className="modal-text">{p}</p>
          </motion.section>
        ))}
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Things I believe</div>
          <ul className="belief-list">
            {card.beliefs.map((b) => (
              <li key={b}>
                <span className="belief-dot" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </>
    );
  }

  if (card.type === 'skills') {
    return (
      <>
        {card.categories.map((cat) => (
          <motion.section className="modal-section modal-section-plain" key={cat.label} variants={modalItemVariants}>
            <div className="skill-category p-3">
              <p className="skill-category-label">{cat.label}</p>
              <div className="d-flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span className="tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </>
    );
  }

  if (card.type === 'education') {
    return (
      <>
        {card.entries.map((entry) => (
          <motion.section className="modal-section" key={`${entry.degree}-details`} variants={modalItemVariants}>
            <p className="timeline-role">{entry.degree}</p>
            <p className="timeline-company">{entry.institution}</p>
            <p className="timeline-dates">{entry.dates}</p>
            <p className="modal-text education-details">{entry.details}</p>
          </motion.section>
        ))}
        {card.entries.map((entry) => (
          <motion.section className="modal-section education-modules-section" key={`${entry.degree}-modules`} variants={modalItemVariants}>
            <div className="modal-row-title">Key Modules</div>
            <div className="d-flex flex-wrap gap-2 education-modules-tags">
              {entry.modules.map((m) => (
                <span className="tag" key={`${entry.degree}-${m}`}>{m}</span>
              ))}
            </div>
          </motion.section>
        ))}
      </>
    );
  }

  if (card.type === 'vision') {
    return (
      <>
        {card.body.map((p) => (
          <motion.section className="modal-section" key={p} variants={modalItemVariants}>
            <p className="modal-text">{p}</p>
          </motion.section>
        ))}
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Goals</div>
          <ul className="belief-list">
            {card.goals.map((g) => (
              <li key={g}>
                <span className="belief-dot" aria-hidden="true" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </>
    );
  }

  if (card.type === 'experience') {
    return (
      <div className="timeline" aria-label="Experience timeline">
        {card.roles.map((role) => (
          <motion.article
            className="timeline-item"
            key={`${role.company}-${role.role}`}
            variants={modalItemVariants}
          >
            <span className={`timeline-dot ${role.isRecent ? 'is-recent' : ''}`} aria-hidden="true" />
            <div className="timeline-content">
              <p className="timeline-role">{role.role}</p>
              <p className="timeline-company">{role.company}</p>
              <p className="timeline-dates">{role.dates}</p>
              <p className="modal-text">{role.impact}</p>
              <div className="d-flex flex-wrap gap-2">
                {role.skills.map((s) => <span className="tag" key={s}>{s}</span>)}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    );
  }

  if (card.type === 'project') {
    return (
      <>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="project-image-placeholder" role="img" aria-label={card.imageTitle}>
            {card.imageTitle}
          </div>
        </motion.section>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <p className="modal-text">{card.description}</p>
        </motion.section>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Impact</div>
          <div className="d-flex flex-wrap gap-2">
            {card.impact.map((i) => <span className="pill" key={i}>{i}</span>)}
          </div>
        </motion.section>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Stack</div>
          <div className="d-flex flex-wrap gap-2">
            {card.stack.map((i) => (
              <span className={`tag ${i.primary ? 'is-primary' : ''}`} key={i.name}>{i.name}</span>
            ))}
          </div>
        </motion.section>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Links</div>
          <div className="link-row d-flex gap-2">
            {card.links.map((l) => (
              <a href={l.href} key={l.label} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        </motion.section>
      </>
    );
  }

  if (card.type === 'projects') {
    return (
      <section className="projects-preview-grid" aria-label="Projects overview cards">
        {card.items.map((item) => {
          const isHidden = focusedProjectId === item.id;
          return (
            <motion.button
              className={`project-preview-card${isHidden ? ' project-preview-card-hidden' : ''}`}
              key={item.id}
              variants={modalItemVariants}
              onClick={isHidden ? undefined : (event) => onProjectPreviewClick(item, event.currentTarget)}
              type="button"
              aria-hidden={isHidden || undefined}
            >
              <h3 className="project-preview-title">{item.title}</h3>
              <p className="project-preview-summary">{item.summary}</p>
            </motion.button>
          );
        })}
      </section>
    );
  }
}

/* ─── Flying flip card ───────────────────────────────────────────── */

interface FromRect { left: number; top: number; width: number; height: number; }

interface FlipCardProps {
  card: PortfolioCard;
  fromRect: FromRect;
  onClose: () => void;
}

interface ProjectFocusState {
  item: ProjectPreviewItem;
  fromRect: FromRect;
}

function FlipCard({ card, fromRect, onClose }: FlipCardProps) {
  const [modalRect, setModalRect] = useState(() => getModalRect());
  const [modalHeight, setModalHeight] = useState(modalRect.height);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [projectFocus, setProjectFocus] = useState<ProjectFocusState | null>(null);
  const [projectFocusClosedId, setProjectFocusClosedId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const computeHeight = useCallback((rect: ReturnType<typeof getModalRect>) => {
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    const bodyHeight = bodyRef.current?.scrollHeight ?? 0;
    const contentHeight = headerHeight + bodyHeight;
    const targetHeight = Math.min(rect.height, contentHeight || rect.height);
    setModalHeight(targetHeight);
  }, []);

  const measureModal = useCallback(() => {
    const nextRect = getModalRect();
    setModalRect(nextRect);
    computeHeight(nextRect);
  }, [computeHeight]);

  useLayoutEffect(() => {
    measureModal();
    const rafId = requestAnimationFrame(() => {
      measureModal();
    });
    return () => cancelAnimationFrame(rafId);
  }, [card, measureModal]);

  useEffect(() => {
    const handleResize = () => measureModal();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureModal]);

  useEffect(() => {
    if (!bodyRef.current && !headerRef.current) return undefined;
    const observer = new ResizeObserver(() => measureModal());
    if (bodyRef.current) observer.observe(bodyRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [measureModal]);

  useEffect(() => {
    setIsContentRevealed(false);
    setProjectFocus(null);
    setProjectFocusClosedId(null);
    const revealTimer = window.setTimeout(() => {
      setIsContentRevealed(true);
    }, CONTENT_REVEAL_DELAY * 1000);
    return () => window.clearTimeout(revealTimer);
  }, [card.id]);

  const projectFocusRect = useMemo(() => {
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    const topOffset = headerHeight + 14;
    const viewportPadding = 24;
    const maxWidth = Math.max(320, window.innerWidth - viewportPadding * 2);
    const focusWidth = Math.min(maxWidth, modalRect.width + 84);
    const availableHeight = Math.max(250, modalHeight - topOffset + 28);
    const left = modalRect.left + ((modalRect.width - focusWidth) / 2);
    return {
      left,
      top: modalRect.top + topOffset,
      width: focusWidth,
      height: availableHeight,
    };
  }, [modalHeight, modalRect]);

  const handleProjectPreviewClick = useCallback((item: ProjectPreviewItem, el: HTMLButtonElement) => {
    const rect = el.getBoundingClientRect();
    setProjectFocusClosedId(null);
    setProjectFocus({
      item,
      fromRect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
    });
  }, []);

  const closeProjectFocus = useCallback(() => {
    setProjectFocusClosedId(projectFocus?.item.id ?? null);
    setProjectFocus(null);
  }, [projectFocus]);

  useEffect(() => {
    if (!projectFocus) return undefined;
    const onProjectEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      event.preventDefault();
      setProjectFocus(null);
    };
    window.addEventListener('keydown', onProjectEscape, true);
    return () => window.removeEventListener('keydown', onProjectEscape, true);
  }, [projectFocus]);

  return (
    <>
      {/* Scrim behind the card */}
      <motion.div
        className="flip-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* The flying card — framer-motion owns position + size */}
      <motion.div
        className={`flip-wrapper${projectFocus ? ' flip-wrapper-nested-focus' : ''}`}
        initial={{ left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height }}
        animate={{ left: modalRect.left, top: modalRect.top, width: modalRect.width, height: modalHeight }}
        exit={{ left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height }}
        transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
      >
        {/* Inner rotating element — W3Schools preserve-3d pattern */}
        <motion.div
          className="flip-inner"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          exit={{ rotateY: 0 }}
          transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front face — exact copy of the card */}
          <div className="flip-face flip-front">
            <CardInner card={card} />
          </div>

          {/* Back face — modal content (rotated 180deg base, visible when inner=180) */}
          <div className={`flip-face flip-back${projectFocus ? ' flip-back-nested-focus' : ''}`}>
            <div style={{ width: modalRect.width, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <header className="portfolio-modal-header" ref={headerRef}>
                <div>
                  <p className="modal-label">{card.label}</p>
                  <h2 className="modal-title">{card.title}</h2>
                </div>
              </header>
              <motion.div
                className="portfolio-modal-body"
                initial="hidden"
                animate={isContentRevealed ? 'visible' : 'hidden'}
                exit="hidden"
                variants={modalBodyVariants}
                ref={bodyRef}
              >
                <ModalBody
                  card={card}
                  focusedProjectId={projectFocus?.item.id ?? projectFocusClosedId}
                  onProjectPreviewClick={handleProjectPreviewClick}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence onExitComplete={() => setProjectFocusClosedId(null)}>
        {projectFocus && (
          <>
            <motion.button
              className="project-focus-scrim"
              aria-label="Close project details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeProjectFocus}
              type="button"
            />
            <motion.div
              className="project-focus-wrapper"
              initial={{
                left: projectFocus.fromRect.left,
                top: projectFocus.fromRect.top,
                width: projectFocus.fromRect.width,
                height: projectFocus.fromRect.height,
              }}
              animate={projectFocusRect}
              exit={{
                left: projectFocus.fromRect.left,
                top: projectFocus.fromRect.top,
                width: projectFocus.fromRect.width,
                height: projectFocus.fromRect.height,
              }}
              transition={{ duration: 0.48, ease: FLIP_EASE }}
            >
              <motion.div
                className="project-focus-inner"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180 }}
                exit={{ rotateX: 0 }}
                transition={{ duration: 0.48, ease: FLIP_EASE }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="project-focus-face project-focus-front">
                  <h3 className="project-preview-title">{projectFocus.item.title}</h3>
                  <p className="project-preview-summary">{projectFocus.item.summary}</p>
                </div>
                <div className="project-focus-face project-focus-back">
                  <header className="project-focus-header">
                    <div>
                      <h3 className="project-focus-title">{projectFocus.item.title}</h3>
                    </div>
                    <button
                      aria-label="Close focused project"
                      className="modal-close"
                      onClick={closeProjectFocus}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                  </header>
                  <div className="project-focus-body">
                    <section className="modal-section">
                      <p className="modal-text">{projectFocus.item.summary}</p>
                    </section>
                    <section className="modal-section">
                      <div className="modal-row-title">Impact</div>
                      <div className="d-flex flex-wrap gap-2">
                        {projectFocus.item.impact.map((impactPoint) => <span className="pill" key={impactPoint}>{impactPoint}</span>)}
                      </div>
                    </section>
                    <section className="modal-section">
                      <div className="modal-row-title">Stack</div>
                      <div className="d-flex flex-wrap gap-2">
                        {projectFocus.item.stack.map((tag) => (
                          <span className={`tag ${tag.primary ? 'is-primary' : ''}`} key={tag.name}>{tag.name}</span>
                        ))}
                      </div>
                    </section>
                    <section className="modal-section">
                      <div className="modal-row-title">Links</div>
                      <div className="link-row d-flex gap-2">
                        {projectFocus.item.links.map((link) => (
                          <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}</a>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Card inner content (shared between grid & flip front) ──────── */

function CardInner({ card }: { card: PortfolioCard }) {
  const previewIcon = cardPreviewIcons[card.id as keyof typeof cardPreviewIcons];

  return (
    <>
      {previewIcon && (
        <span className="card-preview-icon" aria-hidden="true">
          <FontAwesomeIcon icon={previewIcon} />
        </span>
      )}
      <p className="card-label">{card.label}</p>
      <h2 className="card-title">{card.title}</h2>
      {/* <p className="card-summary">{card.summary}</p> */}
    </>
  );
}

/* ─── App ────────────────────────────────────────────────────────── */

/* ─── Viewport progress border ────────────────────────────────── */

const TRACKABLE_CARDS = portfolioCards.filter((c) => !c.nonClickable);
const TOTAL_SECTIONS = TRACKABLE_CARDS.length;

function ViewportProgress({ viewedCount }: { viewedCount: number }) {
  const pct = TOTAL_SECTIONS > 0 ? (viewedCount / TOTAL_SECTIONS) * 100 : 0;
  const clamped = Math.min(100, Math.max(0, pct));
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const node = pathRef.current;
    if (!node) return undefined;

    const updateLength = () => {
      setPathLength(node.getTotalLength());
    };

    updateLength();
    window.addEventListener('resize', updateLength);
    return () => window.removeEventListener('resize', updateLength);
  }, []);

  useEffect(() => {
    if (pathLength > 0) {
      setIsReady(true);
    }
  }, [pathLength]);

  const dasharray = pathLength || 0;
  const dashoffset = pathLength ? pathLength * (1 - clamped / 100) : 0;

  return (
    <div className="viewport-progress" aria-hidden="true">
      <svg className="viewport-progress-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={pathRef}
          className={`viewport-progress-path${isReady ? ' viewport-progress-ready' : ''}`}
          d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
          fill="none"
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
        />
      </svg>
    </div>
  );
}

function App() {
  /* Dark mode */
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* Viewed cards (session only — resets on refresh) */
  const [viewedCards, setViewedCards] = useState<Set<string>>(() => new Set());

  const viewedCount = viewedCards.size;

  /* Flip state */
  interface FlipState { cardId: string; fromRect: FromRect; }
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const [closedCardId, setClosedCardId] = useState<string | null>(null);

  const activeCard = useMemo(
    () => flipState ? portfolioCards.find((c) => c.id === flipState.cardId) ?? null : null,
    [flipState],
  );

  const handleCardClick = useCallback((cardId: string, el: HTMLButtonElement) => {
    const r = el.getBoundingClientRect();
    setViewedCards((prev) => new Set([...prev, cardId]));
    setFlipState({ cardId, fromRect: { left: r.left, top: r.top, width: r.width, height: r.height } });
  }, []);

  const handleClose = useCallback(() => {
    setClosedCardId(flipState?.cardId ?? null);
    setFlipState(null);
  }, [flipState]);

  const handleExitComplete = useCallback(() => {
    setClosedCardId(null);
  }, []);

  /* Escape key */
  useEffect(() => {
    if (!flipState) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipState, handleClose]);

  return (
    <div className="portfolio-page">
      <ViewportProgress viewedCount={viewedCount} />

      {/* Dark-mode toggle */}
      <button
        id="theme-toggle"
        className="theme-toggle"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setIsDark((p) => !p)}
        type="button"
      >
        {isDark ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
      </button>

      {/* Bento grid */}
      <main className={`portfolio-grid-surface ${flipState ? 'is-dimmed' : ''}`}>
        <section className="portfolio-grid" aria-label="Portfolio card grid">
          {portfolioCards.map((card) => {
            const isHidden = card.id === flipState?.cardId || card.id === closedCardId;
            const isNonClickable = card.nonClickable === true;
            const isViewed = viewedCards.has(card.id);

            if (isNonClickable) {
              return (
                <div
                  className={`portfolio-card card-${card.type} ${card.placementClass} card-non-clickable${isHidden ? ' card-hidden' : ''}`}
                  key={card.id}
                  aria-label={card.title}
                >
                  <CardInner card={card} />
                </div>
              );
            }

            return (
              <button
                aria-label={card.title}
                className={`portfolio-card card-${card.type} ${card.placementClass}${isHidden ? ' card-hidden' : ''}${isViewed ? ' card-viewed' : ''}`}
                key={card.id}
                onClick={(e) => handleCardClick(card.id, e.currentTarget)}
                type="button"
              >
                <CardInner card={card} />
              </button>
            );
          })}
        </section>
      </main>

      {/* Flying flip card */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {activeCard && (
          <FlipCard
            key={activeCard.id}
            card={activeCard}
            fromRect={flipState!.fromRect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
