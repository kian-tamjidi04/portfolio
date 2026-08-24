import type { ExperienceCard } from '../../content';
import { InteractiveList } from '../InteractiveList';
import { TagList } from '../TagList';
import { VerticalTimeline } from '../VerticalTimeline';

const SKILLS_LABEL = 'Skills';

/**
 * One role at a time on the shared vertical timeline (Figma 118:9), mirroring
 * the Education modal. Roles are listed flat rather than grouped by company:
 * each rotation is its own stop, with the company and division carried in the
 * subtitle, so the track reads as a single chronology.
 */
export function ExperienceSection({ card }: { card: ExperienceCard }) {
  const { roles } = card;

  const stops = roles.map((role) => ({
    id: `${role.company}-${role.role}`,
    year: role.dates,
    label: `${role.role}, ${role.company}, ${role.dates}`,
  }));

  return (
    <VerticalTimeline
      stops={stops}
      navLabel="Timeline navigation"
      prevLabel="Previous role"
      nextLabel="Next role"
    >
      {(activeIndex) => {
        const role = roles[activeIndex];
        // Division is the team within the company, so it reads as a
        // continuation of the company name rather than a separate tier.
        const subtitle = role.division
          ? `${role.company} · ${role.division}`
          : role.company;

        return (
          <>
            <p className="vtimeline-entry-title-row">{role.role}</p>
            <p className="vtimeline-entry-institution">{subtitle}</p>
            <InteractiveList
              items={role.impact}
              className="interactive-bullet-list--plain"
            />
            <div className="vtimeline-entry-modules">
              <div className="modal-row-title">{SKILLS_LABEL}</div>
              <TagList
                items={role.skills}
                className="d-flex flex-wrap gap-2 vtimeline-entry-tags"
              />
            </div>
          </>
        );
      }}
    </VerticalTimeline>
  );
}
