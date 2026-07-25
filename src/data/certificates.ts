import type { Certificate } from '@/types';

// Sourced from MASTER_PORTFOLIO_DATA.md → CERTIFICATIONS, enriched with
// exact dates/credential IDs read directly off each uploaded certificate
// file (more reliable than the master doc's year-only figures) and
// matching downloadable PDFs in public/certificates/. All 5 certificates
// now have a verified date, credential ID, and download link.
export const certificates: Certificate[] = [
  {
    id: 'nptel-programming-in-java',
    title: 'Programming in Java',
    issuingOrganization: 'NPTEL',
    issueDate: '2025', // course ran Jul–Oct 2025; no exact issue date is printed on the certificate itself
    tier: 'Elite + Gold',
    credentialId: 'NPTEL25CS110S460803019',
    downloadUrl: '/certificates/nptel-programming-in-java.pdf',
    // Scored 90% overall (24.88/25 assignments, 65/75 proctored exam) — not
    // modeled as a data field yet, noted here so it isn't lost.
  },
  {
    id: 'nptel-cloud-computing',
    title: 'Cloud Computing',
    issuingOrganization: 'NPTEL',
    issueDate: '2026', // course ran Jan–Apr 2026; no exact issue date is printed on the certificate itself
    tier: 'Elite',
    credentialId: 'NPTEL26CS55S1058703097',
    downloadUrl: '/certificates/nptel-cloud-computing.pdf',
    // Scored 72% overall (25/25 assignments, 47.08/75 proctored exam).
  },
  {
    id: 'android-application-development',
    title: 'Android Application Development',
    issuingOrganization: 'Ardent Computech Pvt. Ltd.',
    issueDate: '2025-02-12', // explicit "Issue Date" on the certificate; training ran Feb 4–12, 2025
    credentialId: 'ARDENT/132955',
    verificationUrl: 'https://certificate.ardentsoftware.co.in',
    downloadUrl: '/certificates/ardent-android-application-development.pdf',
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    issuingOrganization: 'Ardent Computech Pvt. Ltd.',
    issueDate: '2026-02-26', // explicit "Date of Issue" on the certificate; training ran Feb 16–26, 2026
    credentialId: 'ARDENT/192258',
    verificationUrl: 'https://certificate.ardentsoftware.co.in',
    downloadUrl: '/certificates/ardent-generative-ai.pdf',
  },
  {
    id: 'spoken-english-certification',
    title: 'Spoken English Certification',
    issuingOrganization: 'Wonder Coaching',
    issueDate: '2023-12-12', // explicit issue date on the certificate; course ran Jun–Nov 2023
    credentialId: 'WBBAR194 No. 03752',
    downloadUrl: '/certificates/nycet-spoken-english.pdf',
    // Certifying body printed on the certificate is "National Youth Computer
    // Education & Training (NYCET)"; issuingOrganization kept as "Wonder
    // Coaching" per MASTER_PORTFOLIO_DATA.md's own wording rather than
    // silently overridden. Grade: AA.
  },
];
