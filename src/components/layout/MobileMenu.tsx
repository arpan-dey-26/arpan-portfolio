import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import type { NavLink } from '@/types';

interface MobileMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

/**
 * Shares the exact focus-trap / return-focus discipline Modal uses, via the
 * same useFocusTrap hook (Architecture §20) — a slide-in panel rather than
 * a centered dialog, so it doesn't reuse the Modal component itself, but it
 * must behave identically from a keyboard-accessibility standpoint. The
 * hook restores focus to whatever was focused before the menu opened (the
 * toggle button, in practice) automatically — no explicit ref needs to be
 * passed in for that.
 */
export function MobileMenu({ id, isOpen, onClose, links }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-mobile-menu laptop:hidden">
      <div className="absolute inset-0 bg-scrim" onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col gap-6 border-l border-border bg-surface p-8"
      >
        <ul className="flex flex-col gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onClose}
                className="text-h3 font-medium text-text-primary transition-colors duration-fast ease-standard hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}
