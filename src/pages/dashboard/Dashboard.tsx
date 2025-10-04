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
import VariationsGrid from '@/components/dashboard/VariationsGrid';

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

  // Mockup data for carousel - different content sizes
  const mockCards = [
    {
      title: 'Growth Mindset Hook',
      content: 'Most people think success is about talent.\n\nBut here\'s what I learned after 10 years in the industry: it\'s actually about consistency and learning from failures.\n\nHere\'s my story and the 3 key lessons that changed everything for me:\n\n1. Small wins compound into massive results\n2. Failure is just feedback in disguise\n3. Your network determines your net worth\n\nWhat\'s been your biggest lesson in your career journey?'
    },
    {
      title: 'Data-Driven Approach',
      content: '73% of professionals struggle with imposter syndrome.\n\nI was one of them.\n\nHere\'s how I turned self-doubt into my biggest competitive advantage in just 6 months.'
    },
    {
      title: 'Personal Experience',
      content: 'I failed 12 times before my first success.\n\nEach failure taught me something crucial. Today, I want to share the 3 lessons that changed everything for me:\n\n→ Embrace the process, not just the outcome\n→ Build in public, learn in public\n→ Consistency beats perfection every single time\n\nThe path to success is rarely a straight line. It\'s messy, it\'s uncomfortable, and it\'s absolutely worth it.\n\nDrop a 💪 if you\'re on this journey too.'
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
        {/* Header Section */}
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

        {/* Input Section */}
        <div className="mb-8">
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

        {/* Carousel Section */}
        <div className="mt-12">
          <CarouselSection
            cards={mockCards}
            userName={userName}
            userAvatar={userAvatar}
          />
        </div>

        {/* Variations Grid Section */}
        {(isGenerating || variations.length > 0) && (
          <div className="mt-12">
            <VariationsGrid
              variations={variations}
              streamingContents={streamingContents}
              isGenerating={isGenerating}
              regeneratingIndex={regeneratingIndex}
              onSelectVariation={handleSelectVariation}
              onRegenerateVariation={handleRegenerateVariation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
