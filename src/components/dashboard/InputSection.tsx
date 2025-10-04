import { Loader2, Target, ArrowUp, X, AlignLeft } from 'lucide-react';

interface SelectedHook {
  icp: string;
  hookType: string;
  title: string;
  gradient: string;
}

type PostLength = 'small' | 'medium' | 'large';

interface InputSectionProps {
  chatMode: 'topic' | 'draft';
  idea: string;
  draftContent: string;
  isGenerating: boolean;
  selectedHook: SelectedHook | null;
  postLength: PostLength;
  onIdeaChange: (value: string) => void;
  onDraftChange: (value: string) => void;
  onHooksClick: () => void;
  onHookRemove: () => void;
  onPostLengthClick: () => void;
  onGenerate: () => void;
}

export default function InputSection({
  chatMode,
  idea,
  draftContent,
  isGenerating,
  selectedHook,
  postLength,
  onIdeaChange,
  onDraftChange,
  onHooksClick,
  onHookRemove,
  onPostLengthClick,
  onGenerate
}: InputSectionProps) {
  const lengthLabels = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large'
  };
  const isDisabled =
    isGenerating ||
    (chatMode === 'topic' && !idea.trim()) ||
    (chatMode === 'draft' && !draftContent.trim());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onGenerate();
      }
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
      <textarea
        value={chatMode === 'topic' ? idea : draftContent}
        onChange={(e) => chatMode === 'topic' ? onIdeaChange(e.target.value) : onDraftChange(e.target.value)}
        onKeyDown={handleKeyDown}
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
            onClick={onHooksClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span className="text-sm">Hooks</span>
          </button>

          <button
            onClick={onPostLengthClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="text-sm">Post Length</span>
          </button>

          {selectedHook && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${selectedHook.gradient} rounded-lg`}>
              <span className="text-sm text-white font-medium">{selectedHook.title}</span>
              <button
                onClick={onHookRemove}
                className="hover:bg-white/20 rounded transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg">
            <span className="text-sm text-white font-medium">{lengthLabels[postLength]}</span>
          </div>
        </div>

        {/* Right Side - Send Button */}
        <button
          onClick={onGenerate}
          disabled={isDisabled}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-colors ${
            isDisabled
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isGenerating ? (
            <Loader2 className={`w-4 h-4 animate-spin ${isDisabled ? 'text-gray-700' : 'text-white'}`} />
          ) : (
            <ArrowUp className={`w-4 h-4 ${isDisabled ? 'text-gray-700' : 'text-white'}`} />
          )}
        </button>
      </div>
    </div>
  );
}
