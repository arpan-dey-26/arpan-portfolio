import { motion } from 'framer-motion';
import { Pill, LazyImage } from '@/components/ui';
import { fadeInUp } from '@/animations/variants';
import { useTilt } from '@/hooks/useTilt';
import { currentlyBuilding } from '@/data/currentlyBuilding';

/**
 * A light "coming soon" preview of the active project — deliberately NOT
 * the full treatment (roadmap steps) that Architecture §9 describes for a
 * dedicated Currently Building section. Reads from
 * data/currentlyBuilding.ts rather than duplicating PrePit AI's facts
 * into data/projects.ts, so there is exactly one source of truth
 * regardless of whether a fuller dedicated section gets built later
 * (Architecture §9.6's "not duplicated content" principle, applied here
 * too). Renders nothing if that data is ever cleared back to null.
 *
 * Same tilt strength as ProjectCard (useTilt(6)) — this card sits in the
 * same grid, so it should feel like the same interactive surface, not a
 * different one.
 */
export function CurrentlyBuildingTeaserCard() {
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt(6);

  if (!currentlyBuilding) return null;

  return (
    <motion.article
      {...tiltHandlers}
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      style={tiltStyle}
      transition={{ duration: 0.2 }}
      className="group flex flex-col justify-between gap-6 overflow-hidden rounded-xl border border-accent bg-accent-muted p-6 transition-shadow duration-fast ease-standard hover:shadow-glow desktop:p-8"
      aria-labelledby="project-prepit-ai-heading"
    >
      <div className="flex flex-col gap-4">
        {/* Same live-status-dot visual language as Journey's "Open to
            opportunities" entry — one consistent way to signal "active/
            current" across the site, not a new pattern invented here. */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="text-caption font-medium uppercase tracking-wide text-accent">
            Currently Building
          </span>
        </div>

        <h3 id="project-prepit-ai-heading" className="text-h3 font-semibold text-text-primary">
          {currentlyBuilding.title}
        </h3>
        <p className="text-body text-text-secondary">{currentlyBuilding.overview}</p>
        {currentlyBuilding.currentMilestone && (
          <p className="text-body-sm text-text-tertiary">{currentlyBuilding.currentMilestone}</p>
        )}
      </div>

      {currentlyBuilding.architecturePreview && (
        <LazyImage
          src={currentlyBuilding.architecturePreview.src}
          alt={currentlyBuilding.architecturePreview.alt}
          width={1400}
          height={788}
          aspectRatio="16/9"
          zoomOnHover={false}
          className="rounded-lg border border-border-subtle"
        />
      )}

      {currentlyBuilding.stack.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={`Technologies used in ${currentlyBuilding.title}`}>
          {currentlyBuilding.stack.map((tech) => (
            <li key={tech}>
              <Pill>{tech}</Pill>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}
