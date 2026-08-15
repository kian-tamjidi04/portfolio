import { motion, type TargetAndTransition } from 'framer-motion';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import type { PortfolioCard } from '../content';
import { getModalRect, getModalSizing, type ModalRect } from '../lib/modalRect';
import {
  CONTENT_REVEAL_DELAY,
  FLIP_DURATION,
  FLIP_EASE,
  SCRIM_DURATION,
  modalBodyVariants,
} from '../motion';
import { CardInner } from './CardInner';
import { ModalBody } from './ModalBody';

export interface FromRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface FlipCardProps {
  card: PortfolioCard;
  fromRect: FromRect;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * The card that flies from its grid position to the centre of the screen while
 * rotating 180° on Y. Front face is the grid card, back face is the modal.
 *
 * Position and size are owned by framer-motion; height is measured from the
 * rendered content so the modal hugs short bodies instead of always filling
 * its maximum bounds.
 */
export function FlipCard({ card, fromRect, onClose }: FlipCardProps) {
  const { fillsHeight } = getModalSizing(card.type);
  const titleId = useId();

  const [modalRect, setModalRect] = useState(() => getModalRect(card.type));
  const [modalHeight, setModalHeight] = useState(modalRect.height);
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  /** Shrink the modal to its content, unless this type always fills its bounds. */
  const computeHeight = useCallback(
    (rect: ModalRect) => {
      if (fillsHeight) {
        setModalHeight(rect.height);
        return;
      }

      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      let bodyHeight = 0;

      if (bodyRef.current) {
        const bodyEl = bodyRef.current;
        const children = Array.from(bodyEl.children);

        if (children.length > 0) {
          // Measure to the bottom of the last child rather than using
          // scrollHeight, which ignores the body's own bottom padding.
          const lastChild = children[children.length - 1] as HTMLElement;
          const paddingBottom = parseFloat(window.getComputedStyle(bodyEl).paddingBottom) || 0;
          bodyHeight = lastChild.offsetTop + lastChild.offsetHeight + paddingBottom;
        } else {
          bodyHeight = bodyEl.scrollHeight;
        }
      }

      const contentHeight = headerHeight + bodyHeight;
      setModalHeight(Math.min(rect.height, contentHeight || rect.height));
    },
    [fillsHeight],
  );

  const measureModal = useCallback(() => {
    const nextRect = getModalRect(card.type);
    setModalRect(nextRect);
    computeHeight(nextRect);
  }, [computeHeight, card.type]);

  // Measure synchronously, then again after paint once fonts/images have settled.
  useLayoutEffect(() => {
    measureModal();
    const rafId = requestAnimationFrame(measureModal);
    return () => cancelAnimationFrame(rafId);
  }, [card, measureModal]);

  useEffect(() => {
    window.addEventListener('resize', measureModal);
    return () => window.removeEventListener('resize', measureModal);
  }, [measureModal]);

  // Re-measure when the content itself changes size (accordions, hovers).
  useEffect(() => {
    if (!bodyRef.current && !headerRef.current) return undefined;
    const observer = new ResizeObserver(() => measureModal());
    if (bodyRef.current) observer.observe(bodyRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [measureModal]);

  // Hold the body hidden until the flip is partway through.
  useEffect(() => {
    setIsContentRevealed(false);
    const revealTimer = window.setTimeout(
      () => setIsContentRevealed(true),
      CONTENT_REVEAL_DELAY * 1000,
    );
    return () => window.clearTimeout(revealTimer);
  }, [card.id]);

  // Move focus into the dialog once it lands, and trap Tab within it.
  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [card.id]);

  return (
    <>
      <motion.div
        className="flip-scrim"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: SCRIM_DURATION }}
        onClick={onClose}
      />

      <motion.div
        className="flip-wrapper"
        initial={fromRect as TargetAndTransition}
        animate={{
          left: modalRect.left,
          top: (window.innerHeight - modalHeight) / 2,
          width: modalRect.width,
          height: modalHeight,
        }}
        exit={fromRect as TargetAndTransition}
        transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
      >
        {/* preserve-3d container: front and back are stacked back-to-back */}
        <motion.div
          className="flip-inner"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          exit={{ rotateY: 0 }}
          transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flip-face flip-front">
            <CardInner card={card} />
          </div>

          <div
            className="flip-face flip-back"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={dialogRef}
          >
            <div
              style={{
                width: modalRect.width,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <header className="portfolio-modal-header" ref={headerRef}>
                <div className="modal-heading-group">
                  <h2 className="modal-title" id={titleId}>
                    {card.label}
                  </h2>
                </div>
                <button
                  className="modal-close-cta"
                  onClick={onClose}
                  aria-label="Close modal"
                  type="button"
                  ref={closeButtonRef}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </header>
              <motion.div
                className="portfolio-modal-body"
                initial="hidden"
                animate={isContentRevealed ? 'visible' : 'hidden'}
                exit="hidden"
                variants={modalBodyVariants}
                ref={bodyRef}
                style={fillsHeight ? { flex: 1, padding: 0, minHeight: 0 } : undefined}
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
