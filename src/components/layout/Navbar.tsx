import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { PiList, PiX } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { navLinks } from '@/constants/navLinks';
import { socialLinks } from '@/constants/socialLinks';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui';
import { MobileMenu } from './MobileMenu';

const SCROLL_GLASS_THRESHOLD = 24;
const SCROLL_HIDE_THRESHOLD = 120;

// Computed once at module load, not per-render — navLinks is a static
// import, so this never actually changes. Passing a freshly-mapped array
// literal to useActiveSection on every render would give it a new array
// reference each time even though the actual ids never change, tearing
// down and recreating its IntersectionObserver for no reason on every
// Navbar re-render (e.g. every scroll-glass/hide-show state flip).
const NAV_SECTION_IDS = navLinks.map((link) => link.href.replace('#', ''));

/**
 * Inline links show at `laptop:` and above; below that, the mobile menu
 * toggle takes over (Architecture §6.2 leaves the exact fallback point to
 * implementation — `laptop` was chosen since horizontal space for text
 * links is tight even at `tablet` width).
 *
 * Phase 2: the always-on subtle bg/blur from the foundation build is now
 * conditional — transparent at the very top (blends into Hero), glass
 * only once scrolled ("Glass effect only while scrolling"), using the
 * same surface-glass token as the chatbot panel rather than an
 * opacity-modifier on a CSS-variable color. Also added: hide on scroll
 * down past a threshold, show on scroll up (never hidden near the top),
 * and a layoutId shared-element indicator that slides between active
 * links instead of only changing their text color.
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const activeId = useActiveSection(NAV_SECTION_IDS);
  const resumeLink = socialLinks.find((link) => link.platform === 'resume');

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (current) => {
    setIsScrolled(current > SCROLL_GLASS_THRESHOLD);

    if (prefersReducedMotion) return; // hide/show is a motion effect — skip it under reduced motion, nav stays put
    const previous = lastScrollY.current;
    const isScrollingDown = current > previous;
    setIsHidden(isScrollingDown && current > SCROLL_HIDE_THRESHOLD);
    lastScrollY.current = current;
  });

  return (
    <motion.header
      animate={{ y: isHidden ? '-100%' : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'sticky top-0 z-navbar w-full transition-colors duration-base ease-standard',
        isScrolled ? 'border-b border-border-subtle bg-surface-glass backdrop-blur-lg' : 'border-b border-transparent'
      )}
    >
      <nav className="mx-auto flex w-full max-w-container items-center justify-between px-6 py-4 tablet:px-12 desktop:px-20">
        <a href="#" className="text-h3 font-semibold text-text-primary">
          Arpan
        </a>

        <ul className="hidden laptop:flex laptop:items-center laptop:gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = activeId === id;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative text-body-sm transition-colors duration-fast ease-standard',
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden laptop:block">
          {resumeLink && (
            <Button href={resumeLink.href} variant="primary" download>
              Resume
            </Button>
          )}
        </div>

        <button
          type="button"
          className="text-text-primary laptop:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <PiX size={24} /> : <PiList size={24} />}
        </button>
      </nav>

      <MobileMenu
        id="mobile-menu"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </motion.header>
  );
}
