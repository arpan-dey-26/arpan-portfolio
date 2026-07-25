import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Shared by Modal and MobileMenu (Architecture §13.2/§20) — both need
// identical keyboard-accessibility discipline: trap Tab/Shift+Tab inside
// the open surface, close on Escape, and restore focus to whatever was
// focused before it opened. Extracted once here rather than duplicated in
// both components.
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const first = getFocusable()[0] ?? container;
    first.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = getFocusable();
      if (elements.length === 0) return;
      const firstEl = elements[0];
      const lastEl = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isActive, containerRef, onEscape]);
}
