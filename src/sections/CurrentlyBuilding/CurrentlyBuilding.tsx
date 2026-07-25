import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading, Pill } from '@/components/ui';
import { currentResearch } from '@/data/currentResearch';
import { fadeInUp, staggerContainer } from '@/animations/variants';
import { ResearchWorkflow } from './ResearchWorkflow';

/**
 * Architecture §9/§3 (5th section, "Currently Building"). Content is the
 * confirmed active research project (see data/currentResearch.ts's header
 * comment) — deliberately concise per explicit instruction: no metrics,
 * no PDF/document viewer, no tables. This is a DIFFERENT project from
 * PrePit AI, which stays as its own teaser card inside Featured Projects
 * — the two are unrelated active projects, not a duplication of one.
 */
export function CurrentlyBuilding() {
  return (
    <SectionWrapper id="currently-building">
      <SectionHeading id="currently-building-heading" eyebrow="Current Research" title="Currently Building" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.1)}
        className="mt-12 flex flex-col gap-8 rounded-xl border border-border bg-surface p-6 desktop:p-10"
      >
        <motion.div variants={fadeInUp} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-caption font-medium uppercase tracking-wide text-accent">
              {currentResearch.status}
            </span>
          </div>
          <h3 className="text-h2 font-semibold text-text-primary">{currentResearch.title}</h3>
          <p className="max-w-2xl text-body-lg text-text-secondary">{currentResearch.overview}</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-8 tablet:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h4 className="text-body-sm font-medium uppercase tracking-wide text-text-tertiary">Problem</h4>
            <p className="text-body text-text-secondary">{currentResearch.problemStatement}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-body-sm font-medium uppercase tracking-wide text-text-tertiary">Approach</h4>
            <p className="text-body text-text-secondary">{currentResearch.approach}</p>
          </div>
        </motion.div>

        {currentResearch.techniques && currentResearch.techniques.length > 0 && (
          <motion.ul variants={fadeInUp} className="flex flex-wrap gap-2" aria-label="Techniques used">
            {currentResearch.techniques.map((technique) => (
              <li key={technique}>
                <Pill>{technique}</Pill>
              </li>
            ))}
          </motion.ul>
        )}

        {currentResearch.workflow && currentResearch.workflow.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-body-sm font-medium uppercase tracking-wide text-text-tertiary">Workflow</h4>
            <ResearchWorkflow steps={currentResearch.workflow} />
          </div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
