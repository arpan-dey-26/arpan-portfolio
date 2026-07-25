import { motion } from 'framer-motion';
import { fadeInUp } from '@/animations/variants';
import { SKILL_ICON_MAP } from './skillIcons';
import type { SkillCategory } from '@/types';

interface SkillCategoryCardProps {
  category: SkillCategory;
}

/**
 * Card system per Design System §6.1 — solid surface, border, standard
 * hover contract.
 * h-full: needed now that Skills.tsx wraps these in a flex layout instead
 * of a fixed grid — without it, a short card (e.g. Databases, now just
 * one item) wouldn't stretch to match a taller sibling in the same row.
 */
export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-6 transition-colors duration-fast ease-standard hover:border-accent hover:shadow-glow"
      aria-labelledby={`skill-category-${category.label.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h3
        id={`skill-category-${category.label.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-caption font-medium uppercase tracking-wide text-text-tertiary"
      >
        {category.label}
      </h3>
      <ul className="flex flex-col gap-3">
        {category.items.map((item) => {
          const Icon = item.icon ? SKILL_ICON_MAP[item.icon] : undefined;
          return (
            <li key={item.name} className="flex items-center gap-3 text-body text-text-primary">
              {Icon ? (
                <Icon size={18} className="shrink-0 text-text-secondary" aria-hidden="true" />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" aria-hidden="true" />
              )}
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
}
