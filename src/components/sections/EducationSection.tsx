import { motion } from 'framer-motion';
import type { EducationCard } from '../../content';
import { modalItemVariants } from '../../motion';
import { InteractiveList } from '../InteractiveList';

const DEFAULT_MODULES_LABEL = 'Key Modules';

export function EducationSection({ card }: { card: EducationCard }) {
  return (
    <div className="timeline">
      {card.entries.map((entry) => (
        <motion.article
          className="timeline-item"
          key={`${entry.institution}-${entry.degree}`}
          variants={modalItemVariants}
        >
          <span
            className={`timeline-dot ${entry.isRecent ? 'is-recent' : ''}`}
            aria-hidden="true"
          />
          <div className="timeline-content panel panel--roomy">
            <div className="timeline-title-row">
              <span className="timeline-role">{entry.degree}</span>
              <span className="timeline-separator"> • </span>
              <span className="timeline-company">{entry.institution}</span>
            </div>
            <p className="timeline-dates">{entry.dates}</p>
            <InteractiveList items={entry.details} />
            <div className="education-modules-section">
              <div className="modal-row-title">{entry.modulesLabel ?? DEFAULT_MODULES_LABEL}</div>
              <div className="d-flex flex-wrap gap-2 education-modules-tags">
                {entry.modules.map((module) => (
                  <span className="tag" key={`${entry.degree}-${module}`}>
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
