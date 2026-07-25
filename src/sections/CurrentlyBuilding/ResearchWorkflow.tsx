import { motion } from 'framer-motion';
import { PiCheckCircle, PiCircle, PiArrowRight } from 'react-icons/pi';
import { fadeInUp } from '@/animations/variants';
import type { ResearchWorkflowStep } from '@/types';

interface ResearchWorkflowProps {
  steps: ResearchWorkflowStep[];
}

/**
 * "A simple workflow illustration" — deliberately just connected labeled
 * steps, not a technical diagram (that register is reserved for
 * CurrentlyBuildingProject's architecturePreview image, a different
 * project's data model — see types/research.ts). Steps before the
 * current one read as done, matching the paper's own stated section
 * order (Dataset → Preprocessing → Model → Training → Evaluation), not
 * an invented timeline.
 */
export function ResearchWorkflow({ steps }: ResearchWorkflowProps) {
  const currentIndex = steps.findIndex((step) => step.isCurrent);

  return (
    <motion.ol
      variants={fadeInUp}
      className="flex flex-col gap-3 tablet:flex-row tablet:flex-wrap tablet:items-center tablet:gap-2"
      aria-label="Research workflow"
    >
      {steps.map((step, index) => {
        const isDone = currentIndex >= 0 && index < currentIndex;
        const isCurrent = Boolean(step.isCurrent);

        return (
          <li key={step.label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-body-sm ${
                isCurrent
                  ? 'border-accent bg-accent-muted text-text-primary'
                  : 'border-border-subtle text-text-secondary'
              }`}
            >
              {isDone ? (
                <PiCheckCircle size={16} className="text-accent" aria-hidden="true" />
              ) : (
                <PiCircle size={16} className={isCurrent ? 'text-accent' : 'text-text-tertiary'} aria-hidden="true" />
              )}
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <PiArrowRight size={14} className="hidden text-text-tertiary tablet:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </motion.ol>
  );
}
