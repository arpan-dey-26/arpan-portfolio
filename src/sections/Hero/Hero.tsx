import { motion } from 'framer-motion';
import { PiMapPin, PiSparkle } from 'react-icons/pi';
import { Button } from '@/components/ui';
import { PageContainer } from '@/components/layout';
import { heroCopy } from '@/content/heroCopy';
import { socialLinks } from '@/constants/socialLinks';
import { siteConfig } from '@/config/site.config';
import { MOTION_DURATIONS, MOTION_EASING } from '@/animations/motionTokens';
import { HeroPhoto } from './HeroPhoto';
import { HeroFloatingBadge } from './HeroFloatingBadge';
import { HeroFloatingShapes } from './HeroFloatingShapes';
import { HeroLocationVisualization } from './HeroLocationVisualization';
import { HeroScrollCue } from './HeroScrollCue';

// Text content is TIMED (fixed offsets) — independent of whether the
// visual has finished loading, per Architecture §14.2 ("the Hero's core
// message must never depend on the visual element to land") and §14.4's
// distinction between timed text steps and the event-driven visual step.
const textVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delayS: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATIONS.moderate, ease: MOTION_EASING.outExpo, delay: delayS },
  }),
};

/**
 * Architecture §14 (Hero Experience) / Recruiter Psychology §2.1 (the
 * entire "first 5 seconds" burden). Does not use SectionWrapper — Hero
 * manages its own full-viewport layout rather than the standard section
 * padding rhythm (the one documented exception in SectionWrapper.tsx) —
 * but still uses PageContainer for the same horizontal max-width/padding
 * every other section gets.
 *
 * Final premium redesign: restructured from a two-column "text beside a
 * modest photo" layout into a full-viewport composition built around the
 * photo — HeroPhoto is significantly larger, the grid weights toward it
 * (0.9fr/1.1fr, was 1.1fr/0.9fr), and two floating badges (real, verified
 * facts — availability status matching Journey's, and location — not
 * invented filler) occupy the space around it rather than leaving it
 * empty. A scroll cue anchors the bottom. `min-h-screen` rather than
 * content-driven height, on the reasoning that a hero which doesn't use
 * the full first viewport reads as smaller/quieter than one that does.
 *
 * The role/tagline split (subtitle vs. accent-colored tagline line) is a
 * new VISUAL treatment of heroCopy's existing single pipe-separated
 * string, not new copy — nothing here was invented.
 *
 * Word-by-word name reveal (Phase 3) and mouse-tilt (Phase 2, now on
 * HeroPhoto) both carry over unchanged.
 */
export function Hero() {
  const resumeLink = socialLinks.find((link) => link.platform === 'resume');
  const nameWords = heroCopy.name.split(' ');
  const [roleLine, ...taglineParts] = heroCopy.role.split(' | ');
  const tagline = taglineParts[taglineParts.length - 1];
  const roleSubtitle = taglineParts.slice(0, -1).length
    ? [roleLine, ...taglineParts.slice(0, -1)].join(' | ')
    : roleLine;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-32 tablet:pt-40"
    >
      <HeroFloatingShapes />
      <PageContainer>
        <div className="grid items-center gap-16 laptop:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <motion.span
              initial="hidden"
              animate="visible"
              custom={0}
              variants={textVariants}
              className="flex items-center gap-2 text-caption font-medium uppercase tracking-wide text-accent"
            >
              <PiSparkle size={14} aria-hidden="true" />
              Available for opportunities
            </motion.span>

            <motion.h1
              id="hero-heading"
              whileHover={{ letterSpacing: '0.005em' }}
              transition={{ duration: 0.3 }}
              // Fluid clamp() rather than a fixed Tailwind size step: the
              // brief asks for the name to be THE visual centerpiece,
              // bigger than this project's largest existing type token
              // (text-display, 72px) allows, and to scale smoothly with
              // viewport width rather than jumping between fixed
              // breakpoints. Floor (44px) keeps it readable on the
              // narrowest phones; ceiling (96px) is deliberately larger
              // than text-display.
              style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
              className="font-semibold leading-[1.05] tracking-tight text-text-primary [text-shadow:0_0_40px_rgba(94,234,212,0.25)]"
            >
              {nameWords.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial="hidden"
                  animate="visible"
                  custom={0.1 + index * 0.04}
                  variants={textVariants}
                  className="mr-[0.25em] inline-block last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.2}
              variants={textVariants}
              className="max-w-xl text-body-lg text-text-secondary"
            >
              {roleSubtitle}
            </motion.p>

            {tagline && (
              <motion.p
                initial="hidden"
                animate="visible"
                custom={0.25}
                variants={textVariants}
                className="max-w-xl text-body-lg font-medium text-accent"
              >
                {tagline}
              </motion.p>
            )}

            {/* Exactly one primary CTA per viewport — Design System §5.1 */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.35}
              variants={textVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {resumeLink && (
                <Button href={resumeLink.href} variant="primary" download>
                  Download Résumé
                </Button>
              )}
              <Button href="#featured-projects" variant="secondary">
                View Work
              </Button>
            </motion.div>
          </div>

          <div className="relative justify-self-center laptop:justify-self-end">
            <HeroLocationVisualization />
            <HeroPhoto />
            <HeroFloatingBadge
              icon={<PiSparkle size={14} aria-hidden="true" />}
              label="Open to opportunities"
              hasLiveDot
              className="left-0 top-4 tablet:-left-4"
            />
            <HeroFloatingBadge
              icon={<PiMapPin size={14} aria-hidden="true" />}
              label={`${siteConfig.location.city}, ${siteConfig.location.country}`}
              delay={0.15}
              className="bottom-8 right-0 tablet:-right-4"
            />
          </div>
        </div>
      </PageContainer>

      <HeroScrollCue />
    </section>
  );
}
