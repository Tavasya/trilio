import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const postId = searchParams.get('postId');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          return;
        }

        const response = await postService.fetchPostById(postId, token);
        if (response.success && response.post) {
          setGeneratedPosts([{
            id: response.post.id,
            content: response.post.content
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to load post', { position: 'top-right' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, getToken]);

  return (
    <div className="h-full bg-gray-50 flex overflow-hidden">
      {/* Chat Interface - 3/5 width */}
      <div className="w-3/5 p-4 h-full overflow-hidden">
        <ChatInterface postId={postId} />
      </div>

      {/* LinkedIn Preview - 2/5 width */}
      <div className="w-2/5 p-4 h-full overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>
        ) : (
          <LinkedInPreview posts={generatedPosts.length > 0 ? generatedPosts : undefined} />
        )}
      </div>
    </div>
  );
}