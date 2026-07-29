import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { collapseTransition } from '../motion';

/** One collapsible section of the project detail pane. */
export function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="accordion-item">
      <button className={`accordion-header ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <span className="modal-row-title">{title}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`accordion-chevron ${isOpen ? 'rotated' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={collapseTransition}
            className="accordion-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
