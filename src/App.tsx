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
  faEnvelope,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faCode,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { portfolioCards, type PortfolioCard, type ProjectPreviewItem } from './content';

/* ─── Helpers ────────────────────────────────────────────────────── */

function getModalRect(type?: string) {
  const pad = 42;
  const isProjects = type === 'projects';
  const isAbout = type === 'about';
  const maxWidth = isProjects ? 1400 : (isAbout ? 1100 : 900);
  const maxHeight = isProjects ? 900 : (isAbout ? 9999 : 760);
  const w = Math.min(maxWidth, window.innerWidth - pad * 2);
  const h = Math.min(maxHeight, window.innerHeight - pad * 2);
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

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
};

const projectContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const projectItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
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
}: {
  card: PortfolioCard;
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectPage, setProjectPage] = useState(0);
  const [pageDirection, setPageDirection] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('tech');
  if (card.type === 'certifications') {
    return (
      <>
        {card.certs.map((cert) => (
          <motion.section className="modal-section modal-section-plain" key={cert.name} variants={modalItemVariants}>
            <motion.div 
              className="cert-row"
              initial="initial"
              whileHover="hovered"
            >
              <div className="cert-icon" aria-hidden="true">
                <img src={cert.icon} className="cert-icon-image" height={64} width={64} />
              </div>
              <div className="d-flex flex-column">
                <div className="cert-title-row">
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-separator"> • </span>
                  <span className="cert-company">{cert.issuer}</span>
                </div>
                <div className="cert-date">{cert.date}</div>
                <motion.div
                  variants={{
                    initial: { height: 0, opacity: 0, marginTop: 0 },
                    hovered: { height: 'auto', opacity: 1, marginTop: 8 }
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="cert-takeaway">{cert.takeaway}</p>
                </motion.div>
              </div>
            </motion.div>
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
                  ? <img src={link.icon} alt={`${link.platform} icon`} className="social-icon-image" height={64} width={64} />
                  : link.platform === 'Email'
                    ? <FontAwesomeIcon icon={faEnvelope} size="2xl" />
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
      <div className="about-layout">
        <motion.div className="about-image-col" variants={modalItemVariants}>
          <img src="/Pic.svg" alt="Profile" className="about-image" />
        </motion.div>
        <div className="about-text-col">
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
                  <span className="belief-text">{b}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>
    );
  }

  if (card.type === 'skills') {
    return (
      <>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <p className="modal-text">I believe in product creation and not being limited by any single set of tools</p>
        </motion.section>
        <div className="skills-grid">
          {card.categories.map((cat) => (
            <motion.section className="modal-section modal-section-plain" key={cat.label} variants={modalItemVariants}>
              <p className="skill-category-label">{cat.label}</p>
              <div className="skill-category p-3 ps-2">
                <div className="d-flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </>
    );
  }

  if (card.type === 'education') {
    return (
      <div className="timeline" aria-label="Education timeline">
        {card.entries.map((entry) => (
          <motion.article
            className="timeline-item"
            key={`${entry.institution}-${entry.degree}`}
            variants={modalItemVariants}
          >
            <span className={`timeline-dot ${entry.isRecent ? 'is-recent' : ''}`} aria-hidden="true" />
            <div className="timeline-content">
              <div className="timeline-title-row">
                <span className="timeline-role">{entry.degree}</span>
                <span className="timeline-separator"> • </span>
                <span className="timeline-company">{entry.institution}</span>
              </div>
              <p className="timeline-dates">{entry.dates}</p>
              <p className="modal-text education-details">{entry.details}</p>
              <div className="education-modules-section">
                {entry.degree == 'A Levels' ? (
                  <div className="modal-row-title">Subjects</div>
                ) : (
                  <div className="modal-row-title">Key Modules</div>
                )}
                <div className="d-flex flex-wrap gap-2 education-modules-tags">
                  {entry.modules.map((m) => (
                    <span className="tag" key={`${entry.degree}-${m}`}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
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
                <span className="belief-text">{g}</span>
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
              {role.logo && (
                <div className="experience-logo-container">
                  <img src={role.logo} alt={`${role.company} logo`} className="experience-logo" />
                </div>
              )}
              <div className="timeline-title-row">
                <span className="timeline-role">{role.role}</span>
                <span className="timeline-separator"> • </span>
                <span className="timeline-company">{role.company}</span>
              </div>
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

  if (card.type === 'projects') {
    const itemsPerPage = 4;
    const totalPages = Math.ceil(card.items.length / itemsPerPage);
    const visibleItems = card.items.slice(projectPage * itemsPerPage, (projectPage + 1) * itemsPerPage);

    // Automatically select the first visible project if none is actively set or it's out of bounds
    // But honestly, keeping the activeProject no matter the page is fine.
    const activeProject = card.items.find((i) => i.id === selectedProjectId) || card.items[0];

    const handleNextPage = () => {
      setPageDirection(1);
      setProjectPage((p) => Math.min(totalPages - 1, p + 1));
    };

    const handlePrevPage = () => {
      setPageDirection(-1);
      setProjectPage((p) => Math.max(0, p - 1));
    };

    const pageVariants = {
      enter: (dir: number) => ({
        y: dir > 0 ? 'calc(100% + 8px)' : 'calc(-100% - 8px)',
      }),
      center: {
        y: 0,
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      },
      exit: (dir: number) => ({
        y: dir > 0 ? 'calc(-100% - 8px)' : 'calc(100% + 8px)',
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      }),
    };

    return (
      <div className="projects-split-view">
        <div className="projects-sidebar">
          <button
            className="project-nav-arrow"
            onClick={handlePrevPage}
            disabled={projectPage === 0}
            aria-label="Previous projects"
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </button>

          <div className="projects-sidebar-list-container">
            <AnimatePresence custom={pageDirection}>
              <motion.div
                key={projectPage}
                custom={pageDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="projects-sidebar-list"
              >
                {visibleItems.map((item) => {
                  const isActive = activeProject?.id === item.id;
                  return (
                    <button
                      className={`project-sidebar-btn ${isActive ? 'active' : ''}`}
                      key={item.id}
                      onClick={() => setSelectedProjectId(item.id)}
                      type="button"
                    >
                      <div className="project-sidebar-btn-content">
                        <h3 className="project-sidebar-title">{item.title}</h3>
                      </div>
                      <FontAwesomeIcon icon={faChevronRight} className="project-sidebar-icon" />
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            className="project-nav-arrow"
            onClick={handleNextPage}
            disabled={projectPage === totalPages - 1}
            aria-label="Next projects"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>

        <div className="projects-detail-pane">
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial="hidden"
              animate="visible"
              variants={projectContainerVariants}
              className="projects-detail-content"
            >
              <motion.div variants={projectItemVariants} className="project-detail-header-row">
                <h2 className="project-detail-header">{activeProject.title}</h2>
                {activeProject.grade && (
                  <div className="project-detail-grade">Grade Achieved: {activeProject.grade}</div>
                )}
              </motion.div>
              <motion.p variants={projectItemVariants} className="project-detail-summary">
                {activeProject.summary}
              </motion.p>

              <div className="project-detail-accordion">
                {/* Section 1: Technologies */}
                <div className="accordion-item">
                  <button
                    className={`accordion-header ${activeAccordion === 'tech' ? 'active' : ''}`}
                    onClick={() => setActiveAccordion(activeAccordion === 'tech' ? null : 'tech')}
                  >
                    <span className="modal-row-title">Technologies and Skills</span>
                    <FontAwesomeIcon icon={faChevronDown} className={`accordion-chevron ${activeAccordion === 'tech' ? 'rotated' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'tech' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="accordion-content"
                      >
                        <div className="d-flex flex-wrap gap-2 pt-2 pb-3">
                          {activeProject.stack.map((tag) => (
                            <span className={`tag ${tag.primary ? 'is-primary' : ''}`} key={tag.name}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 2: Challenges */}
                <div className="accordion-item">
                  <button
                    className={`accordion-header ${activeAccordion === 'challenges' ? 'active' : ''}`}
                    onClick={() => setActiveAccordion(activeAccordion === 'challenges' ? null : 'challenges')}
                  >
                    <span className="modal-row-title">Challenges I faced</span>
                    <FontAwesomeIcon icon={faChevronDown} className={`accordion-chevron ${activeAccordion === 'challenges' ? 'rotated' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'challenges' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="accordion-content"
                      >
                        <p className="project-detail-summary pt-2 pb-3">
                          {activeProject.challenges || "Information coming soon..."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 3: What I learnt */}
                <div className="accordion-item">
                  <button
                    className={`accordion-header ${activeAccordion === 'learnt' ? 'active' : ''}`}
                    onClick={() => setActiveAccordion(activeAccordion === 'learnt' ? null : 'learnt')}
                  >
                    <span className="modal-row-title">What I learnt</span>
                    <FontAwesomeIcon icon={faChevronDown} className={`accordion-chevron ${activeAccordion === 'learnt' ? 'rotated' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'learnt' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="accordion-content"
                      >
                        <p className="project-detail-summary pt-2 pb-3">
                          {activeProject.whatILearnt || "Information coming soon..."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.div variants={projectItemVariants} className="project-detail-actions">
                {activeProject.links?.map((link) => (
                  <a href={link.href} key={link.label} target="_blank" rel="noreferrer" className={`project-action-btn ${(link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('source')) ? 'project-action-btn-primary' : 'project-action-btn-secondary'}`}>
                    {(link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('source')) ? (
                      <FontAwesomeIcon icon={faCode} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    )}
                    {link.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
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
  const [modalRect, setModalRect] = useState(() => getModalRect(card.type));
  const [modalHeight, setModalHeight] = useState(modalRect.height);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const computeHeight = useCallback((rect: ReturnType<typeof getModalRect>) => {
    if (card.type === 'projects') {
      setModalHeight(rect.height);
      return;
    }
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    const bodyHeight = bodyRef.current?.scrollHeight ?? 0;
    const contentHeight = headerHeight + bodyHeight;
    const targetHeight = Math.min(rect.height, contentHeight || rect.height);
    setModalHeight(targetHeight);
  }, [card.type]);

  const measureModal = useCallback(() => {
    const nextRect = getModalRect(card.type);
    setModalRect(nextRect);
    computeHeight(nextRect);
  }, [computeHeight, card.type]);

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
    const revealTimer = window.setTimeout(() => {
      setIsContentRevealed(true);
    }, CONTENT_REVEAL_DELAY * 1000);
    return () => window.clearTimeout(revealTimer);
  }, [card.id]);

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
        className="flip-wrapper"
        initial={{ left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height }}
        animate={{
          left: (window.innerWidth - modalRect.width) / 2,
          top: (window.innerHeight - modalHeight) / 2,
          width: modalRect.width,
          height: modalHeight
        }}
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
          <div className="flip-face flip-front" style={{ transition: 'background-color 0.6s ease' }}>
            <CardInner card={card} />
          </div>

          {/* Back face — modal content (rotated 180deg base, visible when inner=180) */}
          <div className="flip-face flip-back">
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
                style={card.type === 'projects' ? { flex: 1, padding: 0, minHeight: 0 } : undefined}
              >
                <ModalBody card={card} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
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
      {card.type !== 'hero' && <p className="card-label">{card.label}</p>}
      <h2 className="card-title">{card.title}</h2>
      {/* <p className="card-summary">{card.summary}</p> */}
    </>
  );
}

/* ─── App ────────────────────────────────────────────────────────── */

/* ─── Viewport progress border ────────────────────────────────── */

// const TRACKABLE_CARDS = portfolioCards.filter((c) => !c.nonClickable);
// const TOTAL_SECTIONS = TRACKABLE_CARDS.length;

// function ViewportProgress({ viewedCount }: { viewedCount: number }) {
//   const pct = TOTAL_SECTIONS > 0 ? (viewedCount / TOTAL_SECTIONS) * 100 : 0;
//   const clamped = Math.min(100, Math.max(0, pct));
//   const pathRef = useRef<SVGPathElement | null>(null);
//   const [pathLength, setPathLength] = useState(0);
//   const [isReady, setIsReady] = useState(false);

//   useLayoutEffect(() => {
//     const node = pathRef.current;
//     if (!node) return undefined;

//     const updateLength = () => {
//       setPathLength(node.getTotalLength());
//     };

//     updateLength();
//     window.addEventListener('resize', updateLength);
//     return () => window.removeEventListener('resize', updateLength);
//   }, []);

//   useEffect(() => {
//     if (pathLength > 0) {
//       setIsReady(true);
//     }
//   }, [pathLength]);

//   const dasharray = pathLength || 0;
//   const dashoffset = pathLength ? pathLength * (1 - clamped / 100) : 0;

//   return (
//     <div className="viewport-progress" aria-hidden="true">
//       <svg className="viewport-progress-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
//         <path
//           ref={pathRef}
//           className={`viewport-progress-path${isReady ? ' viewport-progress-ready' : ''}`}
//           d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
//           fill="none"
//           strokeDasharray={dasharray}
//           strokeDashoffset={dashoffset}
//         />
//       </svg>
//     </div>
//   );
// }

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

  // const viewedCount = viewedCards.size;

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
      {/* <ViewportProgress viewedCount={viewedCount} /> */}

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
        <motion.section
          className="portfolio-grid"
          aria-label="Portfolio card grid"
          initial="hidden"
          animate="visible"
          variants={gridContainerVariants}
        >
          {portfolioCards.map((card) => {
            const isHidden = card.id === flipState?.cardId || card.id === closedCardId;
            const isNonClickable = card.nonClickable === true;
            const isViewed = viewedCards.has(card.id);

            if (isNonClickable) {
              return (
                <motion.div
                  className={`portfolio-card card-${card.type} ${card.placementClass} card-non-clickable${isHidden ? ' card-hidden' : ''}`}
                  key={card.id}
                  aria-label={card.title}
                  variants={gridItemVariants}
                >
                  <CardInner card={card} />
                </motion.div>
              );
            }

            return (
              <motion.button
                aria-label={card.title}
                className={`portfolio-card card-${card.type} ${card.placementClass}${isHidden ? ' card-hidden' : ''}`}
                key={card.id}
                onClick={(e) => handleCardClick(card.id, e.currentTarget)}
                type="button"
                variants={gridItemVariants}
              >
                <CardInner card={card} />
              </motion.button>
            );
          })}
        </motion.section>
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
