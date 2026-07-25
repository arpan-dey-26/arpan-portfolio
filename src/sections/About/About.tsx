import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading } from '@/components/ui';
import { aboutCopy } from '@/content/aboutCopy';
import { fadeInUp } from '@/animations/variants';

export function About() {
  return (
    <SectionWrapper id="about">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeInUp}
        className="flex flex-col gap-6"
      >
        <SectionHeading id="about-heading" eyebrow={aboutCopy.eyebrow} title="About" />
        <p className="max-w-2xl text-body-lg text-text-secondary">{aboutCopy.body}</p>
      </motion.div>
    </SectionWrapper>
  );
}
