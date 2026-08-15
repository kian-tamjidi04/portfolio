import { motion } from 'framer-motion';
import type { CertificationsCard } from '../../content';
import { modalItemVariants } from '../../motion';

export function CertificationsSection({ card }: { card: CertificationsCard }) {
  return (
    <div className="certs-grid">
      {card.certs.map((cert) => (
        <motion.a
          className="cert-card"
          key={cert.name}
          href={cert.href}
          target="_blank"
          rel="noreferrer"
          variants={modalItemVariants}
        >
          <div className="cert-card-header">
            <span className="cert-icon" aria-hidden="true">
              <img src={cert.icon} alt="" className="cert-icon-image" height={64} width={64} />
            </span>
            <div className="cert-info">
              <p className="cert-title">{cert.name}</p>
              <p className="cert-issuer">{cert.issuer}</p>
              <p className="cert-date">{cert.date}</p>
            </div>
          </div>
          <p className="cert-takeaway">{cert.takeaway}</p>
        </motion.a>
      ))}
    </div>
  );
}
