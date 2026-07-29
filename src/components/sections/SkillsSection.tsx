import { motion } from 'framer-motion';
import type { SkillsCard } from '../../content';
import { modalItemVariants } from '../../motion';

export function SkillsSection({ card }: { card: SkillsCard }) {
  return (
    <>
      <motion.section className="modal-section" variants={modalItemVariants}>
        <p className="modal-text">{card.intro}</p>
      </motion.section>
      <div className="skills-grid">
        {card.categories.map((category) => (
          <motion.section
            className="modal-section modal-section-plain"
            key={category.label}
            variants={modalItemVariants}
          >
            <p className="skill-category-label">{category.label}</p>
            <div className="skill-category p-3 ps-2">
              <div className="d-flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </>
  );
}
