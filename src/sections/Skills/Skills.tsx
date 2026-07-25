import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { skills } from '@/data/skills';
import { staggerContainer } from '@/animations/variants';
import { SkillCategoryCard } from './SkillCategoryCard';

/**
 * Architecture §5/§3 (6th section). Wrapping flexbox rather than a fixed
 * grid-cols-3 — with a category count that doesn't evenly divide by 3
 * (7, after the authenticity pass removed "Backend" entirely), a fixed
 * grid leaves an awkward gap in the last row; each card instead gets a
 * flexible basis and wraps naturally, so this lays out cleanly regardless
 * of how many categories exist.
 */
export function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionHeading id="skills-heading" eyebrow="Skills" title="Skills & Technologies" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.08)}
        className="mt-12 flex flex-wrap gap-6"
      >
        {/* min-w-[240px]: at the narrowest named breakpoint (320px),
            PageContainer's 24px-each-side padding leaves 272px of content
            width — 240px keeps a real safety margin rather than the 12px
            an earlier 260px value left, which was too close to the actual
            "no horizontal scrolling" requirement to be safe. */}
        {skills.map((category) => (
          <div key={category.label} className="min-w-[240px] flex-1 basis-[300px]">
            <SkillCategoryCard category={category} />
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
