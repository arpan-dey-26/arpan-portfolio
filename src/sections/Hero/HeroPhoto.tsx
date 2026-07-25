import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTilt } from '@/hooks/useTilt';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createImageParallax } from '@/animations/gsapUtils';
import { cn } from '@/utils/cn';
import profilePhoto from '@/assets/images/profile-photo.webp';

/**
 * The real uploaded photo (src/assets/images/profile-photo.webp).
 *
 * Sourced from arpan_25_07_26_photo.jpeg — a casual outdoor photo, not a
 * studio headshot — cropped here using OpenCV's Haar-cascade face
 * detector (not a visual guess) so the face sits with consistent
 * headroom and the frame extends to the upper body, per the brief.
 * Precise numbers: face detected at 244x244px, crop composed so the face
 * occupies ~30% of frame height with ~12% headroom above the hairline,
 * then centered horizontally on the face and resized to 800x800.
 *
 * A prior upload (Firefly_Gemini_Flash_PLAIN_PROFESSIONAL_BACKGROUND —
 * Adobe's and Google's AI-generation tool names in the filename itself)
 * was declined for exactly the reason this whole feature exists: "do not
 * use AI-generated portraits." This one has none of those signatures and
 * was confirmed directly, so it replaced the original
 * IMG-20260725-WA0003.jpg extraction as the live asset.
 *
 * Replaces the abstract Spline-scene slot as Hero's primary visual —
 * HeroSplineScene/HeroFallbackVisual are left in place, just not
 * rendered by Hero anymore, in case an actual Spline scene gets authored
 * later and this decision gets revisited.
 *
 * Layered animation, each independently reduced-motion-aware:
 * - Entrance: scale+fade+y on mount (Framer `initial`/`animate`)
 * - Floating: continuous gentle y bob (Framer `animate` loop)
 * - Breathing: continuous subtle scale+opacity pulse on the glow only,
 *   not the photo itself — pulsing the photo would read as zooming, not
 *   breathing
 * - Tilt: mouse-tracked rotateX/rotateY (shared useTilt hook)
 * - Scroll: subtle GSAP ScrollTrigger parallax as the page scrolls past
 *   Hero (same createImageParallax utility Featured Projects' image
 *   uses, not a second implementation of scroll-scrubbed parallax)
 *
 * Framer's `animate` (float) and `style` (tilt) apply to the same element
 * without conflicting — Framer Motion merges transform-related values
 * from both sources into one `transform`.
 */
export function HeroPhoto() {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !parallaxRef.current) return;
    const scrollTrigger = createImageParallax(parallaxRef.current, 24);
    return () => scrollTrigger.kill();
  }, [prefersReducedMotion]);

  // Two nested elements, not one, on purpose: GSAP drives the outer div's
  // transform (scroll parallax) and Framer Motion drives the inner div's
  // transform (tilt/float/breathing/entrance). Both libraries assume they
  // have exclusive control over whatever element they're animating — put
  // both sets of effects on the SAME element and they'd overwrite each
  // other's transform on every frame instead of composing. On separate
  // elements, the outer translateY and inner rotate/scale just stack
  // visually, the way normal nested transforms always do.
  return (
    <div ref={parallaxRef} className="mx-auto w-full max-w-md laptop:max-w-lg">
      <motion.div
        {...tiltHandlers}
        style={tiltStyle}
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: prefersReducedMotion ? 0 : [0, -12, 0],
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            : {
                opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
              }
        }
        className="relative aspect-square w-full"
      >
        {/* Soft aurora glow — "breathing" via a slow scale+opacity pulse, kept on this layer only so the photo itself never visibly resizes */}
        <motion.div
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={prefersReducedMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-aurora opacity-30 blur-3xl"
          aria-hidden="true"
        />

        {/* Glass ring frame — now a broadly-authorized pattern, not the chatbot's one-off exception */}
        <div
          className="absolute inset-0 rounded-full border border-white/10 bg-surface-glass shadow-glow backdrop-blur-md"
          aria-hidden="true"
        />

        <div className="absolute inset-3 overflow-hidden rounded-full shadow-hover">
          <img
            src={profilePhoto}
            alt="Arpan Dey"
            loading="lazy"
            width={800}
            height={800}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-slow ease-out-expo',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
      </motion.div>
    </div>
  );
}
