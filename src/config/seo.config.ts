// Typed, programmatic access to the same defaults index.html interpolates
// via Vite's %VITE_*% syntax at build time. Use this from React code (e.g.
// a future per-route meta solution, Architecture §19.1) rather than
// duplicating these values — index.html and this file both read from the
// same env vars, so there's one source of truth either way.

import { env } from './env';

export const seoConfig = {
  title: env.siteTitle,
  description: env.siteDescription,
  url: env.siteUrl,
  ogImage: env.ogImage,
  twitterHandle: '', // TODO: add if/when a Twitter/X handle is confirmed
} as const;
