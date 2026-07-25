import type { CurrentlyBuildingProject } from '@/types';
import prepitArchitecture from '@/assets/images/prepit-architecture.webp';

// Sourced from the uploaded Smart Bengal Hackathon (SBH-Sr) 2025 submission
// (PS No. SBHRCCIIT020, AI/ML and NLP, team TechBuddies) and its
// accompanying idea description/synopsis/abstract document.
//
// Built by a 4-person team (Arpan as team lead, per the submission's own
// team-details table) — mentioned in the overview rather than presented as
// solo work, since implying otherwise wouldn't be accurate. githubUrl is
// still TODO: the source material confirms a repo exists but doesn't state
// the URL anywhere actually read.
//
// Stack list: Next.js, Node.js, PostgreSQL, and Docker were removed on
// Arpan's explicit instruction — he doesn't know them well enough to
// speak to them confidently, regardless of whether the team project
// used them. NOTE left un-actioned on purpose: Prisma ORM and Turborepo
// are both normally Node.js-ecosystem tools, so keeping them without
// Node.js/Next.js listed could read oddly in an interview ("used Prisma
// with what runtime?") — flagged in chat rather than silently removed,
// since neither was in the explicit removal list.
export const currentlyBuilding: CurrentlyBuildingProject = {
  title: 'PrePit AI',
  overview:
    'AI-powered career guidance platform providing personalized learning paths, interview preparation, resume building, skill verification, gamification, and AI mentorship. Built as team lead of a 4-person team (TechBuddies) for Smart Bengal Hackathon 2025.',
  currentMilestone: 'About 80% of planned features built — testing and validation are next.',
  status: 'Ongoing',
  roadmap: [
    { label: 'Complete remaining planned features', isCurrent: false },
    { label: 'Testing and validation', isCurrent: true },
    { label: 'Public launch', isCurrent: false },
  ],
  stack: ['Prisma ORM', 'JWT', 'TensorFlow', 'OpenCV', 'Gemini', 'VAPI AI', 'Turborepo', 'AWS'],
  githubUrl: undefined, // TODO: repo confirmed to exist, URL not provided
  architecturePreview: {
    src: prepitArchitecture,
    alt: 'PrePit AI architecture and data-flow diagram, from the Smart Bengal Hackathon 2025 submission',
  },
};
