import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserPosts, selectShouldFetchPosts, setCurrentPost } from '@/features/post/postSlice';
import { useAuth } from '@clerk/react-router';
import { Link, useNavigate } from 'react-router';
import { MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Send, PenLine, Heart, Lightbulb, Edit } from 'lucide-react';
import { useUser } from '@clerk/react-router';
import { Button } from '@/components/ui/button';

export default function Posts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { posts, isLoading } = useAppSelector(state => state.post);
  const shouldFetch = useAppSelector(selectShouldFetchPosts);

  useEffect(() => {
    const loadPosts = async () => {
      if (shouldFetch) {
        const token = await getToken();
        if (token) {
          dispatch(fetchUserPosts(token));
        }
      }
    };
    loadPosts();
  }, [dispatch, getToken, shouldFetch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInHours < 48) {
      return '1d';
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return `${Math.floor(diffInHours / 168)}w`;
    }
  };

  const handleResumeWriting = (post: any) => {
    dispatch(setCurrentPost({
      content: post.content,
      media_url: post.media_url,
      visibility: post.visibility
    }));
    navigate('/generate');
  };

  const handleEditPost = (postId: string) => {
    navigate(`/generate?postId=${postId}`);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f3f2ef]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500">Loading your content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f3f2ef] overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
          <div className="flex gap-3">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <Link
              to="/create-post"
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-left text-gray-500 text-sm font-medium"
            >
              Start a post
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Start building your LinkedIn presence by creating your first post.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative"
              >
                {/* Draft Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    DRAFT
                  </span>
                </div>

                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">Product Manager | Tech Enthusiast</p>
                        <p className="text-xs text-gray-500">
                          <span className="text-amber-600 font-medium">Draft</span> • {formatDate(post.created_at)} • {post.visibility === 'PUBLIC' ? '🌐' : '👥'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEditPost(post.id)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {post.media_url && (
                    <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                      <a
                        href={post.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {new URL(post.media_url).hostname}
                      </a>
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-3 h-3 text-white fill-white" />
                      </div>
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-3 h-3 text-white fill-white" />
                      </div>
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white fill-white" />
                      </div>
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
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                    <Repeat2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Repost</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                    <Send className="w-5 h-5" />
                    <span className="text-sm font-medium">Send</span>
                  </button>
                </div>

                {/* Resume Writing Button */}
                <div className="px-4 pb-3 border-t border-gray-100">
                  <button
                    onClick={() => handleResumeWriting(post)}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                    <span className="text-sm font-semibold">Edit Draft</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}