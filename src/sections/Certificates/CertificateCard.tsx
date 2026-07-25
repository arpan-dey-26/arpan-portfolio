import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { PiArrowSquareOut, PiDownloadSimple, PiEye } from 'react-icons/pi';
import { Button, Modal, Pill } from '@/components/ui';
import { formatDate } from '@/utils/formatDate';
import { fadeInUp } from '@/animations/variants';
import type { Certificate } from '@/types';

interface CertificateCardProps {
  certificate: Certificate;
}

/**
 * Architecture §13. Preview opens the shared Modal primitive with the
 * certificate PDF embedded directly — no dedicated PDF.js dependency
 * needed for a single-page certificate scan. organizationLogo isn't shown
 * (no logo image files exist yet, per README) — title/org text carries
 * the identification instead.
 */
export function CertificateCard({ certificate }: CertificateCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const titleId = useId();

  // issueDate can be a bare year ("2025") or a full date ("2026-02-26") —
  // only attempt the human-readable format for a full date; a bare year
  // displays as-is.
  const displayDate = certificate.issueDate.length > 4 ? formatDate(certificate.issueDate) : certificate.issueDate;

  return (
    <>
      <motion.article
        variants={fadeInUp}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 transition-colors duration-fast ease-standard hover:border-accent hover:shadow-glow"
        aria-labelledby={`certificate-${certificate.id}-heading`}
      >
        <div className="flex flex-col gap-1">
          <h3 id={`certificate-${certificate.id}-heading`} className="text-h3 font-semibold text-text-primary">
            {certificate.title}
          </h3>
          <p className="text-body-sm text-text-secondary">{certificate.issuingOrganization}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {certificate.issueDate && <Pill>{displayDate}</Pill>}
          {certificate.tier && <Pill>{certificate.tier}</Pill>}
        </div>

        {certificate.credentialId && (
          <p className="text-body-sm text-text-tertiary">Credential ID: {certificate.credentialId}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {certificate.downloadUrl && (
            <Button
              variant="ghost"
              leftIcon={<PiEye size={16} />}
              onClick={() => setIsPreviewOpen(true)}
              aria-haspopup="dialog"
            >
              Preview
            </Button>
          )}
          {certificate.downloadUrl && (
            <Button href={certificate.downloadUrl} download variant="ghost" leftIcon={<PiDownloadSimple size={16} />}>
              Download
            </Button>
          )}
          {certificate.verificationUrl && (
            <Button
              href={certificate.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              rightIcon={<PiArrowSquareOut size={16} />}
            >
              Verify
            </Button>
          )}
        </div>
      </motion.article>

      {certificate.downloadUrl && (
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} titleId={titleId} className="max-w-3xl">
          <div className="flex flex-col gap-4">
            <h3 id={titleId} className="text-h3 font-semibold text-text-primary">
              {certificate.title}
            </h3>
            <embed
              src={certificate.downloadUrl}
              type="application/pdf"
              className="h-[70vh] w-full rounded-md border border-border-subtle"
              aria-label={`Preview of the ${certificate.title} certificate`}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
