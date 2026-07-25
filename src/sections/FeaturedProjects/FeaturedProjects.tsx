import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { projects } from '@/data/projects';
import { staggerContainer } from '@/animations/variants';
import { ProjectCard } from './ProjectCard';
import { CurrentlyBuildingTeaserCard } from './CurrentlyBuildingTeaserCard';

/**
 * Architecture §5 (Component Tree) / §3 (Information Architecture, 4th
 * section). Grid is 1-column on mobile, 2-column from tablet up — with
 * exactly one completed project plus the Currently Building teaser, two
 * columns fills a single row cleanly. Entrance uses the same
 * staggerContainer/fadeInUp variants already established in
 * animations/variants.ts — no new animation pattern introduced here.
 */
export function FeaturedProjects() {
  return (
    <SectionWrapper id="featured-projects">
      <SectionHeading id="featured-projects-heading" eyebrow="Work" title="Featured Projects" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer(0.12)}
        className="mt-12 grid grid-cols-1 gap-8 tablet:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
        <CurrentlyBuildingTeaserCard />
      </motion.div>
    </SectionWrapper>
  );
}
