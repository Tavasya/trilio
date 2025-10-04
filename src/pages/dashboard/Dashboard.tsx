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
import type { IdeaVariation } from '@/features/post/postTypes';
import { useState } from 'react';
import HooksModal from '@/components/dashboard/HooksModal';
import InputSection from '@/components/dashboard/InputSection';
import CarouselSection from '@/components/dashboard/CarouselSection';

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
            onIdeaChange={(value) => dispatch(setIdea(value))}
            onDraftChange={(value) => dispatch(setDraftContent(value))}
            onModeToggle={() => dispatch(setChatMode(chatMode === 'topic' ? 'draft' : 'topic'))}
            onHooksClick={() => setIsHooksModalOpen(true)}
            onGenerate={handleGenerateIdeas}
          />
        </div>

        {/* Hooks Modal */}
        <HooksModal
          isOpen={isHooksModalOpen}
          onClose={() => setIsHooksModalOpen(false)}
          onApply={handleHooksApply}
        />

        {/* Carousel Section - Show when variations are generated */}
        {(isGenerating || variations.length > 0) && (
          <div className="mt-12">
            <CarouselSection
              cards={variations}
              userName={userName}
              userAvatar={userAvatar}
              isGenerating={isGenerating}
              streamingContents={streamingContents}
              regeneratingIndex={regeneratingIndex}
              onEdit={handleSelectVariation}
              onRegenerate={handleRegenerateVariation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
