import { useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { WestBengalOutline } from './WestBengalOutline';

/**
 * Sits behind/around the location badge — see WestBengalOutline.tsx for
 * why this is a stylized approximation, not a precise trace. Everything
 * here is intentionally quiet: 8% base opacity (within the requested
 * 5–12% range), no solid fill beyond the silhouette itself, blurred glow
 * rather than a crisp outline.
 *
 * The pin sits roughly where Kolkata falls within the silhouette (south-
 * central) and a thin gradient line reaches from it toward the badge's
 * actual position, visually tying the two together rather than leaving
 * them as two unrelated floating elements.
 */
export function HeroLocationVisualization() {
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({ x: relX * 6, y: relY * 6 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-64 w-40 tablet:-right-20 tablet:h-80 tablet:w-48"
      aria-hidden="true"
    >
      {/* Soft cyan/blue glow behind the outline */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
        transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: 'rgba(103, 232, 249, 0.15)' }}
      />

      <motion.div
        animate={{
          x: offset.x,
          y: prefersReducedMotion ? 0 : [offset.y, offset.y - 10, offset.y],
        }}
        transition={{
          x: { duration: 0.4, ease: 'easeOut' },
          y: prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative h-full w-full"
      >
        <WestBengalOutline className="h-full w-full text-accent-cyan opacity-[0.08]" />

        {/* Pin roughly at Kolkata's position within the silhouette */}
        <div className="absolute left-[42%] top-[62%] h-2 w-2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full rounded-full bg-accent-cyan" style={{ opacity: 0.7 }} />
          {!prefersReducedMotion && (
            <>
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'rgba(103, 232, 249, 0.5)' }}
              />
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1.25 }}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'rgba(103, 232, 249, 0.5)' }}
              />
            </>
          )}
        </div>

        {/* Thin connecting line reaching toward the badge */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <motion.line
            x1="42%"
            y1="62%"
            x2="130%"
            y2="85%"
            stroke="rgba(103, 232, 249, 0.35)"
            strokeWidth="1"
            strokeDasharray="3 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
