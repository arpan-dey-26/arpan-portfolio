import { motion } from 'framer-motion';
import { PiChatCircleDots, PiX } from 'react-icons/pi';
import { useMagneticHover } from '@/hooks/useMagneticHover';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Design System §10.1 (Position) — fixed bottom-right, always accessible
 * regardless of scroll position.
 *
 * Phase 3: now uses the shared useMagneticHover hook instead of its own
 * one-off whileHover scale — the same magnetic pull every other Button
 * gets, rather than a second, slightly different hover implementation
 * for this one button.
 */
export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  const { style: magneticStyle, handlers: magneticHandlers } = useMagneticHover(0.3);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={magneticStyle}
      {...magneticHandlers}
      aria-label={isOpen ? 'Close Ask Arpan AI chat' : 'Open Ask Arpan AI chat'}
      aria-expanded={isOpen}
      aria-controls="ask-arpan-ai-panel"
      className="fixed bottom-6 right-6 z-modal flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {isOpen ? <PiX size={24} /> : <PiChatCircleDots size={24} />}
    </motion.button>
  );
}
