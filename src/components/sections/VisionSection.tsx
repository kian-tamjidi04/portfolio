import { motion } from 'framer-motion';
import type { VisionCard } from '../../content';
import { modalItemVariants } from '../../motion';
import { DotListSection } from '../DotListSection';

export function VisionSection({ card }: { card: VisionCard }) {
  return (
    <>
      {card.body.map((paragraph) => (
        <motion.section className="modal-section" key={paragraph} variants={modalItemVariants}>
          <p className="modal-text">{paragraph}</p>
        </motion.section>
      ))}
      <DotListSection title="Goals" items={card.goals} />
    </>
  );
}
