import type { Config } from 'tailwindcss';

/**
 * Tailwind theme — implements the approved Design System's tokens exactly
 * (Design System §2–§8, Architecture §1/§6). A few decisions worth knowing
 * before editing this file:
 *
 * 1. `colors` and `borderRadius` REPLACE Tailwind's defaults rather than
 *    extending them. The Design System mandates exactly one accent color
 *    and a specific radius scale — leaving Tailwind's full default palette
 *    and radius scale available *alongside* ours would make it possible to
 *    accidentally reach for an off-system value (e.g. `bg-blue-500` or
 *    `rounded-2xl`). Removing the option is more reliable than a naming
 *    convention alone (Architecture "Developer Guidelines").
 *
 * 2. `spacing` is NOT overridden. Tailwind's default spacing scale (a 4px
 *    base unit) already matches the Design System's spacing scale exactly:
 *      space-1=4px→p-1  space-4=16px→p-4  space-8=32px→p-8  space-20=80px→p-20
 *      space-2=8px→p-2  space-5=20px→p-5  space-10=40px→p-10 space-24=96px→p-24
 *      space-3=12px→p-3 space-6=24px→p-6  space-12=48px→p-12 space-40=160px→p-40
 *      space-16=64px→p-16
 *    This was verified value-by-value against Design System §4.1. Treat
 *    Tailwind's numeric spacing utilities as the design tokens directly —
 *    there is no separate `space-*` scale to remember.
 *
 * 3. `screens` REPLACES Tailwind's defaults with the three named breakpoints
 *    from Architecture §6.1 (tablet/laptop/desktop) so responsive prefixes
 *    in the codebase read the same way the docs do. There is no `sm:` /
 *    `md:` / `lg:` / `xl:` in this project — use `tablet:` / `laptop:` /
 *    `desktop:`. The Design System only specifies two explicit container-
 *    padding steps (48px at tablet, 80px at desktop) — the laptop range
 *    intentionally inherits the tablet value; see PageContainer.tsx.
 *
 * 4. `zIndex` fills a genuine gap: the Design System names "Z-index" as a
 *    token category (§1) without ever specifying values. The scale below is
 *    the minimal functional set needed to implement Navbar / MobileMenu /
 *    Modal / skip-link stacking correctly — flagged here as a foundation-
 *    level decision, not a restatement of an approved value.
 *
 * 5. Focus rings use Tailwind's native `ring-*` utilities (see Button.tsx)
 *    rather than a custom `shadow-focus` token — `ring-2 ring-accent
 *    ring-offset-2 ring-offset-bg` implements the Design System's "2px
 *    accent ring, 2px offset" spec (§4.5) more idiomatically than a bespoke
 *    boxShadow value would.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      'surface-raised': 'var(--color-surface-raised)',
      border: 'var(--color-border)',
      'border-subtle': 'var(--color-border-subtle)',
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
      'text-tertiary': 'var(--color-text-tertiary)',
      accent: 'var(--color-accent)',
      'accent-muted': 'var(--color-accent-muted)',
      'accent-hover': 'var(--color-accent-hover)',
      'accent-cyan': 'var(--color-accent-cyan)',
      'accent-blue': 'var(--color-accent-blue)',
      'accent-purple': 'var(--color-accent-purple)',
      success: 'var(--color-success)',
      danger: 'var(--color-danger)',
      'surface-glass': 'var(--color-surface-glass)',
      scrim: 'var(--color-scrim)',
    },
    borderRadius: {
      none: '0px',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      full: 'var(--radius-full)',
    },
    fontFamily: {
      sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    // Design System §3.4 type scale. Weight is intentionally NOT baked into
    // these tuples (Tailwind's fontSize array only supports lineHeight /
    // letterSpacing) — pair with a font-medium / font-semibold utility per
    // that table's "Weight" column when using these classes.
    fontSize: {
      display: ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }], // 72px
      h1: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 48px
      h2: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }], // 32px
      h3: ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }], // 22px
      'body-lg': ['1.125rem', { lineHeight: '1.6' }], // 18px
      body: ['1rem', { lineHeight: '1.6' }], // 16px
      'body-sm': ['0.875rem', { lineHeight: '1.5' }], // 14px
      caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }], // 13px
      mono: ['0.8125rem', { lineHeight: '1.4' }], // 13px
    },
    extend: {
      maxWidth: {
        container: '1200px', // Design System §4.2
      },
      boxShadow: {
        hover: '0 8px 24px rgba(0, 0, 0, 0.35)', // Design System §4.5
        // Phase 2 addition: a subtle accent-tinted glow for card hover
        // states. A raw CSS custom-property reference inside a shadow
        // value (not a Tailwind opacity modifier on a color utility), so
        // it doesn't hit the same risk flagged for accent/30 earlier —
        // this is just CSS, not Tailwind's color-alpha system.
        glow: '0 0 0 1px var(--color-accent), 0 12px 32px -8px rgba(94, 234, 212, 0.35)',
        // Premium color system addition: a softer, purple-leaning glow —
        // used sparingly (Currently Building's status accent) so purple
        // reads as a deliberate highlight, not a second default color.
        'glow-purple': '0 0 0 1px var(--color-accent-purple), 0 12px 32px -8px rgba(196, 181, 253, 0.3)',
      },
      backgroundImage: {
        // Premium button gradients — teal → cyan, the two closest/most
        // harmonious accents, kept subtle rather than spanning the full
        // teal→purple range (that range is reserved for the aurora
        // background, where more hue movement reads as atmosphere rather
        // than a button looking muddy).
        'gradient-accent': 'linear-gradient(135deg, var(--color-accent), var(--color-accent-cyan))',
        'gradient-aurora': 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-blue), var(--color-accent) )',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '160ms',
        base: '250ms',
        moderate: '400ms',
        slow: '600ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      zIndex: {
        navbar: '40',
        'mobile-menu': '50',
        modal: '60',
        'skip-link': '70',
      },
    },
  },
  plugins: [],
};

export default config;
