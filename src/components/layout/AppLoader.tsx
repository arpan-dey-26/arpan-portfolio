import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MIN_DISPLAY_MS = 300; // avoids a jarring instant flash if fonts resolve immediately
const MAX_WAIT_MS = 1200; // hard cap — "no unnecessary delay" means this never blocks a slow connection

/**
 * Phase 3's loading experience. Tied to a REAL signal —
 * `document.fonts.ready` — not a fake setTimeout pretending to be
 * progress; the whole point of "no unnecessary delay" is that this
 * should resolve almost immediately in normal conditions (Geist is
 * already preloaded in index.html) and never hold up a slow connection
 * past MAX_WAIT_MS. Renders as an overlay ON TOP of the real app rather
 * than blocking its mount — App.tsx's actual content is already
 * rendering underneath, so this is a brief cosmetic layer, not something
 * that could hurt LCP/FCP the way a true render-blocking loader would.
 */
export function AppLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const start = performance.now();
    const fontsReady = 'fonts' in document ? document.fonts.ready : Promise.resolve();
    const maxWait = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    Promise.race([fontsReady, maxWait]).then(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => setIsVisible(false), remaining);
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-skip-link flex flex-col items-center justify-center gap-4 bg-bg"
          aria-hidden="true"
        >
          <svg viewBox="0 0 60 60" className="h-10 w-10" aria-hidden="true">
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3"
            />
            <motion.circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="150.8"
              initial={{ strokeDashoffset: 150.8 }}
              animate={{ strokeDashoffset: prefersReducedMotion ? 40 : [150.8, 20, 150.8] }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
              }
              transform="rotate(-90 30 30)"
            />
          </svg>
          <span className="text-caption uppercase tracking-wide text-text-tertiary">Arpan</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
