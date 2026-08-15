import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faBook,
  faBriefcase,
  faCircleUser,
  faHammer,
  faLocationDot,
  faRocket,
  faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons';
import type { PortfolioCard } from '../content';

/** Corner glyph per card, keyed by card id. Hero deliberately has none. */
const cardPreviewIcons = {
  certifications: faAward,
  about: faCircleUser,
  location: faLocationDot,
  experience: faBriefcase,
  education: faBook,
  skills: faScrewdriverWrench,
  projects: faHammer,
  vision: faRocket,
} as const;

const HERO_SOCIAL_SLUGS: Record<string, string> = {
  GitHub: 'github',
  LinkedIn: 'linkedin',
  Email: 'email',
};

/**
 * Face of a grid tile. Rendered both in the grid and as the front face of the
 * flying flip card, so the two are guaranteed to match during the transition.
 */
export function CardInner({
  card,
  titleTag: TitleTag = 'h2',
}: {
  card: PortfolioCard;
  /** The hero tile is the page's only <h1>; every other card stays <h2>. */
  titleTag?: 'h1' | 'h2';
}) {
  const previewIcon = cardPreviewIcons[card.id as keyof typeof cardPreviewIcons];

  return (
    <>
      {previewIcon && (
        <span className="card-preview-icon" aria-hidden="true">
          <FontAwesomeIcon icon={previewIcon} />
        </span>
      )}
      {card.type === 'hero' && (
        <div className="hero-socials">
          {card.socials.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`hero-social-pill hero-social-pill-${HERO_SOCIAL_SLUGS[link.platform] ?? 'default'}`}
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
      <TitleTag className="card-title">
        {card.nonClickable ? card.title : card.label}
      </TitleTag>
    </>
  );
}
