import { motion } from 'framer-motion';

/**
 * Design System §10.6 (Loading/Thinking state) — tertiary-toned dots, NOT
 * accent-colored, so a passive waiting state doesn't read as an
 * actionable/interactive element (same rule already applied to Spinner's
 * tone="tertiary" variant).
 */
export function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5" role="status" aria-label="Ask Arpan AI is responding">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
