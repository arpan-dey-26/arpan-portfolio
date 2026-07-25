import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeInUp } from '@/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import type { JourneyMilestone } from '@/types';

interface JourneyMilestoneItemProps {
  milestone: JourneyMilestone;
  Icon: IconType;
  isLast: boolean;
}

/**
 * "Motion that feels continuous instead of disconnected." The connecting
 * line (built in an earlier pass) used Framer's whileInView — a fixed
 * duration once the element crosses the viewport edge, the same as every
 * other reveal in this codebase. This is the one exception: the line's
 * fill is now scroll-scrubbed via GSAP (tied directly to scroll position
 * while THIS milestone is in the viewport, not a fixed-duration
 * animation), so it visibly draws as you scroll rather than snapping in.
 * That's a deliberate, narrow use of GSAP's scrub — everything else in
 * Journey (the card entrance itself) stays on Framer's whileInView,
 * consistent with the rest of the site.
 *
 * Extracted into its own component (rather than inline in Journey.tsx)
 * specifically so each milestone gets its own stable ref for
 * ScrollTrigger to target — a shared ref across a .map() wouldn't give
 * GSAP a distinct element per milestone to scrub independently.
 */
export function JourneyMilestoneItem({ milestone, Icon, isLast }: JourneyMilestoneItemProps) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || isLast || !lineRef.current) return;
    const tween = gsap.fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, ease: 'none' });
    const trigger = ScrollTrigger.create({
      trigger: lineRef.current,
      start: 'top 85%',
      end: 'top 45%',
      scrub: 0.3,
      animation: tween,
    });
    return () => trigger.kill();
  }, [prefersReducedMotion, isLast]);

  const body = (
    <>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent">
        <Icon size={18} aria-hidden="true" />
        {!isLast && (
          <span
            ref={lineRef}
            style={{ transformOrigin: 'top' }}
            className={cn(
              'absolute left-1/2 top-full h-8 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-border to-transparent',
              // Reduced motion: GSAP's scrub effect is skipped entirely
              // (see the effect below), so the line must default to fully
              // visible here instead — otherwise it would stay at scale-y-0
              // forever with nothing left to animate it in.
              prefersReducedMotion ? 'scale-y-100' : 'scale-y-0'
            )}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-caption uppercase tracking-wide text-text-tertiary">{milestone.label}</span>
          {milestone.type === 'status' && <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />}
        </div>
        <p className="text-h3 font-medium text-text-primary">{milestone.headline}</p>
        {milestone.detail && <p className="text-body text-text-secondary">{milestone.detail}</p>}
      </div>
    </>
  );

  return (
    <motion.li variants={fadeInUp} className="flex items-start gap-4">
      {milestone.linkTo ? (
        <a href={milestone.linkTo} className="flex items-start gap-4 transition-opacity duration-fast ease-standard hover:opacity-80">
          {body}
        </a>
      ) : (
        body
      )}
    </motion.li>
  );
}
