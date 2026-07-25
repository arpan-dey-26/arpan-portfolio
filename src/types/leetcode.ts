export interface LeetCodeStats {
  totalSolved: number;
  /**
   * Easy/Medium/Hard breakdown (Architecture §11.2) — optional here because
   * it is a genuinely different dimension of data than a by-language
   * breakdown, and must never be backfilled from one to fake the other.
   * Omitted from the DOM entirely when absent, same rule as streak/rating
   * below — Architecture §20.
   */
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  /**
   * NOT part of the approved Architecture §11.2 content model — added
   * because real source data reported solved-count-by-language rather
   * than by-difficulty, and that's real information worth keeping rather
   * than discarding. Render this only if/when a by-language view is
   * actually wanted; it is not a substitute for easy/medium/hardSolved.
   */
  languageBreakdown?: { language: string; solved: number }[];
  currentStreak?: number;
  /** Highest streak ever achieved — distinct from currentStreak above; never conflate the two. */
  maxStreak?: number;
  contestRating?: number;
  /** Platform-wide rank (lower is better) — optional context, not a difficulty metric. */
  rank?: number;
  /** Submissions logged in the past year, per the profile's own activity heatmap. */
  activeDaysPastYear?: number;
  profileUrl: string;
}
