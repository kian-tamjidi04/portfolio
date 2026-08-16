import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { AboutCard } from '../../content';
import { modalItemVariants } from '../../motion';
import { DotListSection } from '../DotListSection';

/** Intrinsic aspect ratio of Pic.svg. */
const PORTRAIT_ASPECT = 1537 / 2730;

export function AboutSection({ card }: { card: AboutCard }) {
  const [textHeight, setTextHeight] = useState<number | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);

  /*
   * The portrait is sized from the text column rather than the other way round,
   * so the two columns always end flush. Observed rather than measured once,
   * because the height moves with hovers, resizes and font loading.
   */
  useEffect(() => {
    const textCol = textColRef.current;
    if (!textCol) return;

    const updateHeight = () => setTextHeight(textCol.offsetHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(textCol);
    return () => resizeObserver.disconnect();
  }, []);

  const imageWidth = textHeight ? textHeight * PORTRAIT_ASPECT : undefined;

  return (
    <div className="about-layout">
      <motion.div
        className="about-image-col"
        variants={modalItemVariants}
        style={
          textHeight
            ? { height: textHeight, width: imageWidth, flex: '0 0 auto' }
            : { flex: '0 0 0px', overflow: 'hidden' }
        }
      >
        <img src="./Pic.svg" alt="Profile" className="about-image" />
      </motion.div>
      <div className="about-text-col" ref={textColRef}>
        {card.bio.map((paragraph) => (
          <motion.section
            className="modal-section modal-section--elevated"
            key={paragraph}
            variants={modalItemVariants}
          >
            <p className="modal-text">{paragraph}</p>
          </motion.section>
        ))}
        <DotListSection title="Things I believe" items={card.beliefs} elevated />
        <DotListSection title="Hobbies" items={card.hobbies} elevated />
      </div>
    </div>
  );
}
