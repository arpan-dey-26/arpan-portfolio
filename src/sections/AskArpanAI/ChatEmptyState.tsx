import { PiChatCircleDots } from 'react-icons/pi';
import { Pill } from '@/components/ui';
import { promptChips } from '@/constants/promptChips';

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

/** Design System §10.5 (Empty State). */
export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
      <PiChatCircleDots size={32} className="text-text-tertiary" aria-hidden="true" />
      <p className="text-body-sm text-text-secondary">
        Ask about Arpan's projects, skills, or how to get in touch.
      </p>
      {promptChips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {promptChips.map((chip) => (
            <Pill key={chip.label} as="button" variant="interactive" onClick={() => onSelectPrompt(chip.prompt)}>
              {chip.label}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
