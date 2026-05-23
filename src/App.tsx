import { AnimatePresence, motion, cubicBezier } from 'framer-motion';
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
  faEnvelope,
  faChevronRight,
  faChevronDown,
  faArrowUpRightFromSquare,
  faListUl
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark as faRegularCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { portfolioCards, type PortfolioCard, type AboutCard } from './content';

/* ─── Helpers ────────────────────────────────────────────────────── */

function getModalRect(type?: string) {
  const pad = 42;
  const isProjects = type === 'projects';
  const isAbout = type === 'about';
  const maxWidth = isProjects ? 1400 : (isAbout ? 1300 : 900);
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
const FLIP_EASE = cubicBezier(0.4, 0, 0.2, 1);
const CONTENT_REVEAL_DELAY = 0.24; // seconds, starts during card expansion
const CONTENT_STAGGER = 0.08; // seconds

/* ─── Modal body content ─────────────────────────────────────────── */

const modalItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: cubicBezier(0.2, 0, 0, 1) },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezier(0.4, 0, 0.2, 1) } },
};

const projectContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const projectItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) } },
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

function InteractiveList({ text, className = "" }: { text: string; className?: string }) {
  const sentences = useMemo(() => {
    // Split by . ! or ? followed by whitespace, keeping the punctuation
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
  }, [text]);

  return (
    <ul className={`interactive-bullet-list ${className}`}>
      {sentences.map((s, i) => (
        <li key={i} className="interactive-bullet-item">
          {s}
        </li>
      ))}
    </ul>
  );
}

function AboutSection({ card }: { card: AboutCard }) {
  const [textHeight, setTextHeight] = useState<number | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const textCol = textColRef.current;
    if (!textCol) return;

    const updateHeight = () => {
      setTextHeight(textCol.offsetHeight);
    };

    // Measure initially
    updateHeight();

    // Observe changes to the text column size (hovers, window resize, fonts loading)
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(textCol);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Pic.svg aspect ratio is 1537 / 2730
  const imageWidth = textHeight ? textHeight * (1537 / 2730) : undefined;

  return (
    <div className="about-layout">
      <motion.div
        className="about-image-col"
        variants={modalItemVariants}
        style={textHeight ? { height: textHeight, width: imageWidth, flex: '0 0 auto' } : undefined}
      >
        <img src="./Pic.svg" alt="Profile" className="about-image" />
      </motion.div>
      <div className="about-text-col" ref={textColRef}>
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
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="modal-row-title">Hobbies</div>
          <ul className="belief-list">
            {card.hobbies.map((h) => (
              <li key={h}>
                <span className="belief-dot" aria-hidden="true" />
                <span className="belief-text">{h}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}

function ModalBody({
  card,
}: {
  card: PortfolioCard;
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('tech');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  if (card.type === 'certifications') {
    return (
      <>
        {card.certs.map((cert) => (
          <motion.section className="modal-section modal-section-plain" key={cert.name} variants={modalItemVariants}>
            <motion.a
              className="cert-row"
              href={cert.href}
              target="_blank"
              rel="noreferrer"
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
                  transition={{ duration: 0.3, ease: cubicBezier(0.4, 0, 0.2, 1) }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="cert-takeaway">{cert.takeaway}</p>
                </motion.div>
              </div>
            </motion.a>
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
                    ? <FontAwesomeIcon icon={faEnvelope} size="2xl" style={{ transform: 'scale(1.5)' }} />
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
    return <AboutSection card={card} />;
  }

  if (card.type === 'skills') {
    return (
      <>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <p className="modal-text">I'm a tool-agnostic engineer - I cultivate an adaptable mindset to pick up new tools quickly. Here are the skills I'm actively developing:</p>
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
              <InteractiveList text={entry.details} />
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
              <InteractiveList text={role.impact} />
              <div className="d-flex flex-wrap gap-2">
                {role.skills.map((s) => (
                  <span className={`tag ${s.primary ? 'is-primary' : ''}`} key={s.name}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    );
  }

  if (card.type === 'projects') {
    const activeProject = card.items.find((i) => i.id === selectedProjectId) || card.items[0];

    return (
      <div className={`projects-split-view ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="projects-sidebar">
          <div className="projects-sidebar-list-container">
            <div className="projects-sidebar-list">
              {card.items.map((item) => {
                const isActive = activeProject?.id === item.id;
                return (
                  <button
                    className={`project-sidebar-btn ${isActive ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => {
                      setSelectedProjectId(item.id);
                      setIsSidebarOpen(false);
                    }}
                    type="button"
                  >
                    <div className="project-sidebar-btn-content">
                      <h3 className="project-sidebar-title">{item.title}</h3>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="project-sidebar-icon" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Close Button for Sidebar */}
          <button
            className="project-sidebar-close-mobile"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close project list"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>

        <div className="projects-detail-pane">
          <button
            className="project-list-hamburger"
            onClick={() => setIsSidebarOpen(true)}
            type="button"
          >
            <FontAwesomeIcon icon={faListUl} />
            <span>Project List</span>
          </button>
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial="hidden"
              animate="visible"
              variants={projectContainerVariants}
              className="projects-detail-content"
            >
              <motion.div variants={projectItemVariants} className="project-detail-header-group">
                <h2 className="project-detail-header">{activeProject.title}</h2>
                {activeProject.grade && (
                  <div className="project-detail-grade">Grade Achieved: {activeProject.grade}</div>
                )}
              </motion.div>
              <motion.div variants={projectItemVariants}>
                <InteractiveList text={activeProject.summary} />
              </motion.div>

              <motion.div variants={projectItemVariants} className="project-detail-accordion">
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
                        <div className="d-flex flex-wrap gap-2 pt-3 pb-1">
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

                <div className="accordion-item">
                  <button
                    className={`accordion-header ${activeAccordion === 'challenges' ? 'active' : ''}`}
                    onClick={() => setActiveAccordion(activeAccordion === 'challenges' ? null : 'challenges')}
                  >
                    <span className="modal-row-title">Challenges I faced and how I overcame them</span>
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
                        <div className="pt-2">
                          <InteractiveList text={activeProject.challenges || "Information coming soon..."} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={projectItemVariants} className="project-detail-actions">
                {activeProject.links?.map((link) => (
                  <a href={link.href} key={link.label} target="_blank" rel="noreferrer" className={`project-action-btn ${(link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('source')) ? 'project-action-btn-primary' : 'project-action-btn-secondary'}`}>
                    {(link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('source')) ? (
                      <img src="./github.svg" alt="GitHub" className="project-action-icon-svg" />
                    ) : (
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    )}
                    {link.label}
                  </a>
                ))}
                {activeProject.id === 'project-07' && (
                  <div className="project-action-btn project-action-btn-primary project-action-btn-coming-soon">
                    <img src="./figma.svg" alt="Figma" className="project-action-icon-svg" />
                    Figma coming soon
                  </div>
                )}
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
                <button className="modal-close-cta" onClick={onClose} aria-label="Close modal">
                  <span className="modal-close-cta-text">Close</span>
                  <FontAwesomeIcon icon={faRegularCircleXmark} />
                </button>
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
function App() {
  /* Dark mode */
  const [isDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored === 'dark';
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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
      {/* Dark-mode toggle - hidden for now */}
      {/* <button
        id="theme-toggle"
        className="theme-toggle"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setIsDark((p) => !p)}
        type="button"
      >
        {isDark ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
      </button> */}

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
