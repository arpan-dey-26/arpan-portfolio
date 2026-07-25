import { Fragment } from 'react';

/**
 * A deliberately small markdown renderer — bold, inline code, fenced code
 * blocks, and bullet lists, which covers what a concise portfolio-FAQ
 * chatbot response actually needs (per the system prompt in api/chat.ts,
 * responses are told to stay short). Returns real React elements built
 * from parsed segments, never `dangerouslySetInnerHTML` — there's no HTML
 * string construction here at all, so there's no escaping to get right
 * or get wrong. A full markdown library was considered and set aside:
 * this environment can't `npm install` to verify a new dependency
 * resolves, and the actual formatting need here is narrow enough that a
 * small hand-written parser is both safer and sufficient.
 */
export function MarkdownText({ content }: { content: string }) {
  const blocks = content.split(/```/);

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const isCodeBlock = blockIndex % 2 === 1;
        if (isCodeBlock) {
          return (
            <pre
              key={blockIndex}
              className="my-1 overflow-x-auto rounded-md bg-surface p-2 font-mono text-mono text-text-secondary"
            >
              <code>{block.trim()}</code>
            </pre>
          );
        }

        const lines = block.split('\n').filter((line) => line.trim().length > 0);
        return (
          <Fragment key={blockIndex}>
            {lines.map((line, lineIndex) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
              const text = isBullet ? trimmed.slice(2) : trimmed;

              const content = <InlineFormatted key={lineIndex} text={text} />;
              return isBullet ? (
                <div key={lineIndex} className="flex gap-1.5 pl-1">
                  <span aria-hidden="true">•</span>
                  {content}
                </div>
              ) : (
                <p key={lineIndex}>{content}</p>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

// Handles **bold** and `inline code` within a single line — splits on
// both patterns and rebuilds as an array of plain text and styled spans.
function InlineFormatted({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="rounded bg-surface px-1 py-0.5 font-mono text-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
