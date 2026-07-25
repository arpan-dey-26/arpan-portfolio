// Minimal analytics wrapper — currently a no-op in production. Wire up to
// Vercel Analytics (already in the recommended stack) or another provider
// when ready. Keeping this as its own service means no other file needs to
// change when that happens (Architecture §22).

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics]', name, properties);
  }
}
