import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PillOwnProps {
  children: ReactNode;
  variant?: 'default' | 'interactive';
  active?: boolean;
  className?: string;
}

type PillProps =
  | (PillOwnProps & { as?: 'span' } & HTMLAttributes<HTMLSpanElement>)
  | (PillOwnProps & { as: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>);

/**
 * One shared primitive backing tech tags (FeaturedProjects/CurrentlyBuilding),
 * prompt chips (AskArpanAI), and learning-stage badges (ProgrammingProficiency)
 * — Architecture §5 calls this out explicitly as intentional reuse rather
 * than three near-identical components.
 */
export function Pill({ children, variant = 'default', active = false, className, as = 'span', ...rest }: PillProps) {
  const classes = cn(
    'inline-flex items-center rounded-full border px-3 py-1 font-mono text-mono transition-colors duration-fast ease-standard',
    variant === 'default' && 'border-border-subtle bg-surface text-text-secondary hover:border-border',
    variant === 'interactive' &&
      'border-border bg-surface-raised text-text-secondary transition-colors duration-fast ease-standard hover:border-accent hover:bg-accent-muted hover:text-text-primary',
    active && 'border-accent bg-accent-muted text-text-primary',
    className
  );

  if (as === 'button') {
    return (
      <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }

  return (
    <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
      {children}
    </span>
  );
}
