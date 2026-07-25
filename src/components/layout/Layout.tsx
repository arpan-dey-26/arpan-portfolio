import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SkipToContent } from './SkipToContent';
import { ScrollProgressBar } from './ScrollProgressBar';
import { CursorFollower } from './CursorFollower';
import { AmbientBackground } from './AmbientBackground';
import { LightRays } from './LightRays';
import { Starfield } from './Starfield';
import { AskArpanAI } from '@/sections/AskArpanAI';

interface LayoutProps {
  children: ReactNode;
}

/**
 * App → Layout → Navbar / main / Footer, per the approved Architecture
 * component tree (§5). Sections are composed as `children`, in the
 * approved Information Architecture order (Architecture §3) — see App.tsx.
 *
 * AskArpanAI is the one exception: it's a global floating widget (button
 * always visible + expandable panel), not a scrollable section, so it's
 * mounted here rather than in App.tsx's section list — reachable from
 * anywhere on the page, same as Navbar/Footer.
 *
 * Phase 2 additions, all global/decorative and none of them touching
 * layout/content: AmbientBackground (behind everything), ScrollProgressBar
 * (above the navbar), CursorFollower (desktop only, pointer-events-none).
 *
 * Starfield replaces the earlier CSS-based ParticleField (that file is
 * removed, not left as an unused alternative) — see Starfield.tsx for why
 * a scroll-velocity-reactive effect needed a canvas/RAF rewrite rather
 * than an extension of the CSS-keyframe version.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <>
      <AmbientBackground />
      <LightRays />
      <Starfield />
      <ScrollProgressBar />
      <SkipToContent />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <AskArpanAI />
      <CursorFollower />
    </>
  );
}
