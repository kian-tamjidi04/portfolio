import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { portfolioCards } from './content';
import { CardInner } from './components/CardInner';
import { FlipCard, type FromRect } from './components/FlipCard';
import { useThemeClass } from './hooks/useThemeClass';
import { trackTileClick } from './lib/tileAnalytics';
import { gridContainerVariants, gridItemVariants } from './motion';

interface FlipState {
  cardId: string;
  fromRect: FromRect;
}

function App() {
  useThemeClass();

  /**
   * `flipState` holds the card currently flying/open plus the grid rect it came
   * from. `closedCardId` keeps the origin tile invisible until the reverse flip
   * has finished, so the card never appears in two places at once.
   */
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const [closedCardId, setClosedCardId] = useState<string | null>(null);

  const activeCard = useMemo(
    () => (flipState ? portfolioCards.find((c) => c.id === flipState.cardId) ?? null : null),
    [flipState],
  );

  const handleCardClick = useCallback((cardId: string, el: HTMLButtonElement) => {
    trackTileClick(cardId);
    const { left, top, width, height } = el.getBoundingClientRect();
    setFlipState({ cardId, fromRect: { left, top, width, height } });
  }, []);

  const handleClose = useCallback(() => {
    setClosedCardId(flipState?.cardId ?? null);
    setFlipState(null);
  }, [flipState]);

  const handleExitComplete = useCallback(() => setClosedCardId(null), []);

  useEffect(() => {
    if (!flipState) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipState, handleClose]);

  return (
    <div className="portfolio-page">
      {/* Dark-mode toggle - hidden for now. useThemeClass() also returns [isDark, setIsDark]. */}
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
            const baseClass = `portfolio-card card-${card.type} ${card.placementClass}`;

            if (card.nonClickable === true) {
              return (
                <motion.div
                  className={`${baseClass} card-non-clickable${isHidden ? ' card-hidden' : ''}`}
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
                className={`${baseClass}${isHidden ? ' card-hidden' : ''}`}
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
