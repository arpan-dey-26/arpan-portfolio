import type { SocialLink } from '@/types';

// Sourced from MASTER_PORTFOLIO_DATA.md → SOCIAL LINKS / PERSONAL
// INFORMATION. LeetCode and HackerRank are deliberately NOT duplicated
// here even though the source lists them under both "Coding Profiles" and
// "Social Links" — they get their dedicated, richer treatment in
// data/codingProfiles.ts (Architecture §10) instead of a second, plainer
// icon link in the Footer. Resume stays a placeholder path — the source
// data explicitly says the resume file is still pending.
export const socialLinks: SocialLink[] = [
  { platform: 'github', label: 'GitHub', href: 'https://github.com/arpan-dey-26' },
  { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/arpan-dey26' },
  { platform: 'x', label: 'X', href: 'https://x.com/ArpanDeydev' },
  { platform: 'email', label: 'Email', href: 'mailto:ccmmnn2019@gmail.com' },
  { platform: 'resume', label: 'Resume', href: '/resume.pdf' }, // TODO: file pending per source data
];
