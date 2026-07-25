import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

/**
 * Counts up from 0 to `value` once it scrolls into view. A small, new
 * addition to the UI primitives — not in the original 10 from the
 * foundation build, but justified the same way IconButton was: a genuine,
 * reusable need (LeetCode Statistics' animated counters; also reusable
 * anywhere else a stat is shown) rather than a one-off.
 *
 * Explicitly respects reduced motion by jumping straight to the final
 * value — MotionConfig's reducedMotion="user" (App.tsx) mainly targets
 * transform/layout animation; this animates text content via a spring, so
 * it's checked directly here too rather than assumed to be covered.
 */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }
    motionValue.set(value);
  }, [isInView, value, motionValue, prefersReducedMotion]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
}
