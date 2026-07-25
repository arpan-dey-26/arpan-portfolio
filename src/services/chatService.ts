// Real implementation, replacing the earlier stub — calls POST /api/chat
// (api/chat.ts), which talks to Anthropic's API server-side. The
// frontend never sees an API key; it only ever calls this same-origin
// route.

import type { ChatMessage } from '@/types';

export interface SendChatMessageParams {
  messages: ChatMessage[];
}

export interface SendChatMessageResult {
  reply: string;
}

/**
 * Throws on any failure (network error, non-2xx response, or a
 * configuration/rate-limit error from the backend) — callers (see
 * sections/AskArpanAI/useChatSession.ts) are responsible for catching
 * this and surfacing a graceful, honest error state rather than a raw
 * error message to the visitor.
 */
export async function sendChatMessage({ messages }: SendChatMessageParams): Promise<SendChatMessageResult> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((message) => ({ role: message.role, content: message.content })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error ?? 'The assistant is temporarily unavailable.');
  }

  const data = await response.json();
  if (typeof data.reply !== 'string') {
    throw new Error('Received an unexpected response from the assistant.');
  }

  return { reply: data.reply };
}
