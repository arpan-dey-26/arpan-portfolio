import type { LeetCodeStats } from '@/types';

// ---------------------------------------------------------------------------
// IMPORTANT: this REPLACES an earlier version of this file.
//
// MASTER_PORTFOLIO_DATA.md stated "183+ problems solved" with a by-language
// breakdown (Java 170 / Python 31 / MySQL 9 — which itself summed to 210,
// not 183). A direct screenshot of the live LeetCode profile
// (arpan_dey12, taken 2026-07-25) shows a DIFFERENT, internally-consistent
// picture: 25 total solved (11 Easy + 12 Medium + 2 Hard = 25 ✓). The
// screenshot is the more current and verifiable source, so its numbers are
// used here instead — the master data's 183+/language figures appear to be
// stale or from a different context. Worth confirming directly.
//
// currentStreak and contestRating are not visible anywhere on the profile
// and are left unset — "Max streak: 4" is a DIFFERENT stat (highest ever,
// not current) and is captured separately as maxStreak so the two are
// never conflated.
// ---------------------------------------------------------------------------
export const leetcodeStats: LeetCodeStats = {
  totalSolved: 25,
  easySolved: 11,
  mediumSolved: 12,
  hardSolved: 2,
  maxStreak: 4,
  rank: 4135530,
  activeDaysPastYear: 5,
  profileUrl: 'https://leetcode.com/u/arpan_dey12/',
};
