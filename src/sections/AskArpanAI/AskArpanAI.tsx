import { Suspense, lazy, useState } from 'react';
import { ChatButton } from './ChatButton';

const ChatWindow = lazy(() => import('./ChatWindow').then((module) => ({ default: module.ChatWindow })));

/**
 * Global floating widget — per this section's brief ("floating chatbot
 * button" + "chat window"), mounted once in Layout (not composed as a
 * scrollable section in App.tsx), so it's reachable from anywhere on the
 * page regardless of scroll position. This is also why it's not in
 * constants/navLinks.ts — a scroll-to nav link doesn't make sense for a
 * widget that's already always visible.
 *
 * Phase 3: ChatWindow (and everything it pulls in — the message thread,
 * the reducer, prompt chips) is now lazy-loaded, same pattern as Hero's
 * Spline scene — it doesn't ship in the initial bundle for visitors who
 * never open the chat. No Suspense fallback is rendered: the button
 * itself is the loading state, and the window only mounts once isOpen is
 * already true (a click already happened), so the brief async gap is
 * imperceptible rather than needing its own spinner.
 */
export function AskArpanAI() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      <Suspense fallback={null}>
        <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Suspense>
    </>
  );
}
