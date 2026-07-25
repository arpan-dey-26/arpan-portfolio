import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading, AnimatedCounter, ProgressBar } from '@/components/ui';
import { leetcodeStats } from '@/data/leetcodeStats';
import { fadeInUp, staggerContainer } from '@/animations/variants';

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-6 text-center"
    >
      {/*
        text-h2 tablet:text-h1: the platform rank stat is 7 digits
        ("4,135,530", ~9 characters with separators). At text-h1 (48px)
        inside a 2-column mobile grid, that number is wider than the
        column itself — worked out from PageContainer's 24px mobile
        padding and this card's own p-6, it doesn't actually fit. Smaller
        at the base, stepping up once the grid below also steps to more
        columns and there's room for it.
      */}
      <AnimatedCounter value={value} className="text-h2 font-semibold text-text-primary tablet:text-h1" />
      <span className="text-caption uppercase tracking-wide text-text-tertiary">{label}</span>
    </motion.div>
  );
}

/**
 * Architecture §11/§3 (9th section). Every number here is the verified
 * screenshot data in data/leetcodeStats.ts — see that file's header
 * comment for why it replaced the master data document's figures.
 * Difficulty bars show each count as a share of total SOLVED (11/25,
 * 12/25, 2/25) — real arithmetic from verified numbers, not a comparison
 * against the platform's full problem library, which would be a
 * different (also real, but less meaningful here) statistic.
 * currentStreak/contestRating aren't rendered — neither is available, and
 * per Architecture §20 an absent optional stat is omitted, never shown as
 * a fabricated zero.
 */
export function LeetCodeStatistics() {
  const { totalSolved, easySolved, mediumSolved, hardSolved, maxStreak, rank, activeDaysPastYear } = leetcodeStats;

  return (
    <SectionWrapper id="leetcode-statistics">
      <SectionHeading id="leetcode-statistics-heading" eyebrow="LeetCode" title="LeetCode Statistics" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
        className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4"
      >
        <StatCard label="Solved" value={totalSolved} />
        {maxStreak !== undefined && <StatCard label="Max Streak (days)" value={maxStreak} />}
        {activeDaysPastYear !== undefined && <StatCard label="Active Days (past year)" value={activeDaysPastYear} />}
        {rank !== undefined && <StatCard label="Platform Rank" value={rank} />}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="mt-8 flex flex-col gap-5 rounded-xl border border-border bg-surface p-6 desktop:p-8"
      >
        <h3 className="text-body-sm font-medium uppercase tracking-wide text-text-tertiary">
          Solved by difficulty
        </h3>
        {easySolved !== undefined && (
          <ProgressBar label={`Easy — ${easySolved}`} value={(easySolved / totalSolved) * 100} />
        )}
        {mediumSolved !== undefined && (
          <ProgressBar label={`Medium — ${mediumSolved}`} value={(mediumSolved / totalSolved) * 100} />
        )}
        {hardSolved !== undefined && (
          <ProgressBar label={`Hard — ${hardSolved}`} value={(hardSolved / totalSolved) * 100} />
        )}
      </motion.div>
    </SectionWrapper>
  );
}
