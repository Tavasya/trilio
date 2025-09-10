import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserPosts, selectShouldFetchPosts } from '@/features/post/postSlice';
import { useAuth } from '@clerk/react-router';
import { Link } from 'react-router';
import { Clock, Globe, Users, ExternalLink, PlusCircle } from 'lucide-react';

export default function Posts() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 280) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Posts</h1>
          <Link
            to="/create-post"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any posts yet.
            </p>
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.visibility === 'PUBLIC' ? (
                      <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                        <Globe className="w-4 h-4" />
                        <span>Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Users className="w-4 h-4" />
                        <span>Connections</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                  {truncateContent(post.content)}
                </p>

                {post.media_url && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <a
                      href={post.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-2 break-all"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      {post.media_url}
                    </a>
                  </div>
                )}

                {post.linkedin_post_url && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={post.linkedin_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      View on LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}