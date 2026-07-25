import { forwardRef, type AriaAttributes, type MouseEventHandler, type ReactNode, type Ref } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useMagneticHover } from '@/hooks/useMagneticHover';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

interface CommonProps {
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

// Renders as <a> when `href` is provided, <button> otherwise — one
// component covers both cases (external links like "View GitHub" and real
// actions like the mobile-menu toggle) rather than needing two primitives.
//
// ROOT CAUSE FIX (real TS2322 build errors, two rounds of them): the
// previous version of this interface extended `ButtonHTMLAttributes<HTMLButtonElement>`
// wholesale. That ties EVERY handler prop (onCopy, onMouseLeave, onFocus,
// literally all of them) to a signature parameterized specifically for
// HTMLButtonElement — but this component ALSO renders as <a>, and
// spreading a button-shaped props object onto <motion.a> (which expects
// each handler parameterized for HTMLAnchorElement instead) is
// structurally incompatible for every single one of those props, not
// just the few that happened to surface as errors in any one build run.
// Omitting individual conflicting names (the previous fix) was treating
// the symptom — each fix just revealed the next mismatched handler.
//
// The actual fix: don't extend an element-specific attributes interface
// at all. `ButtonProps` now lists only the props real callers in this
// codebase actually use (verified by grepping every <Button>/<IconButton>
// usage in the project — only onClick, disabled, type, href, target,
// rel, download, and standard aria-* attributes are ever passed), with
// onClick typed generically against the base `HTMLElement` rather than
// any specific tag. A handler that only needs HTMLElement-level features
// is safely assignable wherever a more specific element's handler is
// expected (HTMLButtonElement and HTMLAnchorElement both extend
// HTMLElement) — this is what makes one handler type correctly satisfy
// both the <a> and <button> render paths, permanently, rather than
// needing a per-element special case.
export interface ButtonProps extends CommonProps, AriaAttributes {
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLElement>;
  id?: string;
  children?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Premium color system: gradient instead of flat accent — Section 12's
  // "premium button gradients." hover:brightness-110 rather than a
  // second gradient definition (simpler, same premium-hover feel).
  primary: 'bg-gradient-accent text-bg hover:brightness-110',
  secondary: 'border border-border text-text-primary hover:border-text-secondary hover:bg-surface',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface',
  icon: 'h-10 w-10 rounded-full p-0 text-text-secondary hover:bg-surface',
};

/**
 * Design System §5: exactly one primary Button should be visible per
 * viewport at a time — that's a usage discipline for callers, not
 * something this component can enforce structurally.
 *
 * Phase 2: added a subtle magnetic pull toward the cursor (desktop only,
 * via useMagneticHover) and a press animation (whileTap). Both are pure
 * interaction physics layered on top of the existing visual design —
 * variant styling, layout, and typography are unchanged.
 *
 * Final pass: press/hover now use spring physics (genuine overshoot on
 * release) instead of a linear duration-based scale — "elastic buttons."
 * Still just transform, still GPU-cheap.
 */
const ELASTIC_TAP = { type: 'spring', stiffness: 500, damping: 15 } as const;
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      href,
      disabled,
      type,
      ...rest
    },
    ref
  ) => {
    const { style: magneticStyle, handlers: magneticHandlers } = useMagneticHover();

    const classes = cn(
      'relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-3',
      'text-body-sm font-medium transition-colors duration-fast ease-standard',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      'disabled:cursor-not-allowed disabled:opacity-40',
      VARIANT_CLASSES[variant],
      className
    );

    const inner = (
      <>
        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Spinner size={16} tone={variant === 'primary' ? 'current' : 'accent'} />
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <motion.a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-disabled={disabled || loading || undefined}
          style={magneticStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={ELASTIC_TAP}
          {...magneticHandlers}
          {...rest}
        >
          {inner}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref as Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        className={classes}
        disabled={disabled || loading}
        style={magneticStyle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={ELASTIC_TAP}
        {...magneticHandlers}
        {...rest}
      >
        {inner}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
