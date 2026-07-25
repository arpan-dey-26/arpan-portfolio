import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { PageContainer } from './PageContainer';
import { Divider } from '@/components/ui';
import { fadeIn } from '@/animations/variants';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Set false to omit the top divider — e.g. a section that should read as visually joined to the one above it. */
  divider?: boolean;
}

/**
 * Every section (Hero excepted — it manages its own full-viewport layout)
 * wraps its content in this component, per Architecture §5, so vertical
 * section-padding (Design System §4.3: 96px mobile → 160px desktop) and
 * horizontal container tokens are enforced structurally rather than by
 * convention. Composes PageContainer internally so a section only needs to
 * reach for one wrapper, not two.
 *
 * `aria-labelledby` is wired to `{id}-heading` by convention — give your
 * SectionHeading (or equivalent) that exact id.
 *
 * Phase 3: added a top divider, on by default. This is the existing
 * `Divider` UI primitive from the foundation build, which had never
 * actually been used anywhere — reused here rather than building a new
 * "section divider" concept. Positioned absolutely at the section's top
 * edge (not stacked into normal flow) specifically so it decorates the
 * existing py-24/py-40 padding rhythm rather than adding to it — an
 * earlier version of this added extra margin instead, which would have
 * doubled the gap between sections.
 */
export function SectionWrapper({
  id,
  children,
  className,
  containerClassName,
  divider = true,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn('relative py-24 desktop:py-40', className)}
    >
      {divider && (
        <PageContainer className="absolute inset-x-0 top-0">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Divider />
          </motion.div>
        </PageContainer>
      )}
      <PageContainer className={containerClassName}>{children}</PageContainer>
    </section>
  );
}
