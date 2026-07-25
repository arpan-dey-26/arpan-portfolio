// Upgraded shape — Architecture §13.1.
export interface Certificate {
  id: string;
  title: string;
  issuingOrganization: string;
  /** Full ISO date where known ("2025-03-01"); a bare year ("2025") is acceptable when that's all that's confirmed — never invent a day/month. */
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  downloadUrl?: string;
  /** e.g. "Elite + Gold" — an issuer-assigned grade/tier. Kept distinct from `category` below, which is a subject grouping ("Cloud", "Academic") for future filtering, not a grade. */
  tier?: string;
  /**
   * Optional, not required. Real certificate data commonly arrives before
   * logo image files exist — a required field pointing at a missing asset
   * is worse than an explicit "not yet available."
   */
  organizationLogo?: {
    src: string;
    alt: string;
  };
  previewImage?: {
    src: string;
    alt: string;
  };
  /** Powers CertificateFilterBar once more than one category exists — Architecture §13.5. */
  category?: string;
}
