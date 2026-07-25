import { useEffect, type RefObject } from 'react';

// Currently unused elsewhere in the codebase, but fixed to the same
// standard as useFocusTrap.ts regardless — RefObject<HTMLElement | null>,
// not RefObject<HTMLElement>, matching what useRef<HTMLDivElement>(null)
// actually produces in current React types. Left as plain RefObject<HTMLElement>
// this would fail the exact same way useFocusTrap did the moment anything
// calls it with a standard useRef(null) pattern.
export function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
