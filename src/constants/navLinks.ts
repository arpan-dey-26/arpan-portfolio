import type { NavLink } from '@/types';

// A curated SUBSET of the 12 IA sections (Architecture §3), not all of
// them — a 12-item nav would contradict the Design System's "minimal nav"
// principle. Selected using the section-priority ranking in Architecture
// §2.5: highest-signal sections get a direct link, lower-priority ones
// (Programming Proficiency, Certificates) stay reachable by scrolling.
// This is a reasonable default, not a locked decision — adjust freely.
export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#featured-projects' },
  { label: 'Building', href: '#currently-building' },
  { label: 'Skills', href: '#skills' },
  { label: 'Profiles', href: '#coding-profiles' },
  { label: 'Contact', href: '#contact' },
];
