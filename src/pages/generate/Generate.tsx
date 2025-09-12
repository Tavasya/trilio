import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setGeneratedPost } from '@/features/chat/chatSlice';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const postId = searchParams.get('postId');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }

        const response = await postService.fetchPostById(postId, token);
        if (response.success && response.post) {
          dispatch(setGeneratedPost({
            id: response.post.id,
            content: response.post.content,
            isEdited: false
          }));
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to load post', { position: 'top-right' });
      }
    };

    fetchPost();
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