import { motion } from 'framer-motion';
import type { CertificationsCard } from '../../content';
import { collapseTransition, modalItemVariants } from '../../motion';

/** Takeaway copy stays collapsed until the row is hovered. */
const takeawayVariants = {
  initial: { height: 0, opacity: 0, marginTop: 0 },
  hovered: { height: 'auto', opacity: 1, marginTop: 8 },
};

export function CertificationsSection({ card }: { card: CertificationsCard }) {
  return (
    <>
      {card.certs.map((cert) => (
        <motion.section
          className="modal-section modal-section-plain"
          key={cert.name}
          variants={modalItemVariants}
        >
          <motion.a
            className="cert-row panel panel--interactive"
            href={cert.href}
            target="_blank"
            rel="noreferrer"
            initial="initial"
            whileHover="hovered"
            whileFocus="hovered"
          >
            <div className="cert-icon" aria-hidden="true">
              <img src={cert.icon} alt="" className="cert-icon-image" height={64} width={64} />
            </div>
            <div className="d-flex flex-column">
              <div className="cert-title-row">
                <span className="cert-name">{cert.name}</span>
                <span className="cert-separator"> • </span>
                <span className="cert-company">{cert.issuer}</span>
              </div>
              <div className="cert-date">{cert.date}</div>
              <motion.div
                variants={takeawayVariants}
                transition={collapseTransition}
                style={{ overflow: 'hidden' }}
              >
                <p className="cert-takeaway">{cert.takeaway}</p>
              </motion.div>
            </div>
          </motion.a>
        </motion.section>
      ))}
    </>
  );
}
