import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { postService } from '@/features/post/postService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setIdea,
  setGenerating,
  setVariations,
  setError,
  startVariation,
  appendVariationContent,
  completeVariation,
  selectDashboardState
} from '../../features/dashboard/dashboardSlice';
import { Sparkles, Loader2 } from 'lucide-react';
import type { IdeaVariation } from '@/features/post/postTypes';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { idea, variations, isGenerating, streamingContents } = useAppSelector(selectDashboardState);

  const handleGenerateIdeas = async () => {
    if (!idea.trim()) {
      toast.error('Please enter an idea or topic', { position: 'top-right' });
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
        { topic: idea },
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
          toast.error(`Failed to generate ${index !== undefined ? `variation ${index + 1}` : 'ideas'}. Please try again.`, { position: 'top-right' });
        }
      );
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate ideas'));
      dispatch(setGenerating(false));
      toast.error('Failed to generate ideas. Please try again.', { position: 'top-right' });
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
    } catch (error) {
      toast.error('Failed to save draft. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate LinkedIn Post Ideas
          </h1>
          <p className="text-gray-600">Tell us what you want to talk about and we'll create variations for you</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label htmlFor="idea-input" className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to talk about?
          </label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => dispatch(setIdea(e.target.value))}
            placeholder="e.g., AI in marketing, productivity tips, startup lessons..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
          />
          <Button
            onClick={handleGenerateIdeas}
            disabled={isGenerating || !idea.trim()}
            className="mt-4 w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ideas
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {variations.map((variation, index) => {
                const isStreaming = streamingContents[index] !== undefined;
                const displayContent = isStreaming ? streamingContents[index] : variation.content;
                const hasContent = variation.title || displayContent;

                return (
                  <div
                    key={index}
                    onClick={() => !isGenerating && variation.content ? handleSelectVariation(variation) : undefined}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-200 ${
                      !isGenerating && variation.content
                        ? 'cursor-pointer hover:shadow-md hover:border-primary'
                        : 'cursor-default'
                    } ${isStreaming ? 'ring-2 ring-primary/30' : ''}`}
                  >
                    {hasContent ? (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {variation.title || 'Generating...'}
                        </h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {displayContent}
                          {isStreaming && <span className="animate-pulse ml-0.5">▊</span>}
                        </p>
                        {!isGenerating && variation.content && (
                          <div className="mt-4 text-primary text-sm font-medium">
                            Click to edit →
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