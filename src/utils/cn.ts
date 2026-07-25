import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard clsx + tailwind-merge combo: clsx handles conditional class
// logic, tailwind-merge resolves conflicting Tailwind utilities (e.g.
// `px-4` vs a later `px-6`) so the last one wins instead of both applying.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
