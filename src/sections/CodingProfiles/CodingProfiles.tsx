import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { codingProfiles } from '@/data/codingProfiles';
import { staggerContainer } from '@/animations/variants';
import { CodingProfileCard } from './CodingProfileCard';

/**
 * Architecture §10/§3 (8th section). Grid renders one card per
 * CONFIGURED platform (§10.5) — CodeChef/GeeksforGeeks aren't in
 * data/codingProfiles.ts, so they simply don't render; adding one later
 * is a data change, not a component change.
 */
export function CodingProfiles() {
  return (
    <SectionWrapper id="coding-profiles">
      <SectionHeading
        id="coding-profiles-heading"
        eyebrow="Profiles"
        title="Coding Profiles"
        description="Where the work is actually checkable."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer(0.1)}
        className="mt-12 grid grid-cols-1 gap-6 tablet:grid-cols-3"
      >
        {codingProfiles.map((profile) => (
          <CodingProfileCard key={profile.platform} profile={profile} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
