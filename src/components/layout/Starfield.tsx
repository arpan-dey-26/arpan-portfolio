import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVelocity } from '@/lib/scrollVelocity';

const LAYER_COUNT = 3;
const STARS_PER_LAYER = 45;
const STALE_MS = 120; // no scroll event in this long → treat as stopped, not just slow

// Idle speed is the floor, always active — stars never drop below this,
// scrolling or not. Previously the "idle" value (baseDrift = [3, 6, 10])
// had no defined relationship to the scrolling speed at all, which is
// exactly the bug: there was no "20-30% of max" to honor because nothing
// was expressed as a proportion of anything. Rewritten so IDLE_SPEED *is*
// the reference point everything else is defined against.
const IDLE_SPEED = [10, 18, 28]; // px/sec per layer — the sole per-layer depth factor now; perceptibly moving at rest on every layer, not just the nearest one

// Normal, comfortable scrolling should land right at 2x idle (the
// requested ratio) — VELOCITY_FOR_FULL_BOOST is the scroll velocity
// (Lenis's own units) at which that 2x point is reached. Scrolling
// harder than that still adds a bit more, up to MAX_SPEED_FACTOR, as a
// soft ceiling for an unusually hard fling — not unbounded the way the
// old `* 4` multiplier was.
const VELOCITY_FOR_FULL_BOOST = 15;
const MAX_SPEED_FACTOR = 2.5;
const STREAK_VELOCITY_THRESHOLD = 6; // above this, draw as a short streak instead of a dot

interface Star {
  x: number;
  y: number;
  layer: number; // 0 = farthest/slowest/smallest, LAYER_COUNT-1 = nearest/fastest/largest
  size: number;
  twinklePhase: number;
  twinkleSpeed: number;
  baseBrightness: number;
}

/**
 * Replaces the earlier CSS-keyframe ParticleField with a canvas +
 * requestAnimationFrame implementation — a scroll-velocity-reactive
 * effect needs a per-frame read of the current scroll speed, which CSS
 * keyframes have no mechanism for at all, and manipulating 100+ DOM
 * element styles every frame (vs. one canvas draw call) would be the
 * more expensive way to do this anyway. Reads scrollVelocity directly
 * (see lib/scrollVelocity.ts) rather than React state, so this animation
 * loop never triggers a React re-render.
 *
 * Smoothing: `smoothedVelocity` is lerped toward the target velocity a
 * little each frame rather than snapping to it — this is what makes
 * accel/decel feel continuous ("never jump abruptly") and gives a
 * natural inertia on scroll stop, rather than an instant cutoff.
 *
 * Depth: three layers with different idle speeds and star sizes (see
 * IDLE_SPEED above) — nearer (larger, faster) stars separate visually
 * from farther (smaller, slower) ones, the standard parallax-starfield
 * depth technique.
 *
 * Streak effect: past a velocity threshold, a star draws as a short line
 * along its direction of travel instead of a dot — this IS the
 * "hyperspace" effect the brief asks for, achieved as a draw-mode change
 * rather than a separate trail-rendering system, so it appears and
 * disappears exactly in step with the smoothed velocity value.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2); // capped — no benefit beyond 2x for small dots, real cost above it

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const isMobileViewport = width < 768;
    const starsPerLayer = isMobileViewport ? Math.round(STARS_PER_LAYER * 0.5) : STARS_PER_LAYER;

    const stars: Star[] = [];
    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      for (let i = 0; i < starsPerLayer; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          layer,
          size: 0.6 + layer * 0.5 + Math.random() * 0.4,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.4 + Math.random() * 0.8,
          baseBrightness: 0.3 + Math.random() * 0.4,
        });
      }
    }

    let smoothedVelocity = 0;
    let rafId: number;
    let lastTime = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp dt to avoid a huge jump after a tab was backgrounded
      lastTime = now;

      const isStale = now - scrollVelocity.lastUpdate > STALE_MS;
      const targetVelocity = isStale ? 0 : Math.abs(scrollVelocity.current);
      // Same lerp as before (already confirmed working) — only the
      // idle/boost values themselves changed, not the smoothing mechanism.
      smoothedVelocity += (targetVelocity - smoothedVelocity) * 0.08;

      // 0 at idle, 1.0 right at "normal fast scroll" (→ 2x idle speed),
      // up to 1.5 for an unusually hard fling (→ 2.5x idle, the soft
      // ceiling) — never unbounded the way the old `* 4` multiplier was.
      const boostFactor = Math.min(smoothedVelocity / VELOCITY_FOR_FULL_BOOST, MAX_SPEED_FACTOR - 1);
      const speedMultiplier = 1 + boostFactor;

      ctx!.clearRect(0, 0, width, height);

      for (const star of stars) {
        // IDLE_SPEED[layer] is the floor AND the only source of
        // per-layer depth differentiation — speedMultiplier applies
        // uniformly on top of it, so the 2x-at-full-scroll ratio holds
        // identically for every layer, and there's exactly one place
        // that controls how much faster the foreground moves than the
        // background (no second multiplier compounding on top of it).
        const speed = IDLE_SPEED[star.layer] * speedMultiplier;
        star.y += speed * dt;
        if (star.y > height + 4) {
          star.y = -4;
          star.x = Math.random() * width;
        }

        const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinklePhase) * 0.3;
        const brightness = Math.max(0, Math.min(1, star.baseBrightness + twinkle));

        ctx!.beginPath();
        if (smoothedVelocity > STREAK_VELOCITY_THRESHOLD) {
          const streakLength = Math.min(speed * 0.15, 40);
          ctx!.strokeStyle = `rgba(245, 247, 250, ${brightness})`;
          ctx!.lineWidth = star.size;
          ctx!.moveTo(star.x, star.y);
          ctx!.lineTo(star.x, star.y - streakLength);
          ctx!.stroke();
        } else {
          ctx!.fillStyle = `rgba(245, 247, 250, ${brightness})`;
          ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
