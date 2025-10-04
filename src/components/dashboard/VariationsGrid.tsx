import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import type { IdeaVariation } from '@/features/post/postTypes';

interface VariationsGridProps {
  variations: IdeaVariation[];
  streamingContents: Record<number, string>;
  isGenerating: boolean;
  regeneratingIndex: number | null;
  onSelectVariation: (variation: IdeaVariation) => void;
  onRegenerateVariation: (index: number, previousContent: string) => void;
}

export default function VariationsGrid({
  variations,
  streamingContents,
  isGenerating,
  regeneratingIndex,
  onSelectVariation,
  onRegenerateVariation
}: VariationsGridProps) {
  if (!isGenerating && variations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {isGenerating ? 'Generating variations...' : 'Choose a variation to continue'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {variations.map((variation, index) => {
          const isStreaming = streamingContents[index] !== undefined;
          const displayContent = isStreaming ? streamingContents[index] : variation.content;
          const hasContent = variation.title || displayContent;
          const isRegenerating = regeneratingIndex === index;

          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-200 h-fit ${
                isStreaming ? 'ring-2 ring-primary/30' : ''
              }`}
            >
              {hasContent ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {variation.title || 'Generating...'}
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">
                    {displayContent}
                    {isStreaming && <span className="animate-pulse ml-0.5">▊</span>}
                  </p>
                  {!isGenerating && !isRegenerating && variation.content && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onSelectVariation(variation)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        Select & Edit →
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegenerateVariation(index, variation.content);
                        }}
                        variant="outline"
                        className="px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {isRegenerating && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </div>
                  )}
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
