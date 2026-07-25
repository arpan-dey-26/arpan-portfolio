import type { JourneyMilestone } from '@/types';

// Milestone TYPES, LABELS, and ORDER are fixed by the approved Design
// System (§11.3). Headline/detail below are sourced directly from
// MASTER_PORTFOLIO_DATA.md — nothing here is invented or embellished.
export const journey: JourneyMilestone[] = [
  {
    id: 'education',
    type: 'education',
    label: 'Education',
    headline: 'B.Tech in Computer Science and Engineering',
    detail: 'Narula Institute of Technology (MAKAUT) · 2023–2027 · CGPA 8.60/10 (through 6th semester)',
    order: 1,
  },
  {
    id: 'jee-advanced',
    type: 'achievement',
    label: 'Competitive Achievement',
    headline: 'JEE Advanced 2023 — CRL Rank 5133',
    detail: '97th percentile in JEE Main 2023.',
    order: 2,
  },
  {
    id: 'nptel-elite-gold',
    type: 'certification',
    label: 'Certification',
    headline: 'NPTEL — Programming in Java (Elite + Gold)',
    detail: '2025',
    order: 3,
  },
  {
    id: 'hackathons',
    type: 'hackathon',
    label: 'Hackathon',
    headline: 'Hack-O-NiT 2025 — Grand Finale',
    detail: 'Reached the grand finale of the 24-hour overnight Hack-O-NiT (March 20–21, 2025). Also built PrePit AI at Smart Bengal Hackathon 2025.',
    order: 4,
  },
  {
    id: 'current-flagship-project',
    type: 'project',
    label: 'Current Project',
    headline: 'PrePit AI',
    detail:
      'AI-powered career guidance platform — personalized learning paths, interview preparation, resume building, skill verification, gamification, and AI mentorship.',
    order: 5,
    linkTo: '#currently-building',
  },
  {
    id: 'open-to-opportunities',
    type: 'status',
    label: 'Status',
    headline: 'Open to opportunities',
    detail: '',
    order: 6,
  },
];
