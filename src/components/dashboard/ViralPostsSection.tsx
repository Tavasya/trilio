import { useState, useEffect } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { useAuth } from '@clerk/react-router';
import TrendingPostsModal from './TrendingPostsModal';
import { API_CONFIG } from '@/shared/config/api';

interface ViralPost {
  id: string;
  title?: string;
  content?: string;
  author_name?: string;
  author_title?: string;
  hook?: string;
  content_preview?: string;
  likes?: number | string;
  comments?: number | string;
  views?: string;
  time_posted?: string;
}

interface ViralPostsSectionProps {
  posts?: ViralPost[];
  topics?: string;
  onSelectionChange?: (posts: ViralPost[]) => void;
}

export default function ViralPostsSection({ topics = '', onSelectionChange }: ViralPostsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [previewPosts, setPreviewPosts] = useState<ViralPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  // Fetch AI posts on component mount
  useEffect(() => {
    fetchAIPosts();
  }, []);

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange?.(selectedPosts);
  }, [selectedPosts, onSelectionChange]);

  const fetchAIPosts = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No auth token available');
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams({
        q: 'recruiting',
        limit: '4',
        sort_by: 'likes'
      });

      const url = `${API_CONFIG.BASE_URL}/api/search/posts?${params}`;
      console.log('Fetching trending posts from:', url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch posts - Status:', response.status, 'StatusText:', response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.success && data.posts && data.posts.length > 0) {
        // Format posts for display
        const formattedPosts = data.posts.slice(0, 4).map((post: any) => ({
          id: post.id,
          title: post.author_name,
          content: post.hook || post.content_preview,
          likes: post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes.toString(),
          comments: post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}K` : post.comments.toString(),
          views: post.likes ? `${(post.likes * 10 / 1000).toFixed(0)}K` : '0',
          author_title: post.author_title,
          time_posted: post.time_posted
        }));

        console.log('Formatted posts:', formattedPosts);
        setPreviewPosts(formattedPosts);
      } else {
        console.log('No posts returned or success=false. Data:', data);
      }
    } catch (error) {
      console.error('Failed to fetch AI posts - Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Convert topics to search query
  const getSearchQuery = () => {
    if (!topics) return 'AI';
    return topics.split(',').map(t => t.trim()).filter(t => t).join(' ');
  };

  const handleSaveSelectedPosts = (posts: any[]) => {
    setSelectedPosts(posts);
    // Update preview with selected posts
    const formattedPosts = posts.slice(0, 4).map(post => ({
      id: post.id,
      title: post.author_name,
      content: post.hook || post.content_preview,
      likes: post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes.toString(),
      comments: post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}K` : post.comments.toString(),
      views: post.likes ? `${(post.likes * 10 / 1000).toFixed(0)}K` : '0'
    }));
    setPreviewPosts(formattedPosts);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Trending in Your Topics <span className="text-red-500">*</span>
            </h2>
            {selectedPosts.length > 0 && (
              <p className="text-xs text-primary mt-0.5">
                {selectedPosts.length} posts selected for inspiration
              </p>
            )}
          </div>
          <button
            onClick={handleOpenModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-3"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="flex gap-3">
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))
          ) : previewPosts.length > 0 ? (
            previewPosts.map((post: any) => {
              const isSelected = selectedPosts.some(p => p.id === post.id);
              return (
                <div
                  key={post.id}
                  onClick={() => {
                    if (!isSelected) {
                      setSelectedPosts([...selectedPosts, post]);
                    } else {
                      setSelectedPosts(selectedPosts.filter(p => p.id !== post.id));
                    }
                  }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-3 hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isSelected ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-800'
                    }`}>
                      {isSelected ? 'Selected' : 'Trending'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-gray-900 mb-1.5 pr-12 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback if no posts found
            <div className="col-span-2 text-center py-8 text-gray-500">
              <p className="text-sm">No trending posts available</p>
            </div>
          )}
        </div>
      </div>

      {/* Trending Posts Modal */}
      <TrendingPostsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuery={getSearchQuery()}
        getToken={getToken}
        onSave={handleSaveSelectedPosts}
        initialSelections={selectedPosts.map(p => p.id)}
      />
    </>
  );
}