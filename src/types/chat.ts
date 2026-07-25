// Only the shared message shape — full chat session/service contracts are
// defined when the Ask Arpan AI section itself is built (Architecture §18).
export type ChatRole = 'user' | 'assistant';
export type ChatStatus = 'idle' | 'sending' | 'streaming' | 'done' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}
