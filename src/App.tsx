import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { portfolioCards, type PortfolioCard } from './content';

const flipTransition = {
  duration: 0.55,
  ease: [0.4, 0, 0.2, 1] as const,
};

const modalBodyVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.56,
      staggerChildren: 0.09,
    },
  },
};

const modalItemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.2, 0, 0, 1] as const,
    },
  },
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

  if (card.type === 'status') {
    return (
      <>
        <motion.section className="modal-section" variants={modalItemVariants}>
          <div className="status-line modal-status-line">
            <span className="status-dot" aria-hidden="true" />
            <span>{card.statusText}</span>
          </div>
          <p className="modal-text">{card.statusSubtitle}</p>
        </motion.section>
      </>
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
              {link.icon ? (
                <img src={link.icon} alt={`${link.platform} icon`} className="social-icon-image" height={32} width={32} />
              ) : (
                <span>{link.platform}</span>
              )}
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
        {card.bio.map((paragraph) => (
          <motion.section
            className="modal-section"
            key={paragraph}
            variants={modalItemVariants}
          >
            <p className="modal-text">{paragraph}</p>
          </motion.section>
        ))}
        <motion.section className="modal-section" variants={modalItemVariants}>
          <h3 className="modal-row-title">Things I believe</h3>
          <ul className="belief-list">
            {card.beliefs.map((belief) => (
              <li key={belief}>
                <span className="belief-dot" aria-hidden="true" />
                <span>{belief}</span>
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
            <span
              className={`timeline-dot ${role.isRecent ? 'is-recent' : ''}`}
              aria-hidden="true"
            />
            <div className="timeline-content">
              <p className="timeline-role">{role.role}</p>
              <p className="timeline-company">{role.company}</p>
              <p className="timeline-dates">{role.dates}</p>
              <p className="modal-text">{role.impact}</p>
              <div className="tag-row">
                {role.skills.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    );
  }

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
          {card.impact.map((item) => (
            <span className="pill" key={item}>
              {item}
            </span>
          ))}
        </div>
      </motion.section>
      <motion.section className="modal-section" variants={modalItemVariants}>
        <h3 className="modal-row-title">Stack</h3>
        <div className="tag-row">
          {card.stack.map((item) => (
            <span className={`tag ${item.primary ? 'is-primary' : ''}`} key={item.name}>
              {item.name}
            </span>
          ))}
        </div>
      </motion.section>
      <motion.section className="modal-section" variants={modalItemVariants}>
        <h3 className="modal-row-title">Links</h3>
        <div className="link-row">
          {card.links.map((link) => (
            <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </motion.section>
    </>
  );
}

function App() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const activeCard = useMemo(
    () => portfolioCards.find((card) => card.id === activeCardId) ?? null,
    [activeCardId],
  );

  useEffect(() => {
    if (!activeCardId) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveCardId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeCardId]);

  return (
    <div className="portfolio-page">
      <main className={`portfolio-grid-surface ${activeCard ? 'is-dimmed' : ''}`}>
        <section className="portfolio-grid" aria-label="Portfolio card grid">
          {portfolioCards.map((card) => (
            <button
              className={`portfolio-card card-${card.type} ${card.placementClass}`}
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              type="button"
            >
              <p className="card-label">{card.label}</p>
              <h2 className="card-title">{card.title}</h2>
              <p className="card-summary">{card.summary}</p>

              {card.type === 'hero' && <span className="hero-orb" aria-hidden="true" />}

              {card.type === 'status' && (
                <div className="status-line">
                  <span className="status-dot" aria-hidden="true" />
                  <span>{card.statusText}</span>
                </div>
              )}

              {card.type === 'project' && <span className="project-accent" aria-hidden="true" />}
            </button>
          ))}
        </section>
      </main>

      <AnimatePresence>
        {activeCard && (
          <>
            <motion.button
              aria-label="Close active card"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCardId(null)}
              transition={{ duration: 0.2 }}
              type="button"
            />

            <motion.div
              className="modal-viewport"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.article
                className="portfolio-modal"
                initial={{ rotateY: 90, scale: 0.6, opacity: 0 }}
                animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                exit={{ rotateY: 90, scale: 0.6, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
                transition={flipTransition}
              >
                <header className="portfolio-modal-header">
                  <div>
                    <p className="modal-label">{activeCard.label}</p>
                    <h2 className="modal-title">{activeCard.title}</h2>
                  </div>
                  <button
                    aria-label="Close modal"
                    className="modal-close"
                    onClick={() => setActiveCardId(null)}
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
                  <ModalBody card={activeCard} />
                </motion.div>
              </motion.article>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
