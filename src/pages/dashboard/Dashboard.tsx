import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { postService } from '@/features/post/postService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setIdea,
  setDraftContent,
  setGenerating,
  setVariations,
  setError,
  startVariation,
  appendVariationContent,
  completeVariation,
  selectDashboardState,
  setChatMode
} from '../../features/dashboard/dashboardSlice';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import type { IdeaVariation } from '@/features/post/postTypes';
import { useState } from 'react';
import ModeSlider from '@/components/dashboard/ModeSlider';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const {
    idea,
    draftContent,
    variations,
    isGenerating,
    streamingContents,
    chatMode
  } = useAppSelector(selectDashboardState);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const handleGenerateIdeas = async () => {
    // Validation based on mode
    if (chatMode === 'topic' && !idea.trim()) {
      toast.error('Please enter an idea or topic', { position: 'top-right' });
      return;
    }

    if (chatMode === 'draft' && !draftContent.trim()) {
      toast.error('Please enter your draft content', { position: 'top-right' });
      return;
    }

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    dispatch(setGenerating(true));
    dispatch(setError(null));
    dispatch(setVariations([{title: '', content: ''}, {title: '', content: ''}, {title: '', content: ''}]));

    try {
      await postService.streamGenerateIdeas(
        chatMode === 'topic'
          ? { topic: idea }
          : { draft_content: draftContent },
        token,
        (index, title) => {
          dispatch(startVariation({ index, title }));
        },
        (index, content) => {
          dispatch(appendVariationContent({ index, content }));
        },
        (index, content) => {
          dispatch(completeVariation({ index, content }));
        },
        () => {
          dispatch(setGenerating(false));
        },
        (error, index) => {
          dispatch(setError(error.message));
          dispatch(setGenerating(false));
          toast.error(`Failed to generate ${index !== undefined ? `variation ${index + 1}` : 'variations'}. Please try again.`, { position: 'top-right' });
        }
      );
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate variations'));
      dispatch(setGenerating(false));
      toast.error('Failed to generate variations. Please try again.', { position: 'top-right' });
    }
  };

  const handleSelectVariation = async (variation: IdeaVariation) => {
    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    try {
      const response = await postService.saveDraft({ content: variation.content }, token);
      if (response.post_id) {
        navigate(`/generate?postId=${response.post_id}`);
      } else {
        throw new Error('No post ID returned');
      }
    } catch {
      toast.error('Failed to save draft. Please try again.', { position: 'top-right' });
    }
  };

  const handleRegenerateVariation = async (index: number, previousContent: string) => {
    if (!idea.trim()) {
      toast.error('Original topic required for regeneration', { position: 'top-right' });
      return;
    }

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    setRegeneratingIndex(index);

    try {
      await postService.streamRegenerateVariation(
        { topic: idea, index, previous_content: previousContent },
        token,
        (idx, title) => {
          dispatch(startVariation({ index: idx, title }));
        },
        (idx, content) => {
          dispatch(appendVariationContent({ index: idx, content }));
        },
        (idx, content) => {
          dispatch(completeVariation({ index: idx, content }));
        },
        () => {
          setRegeneratingIndex(null);
        },
        (error) => {
          dispatch(setError(error.message));
          setRegeneratingIndex(null);
          toast.error('Failed to regenerate variation. Please try again.', { position: 'top-right' });
        }
      );
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to regenerate variation'));
      setRegeneratingIndex(null);
      toast.error('Failed to regenerate variation. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50/30 to-white pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header with serif font and italic emphasis */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Chat it into <span className="italic">existence</span>
          </h1>
          <p className="text-lg text-gray-600 font-sans">
            {chatMode === 'topic'
              ? 'Tell us what you want to talk about and we\'ll create variations for you'
              : 'Select a draft and we\'ll create variations to refine it'
            }
          </p>
        </div>

        {/* Mode Slider */}
        <div className="mb-6 flex justify-center">
          <ModeSlider
            mode={chatMode}
            onModeChange={(mode) => dispatch(setChatMode(mode))}
          />
        </div>

        {/* Input Section - Elevated card with soft shadow */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {chatMode === 'topic' ? (
            <>
              <label htmlFor="idea-input" className="block text-sm font-medium text-gray-700 mb-3">
                What do you want to talk about?
              </label>
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => dispatch(setIdea(e.target.value))}
                placeholder="e.g., AI in marketing, productivity tips, startup lessons..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 hover:border-gray-400"
                rows={4}
              />
            </>
          ) : (
            <>
              <label htmlFor="draft-input" className="block text-sm font-medium text-gray-700 mb-3">
                Paste your draft content
              </label>
              <textarea
                id="draft-input"
                value={draftContent}
                onChange={(e) => dispatch(setDraftContent(e.target.value))}
                placeholder="Paste your existing LinkedIn post or content here to get refined variations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 hover:border-gray-400"
                rows={6}
              />
            </>
          )}
          <Button
            onClick={handleGenerateIdeas}
            disabled={
              isGenerating ||
              (chatMode === 'topic' && !idea.trim()) ||
              (chatMode === 'draft' && !draftContent.trim())
            }
            className="mt-6 w-full sm:w-auto px-8 py-3 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 rounded-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Variations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Variations
              </>
            )}
          </Button>
        </div>

        {/* Variations Grid */}
        {(isGenerating || variations.length > 0) && (
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
                              onClick={() => handleSelectVariation(variation)}
                              className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                              Select & Edit →
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegenerateVariation(index, variation.content);
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;