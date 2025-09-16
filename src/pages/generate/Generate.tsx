import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { setGeneratedPost, loadConversationHistory } from '@/features/chat/chatSlice';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const postId = searchParams.get('postId');

  useEffect(() => {
    const fetchPostAndConversation = async () => {
      if (!postId) return;

      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }

        // Fetch post data
        const response = await postService.fetchPostById(postId, token);
        if (response.success && response.post) {
          // Set the full post content in the Redux state
          dispatch(setGeneratedPost({
            id: response.post.id,
            content: response.post.content || '',  // Ensure content is never undefined
            isEdited: false
          }));
        }

        // Fetch conversation history for this post
        await dispatch(loadConversationHistory({ postId, token })).unwrap();
      } catch (error) {
        console.error('Failed to fetch post or conversation:', error);
        // Only show error for post fetch failure, conversation might not exist
        if (error instanceof Error && !error.message.includes('conversation')) {
          toast.error('Failed to load post', { position: 'top-right' });
        }
      }
    };

    fetchPostAndConversation();
  }, [postId, getToken, dispatch]);

  return (
    <div className="h-full bg-gray-50 flex overflow-hidden">
      {/* Chat Interface - 3/5 width */}
      <div className="w-3/5 p-4 h-full overflow-hidden">
        <ChatInterface postId={postId} />
      </div>

      {/* LinkedIn Preview - 2/5 width */}
      <div className="w-2/5 p-4 h-full overflow-auto">
        <LinkedInPreview />
      </div>
    </div>
  );
}