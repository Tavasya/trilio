import { Loader2, FileText, Target, ArrowUp } from 'lucide-react';

interface InputSectionProps {
  chatMode: 'topic' | 'draft';
  idea: string;
  draftContent: string;
  isGenerating: boolean;
  onIdeaChange: (value: string) => void;
  onDraftChange: (value: string) => void;
  onModeToggle: () => void;
  onHooksClick: () => void;
  onGenerate: () => void;
}

export default function InputSection({
  chatMode,
  idea,
  draftContent,
  isGenerating,
  onIdeaChange,
  onDraftChange,
  onModeToggle,
  onHooksClick,
  onGenerate
}: InputSectionProps) {
  const isDisabled =
    isGenerating ||
    (chatMode === 'topic' && !idea.trim()) ||
    (chatMode === 'draft' && !draftContent.trim());

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
      <textarea
        value={chatMode === 'topic' ? idea : draftContent}
        onChange={(e) => chatMode === 'topic' ? onIdeaChange(e.target.value) : onDraftChange(e.target.value)}
        placeholder={chatMode === 'topic'
          ? 'e.g., AI in marketing, productivity tips, startup lessons...'
          : 'Paste your existing LinkedIn post or content here to get refined variations...'
        }
        className="w-full px-6 py-6 pb-16 bg-transparent border-0 rounded-2xl resize-none focus:ring-0 focus:outline-none text-base leading-relaxed"
        rows={6}
      />

      {/* Bottom Controls - Inside textarea */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
        {/* Left Side Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onModeToggle}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">{chatMode === 'topic' ? 'Draft' : 'Topic'}</span>
          </button>

          <button
            onClick={onHooksClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Hooks</span>
          </button>
        </div>

        {/* Right Side - Send Button */}
        <button
          onClick={onGenerate}
          disabled={isDisabled}
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
