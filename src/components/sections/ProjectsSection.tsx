import { motion } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faChevronRight,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark as faRegularCircleXmark } from '@fortawesome/free-regular-svg-icons';
import type { ExternalLink, ProjectsCard } from '../../content';
import { projectContainerVariants, projectItemVariants } from '../../motion';
import { AccordionSection } from '../AccordionSection';
import { InteractiveList } from '../InteractiveList';
import { TagList } from '../TagList';

type AccordionId = 'tech' | 'challenges';

const CHALLENGES_PLACEHOLDER = 'Information coming soon...';

/** Source-code links get the GitHub mark and the primary treatment. */
function isSourceLink(link: ExternalLink) {
  const label = link.label.toLowerCase();
  return label.includes('github') || label.includes('source');
}

export function ProjectsSection({ card }: { card: ProjectsCard }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<AccordionId | null>('tech');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeProject = card.items.find((item) => item.id === selectedProjectId) || card.items[0];

  const toggleAccordion = (id: AccordionId) =>
    setActiveAccordion((current) => (current === id ? null : id));

  return (
    <div className={`projects-split-view ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="projects-sidebar">
        <div className="projects-sidebar-list-container">
          <div className="projects-sidebar-list">
            {card.items.map((item) => (
              <button
                className={`project-sidebar-btn ${activeProject?.id === item.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => {
                  setSelectedProjectId(item.id);
                  setIsSidebarOpen(false);
                }}
                type="button"
              >
                <div className="project-sidebar-btn-content">
                  <h3 className="project-sidebar-title">{item.title}</h3>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="project-sidebar-icon" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile-only: dismiss the overlaid project list */}
        <button
          className="modal-close-cta project-sidebar-close-mobile"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close project list"
        >
          <span className="modal-close-cta-text">Close</span>
          <FontAwesomeIcon icon={faRegularCircleXmark} />
        </button>
      </div>

      <div className="projects-detail-pane">
        <button
          className="project-list-hamburger"
          onClick={() => setIsSidebarOpen(true)}
          type="button"
        >
          <FontAwesomeIcon icon={faListUl} />
          <span>Project List</span>
        </button>
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial="hidden"
            animate="visible"
            variants={projectContainerVariants}
            className="projects-detail-content"
          >
            <motion.div variants={projectItemVariants} className="project-detail-header-group">
              <h2 className="project-detail-header">{activeProject.title}</h2>
              {activeProject.grade && (
                <div className="project-detail-grade">Grade Achieved: {activeProject.grade}</div>
              )}
            </motion.div>
            <motion.div variants={projectItemVariants}>
              <InteractiveList text={activeProject.summary} />
            </motion.div>

            <motion.div variants={projectItemVariants} className="project-detail-accordion">
              <AccordionSection
                title="Technologies and Skills"
                isOpen={activeAccordion === 'tech'}
                onToggle={() => toggleAccordion('tech')}
              >
                <TagList
                  items={activeProject.stack}
                  className="d-flex flex-wrap gap-2 pt-3 pb-1"
                />
              </AccordionSection>

              <AccordionSection
                title="Challenges I faced and how I overcame them"
                isOpen={activeAccordion === 'challenges'}
                onToggle={() => toggleAccordion('challenges')}
              >
                <div className="pt-2">
                  <InteractiveList
                    text={activeProject.challenges || CHALLENGES_PLACEHOLDER}
                  />
                </div>
              </AccordionSection>
            </motion.div>

            <motion.div variants={projectItemVariants} className="project-detail-actions">
              {activeProject.links?.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer"
                  className={`project-action-btn ${
                    isSourceLink(link)
                      ? 'project-action-btn-primary'
                      : 'project-action-btn-secondary'
                  }`}
                >
                  {isSourceLink(link) ? (
                    <img src="./github.svg" alt="GitHub" className="project-action-icon-svg" />
                  ) : (
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  )}
                  {link.label}
                </a>
              ))}
              {activeProject.figmaComingSoon && (
                <div className="project-action-btn project-action-btn-primary project-action-btn-coming-soon">
                  <img src="./figma.svg" alt="Figma" className="project-action-icon-svg" />
                  Figma coming soon
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
