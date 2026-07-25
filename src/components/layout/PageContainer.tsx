import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enforces the Design System's container max-width + horizontal padding
 * tokens (§4.2) everywhere it's used, so no section redefines these itself.
 *
 * Padding steps: 24px (mobile) → 48px (tablet) → 80px (desktop). The
 * Design System only specifies these two explicit breakpoints for padding —
 * the laptop range (1024–1279px) intentionally inherits the tablet value
 * rather than inventing a fourth number; see tailwind.config.ts's header
 * comment for the full reasoning.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('mx-auto w-full max-w-container px-6 tablet:px-12 desktop:px-20', className)}>{children}</div>;
}
