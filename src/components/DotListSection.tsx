import { motion } from 'framer-motion';
import { modalItemVariants } from '../motion';

/**
 * A titled list with accent dots — used for About's beliefs and hobbies, and
 * Vision's goals. All three were identical 12-line blocks.
 */
export function DotListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.section className="modal-section" variants={modalItemVariants}>
      <div className="modal-row-title">{title}</div>
      <ul className="belief-list">
        {items.map((item) => (
          <li key={item}>
            <span className="belief-dot" aria-hidden="true" />
            <span className="belief-text">{item}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
