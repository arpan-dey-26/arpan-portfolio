import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ShapeConfig {
  className: string;
  size: number;
  duration: number;
  delay: number;
  variant: 'ring' | 'dot' | 'square';
}

const SHAPES: ShapeConfig[] = [
  { className: 'left-[8%] top-[18%]', size: 56, duration: 9, delay: 0, variant: 'ring' },
  { className: 'right-[6%] top-[12%]', size: 14, duration: 7, delay: 0.5, variant: 'dot' },
  { className: 'left-[4%] bottom-[22%]', size: 30, duration: 11, delay: 1, variant: 'square' },
];

/**
 * "Floating 3D objects" — small ambient shapes, hidden on mobile
 * (`hidden laptop:block`, both for visual clutter and because there's
 * less room for pure decoration on a small screen) and skipped under
 * reduced motion. Each combines a Framer `animate` position float with a
 * continuous rotateX/rotateY/rotateZ + perspective, which is what gives
 * these a "tumbling in 3D space" quality rather than a flat 2D spin —
 * the same rotateX/rotateY mechanism useTilt uses for mouse-tracked tilt,
 * just animating on a timer instead of tracking the cursor.
 * Colors use inline rgba styles, not Tailwind classes with an opacity
 * modifier (e.g. `border-accent-cyan/40`) — that syntax isn't reliable
 * against this project's CSS-variable-based color tokens (the same issue
 * already found and fixed for Modal/MobileMenu's scrim and the chatbot's
 * glass panel). Caught here before shipping, not after.
 */
export function HeroFloatingShapes() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden laptop:block" aria-hidden="true">
      {SHAPES.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.className}`}
          style={{ width: shape.size, height: shape.size, transformPerspective: 600 }}
          animate={{
            y: [0, -18, 0],
            rotateX: [0, 25, 0],
            rotateY: [0, 40, 0],
            rotateZ: [0, 12, 0],
          }}
          transition={{ duration: shape.duration, repeat: Infinity, ease: 'easeInOut', delay: shape.delay }}
        >
          {shape.variant === 'ring' && (
            <div
              className="h-full w-full rounded-full border-2"
              style={{ borderColor: 'rgba(103, 232, 249, 0.4)' }}
            />
          )}
          {shape.variant === 'dot' && (
            <div className="h-full w-full rounded-full" style={{ backgroundColor: 'rgba(196, 181, 253, 0.5)' }} />
          )}
          {shape.variant === 'square' && (
            <div
              className="h-full w-full rounded-lg border-2"
              style={{ borderColor: 'rgba(94, 234, 212, 0.4)' }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
