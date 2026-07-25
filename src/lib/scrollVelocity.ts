/**
 * A plain mutable object, not React state, on purpose — Lenis fires scroll
 * events far more often than a component should re-render (every scroll
 * tick, easily 60+/sec), so this needs to be readable from a
 * requestAnimationFrame loop (the Starfield) without triggering React's
 * render cycle at all. useLenis writes both fields on every Lenis scroll
 * event; consumers read them directly inside their own animation loop
 * instead of subscribing as state.
 *
 * `lastUpdate` exists so a consumer can tell a *stale* value (scrolling
 * actually stopped) from a genuinely-zero one (scrolling continues, just
 * slowly) — see useLenis.ts's comment for why this doesn't depend on a
 * Lenis "scroll ended" event.
 */
export const scrollVelocity = { current: 0, lastUpdate: 0 };
