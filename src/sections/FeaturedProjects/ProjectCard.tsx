import { motion } from 'framer-motion';
import { PiArrowUpRight, PiGithubLogo, PiCheckCircle } from 'react-icons/pi';
import { Pill, Button, LazyImage } from '@/components/ui';
import { fadeInUp } from '@/animations/variants';
import { useTilt } from '@/hooks/useTilt';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

/**
 * Completed-project card — Architecture §5 Component Tree (ProjectImage /
 * ProjectTitle / ProjectDescription / TechTagList / links), extended with a
 * concise feature list per this section's requirements.
 *
 * Phase 3: image handling now goes through the shared LazyImage primitive
 * (load-fade + zoom-on-hover) instead of a bespoke <img> here.
 *
 * "Interactive cards" / 3D hover: now uses the shared useTilt hook (same
 * one Hero's photo uses) — a subtle mouse-tracked rotateX/rotateY on top
 * of the existing y:-4 lift + glow, desktop/fine-pointer/reduced-motion
 * gated like every other tilt in the codebase. Kept genuinely subtle
 * (strength=6, less than Hero's 8) — a card in a multi-item grid earns
 * less dramatic tilt than the single Hero visual.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const hasLinks = Boolean(project.githubUrl || project.liveUrl);
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt(6);

  return (
    <motion.article
      {...tiltHandlers}
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      style={tiltStyle}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-fast ease-standard hover:border-accent hover:shadow-glow"
      aria-labelledby={`project-${project.slug}-heading`}
    >
      {project.image && (
        <LazyImage src={project.image.src} alt={project.image.alt} width={1600} height={900} parallax />
      )}

      <div className="flex flex-1 flex-col gap-4 p-6 desktop:p-8">
        <div className="flex flex-col gap-2">
          <h3 id={`project-${project.slug}-heading`} className="text-h3 font-semibold text-text-primary">
            {project.title}
          </h3>
          <p className="text-body text-text-secondary">{project.description}</p>
        </div>

        {project.features && project.features.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-body-sm text-text-secondary">
                <PiCheckCircle size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {project.stack && project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
            {project.stack.map((tech) => (
              <motion.li key={tech} whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }}>
                <Pill>{tech}</Pill>
              </motion.li>
            ))}
          </ul>
        )}

        {hasLinks && (
          <div className="mt-auto flex items-center gap-4 pt-2">
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                leftIcon={<PiGithubLogo size={16} />}
              >
                Code
              </Button>
            )}
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                rightIcon={<PiArrowUpRight size={16} />}
              >
                Live Demo
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
