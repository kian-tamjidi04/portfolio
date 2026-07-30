import { motion } from 'framer-motion';
import type { ExperienceCard, ExperienceRole } from '../../content';
import { groupExperienceRoles, type ExperienceGroup } from '../../lib/groupExperienceRoles';
import { modalItemVariants } from '../../motion';
import { InteractiveList } from '../InteractiveList';
import { TagList } from '../TagList';

/** A rotation programme: one company header with each rotation nested beneath. */
function GroupedRoles({ group }: { group: ExperienceGroup }) {
  return (
    <>
      <div className="timeline-title-row">
        <span className="timeline-role">{group.groupSubtitle}</span>
        <span className="timeline-separator"> • </span>
        <span className="timeline-company">{group.company}</span>
        {group.groupTitle && (
          <span className="timeline-group-title-badge">{group.groupTitle}</span>
        )}
      </div>
      {group.groupDates && <p className="timeline-dates">{group.groupDates}</p>}

      <div className="sub-timeline">
        {group.roles.map((role) => (
          <div className="sub-timeline-item" key={role.role}>
            <span
              className={`sub-timeline-dot ${role.isRecent ? 'is-recent' : ''}`}
              aria-hidden="true"
            />
            <div className="sub-timeline-role-row">
              <span className="sub-timeline-role">{role.role}</span>
              {role.division && (
                <>
                  <span className="sub-timeline-separator"> • </span>
                  <span className="sub-timeline-division">{role.division}</span>
                </>
              )}
              {role.badge && <span className="sub-timeline-badge">{role.badge}</span>}
            </div>
            <p className="sub-timeline-dates">{role.dates}</p>
            <InteractiveList items={role.impact} />
            <TagList items={role.skills} className="d-flex flex-wrap gap-2 mt-2" />
          </div>
        ))}
      </div>
    </>
  );
}

/** A single stint at a company. */
function SingleRole({ role }: { role: ExperienceRole }) {
  return (
    <>
      <div className="timeline-title-row">
        <span className="timeline-role">{role.role}</span>
        <span className="timeline-separator"> • </span>
        <span className="timeline-company">{role.company}</span>
      </div>
      <p className="timeline-dates">{role.dates}</p>
      <InteractiveList items={role.impact} />
      <TagList items={role.skills} />
    </>
  );
}

export function ExperienceSection({ card }: { card: ExperienceCard }) {
  const groups = groupExperienceRoles(card.roles);

  return (
    <div className="timeline">
      {groups.map((group) => (
        <motion.article
          className="timeline-item"
          key={`group-${group.company}-${group.roles.map((r) => r.role).join('-')}`}
          variants={modalItemVariants}
        >
          <span
            className={`timeline-dot ${group.isRecent ? 'is-recent' : ''}`}
            aria-hidden="true"
          />
          <div className="timeline-content panel panel--roomy">
            {group.logo && (
              <div className="experience-logo-container">
                <img
                  src={group.logo}
                  alt={`${group.company} logo`}
                  className="experience-logo"
                />
              </div>
            )}

            {group.roles.length > 1 ? (
              <GroupedRoles group={group} />
            ) : (
              <SingleRole role={group.roles[0]} />
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
