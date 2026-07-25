import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * Shared by LeetCode's difficulty breakdown and Programming Proficiency's
 * optional learning-progress indicator (Architecture §11.3/§12.2) — one
 * primitive instead of two bespoke bar implementations.
 *
 * Always renders in the single accent color. Per Design System §2.1 ("one
 * accent color only"), this intentionally does NOT support semantic/
 * difficulty-based color variants (e.g. green/yellow/red for Easy/Medium/
 * Hard) — differentiate by label and value, not by color.
 */
export function ProgressBar({ value, label, showValue = false, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-body-sm text-text-secondary">
          {label && <span>{label}</span>}
          {showValue && <span className="text-text-tertiary">{clamped}%</span>}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-moderate ease-out-expo"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
