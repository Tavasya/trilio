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
  const isNew = searchParams.get('new') === 'true';
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId);

  useEffect(() => {
    const initializePage = async () => {
      // Skip if we already have a currentPostId set (to avoid re-running after navigation)
      if (!isNew && !postId) {
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

        // Handle new draft creation from dashboard
        if (isNew && !postId) {
          // Check if draft was already saved in background
          let savedPostId = sessionStorage.getItem('savedPostId');

          if (savedPostId) {
            // Draft already saved! Just use it
            sessionStorage.removeItem('savedPostId');
            sessionStorage.removeItem('pendingDraft');
            sessionStorage.removeItem('pendingToken');

            setCurrentPostId(savedPostId);
            navigate(`/generate?postId=${savedPostId}`, { replace: true });
            return;
          }

          // Draft might still be saving, wait for it
          const pendingDraftData = sessionStorage.getItem('pendingDraft');
          if (pendingDraftData) {
            const draftData = JSON.parse(pendingDraftData);

            // Poll for saved post ID (the background save might complete any moment)
            let pollCount = 0;
            const pollInterval = setInterval(() => {
              savedPostId = sessionStorage.getItem('savedPostId');
              pollCount++;

              if (savedPostId) {
                // Found it! Use the saved post
                clearInterval(pollInterval);
                sessionStorage.removeItem('savedPostId');
                sessionStorage.removeItem('pendingDraft');
                sessionStorage.removeItem('pendingToken');

                setCurrentPostId(savedPostId);

                // Set initial post state
                dispatch(setGeneratedPost({
                  id: savedPostId,
                  content: draftData.content || '',
                  isEdited: false
                }));

                navigate(`/generate?postId=${savedPostId}`, { replace: true });
              } else if (pollCount > 20) { // After 2 seconds, save it ourselves
                clearInterval(pollInterval);

                // Background save didn't complete, do it now
                postService.saveDraft(draftData, token).then(response => {
                  if (response.post_id) {
                    sessionStorage.removeItem('pendingDraft');
                    sessionStorage.removeItem('pendingToken');

                    setCurrentPostId(response.post_id);

                    dispatch(setGeneratedPost({
                      id: response.post_id,
                      content: draftData.content || '',
                      isEdited: false
                    }));

                    navigate(`/generate?postId=${response.post_id}`, { replace: true });
                  }
                }).catch(error => {
                  console.error('Failed to create draft:', error);
                  toast.error('Failed to create draft', { position: 'top-right' });
                  setIsLoading(false);
                });
              }
            }, 100); // Check every 100ms

            return; // Don't set loading false yet
          }
        }
        // Handle existing post loading
        else if (postId) {
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
  }, [postId, isNew, getToken, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <LogoLoader size="lg" text="Setting up your workspace..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
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