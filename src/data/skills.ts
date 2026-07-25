import type { SkillCategory } from '@/types';

// Sourced directly from MASTER_PORTFOLIO_DATA.md → TECHNICAL SKILLS.
//
// UPDATE (authenticity pass): React, Next.js, Tailwind CSS, Node.js,
// Express.js, MongoDB, PostgreSQL, and Docker were removed on Arpan's
// explicit instruction — he flagged that he doesn't actually know these
// well enough to speak to them confidently in an interview, and asked
// for the whole portfolio to reflect only what he can genuinely explain.
// Nothing was added to compensate; a shorter, honest list was preferred
// over padding it back out.
//
// This forced two structural changes, not just item removal:
// - "Backend" (previously Node.js + Express.js) is gone entirely —
//   removing both left it with zero items, and an empty category card
//   would just look broken.
// - "Frontend" is renamed "Web Fundamentals" — with React/Next.js/
//   Tailwind gone, what's left (HTML, CSS) is markup/styling basics, not
//   framework-level frontend work, and the old label would overstate
//   that.
// 6 categories now, not 8. See Skills.tsx for the layout consequence
// (switched from a fixed 3-column grid to a wrapping flex layout, so
// whatever number of categories exist lays out cleanly rather than
// leaving an awkward gap if the count doesn't divide evenly).
//
// `icon` keys are looked up against sections/Skills/skillIcons.ts. Only
// concrete tools/languages/frameworks get one; the two conceptual
// categories (AI & Modern Technologies, Core Computer Science) are fields
// of study, not branded products, so they intentionally have none —
// forcing an icon onto "Operating Systems" would be arbitrary, not
// informative.
export const skills: SkillCategory[] = [
  {
    label: 'Programming Languages',
    items: [
      { name: 'Java', icon: 'java' },
      { name: 'C', icon: 'c' },
      { name: 'C++', icon: 'cpp' },
      { name: 'Python', icon: 'python' },
      { name: 'JavaScript', icon: 'javascript' },
    ],
  },
  {
    label: 'Web Fundamentals',
    items: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
    ],
  },
  {
    label: 'Databases',
    items: [{ name: 'MySQL', icon: 'mysql' }],
  },
  {
    label: 'Developer Tools',
    items: [
      { name: 'VS Code', icon: 'vscode' },
      { name: 'IntelliJ IDEA', icon: 'intellij' },
      { name: 'Postman', icon: 'postman' },
      { name: 'Figma', icon: 'figma' },
    ],
  },
  {
    label: 'Cloud & DevOps',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
    ],
  },
  {
    label: 'AI & Modern Technologies',
    items: [{ name: 'Generative AI' }, { name: 'Prompt Engineering' }, { name: 'REST APIs' }],
  },
  {
    label: 'Core Computer Science',
    items: [
      { name: 'Data Structures' },
      { name: 'Algorithms' },
      { name: 'OOP' },
      { name: 'DBMS' },
      { name: 'Operating Systems' },
      { name: 'Computer Networks' },
    ],
  },
];
