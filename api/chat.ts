// Real implementation, replacing the earlier 501 placeholder — Ask Arpan
// AI's backend, per Architecture §18. Vercel Edge Function (Web Request/
// Response signature, matching what the placeholder was already written
// for).
//
// Uses fetch() directly against Anthropic's Messages API rather than the
// @anthropic-ai/sdk package — this environment can't run `npm install` to
// verify a new dependency resolves correctly, and the raw REST contract
// (documented, stable: x-api-key/anthropic-version headers, a
// model/max_tokens/system/messages body) is something I can implement
// with real confidence without that verification step. One fewer new
// dependency to get wrong.
//
// Non-streaming by design: true token-by-token streaming needs
// Server-Sent-Event parsing on the frontend that I have no way to test
// end-to-end here. A single awaited response is slower to first-byte but
// cannot go subtly wrong the way an untested streaming parser could —
// the right tradeoff given I can't verify either path live. The
// 'streaming' ChatStatus in the frontend already just means "waiting for
// a reply" (the typing indicator), so this doesn't change that UI at all.

import { chatbotKnowledge } from '../src/content/chatbotKnowledge';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001'; // fast + cost-effective — this is a scoped FAQ bot, not a reasoning task
const MAX_TOKENS = 512; // keeps responses concise per the brief, and keeps cost per message low

const SYSTEM_PROMPT = `You are "Ask Arpan AI," embedded in Arpan Dey's personal portfolio website. You answer visitors' questions about Arpan using ONLY the information below. You are not a general-purpose assistant.

Rules:
- Only use facts from the knowledge base below. Never invent, guess, or embellish details about Arpan, his projects, skills, or history.
- If asked something the knowledge base doesn't cover, say so plainly and suggest the visitor use the Contact section to ask Arpan directly. Do not guess.
- Keep responses concise and professional — a few sentences for most questions, short lists where that's clearer. This is a portfolio chat widget, not a long-form assistant.
- Never mention React, Next.js, Tailwind CSS, Node.js, Express.js, MongoDB, PostgreSQL, or Docker as things Arpan knows or has used — he has explicitly asked for these to not be attributed to him anywhere, including in conversation.
- Do not state his phone number even if asked; point to the Contact section instead.
- If asked who you are or how you work, you can say you're an AI assistant answering questions about Arpan's background using his portfolio content.
- You may use light markdown (bold, bullet lists) since responses render with markdown support, but keep it minimal.

Knowledge base:
${chatbotKnowledge}`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Deliberately generic to the client — never leak whether it's a
    // missing key vs. something else internal.
    return new Response(JSON.stringify({ error: 'Chat is not configured yet.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!anthropicResponse.ok) {
      // Don't forward the provider's raw error body to the client —
      // could contain more detail than a visitor should see.
      return new Response(JSON.stringify({ error: 'The assistant is temporarily unavailable.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await anthropicResponse.json();
    const textBlock = data.content?.find((block: { type: string }) => block.type === 'text');
    const reply = textBlock?.text ?? "I couldn't generate a response — please try again.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Network error reaching the assistant.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
