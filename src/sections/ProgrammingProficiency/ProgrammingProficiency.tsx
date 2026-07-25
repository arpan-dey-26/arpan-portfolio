import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { programmingProficiency } from '@/data/programmingProficiency';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import { SKILL_ICON_MAP } from '@/sections/Skills/skillIcons';

// Reuses Skills' icon map (java/c/cpp/python/javascript are already in it)
// rather than building a second one for the same five languages.
const LANGUAGE_ICON_KEYS: Record<string, string> = {
  Java: 'java',
  C: 'c',
  'C++': 'cpp',
  Python: 'python',
  JavaScript: 'javascript',
};

/**
 * Architecture §5/§3 (7th section) — but NOT the tier-visualization model
 * §12 originally describes. That model needs a self-assessed stage, years
 * of practice, and current focus per language; none of that has ever been
 * provided, and inferring it would be fabricating experience. This shows
 * every verified language with whatever concrete, checkable evidence
 * exists (a certification, a named project) and nothing invented where it
 * doesn't — see the header comment in data/programmingProficiency.ts.
 *
 * No ProgressBar here on purpose: a bar implies a quantified 0–100 value,
 * and there isn't a legitimate one to plot.
 */
export function ProgrammingProficiency() {
  return (
    <SectionWrapper id="programming-proficiency">
      <SectionHeading
        id="programming-proficiency-heading"
        eyebrow="Proficiency"
        title="Programming Proficiency"
        description="Languages I work with, shown with real, checkable evidence rather than self-rated percentages."
      />

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
        className="mt-12 flex flex-col gap-4"
      >
        {programmingProficiency.map((entry) => {
          const iconKey = LANGUAGE_ICON_KEYS[entry.language];
          const Icon = iconKey ? SKILL_ICON_MAP[iconKey] : undefined;

          return (
            <motion.li
              key={entry.language}
              variants={fadeInUp}
              className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface p-5 tablet:flex-row tablet:items-center tablet:justify-between"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className="shrink-0 text-text-secondary" aria-hidden="true" />}
                <span className="text-h3 font-medium text-text-primary">{entry.language}</span>
              </div>
              {entry.evidence && <span className="text-body-sm text-text-secondary">{entry.evidence}</span>}
            </motion.li>
          );
        })}
      </motion.ul>
    </SectionWrapper>
  );
}
