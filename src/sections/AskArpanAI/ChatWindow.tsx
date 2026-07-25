import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiX, PiPaperPlaneTilt } from 'react-icons/pi';
import { IconButton } from '@/components/ui';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useChatSession } from './useChatSession';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The one sanctioned glassmorphism surface in the system (Design System
 * §10.2) — bg-surface-glass (a real rgba token, not a risky opacity
 * modifier on a CSS-variable color) + backdrop-blur. Focus-trapped and
 * Escape-closes via the same useFocusTrap hook Modal and MobileMenu
 * already use — third reuse of that hook, not a new accessibility
 * pattern invented here.
 */
export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const { messages, status, error, sendMessage } = useChatSession();

  useFocusTrap(panelRef, isOpen, onClose);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          id="ask-arpan-ai-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Ask Arpan AI"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.8 }}
          className="fixed bottom-24 right-6 z-modal flex h-[32rem] max-h-[75vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-surface-glass shadow-hover backdrop-blur-lg"
        >
          <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <h2 className="text-body-sm font-semibold text-text-primary">Ask Arpan AI</h2>
            <IconButton aria-label="Close chat" icon={<PiX size={18} />} onClick={onClose} />
          </header>

          <div ref={threadRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 ? (
              <ChatEmptyState onSelectPrompt={sendMessage} />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} />
                ))}
                {status === 'streaming' && <ChatTypingIndicator />}
                {status === 'error' && error && (
                  <p
                    role="alert"
                    style={{ borderColor: 'rgba(248, 113, 113, 0.4)' }}
                    className="rounded-lg border bg-surface px-4 py-2.5 text-body-sm text-danger"
                  >
                    {error}
                  </p>
                )}
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border-subtle p-3">
            <label htmlFor="ask-arpan-ai-input" className="sr-only">
              Message
            </label>
            <input
              id="ask-arpan-ai-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask something…"
              autoComplete="off"
              className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-text-primary outline-none transition-colors duration-fast ease-standard placeholder:text-text-tertiary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />
            <IconButton
              type="submit"
              aria-label="Send message"
              icon={<PiPaperPlaneTilt size={18} />}
              disabled={!inputValue.trim()}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
