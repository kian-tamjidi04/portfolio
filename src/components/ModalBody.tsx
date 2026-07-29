import type { PortfolioCard } from '../content';
import { AboutSection } from './sections/AboutSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { SocialSection } from './sections/SocialSection';
import { VisionSection } from './sections/VisionSection';

/**
 * Picks the layout for the back face of a flipped card. The switch is
 * exhaustive over `PortfolioCard`, so adding a card variant is a type error
 * until it is handled here.
 */
export function ModalBody({ card }: { card: PortfolioCard }) {
  switch (card.type) {
    case 'certifications':
      return <CertificationsSection card={card} />;
    case 'social':
      return <SocialSection card={card} />;
    case 'about':
      return <AboutSection card={card} />;
    case 'skills':
      return <SkillsSection card={card} />;
    case 'education':
      return <EducationSection card={card} />;
    case 'vision':
      return <VisionSection card={card} />;
    case 'experience':
      return <ExperienceSection card={card} />;
    case 'projects':
      return <ProjectsSection card={card} />;
    case 'hero':
      // Hero is non-clickable, so it never reaches a modal.
      return null;
  }
}
