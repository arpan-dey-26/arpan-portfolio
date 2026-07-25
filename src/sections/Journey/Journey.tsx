import { motion } from 'framer-motion';
import { PiGraduationCap, PiTrophy, PiCertificate, PiRocketLaunch, PiCode, PiSparkle } from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { journey } from '@/data/journey';
import { staggerContainer } from '@/animations/variants';
import type { JourneyMilestoneType } from '@/types';
import { JourneyMilestoneItem } from './JourneyMilestoneItem';

// One icon per milestone TYPE (fixed by Design System §11.3) — verify
// these exact export names against the installed react-icons version
// (this environment has no network access to confirm imports resolve).
const ICON_MAP: Record<JourneyMilestoneType, IconType> = {
  education: PiGraduationCap,
  achievement: PiTrophy,
  certification: PiCertificate,
  hackathon: PiRocketLaunch,
  project: PiCode,
  status: PiSparkle,
};

/**
 * Timeline connecting-line scroll-scrub now lives in
 * JourneyMilestoneItem.tsx (extracted so GSAP's ScrollTrigger has a
 * stable per-item ref to target, which a shared ref across this .map()
 * couldn't provide).
 */
/**
 * "Pinned elements where appropriate" — implemented as a sticky sidebar
 * (heading) + scrolling content (milestone list) at laptop+ widths, using
 * plain CSS `position: sticky` rather than a GSAP `pin: true` — see
 * Journey/README reasoning in the project README's "Status" section for
 * why. A two-column sticky-sidebar layout was chosen over making the
 * heading stick directly above a stacked list specifically to avoid any
 * visual overlap between the sticky heading and scrolling milestones —
 * they occupy separate horizontal space instead, so no z-index/opacity
 * handling is needed to keep them from colliding. Below `laptop:`, this
 * collapses to a normal stacked layout (heading above list, not sticky) —
 * a sticky sidebar doesn't read as naturally on a narrow viewport where
 * there's no separate column for it to occupy.
 *
 * Timeline connecting-line scroll-scrub lives in JourneyMilestoneItem.tsx
 * (extracted so GSAP's ScrollTrigger has a stable per-item ref to target,
 * which a shared ref across this .map() couldn't provide).
 */
export function Journey() {
  const sortedMilestones = [...journey].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper id="journey">
      <div className="grid gap-8 laptop:grid-cols-[280px_1fr] laptop:items-start laptop:gap-16">
        <div className="laptop:sticky laptop:top-28">
          <SectionHeading id="journey-heading" eyebrow="Journey" title="How I got here" />
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.08)}
          className="flex flex-col gap-8"
        >
          {sortedMilestones.map((milestone, index) => (
            <JourneyMilestoneItem
              key={milestone.id}
              milestone={milestone}
              Icon={ICON_MAP[milestone.type]}
              isLast={index === sortedMilestones.length - 1}
            />
          ))}
        </motion.ol>
      </div>
    </SectionWrapper>
  );
}
