import type { ExperienceRole } from '../content';

export interface ExperienceGroup {
  company: string;
  logo?: string;
  groupTitle?: string;
  groupSubtitle?: string;
  groupDates?: string;
  isRecent: boolean;
  roles: ExperienceRole[];
}

/**
 * Collapses *consecutive* roles at the same company into one group, so a
 * rotation programme (e.g. UBS GOTO) renders as a single timeline entry with a
 * nested sub-timeline. Order is preserved; non-adjacent stints at the same
 * company stay separate on purpose.
 */
export function groupExperienceRoles(roles: ExperienceRole[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];

  roles.forEach((role) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.company === role.company) {
      lastGroup.roles.push(role);
      if (role.isRecent) lastGroup.isRecent = true;
      return;
    }

    groups.push({
      company: role.company,
      logo: role.logo,
      groupTitle: role.groupTitle,
      groupSubtitle: role.groupSubtitle,
      groupDates: role.groupDates,
      isRecent: role.isRecent,
      roles: [role],
    });
  });

  return groups;
}
