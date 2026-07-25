import { motion } from 'framer-motion';
import { PiArrowUpRight, PiGithubLogo } from 'react-icons/pi';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { Button } from '@/components/ui';
import { fadeInUp } from '@/animations/variants';
import type { CodingProfile, CodingPlatform } from '@/types';

// GitHub uses Phosphor (already covers it well); LeetCode/HackerRank use
// Simple Icons — the exact split Architecture §10.7 calls for. CodeChef/
// GeeksforGeeks aren't mapped yet since no profile is configured for
// either (Architecture §10.5) — add an entry here when one is.
const PLATFORM_ICON_MAP: Partial<Record<CodingPlatform, IconType>> = {
  github: PiGithubLogo,
  leetcode: SiLeetcode,
  hackerrank: SiHackerrank,
};

// Short, generic descriptions of what each platform IS — not claims about
// Arpan specifically, so these don't need sourcing from his documents.
const PLATFORM_DESCRIPTIONS: Partial<Record<CodingPlatform, string>> = {
  github: 'Code hosting & version control',
  leetcode: 'Competitive programming practice',
  hackerrank: 'Coding challenges & skill certification',
};

const PLATFORM_LABELS: Partial<Record<CodingPlatform, string>> = {
  github: 'GitHub',
  leetcode: 'LeetCode',
  hackerrank: 'HackerRank',
  codechef: 'CodeChef',
  geeksforgeeks: 'GeeksforGeeks',
};

interface CodingProfileCardProps {
  profile: CodingProfile;
}

export function CodingProfileCard({ profile }: CodingProfileCardProps) {
  const Icon = PLATFORM_ICON_MAP[profile.platform];

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 transition-colors duration-fast ease-standard hover:border-accent hover:shadow-glow"
      aria-labelledby={`coding-profile-${profile.platform}-heading`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={24} className="shrink-0 text-accent" aria-hidden="true" />}
        <div className="flex flex-col">
          <h3 id={`coding-profile-${profile.platform}-heading`} className="text-h3 font-semibold text-text-primary">
            {PLATFORM_LABELS[profile.platform]}
          </h3>
          <span className="text-body-sm text-text-tertiary">@{profile.username}</span>
        </div>
      </div>

      {PLATFORM_DESCRIPTIONS[profile.platform] && (
        <p className="text-body-sm text-text-secondary">{PLATFORM_DESCRIPTIONS[profile.platform]}</p>
      )}

      {profile.statSummary && <p className="text-body font-medium text-text-primary">{profile.statSummary}</p>}

      <Button
        href={profile.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        rightIcon={<PiArrowUpRight size={16} />}
        className="mt-auto self-start"
      >
        View Profile
      </Button>
    </motion.article>
  );
}
