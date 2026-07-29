import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faBook,
  faBriefcase,
  faBullhorn,
  faCircleUser,
  faHammer,
  faRocket,
  faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons';
import type { PortfolioCard } from '../content';

/** Corner glyph per card, keyed by card id. Hero deliberately has none. */
const cardPreviewIcons = {
  certifications: faAward,
  about: faCircleUser,
  social: faBullhorn,
  experience: faBriefcase,
  education: faBook,
  skills: faScrewdriverWrench,
  projects: faHammer,
  vision: faRocket,
} as const;

/**
 * Face of a grid tile. Rendered both in the grid and as the front face of the
 * flying flip card, so the two are guaranteed to match during the transition.
 */
export function CardInner({ card }: { card: PortfolioCard }) {
  const previewIcon = cardPreviewIcons[card.id as keyof typeof cardPreviewIcons];

  return (
    <>
      {previewIcon && (
        <span className="card-preview-icon" aria-hidden="true">
          <FontAwesomeIcon icon={previewIcon} />
        </span>
      )}
      {card.type !== 'hero' && <p className="card-label">{card.label}</p>}
      <h2 className="card-title">{card.title}</h2>
    </>
  );
}
