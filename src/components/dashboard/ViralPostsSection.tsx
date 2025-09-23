import { useState, useEffect } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@clerk/react-router';
import TrendingPostsModal from './TrendingPostsModal';
import { API_CONFIG } from '@/shared/config/api';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

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
  post_url?: string;
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
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const { getToken } = useAuth();

  // Fetch AI posts only on initial mount or when topics actually change
  useEffect(() => {
    // Only fetch if we don't have posts yet
    if (previewPosts.length === 0) {
      fetchAIPosts();
    }
  }, []); // Remove topics dependency to prevent re-fetching

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

      // Use provided topics or default to startup content
      const searchQuery = topics || 'startup';

      const params = new URLSearchParams({
        q: searchQuery,
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
          content: post.content || post.hook || post.content_preview,
          content_preview: post.content_preview || post.hook || (post.content ? post.content.substring(0, 150) : ''),
          likes: post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes.toString(),
          comments: post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}K` : post.comments.toString(),
          views: post.likes ? `${(post.likes * 10 / 1000).toFixed(0)}K` : '0',
          author_title: post.author_title,
          time_posted: post.time_posted,
          post_url: post.post_url
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
      content: post.content || post.hook || post.content_preview,
      content_preview: post.content_preview || post.hook || (post.content ? post.content.substring(0, 150) : ''),
      likes: post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes.toString(),
      comments: post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}K` : post.comments.toString(),
      views: post.likes ? `${(post.likes * 10 / 1000).toFixed(0)}K` : '0',
      author_title: post.author_title,
      time_posted: post.time_posted,
      post_url: post.post_url
    }));
    setPreviewPosts(formattedPosts);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Trending in Your Topics
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

        <div className="columns-1 md:columns-2 gap-3 space-y-3">
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 break-inside-avoid mb-3"
              >
                <div className="animate-pulse">
                  <div className="flex gap-2 mb-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))
          ) : previewPosts.length > 0 ? (
            previewPosts.map((post: any) => {
              const isSelected = selectedPosts.some(p => p.id === post.id);
              const isExpanded = expandedPosts.has(post.id);
              // Check if content has line breaks or is long enough to need truncation
              const lines = post.content ? post.content.split('\n').length : 0;
              const needsExpansion = post.content && (post.content.length > 120 || lines > 3);

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
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 break-inside-avoid mb-3 cursor-pointer ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Post Header */}
                  <div className="p-3 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                          {post.title ? post.title.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'UN'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 cursor-pointer">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {post.time_posted || '2h'} • 🌐
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isSelected && (
                          <div className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded">
                            Selected
                          </div>
                        )}
                        {post.post_url && (
                          <a
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-0.5 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700 transition-colors"
                            title="View on LinkedIn"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-0.5 hover:bg-gray-100 rounded"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-3 pb-2">
                    <p className={`text-xs text-gray-900 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {post.content}
                    </p>
                    {needsExpansion && !isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPosts(prev => new Set(prev).add(post.id));
                        }}
                        className="text-gray-600 hover:underline font-medium text-xs"
                      >
                        see more
                      </button>
                    )}
                    {isExpanded && needsExpansion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPosts(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(post.id);
                            return newSet;
                          });
                        }}
                        className="text-gray-600 hover:underline font-medium text-xs mt-1"
                      >
                        see less
                      </button>
                    )}
                  </div>

                  {/* Engagement Stats */}
                  <div className="px-3 py-2 flex items-center text-xs text-gray-500 border-t">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <ThumbIcon className="w-3.5 h-3.5" />
                        <HeartIcon className="w-3.5 h-3.5" />
                        <ClapIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="ml-1">{post.likes}</span>
                    </div>
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