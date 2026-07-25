import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** id of the element used as aria-labelledby — pass your title's id. */
  titleId: string;
  children: ReactNode;
  className?: string;
}

/**
 * The first true modal in the system (Architecture §13.2, built for the
 * future Certificates preview) — focus trapped while open via the shared
 * useFocusTrap hook, closes on Escape or overlay click, returns focus to
 * whatever triggered it on close.
 *
 * The overlay is a SOLID, non-blurred scrim on purpose. The Design System
 * spends its one sanctioned blur/glass moment on the chatbot panel
 * (Design System §10.2) — a second blurred surface here would quietly
 * break that restraint rule.
 */
export function Modal({ isOpen, onClose, titleId, children, className }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-scrim p-4"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-8 shadow-hover',
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
