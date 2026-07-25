import { PiGithubLogo, PiLinkedinLogo, PiEnvelopeSimple, PiXLogo, PiArrowUp } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { socialLinks } from '@/constants/socialLinks';
import { siteConfig } from '@/config/site.config';
import { IconButton } from '@/components/ui';
import { PageContainer } from './PageContainer';

// GitHub/LinkedIn/X/Email use Phosphor (react-icons/pi) — Phosphor's set
// already includes accurate marks for these common platforms, so the
// Simple Icons exception described in Architecture §10.7 doesn't apply
// here. That exception is reserved for platforms Phosphor doesn't cover
// (LeetCode, HackerRank, CodeChef, GeeksforGeeks), which is exactly how
// Coding Profiles uses it.
const ICON_MAP = {
  github: PiGithubLogo,
  linkedin: PiLinkedinLogo,
  x: PiXLogo,
  email: PiEnvelopeSimple,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const iconLinks = socialLinks.filter(
    (link): link is typeof link & { platform: keyof typeof ICON_MAP } => link.platform in ICON_MAP
  );

  return (
    <footer className="border-t border-border-subtle py-10">
      <PageContainer className="flex flex-col items-center justify-between gap-6 tablet:flex-row">
        <p className="text-caption text-text-tertiary">
          © {year} {siteConfig.fullName}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {iconLinks.map((link) => {
            const Icon = ICON_MAP[link.platform];
            return (
              <motion.div key={link.platform} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <IconButton
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  icon={<Icon size={18} />}
                />
              </motion.div>
            );
          })}
          {/* Plain anchor to Hero, not a JS scrollTo — useLenis's own
              anchor-click delegation (Phase 3) now handles the smooth
              scroll for this, same as every other in-page link. */}
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
            <IconButton href="#hero" aria-label="Back to top" icon={<PiArrowUp size={18} />} />
          </motion.div>
        </div>
      </PageContainer>
    </footer>
  );
}
