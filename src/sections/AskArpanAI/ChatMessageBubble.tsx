import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeInUp } from '@/animations/variants';
import { MarkdownText } from './MarkdownText';
import type { ChatMessage } from '@/types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/**
 * Design System §10.3 (Message Style). User and assistant bubbles are
 * visually distinct (alignment + accent vs. surface background) — no
 * avatars, keeping this lightweight now that it's connected to a real
 * model.
 *
 * Markdown only applies to assistant messages — user input renders as
 * plain text verbatim, since it would be strange (and mildly unsafe-
 * feeling) to reinterpret what the visitor themselves typed as
 * formatting syntax. Timestamp is small and quiet, per the brief's
 * "optional" framing — present, but not competing with the message
 * itself for attention.
 */
export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}
    >
      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1 rounded-lg px-4 py-2.5 text-body-sm',
          isUser ? 'bg-accent text-bg' : 'bg-surface-raised text-text-primary'
        )}
      >
        {isUser ? message.content : <MarkdownText content={message.content} />}
      </div>
      <span className="px-1 text-caption text-text-tertiary">{formatTime(message.createdAt)}</span>
    </motion.div>
  );
}
