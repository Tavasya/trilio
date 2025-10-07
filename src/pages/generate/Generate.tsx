import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';
import OnboardingOverlay from '../../components/generate/OnboardingOverlay';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { loadPostData, startNewConversation } from '@/features/chat/chatSlice';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const postId = searchParams.get('postId');
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId);
  const { currentStep, isOpen, nextStep, prevStep, closeOnboarding } = useOnboarding();

  useEffect(() => {
    const initializePage = async () => {
      // Skip if we don't have a postId
      if (!postId) {
        return;
      }

      // Clear any existing conversation state
      dispatch(startNewConversation());

      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }

        // Load post data using Redux thunk
        if (postId) {
          setCurrentPostId(postId);
          dispatch(loadPostData({ postId, token }));
        } else {
          // No postId provided - this shouldn't happen with the new flow
          toast.error('No post ID provided. Please start from the dashboard.', { position: 'top-right' });
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        if (error instanceof Error && !error.message.includes('conversation')) {
          toast.error('Failed to load post', { position: 'top-right' });
        }
      }
    };

    initializePage();
  }, [postId, getToken, dispatch, navigate]);

  return (
    <div className="h-full bg-white flex flex-col relative">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full overflow-hidden">
        {/* Chat Interface - 35% width */}
        <div className="w-[35%] p-4 h-full overflow-hidden">
          <ChatInterface postId={currentPostId || postId} />
        </div>

        {/* LinkedIn Preview - 65% width */}
        <div className="w-[65%] p-4 h-full overflow-auto">
          <LinkedInPreview />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full overflow-hidden">
        {mobileView === 'chat' ? (
          <div className="p-2 sm:p-4 h-full overflow-hidden">
            <ChatInterface
              postId={currentPostId || postId}
              onToggleView={() => setMobileView('preview')}
              showToggle={true}
            />
          </div>
        ) : (
          <div className="p-0 sm:p-4 h-full overflow-auto">
            <LinkedInPreview
              onToggleView={() => setMobileView('chat')}
              showToggle={true}
            />
          </div>
        )}
      </div>

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        currentStep={currentStep}
        isOpen={isOpen}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={closeOnboarding}
      />
    </div>
  );
}