import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface HeroFloatingBadgeProps {
  icon: ReactNode;
  label: string;
  className?: string;
  delay?: number;
  hasLiveDot?: boolean;
}

/**
 * Small glass badges positioned around HeroPhoto — real, already-verified
 * facts (status, location), not decoration invented to fill space. Uses
 * the same glass-frame language as HeroPhoto/Ask Arpan AI rather than a
 * new visual pattern. Floats independently of the photo (its own gentle
 * y-loop, offset timing) so the composition doesn't feel like one rigid
 * object moving as a unit.
 *
 * Phase 5: added a hover response (lift + accent border) — these were
 * purely decorative before; a small interactive reward on hover fits
 * this build's broader "every interaction should feel satisfying" pass
 * without turning them into something that pretends to be clickable
 * (they aren't links, so no cursor/role change).
 */
export function HeroFloatingBadge({ icon, label, className, delay = 0, hasLiveDot }: HeroFloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{
        opacity: { duration: 0.5, delay: 0.8 + delay, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.5, delay: 0.8 + delay, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 + delay },
      }}
      className={cn(
        'absolute z-10 flex items-center gap-2 rounded-full border border-white/10 bg-surface-glass px-4 py-2 text-body-sm text-text-primary shadow-hover backdrop-blur-md transition-colors duration-fast ease-standard hover:border-accent',
        className
      )}
    >
      {hasLiveDot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />}
      <span className="shrink-0 text-accent">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </motion.div>
  );
}
