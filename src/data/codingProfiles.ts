import type { CodingProfile } from '@/types';

// Sourced from MASTER_PORTFOLIO_DATA.md → CODING PROFILES. CodeChef and
// GeeksforGeeks are correctly absent — no data was given for either, and
// they're marked "(future)" in Architecture §10.2 anyway; adding them
// later is purely a data addition (§10.5). HackerRank has no confirmed
// stat summary in the source data, so statSummary is left unset rather
// than invented.
export const codingProfiles: CodingProfile[] = [
  {
    platform: 'github',
    username: 'arpan-dey-26',
    statSummary: '10+ repositories',
    profileUrl: 'https://github.com/arpan-dey-26',
  },
  {
    platform: 'leetcode',
    username: 'arpan_dey12',
    statSummary: '25+ problems solved', // corrected to match the verified figure in data/leetcodeStats.ts — see that file's header comment
    profileUrl: 'https://leetcode.com/u/arpan_dey12/',
  },
  {
    platform: 'hackerrank',
    username: 'arpandey91222',
    profileUrl: 'https://www.hackerrank.com/profile/arpandey91222',
  },
];
