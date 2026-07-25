import { useReducer, useCallback } from 'react';
import { sendChatMessage } from '@/services/chatService';
import type { ChatMessage, ChatStatus } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
}

type ChatAction =
  | { type: 'SEND_USER_MESSAGE'; content: string }
  | { type: 'START_RESPONSE' }
  | { type: 'RESOLVE_RESPONSE'; content: string }
  | { type: 'RESOLVE_ERROR'; message: string };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SEND_USER_MESSAGE':
      return {
        status: 'sending',
        error: null,
        messages: [
          ...state.messages,
          { id: crypto.randomUUID(), role: 'user', content: action.content, createdAt: new Date().toISOString() },
        ],
      };
    case 'START_RESPONSE':
      return { ...state, status: 'streaming' };
    case 'RESOLVE_RESPONSE':
      return {
        status: 'done',
        error: null,
        messages: [
          ...state.messages,
          { id: crypto.randomUUID(), role: 'assistant', content: action.content, createdAt: new Date().toISOString() },
        ],
      };
    case 'RESOLVE_ERROR':
      // Deliberately does NOT add a message to the thread — an error
      // isn't something Arpan "said," and disguising it as a normal
      // assistant bubble would misrepresent what actually happened.
      // ChatWindow renders `error` as its own distinct banner instead.
      return { ...state, status: 'error', error: action.message };
    default:
      return state;
  }
}

/**
 * Real implementation, replacing the earlier setTimeout stub — calls
 * services/chatService.sendChatMessage, which hits POST /api/chat
 * (api/chat.ts → Anthropic's API, server-side only).
 *
 * Sends the full message history each time (Anthropic's API is
 * stateless per-request, same as most chat completion APIs) so the
 * assistant has conversational context across turns, not just the
 * latest message in isolation.
 */
export function useChatSession() {
  const [state, dispatch] = useReducer(chatReducer, { messages: [], status: 'idle', error: null });

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      dispatch({ type: 'SEND_USER_MESSAGE', content: trimmed });
      dispatch({ type: 'START_RESPONSE' });

      try {
        const nextMessages: ChatMessage[] = [
          ...state.messages,
          { id: crypto.randomUUID(), role: 'user', content: trimmed, createdAt: new Date().toISOString() },
        ];
        const { reply } = await sendChatMessage({ messages: nextMessages });
        dispatch({ type: 'RESOLVE_RESPONSE', content: reply });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        dispatch({ type: 'RESOLVE_ERROR', message });
      }
    },
    [state.messages]
  );

  return { messages: state.messages, status: state.status, error: state.error, sendMessage };
}
