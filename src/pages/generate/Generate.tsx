import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { setGeneratedPost, loadConversationHistory, startNewConversation } from '@/features/chat/chatSlice';
import { LogoLoader } from '@/components/ui/logo-loader';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const postId = searchParams.get('postId');
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId);

  useEffect(() => {
    const initializePage = async () => {
      // Skip if we don't have a postId
      if (!postId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Clear any existing conversation state
      dispatch(startNewConversation());

      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          setIsLoading(false);
          return;
        }

        // Handle post loading (always expect a postId now)
        if (postId) {
          setCurrentPostId(postId);

          // Fetch post data
          const response = await postService.fetchPostById(postId, token);
          if (response.success && response.post) {
            dispatch(setGeneratedPost({
              id: response.post.id,
              content: response.post.content || '',
              isEdited: false
            }));
          }

          // Fetch conversation history for this post
          try {
            await dispatch(loadConversationHistory({ postId, token })).unwrap();
          } catch (error) {
            // Conversation might not exist yet, which is fine
            console.log('No conversation history found');
          }
        } else {
          // No postId provided - this shouldn't happen with the new flow
          toast.error('No post ID provided. Please start from the dashboard.', { position: 'top-right' });
          navigate('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
        if (error instanceof Error && !error.message.includes('conversation')) {
          toast.error('Failed to load post', { position: 'top-right' });
        }
        setIsLoading(false);
      }
    };

    initializePage();
  }, [postId, getToken, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <LogoLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full overflow-hidden">
        {/* Chat Interface - 50% width */}
        <div className="w-1/2 p-4 h-full overflow-hidden">
          <ChatInterface postId={currentPostId || postId} />
        </div>

        {/* LinkedIn Preview - 50% width */}
        <div className="w-1/2 p-4 h-full overflow-auto">
          <LinkedInPreview />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full overflow-hidden">
        {mobileView === 'chat' ? (
          <div className="p-4 h-full overflow-hidden">
            <ChatInterface
              postId={currentPostId || postId}
              onToggleView={() => setMobileView('preview')}
              showToggle={true}
            />
          </div>
        ) : (
          <div className="p-4 h-full overflow-auto">
            <LinkedInPreview
              onToggleView={() => setMobileView('chat')}
              showToggle={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}