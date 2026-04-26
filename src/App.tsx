import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { portfolioCards, type PortfolioCard } from './content';

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
  visible: { transition: { delayChildren: FLIP_DURATION + 0.05, staggerChildren: 0.08 } },
};

function ModalBody({ card }: { card: PortfolioCard }) {
  if (card.type === 'hero') {
    return (
      <>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <p className="modal-text">
            {card.name} builds thoughtful digital products where interaction quality
            and engineering reliability move together.
          </p>
        </motion.section>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <p className="modal-text">{card.subtitle}</p>
        </motion.section>
      </>
    );
  }

  if (card.type === 'certifications') {
    return (
      <div className="modal-list">
        {card.certs.map((cert) => (
          <motion.div className="cert-row" key={cert.name} variants={modalItemVariants}>
            <div className="cert-badge" aria-hidden="true">✦</div>
            <div>
              <h3 className="modal-row-title">{cert.name}</h3>
              <p className="modal-row-subtitle">{cert.issuer}</p>
              <p className="cert-date">{cert.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (card.type === 'social') {
    return (
      <div className="modal-list">
        {card.links.map((link) => (
          <motion.a
            className="social-row"
            href={link.href}
            key={link.platform}
            target="_blank"
            rel="noreferrer"
            variants={modalItemVariants}
          >
            <div className="social-icon" aria-hidden="true">
              {link.icon
                ? <img src={link.icon} alt={`${link.platform} icon`} className="social-icon-image" height={32} width={32} />
                : <span>{link.platform}</span>}
            </div>
            <div>
              <h3 className="modal-row-title">{link.platform}</h3>
              <p className="modal-row-subtitle">{link.handle}</p>
              <p className="modal-text">{link.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
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
          <h3 className="modal-row-title">Things I believe</h3>
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
      <div className="skills-grid">
        {card.categories.map((cat) => (
          <motion.div className="skill-category" key={cat.label} variants={modalItemVariants}>
            <p className="skill-category-label">{cat.label}</p>
            <div className="tag-row">
              {cat.items.map((item) => (
                <span className="tag" key={item}>{item}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (card.type === 'education') {
    return (
      <>
        {card.entries.map((entry) => (
          <motion.div key={entry.degree} variants={modalItemVariants}>
            <motion.section className="modal-section" variants={modalItemVariants}>
              <p className="timeline-role">{entry.degree}</p>
              <p className="timeline-company">{entry.institution}</p>
              <p className="timeline-dates">{entry.dates}</p>
              <p className="modal-text" style={{ marginTop: '8px' }}>{entry.details}</p>
            </motion.section>
            <motion.section className="modal-section" style={{ marginTop: '12px' }} variants={modalItemVariants}>
              <h3 className="modal-row-title">Key Modules</h3>
              <div className="tag-row" style={{ marginTop: '10px' }}>
                {entry.modules.map((m) => (
                  <span className="tag" key={m}>{m}</span>
                ))}
              </div>
            </motion.section>
          </motion.div>
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
          <h3 className="modal-row-title">Goals</h3>
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
      <section className="timeline" aria-label="Experience timeline">
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
              <div className="tag-row">
                {role.skills.map((s) => <span className="tag" key={s}>{s}</span>)}
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    );
  }

  // project
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
        <h3 className="modal-row-title">Impact</h3>
        <div className="pill-grid">
          {card.impact.map((i) => <span className="pill" key={i}>{i}</span>)}
        </div>
      </motion.section>
      <motion.section className="modal-section" variants={modalItemVariants}>
        <h3 className="modal-row-title">Stack</h3>
        <div className="tag-row">
          {card.stack.map((i) => (
            <span className={`tag ${i.primary ? 'is-primary' : ''}`} key={i.name}>{i.name}</span>
          ))}
        </div>
      </motion.section>
      <motion.section className="modal-section" variants={modalItemVariants}>
        <h3 className="modal-row-title">Links</h3>
        <div className="link-row">
          {card.links.map((l) => (
            <a href={l.href} key={l.label} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </div>
      </motion.section>
    </>
  );
}

/* ─── Flying flip card ───────────────────────────────────────────── */

interface FromRect { left: number; top: number; width: number; height: number; }

interface FlipCardProps {
  card: PortfolioCard;
  fromRect: FromRect;
  onClose: () => void;
}

function FlipCard({ card, fromRect, onClose }: FlipCardProps) {
  const toRect = useMemo(() => getModalRect(), []);

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
        animate={{ left: toRect.left, top: toRect.top, width: toRect.width, height: toRect.height }}
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
            <p className="card-label">{card.label}</p>
            <h2 className="card-title">{card.title}</h2>
            <p className="card-summary">{card.summary}</p>
          </div>

          {/* Back face — modal content (rotated 180deg base, visible when inner=180) */}
          <div className="flip-face flip-back">
            <header className="portfolio-modal-header">
              <div>
                <p className="modal-label">{card.label}</p>
                <h2 className="modal-title">{card.title}</h2>
              </div>
              <button
                aria-label="Close modal"
                className="modal-close"
                onClick={onClose}
                type="button"
              >
                ✕
              </button>
            </header>
            <motion.div
              className="portfolio-modal-body"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalBodyVariants}
            >
              <ModalBody card={card} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ─── Card inner content (shared between grid & flip front) ──────── */

function CardInner({ card }: { card: PortfolioCard }) {
  return (
    <>
      <p className="card-label">{card.label}</p>
      <h2 className="card-title">{card.title}</h2>
      <p className="card-summary">{card.summary}</p>
    </>
  );
}

/* ─── App ────────────────────────────────────────────────────────── */

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
      {/* Dark-mode toggle */}
      <button
        id="theme-toggle"
        className="theme-toggle"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setIsDark((p) => !p)}
        type="button"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Bento grid */}
      <main className={`portfolio-grid-surface ${flipState ? 'is-dimmed' : ''}`}>
        <section className="portfolio-grid" aria-label="Portfolio card grid">
          {portfolioCards.map((card) => {
            const isHidden = card.id === flipState?.cardId || card.id === closedCardId;
            const isNonClickable = card.nonClickable === true;

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
                className={`portfolio-card card-${card.type} ${card.placementClass}${isHidden ? ' card-hidden' : ''}`}
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
