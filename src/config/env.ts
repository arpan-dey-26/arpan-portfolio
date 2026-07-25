// Typed, validated access to PUBLIC environment variables only.
// Server-only secrets (the Anthropic API key) must NEVER appear here — they
// belong exclusively inside /api functions, read via `process.env` in that
// serverless context. See Architecture §21.4 and .env.example.

function readEnv(key: keyof ImportMetaEnv, fallback = ''): string {
  const value = import.meta.env[key];
  if (!value && import.meta.env.DEV) {
    console.warn(`[env] Missing ${key} — using fallback ("${fallback}").`);
  }
  return value || fallback;
}

export const env = {
  siteUrl: readEnv('VITE_SITE_URL'),
  siteTitle: readEnv('VITE_SITE_TITLE'),
  siteDescription: readEnv('VITE_SITE_DESCRIPTION'),
  ogImage: readEnv('VITE_OG_IMAGE'),
} as const;
