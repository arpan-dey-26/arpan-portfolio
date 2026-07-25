import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';

interface IconButtonProps extends Omit<ButtonProps, 'variant' | 'children' | 'leftIcon' | 'rightIcon'> {
  icon: ReactNode;
  /** Required — an icon-only control has no accessible name without it. */
  'aria-label': string;
}

// Thin, deliberate wrapper around Button's "icon" variant (composition
// over duplication — Architecture "SOLID principles") rather than a
// separate implementation. The one thing it adds: `aria-label` is required
// at the type level, not just a convention.
export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  ({ icon, ...rest }, ref) => (
    <Button ref={ref} variant="icon" {...rest}>
      {icon}
    </Button>
  )
);

IconButton.displayName = 'IconButton';
