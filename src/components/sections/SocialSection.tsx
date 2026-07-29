import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import type { SocialCard, SocialLink } from '../../content';
import { modalItemVariants } from '../../motion';

/** Links carry an SVG path; Email has none and falls back to a Font Awesome glyph. */
function SocialIcon({ link }: { link: SocialLink }) {
  if (link.icon) {
    return (
      <img
        src={link.icon}
        alt={`${link.platform} icon`}
        className="social-icon-image"
        height={64}
        width={64}
      />
    );
  }

  if (link.platform === 'Email') {
    return <FontAwesomeIcon icon={faEnvelope} size="2xl" style={{ transform: 'scale(1.5)' }} />;
  }

  return <span>{link.platform}</span>;
}

export function SocialSection({ card }: { card: SocialCard }) {
  return (
    <>
      {card.links.map((link) => (
        <motion.section key={link.platform} variants={modalItemVariants}>
          <a className="social-row" href={link.href} target="_blank" rel="noreferrer">
            <div className="social-icon" aria-hidden="true">
              <SocialIcon link={link} />
            </div>
            <div>
              <div className="modal-row-title">{link.platform}</div>
              <div className="modal-row-subtitle">{link.handle}</div>
            </div>
          </a>
        </motion.section>
      ))}
    </>
  );
}
