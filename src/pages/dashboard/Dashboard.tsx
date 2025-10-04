import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react-router';
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
import { Loader2, RefreshCw, FileText, Target, ArrowUp, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';
import type { IdeaVariation } from '@/features/post/postTypes';
import { useState } from 'react';
import HooksModal from '@/components/dashboard/HooksModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
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
  const [isHooksModalOpen, setIsHooksModalOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Mockup data for carousel
  const mockCards = [
    {
      title: 'Growth Mindset Hook',
      content: 'Most people think success is about talent. But here\'s what I learned after 10 years in the industry: it\'s actually about consistency and learning from failures. Here\'s my story...'
    },
    {
      title: 'Data-Driven Approach',
      content: '73% of professionals struggle with imposter syndrome. I was one of them. Here\'s how I turned self-doubt into my biggest competitive advantage in just 6 months...'
    },
    {
      title: 'Personal Experience',
      content: 'I failed 12 times before my first success. Each failure taught me something crucial. Today, I want to share the 3 lessons that changed everything for me...'
    }
  ];


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

  const handleHooksApply = (icp: string, hookType: string) => {
    toast.success(`Applied ${hookType} hook for ${icp}`, { position: 'top-right' });
  };

  // Use Clerk user data with fallbacks (same as LinkedInPreview component)
  const userName = user?.fullName || user?.firstName || "Your Name";
  const userAvatar = user?.imageUrl || "";

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate LinkedIn Post Ideas
          </h1>
          <p className="text-gray-600">
            {chatMode === 'topic'
              ? 'Tell us what you want to talk about and we\'ll create variations for you'
              : 'Select a draft and we\'ll create variations to refine it'
            }
          </p>
        </div>

        {/* Input Section with embedded controls */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <textarea
            value={chatMode === 'topic' ? idea : draftContent}
            onChange={(e) => chatMode === 'topic' ? dispatch(setIdea(e.target.value)) : dispatch(setDraftContent(e.target.value))}
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
                onClick={() => dispatch(setChatMode(chatMode === 'topic' ? 'draft' : 'topic'))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{chatMode === 'topic' ? 'Draft' : 'Topic'}</span>
              </button>

              <button
                onClick={() => setIsHooksModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Hooks</span>
              </button>
            </div>

            {/* Right Side - Send Button */}
            <button
              onClick={handleGenerateIdeas}
              disabled={
                isGenerating ||
                (chatMode === 'topic' && !idea.trim()) ||
                (chatMode === 'draft' && !draftContent.trim())
              }
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

        {/* Hooks Modal */}
        <HooksModal
          isOpen={isHooksModalOpen}
          onClose={() => setIsHooksModalOpen(false)}
          onApply={handleHooksApply}
        />

        {/* 3D Horizontal Overlap Carousel Mockup */}
        <div className="mb-12 mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
            Choose a variation to continue
          </h2>

          {/* Properly contained absolute positioning - best practice */}
          <div className="relative h-[650px] w-full max-w-4xl mx-auto flex items-center justify-center">
            {mockCards.map((card, index) => {
              const position = (index - currentCardIndex + mockCards.length) % mockCards.length;

              // Only show 3 cards: left (2), center (0), right (1)
              if (position > 2) return null;

              const isActive = position === 0;
              let translateX = 0;
              let scale = 0.85;
              let opacity = 0.5;
              let filter = 'grayscale(50%)';
              let zIndex = 10;

              if (position === 0) {
                // Center
                translateX = 0;
                scale = 1;
                opacity = 1;
                filter = 'none';
                zIndex = 30;
              } else if (position === 1) {
                // Right
                translateX = 200;
                zIndex = 20;
              } else if (position === 2) {
                // Left
                translateX = -200;
                zIndex = 20;
              }

              return (
                <div
                  key={index}
                  onClick={() => !isActive && setCurrentCardIndex(index)}
                  className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-[550px] transition-all duration-500 ease-out ${!isActive ? 'cursor-pointer hover:opacity-70' : ''}`}
                  style={{
                    zIndex,
                    transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
                    opacity,
                    filter
                  }}
                >
                  <div className="bg-white rounded-lg border border-gray-200 relative">
                    {/* Top Right Buttons - Only show on active card */}
                    {isActive && (
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                    )}

                    {/* Post Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 items-center">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                            {userAvatar ? (
                              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-gray-600 font-semibold text-lg">
                                {userName.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            )}
                          </div>
                          {/* User Info */}
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900">{userName}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Just now • 🌐</p>
                          </div>
                        </div>
                        {/* More Options */}
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-4 pb-3">
                      <div className="text-gray-900 whitespace-pre-wrap text-sm line-clamp-[8]">
                        {card.content}
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <ThumbIcon className="w-4 h-4" />
                          <HeartIcon className="w-4 h-4" />
                          <ClapIcon className="w-4 h-4" />
                        </div>
                        <span className="ml-1">127</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>23 comments</span>
                        <span>•</span>
                        <span>8 reposts</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Repost</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                        <Send className="w-5 h-5" />
                        <span className="text-sm font-medium">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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