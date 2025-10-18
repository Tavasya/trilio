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
  setSelectedHook,
  setPostLength
} from '../../features/dashboard/dashboardSlice';
import { schedulePost, publishToLinkedIn } from '@/features/post/postSlice';
import {
  checkSubscriptionStatus,
  setPendingRequest,
  selectSubscription
} from '@/features/subscription/subscriptionSlice';
import type { IdeaVariation } from '@/features/post/postTypes';
import { useState, useEffect } from 'react';
import HooksModal from '@/components/dashboard/HooksModal';
import InputSection from '@/components/dashboard/InputSection';
import CarouselSection from '@/components/dashboard/CarouselSection';
import ScheduleModal from '@/components/generate/ScheduleModal';
import PaywallModal from '@/components/dashboard/PaywallModal';

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
    chatMode,
    selectedHook,
    postLength
  } = useAppSelector(selectDashboardState);
  const { isSubscribed } = useAppSelector(selectSubscription);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [isHooksModalOpen, setIsHooksModalOpen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<IdeaVariation | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // Check if LinkedIn is connected via Clerk external accounts
  const hasLinkedIn = user?.externalAccounts?.some(
    account => account.provider === 'linkedin_oidc'
  ) || false;

  // Check subscription status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const token = await getToken();
      if (token) {
        dispatch(checkSubscriptionStatus(token));
      }
    };
    checkStatus();
  }, [getToken, dispatch]);

  const handleGenerateIdeas = async () => {
    // Validation - always require idea for topic mode
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

    // Build request with character limit instruction
    const charLimits = {
      small: 300,
      medium: 800,
      large: 1500
    };

    const charLimitText = `Keep the post under ${charLimits[postLength]} characters. `;
    const request: { topic?: string; draft_content?: string; hook_id?: number } = {
      topic: charLimitText + idea
    };

    if (selectedHook && selectedHook.id) {
      request.hook_id = selectedHook.id;
    }

    try {
      await postService.streamGenerateIdeas(
        request,
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
          // Show paywall after posts are generated if not subscribed
          if (!isSubscribed) {
            dispatch(setPendingRequest({
              idea,
              hook_id: selectedHook?.id,
              postLength,
            }));
            setShowPaywallModal(true);
          }
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

  const handleHooksApply = (hook: any) => {
    dispatch(setSelectedHook({ id: hook.id, title: hook.title, template: hook.template }));
    toast.success(`Applied ${hook.title}`, { position: 'top-right' });
  };

  const handleHookRemove = () => {
    dispatch(setSelectedHook(null));
    toast.success('Hook removed', { position: 'top-right' });
  };

  const handlePostLengthClick = () => {
    const cycle: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'medium',
      medium: 'large',
      large: 'small'
    };
    const newLength = cycle[postLength];
    dispatch(setPostLength(newLength));
  };

  const handleSchedulePost = (variation: IdeaVariation) => {
    setSelectedVariation(variation);
    setShowScheduleModal(true);
  };

  const handleSchedule = async (date: Date) => {
    if (!selectedVariation || isScheduling) return;

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    setIsScheduling(true);
    try {
      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Format the scheduled date/time in ISO format
      const scheduledFor = date.toISOString();

      await dispatch(schedulePost({
        scheduleData: {
          content: selectedVariation.content,
          scheduled_for: scheduledFor,
          timezone: timezone,
          visibility: 'PUBLIC'
        },
        token
      })).unwrap();

      setShowScheduleModal(false);
      toast.success('Post scheduled successfully!', { position: 'top-right' });
      navigate('/scheduler');
    } catch {
      toast.error('Failed to schedule post', { position: 'top-right' });
    } finally {
      setIsScheduling(false);
    }
  };

  const handlePostNow = async (variation: IdeaVariation) => {
    if (isPosting) return;

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    setIsPosting(true);
    try {
      await dispatch(publishToLinkedIn({
        post: {
          content: variation.content,
          visibility: 'PUBLIC'
        },
        token
      })).unwrap();

      toast.success('Posted to LinkedIn successfully!', { position: 'top-right' });
      navigate('/posts');
    } catch {
      toast.error('Failed to post to LinkedIn', { position: 'top-right' });
    } finally {
      setIsPosting(false);
    }
  };

  // Use Clerk user data with fallbacks (same as LinkedInPreview component)
  const userName = user?.fullName || user?.firstName || "Your Name";
  const userAvatar = user?.imageUrl || "";

  return (
    <div className={`h-full overflow-y-auto p-6 bg-gray-50 relative ${!isGenerating && variations.length === 0 ? 'flex items-center justify-center' : ''}`}>
      {/* Animated Watercolor Background */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isGenerating || variations.length > 0 ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-watercolor-1" />
        <div className="absolute top-[60%] right-[20%] w-80 h-80 bg-purple-400/30 rounded-full blur-3xl animate-watercolor-2" />
        <div className="absolute bottom-[20%] left-[25%] w-72 h-72 bg-pink-400/30 rounded-full blur-3xl animate-watercolor-3" />
        <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl animate-watercolor-4" />
      </div>

      <div className={`max-w-6xl mx-auto w-full relative z-10 ${!isGenerating && variations.length === 0 ? '' : 'pt-8'}`}>
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
            Craft compelling LinkedIn <span className="font-serif italic">posts</span>
          </h1>
          <p className="text-base font-light text-gray-700 mb-1">
            Turn your ideas into professional content, in minutes.
          </p>
          <p className="text-base font-light text-gray-700">
            Create posts optimized for your goals by chatting with AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8 max-w-3xl mx-auto">
          <InputSection
            chatMode={chatMode}
            idea={idea}
            draftContent={draftContent}
            isGenerating={isGenerating}
            selectedHook={selectedHook}
            postLength={postLength}
            onIdeaChange={(value) => dispatch(setIdea(value))}
            onDraftChange={(value) => dispatch(setDraftContent(value))}
            onHooksClick={() => setIsHooksModalOpen(true)}
            onHookRemove={handleHookRemove}
            onPostLengthClick={handlePostLengthClick}
            onGenerate={handleGenerateIdeas}
          />
        </div>

        {/* Hooks Modal */}
        <HooksModal
          isOpen={isHooksModalOpen}
          onClose={() => setIsHooksModalOpen(false)}
          onApply={handleHooksApply}
          currentlySelected={selectedHook}
        />

        {/* Carousel Section - Show when variations are generated */}
        {(isGenerating || variations.length > 0) && (
          <div className="mt-12 relative">
            <CarouselSection
              cards={variations}
              userName={userName}
              userAvatar={userAvatar}
              isGenerating={isGenerating}
              streamingContents={streamingContents}
              regeneratingIndex={regeneratingIndex}
              onEdit={handleSelectVariation}
              onRegenerate={handleRegenerateVariation}
              onSchedule={hasLinkedIn ? handleSchedulePost : undefined}
              onPostNow={hasLinkedIn ? handlePostNow : undefined}
              isPosting={isPosting}
              isScheduling={isScheduling}
              isSubscribed={isSubscribed}
            />

            {/* Paywall Modal - Appears over blurred content */}
            {showPaywallModal && (
              <PaywallModal
                isOpen={showPaywallModal}
                onClose={() => setShowPaywallModal(false)}
              />
            )}
          </div>
        )}

        {/* Schedule Modal */}
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleSchedule}
          isScheduling={isScheduling}
        />
      </div>
    </div>
  );
};

export default Dashboard;
