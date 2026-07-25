// Small, stable, non-environment-specific site settings — distinct from
// constants/ (which holds UI-facing lists like nav links) and from
// env.ts/seo.config.ts (which wrap environment variables). See Architecture
// §1.3 for why configuration is kept separate from UI-facing constants.

export const siteConfig = {
  /** Casual/brand-mark name — Navbar logo, "Ask Arpan AI", etc. */
  name: 'Arpan',
  /** Formal name — Person schema, footer copyright, resume-style contexts. */
  fullName: 'Arpan Dey',
  locale: 'en-US',
  themeColor: '#0A0A0B', // mirrors --color-bg / index.html's theme-color meta tag
  location: {
    city: 'Kolkata',
    region: 'West Bengal',
    country: 'India',
  },
  // Previously excluded pending an explicit decision (a public phone number
  // carries spam/privacy tradeoffs no earlier doc weighed in on). This
  // section's brief explicitly requests it for Contact, which is that
  // decision — included now on that basis.
  phone: '+91 7029467565',
} as const;
