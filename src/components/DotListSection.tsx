import { motion } from 'framer-motion';
import { modalItemVariants } from '../motion';

/**
 * A titled dot/disc list — used for About's beliefs and hobbies, and Vision's
 * goals. All three were identical 12-line blocks. Defaults to an accent dot;
 * pass `plainBullets` for the native-disc treatment Vision and About both use.
 */
export function DotListSection({
  title,
  items,
  elevated = false,
  plainBullets = false,
}: {
  title: string;
  items: string[];
  /** Vision's Goals block (Figma node 68:48) and About's beliefs/hobbies (76:53) use the cert-card surface + shadow. */
  elevated?: boolean;
  /** Vision's Goals (Figma 68:45/68:46) and About's beliefs/hobbies (76:157/76:160) use plain native disc bullets instead of the accent dot. */
  plainBullets?: boolean;
}) {
  return (
    <motion.section
      className={elevated ? 'modal-section modal-section--elevated' : 'modal-section'}
      variants={modalItemVariants}
    >
      <div className="modal-row-title">{title}</div>
      <ul className={plainBullets ? 'belief-list belief-list--plain' : 'belief-list'}>
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
