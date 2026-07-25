export function throttle<T extends (...args: never[]) => void>(fn: T, waitMs: number): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= waitMs) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}
