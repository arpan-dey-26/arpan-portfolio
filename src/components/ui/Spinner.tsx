import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: number;
  tone?: 'accent' | 'tertiary' | 'current';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<SpinnerProps['tone']>, string> = {
  accent: 'text-accent',
  tertiary: 'text-text-tertiary',
  current: 'text-current',
};

/**
 * Single rotating arc. Two distinct uses per the Design System:
 * - Button loading state → tone="accent" (or "current" inside a primary
 *   button, so it matches that button's own text color) — §5.5.
 * - Chatbot "thinking" indicator → tone="tertiary" specifically, so a
 *   passive waiting state doesn't read as an actionable/interactive
 *   element — §10.6.
 */
export function Spinner({ size = 20, tone = 'accent', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', TONE_CLASSES[tone], className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
