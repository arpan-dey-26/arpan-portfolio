import { cn } from '@/utils/cn';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * "Beautiful section separators" — a gradient fade at both edges rather
 * than a flat line that starts/stops abruptly. Switched from `border` to
 * a `background` gradient on a 1px-thick element, since CSS border-color
 * doesn't support gradients directly. Still a real `<hr>` (thematic-break
 * semantics preserved), just styled differently.
 */
export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-0',
        orientation === 'horizontal'
          ? 'h-px w-full bg-gradient-to-r from-transparent via-border-subtle to-transparent'
          : 'h-full w-px bg-gradient-to-b from-transparent via-border-subtle to-transparent',
        className
      )}
    />
  );
}
