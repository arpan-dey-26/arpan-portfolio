import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { certificates } from '@/data/certificates';
import { staggerContainer } from '@/animations/variants';
import { CertificateCard } from './CertificateCard';

/**
 * Architecture §13/§3 (10th section). All 5 certificates render — every
 * one now has a verified date and a downloadable file (see README). No
 * CertificateFilterBar yet: Architecture §13.5 says it mounts only once
 * more than one distinct `category` exists in the data, and none of the
 * 5 currently have one set.
 */
export function Certificates() {
  return (
    <SectionWrapper id="certificates">
      <SectionHeading id="certificates-heading" eyebrow="Certificates" title="Certificates" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.08)}
        className="mt-12 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3"
      >
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
