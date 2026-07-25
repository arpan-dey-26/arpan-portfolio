import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { wordRevealContainer, wordReveal } from '@/animations/variants';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /**
   * Never 'h1' — the page has exactly one <h1>, the Hero's name
   * (Architecture §20 "one <h1>"). The `text-h1` *visual* scale from the
   * Design System is a typographic size, not a semantic heading level;
   * this component keeps those two concepts separate on purpose.
   */
  as?: 'h2' | 'h3';
  align?: 'left' | 'center';
  id?: string;
  className?: string;
}

// Underline gets its own trigger with a fixed delay long enough for a
// typical 2-4 word heading's stagger to have mostly finished, rather than
// being nested into the same wordRevealContainer as the words — nesting
// it would depend on Framer Motion's variant context propagating through
// the intermediate heading element, which isn't something I can verify
// works as expected without a live render to check it against.
const underlineReveal = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Phase 2: the title reveals word-by-word on scroll into view
 * (staggerChildren via wordRevealContainer/wordReveal, animations/variants.ts)
 * — changed once here rather than per-section, so every section using
 * SectionHeading (About, Journey, Featured Projects, Skills, Programming
 * Proficiency, Coding Profiles, LeetCode Statistics, Certificates,
 * Contact, Currently Building) picks it up consistently for free.
 *
 * Phase 5: added a subtle accent glow (matching Hero's name treatment,
 * so the two "biggest text on the page" moments feel like one system)
 * and a small underline that draws in shortly after — its own
 * independent trigger with a fixed delay, not nested into the word
 * stagger, for the reason in the comment above.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  const MotionHeading = Heading === 'h3' ? motion.h3 : motion.h2;
  const words = title.split(' ');

  return (
    <div className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && <span className="text-caption uppercase tracking-wide text-text-tertiary">{eyebrow}</span>}
      <div className="flex flex-col gap-3">
        <MotionHeading
          id={id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={wordRevealContainer}
          className="text-h1 font-semibold text-text-primary [text-shadow:0_0_30px_rgba(94,234,212,0.18)]"
        >
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <motion.span variants={wordReveal} className="inline-block">
                {word}
              </motion.span>
              {index < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </MotionHeading>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={underlineReveal}
          style={{ transformOrigin: align === 'center' ? 'center' : 'left' }}
          className="h-[3px] w-12 rounded-full bg-gradient-accent"
          aria-hidden="true"
        />
      </div>
      {description && <p className="max-w-2xl text-body text-text-secondary">{description}</p>}
    </div>
  );
}
