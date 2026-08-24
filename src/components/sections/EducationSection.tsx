import type { EducationCard } from '../../content';
import { InteractiveList } from '../InteractiveList';
import { VerticalTimeline } from '../VerticalTimeline';

const DEFAULT_MODULES_LABEL = 'Key Modules';

/**
 * One education entry at a time on the shared vertical timeline. Each entry's
 * title/subtitle/body follows the Certifications card's type scale
 * (.cert-title/.cert-date/.cert-takeaway).
 */
export function EducationSection({ card }: { card: EducationCard }) {
  const { entries } = card;

  const stops = entries.map((entry) => ({
    id: `${entry.institution}-${entry.degree}`,
    year: entry.dates,
    label: `${entry.degree}, ${entry.institution}, ${entry.dates}`,
  }));

  return (
    <VerticalTimeline
      stops={stops}
      navLabel="Timeline navigation"
      prevLabel="Previous education entry"
      nextLabel="Next education entry"
    >
      {(activeIndex) => {
        const entry = entries[activeIndex];
        return (
          <>
            <p className="vtimeline-entry-title-row">{entry.degree}</p>
            <p className="vtimeline-entry-institution">{entry.institution}</p>
            <InteractiveList
              items={entry.details}
              className="interactive-bullet-list--plain"
            />
            <div className="vtimeline-entry-modules">
              <div className="modal-row-title">
                {entry.modulesLabel ?? DEFAULT_MODULES_LABEL}
              </div>
              <div className="d-flex flex-wrap gap-2 vtimeline-entry-tags">
                {entry.modules.map((module) => (
                  <span className="tag" key={`${entry.degree}-${module}`}>
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </>
        );
      }}
    </VerticalTimeline>
  );
}
