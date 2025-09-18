import { useState, useEffect, useCallback } from 'react';
import { X, Search, Filter, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { debounce } from 'lodash';
import { API_CONFIG } from '@/shared/config/api';
import { toast } from 'sonner';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

interface SearchPost {
  id: string;
  author_name: string;
  author_title: string;
  hook: string;
  content: string;
  content_preview: string;
  likes: number;
  comments: number;
  time_posted: string;
  post_url: string;
  hashtags?: string[];
}

interface SearchResponse {
  success: boolean;
  query: string;
  total_results: number;
  page: number;
  per_page: number;
  has_more: boolean;
  posts: SearchPost[];
}

type SortOption = 'relevance' | 'likes' | 'date' | 'date_desc';

interface TrendingPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  getToken: () => Promise<string | null>;
  onSave?: (selectedPosts: SearchPost[]) => void;
  initialSelections?: string[];
}

export default function TrendingPostsModal({
  isOpen,
  onClose,
  initialQuery = '',
  getToken,
  onSave,
  initialSelections = []
}: TrendingPostsModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [minLikes, setMinLikes] = useState('100');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [selectedPosts, setSelectedPosts] = useState<Map<string, SearchPost>>(new Map());
  const [showPreview, setShowPreview] = useState(false);

  // Update search query when modal opens with new initial query
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setSearchQuery(initialQuery);
      }
      // Reset state when modal opens
      setResults([]);
      setCurrentOffset(0);
      setExpandedPosts(new Set());
      // Initialize selected posts from initialSelections if provided
      if (initialSelections.length > 0) {
        // You could fetch these posts by ID if needed
      }
      // Trigger initial search
      if (initialQuery) {
        searchPosts(initialQuery, 0);
      }
    }
  }, [isOpen, initialQuery]);

  const searchPosts = async (query: string, offset: number = 0, append: boolean = false) => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const params = new URLSearchParams({
        q: query,
        limit: '20',
        offset: offset.toString(),
        sort_by: sortBy,
        ...(minLikes && { min_likes: minLikes }),
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/search/posts?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      if (data.success) {
        if (append) {
          setResults(prev => [...prev, ...data.posts]);
        } else {
          setResults(data.posts);
        }
        setHasMore(data.has_more);
        setTotalResults(data.total_results);
        setCurrentOffset(offset);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search posts');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchPosts(query, 0);
    }, 500),
    [sortBy, minLikes]
  );

  useEffect(() => {
    if (searchQuery && isOpen) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, sortBy, minLikes]);

  const handleLoadMore = () => {
    const newOffset = currentOffset + 20;
    searchPosts(searchQuery, newOffset, true);
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const togglePostSelection = (post: SearchPost) => {
    setSelectedPosts(prev => {
      const newMap = new Map(prev);
      if (newMap.has(post.id)) {
        newMap.delete(post.id);
      } else {
        newMap.set(post.id, post);
      }
      return newMap;
    });
  };

  const handleSave = () => {
    const selected = Array.from(selectedPosts.values());
    if (selected.length === 0) {
      toast.error('Please select at least one post');
      return;
    }
    if (onSave) {
      onSave(selected);
    }
    onClose();
  };

  if (!isOpen) return null;

  const selectedPostsArray = Array.from(selectedPosts.values());

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending LinkedIn Posts</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Select posts for inspiration or reference
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-4 sm:px-6 py-2 sm:py-3 border-b flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            <Filter className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="likes">Most Liked</option>
            <option value="relevance">Most Relevant</option>
            <option value="date_desc">Newest First</option>
            <option value="date">Oldest First</option>
          </select>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 border rounded-lg transition-colors text-xs sm:text-sm ${
              showPreview ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>

          {totalResults > 0 && (
            <span className="text-xs sm:text-sm text-gray-600 ml-auto">
              {totalResults.toLocaleString()} results
            </span>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-gray-600">Min Likes</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minLikes}
                  onChange={(e) => setMinLikes(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-200 rounded text-sm ml-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Area - Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Results */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${showPreview && 'sm:border-r'} ${showPreview && 'hidden sm:block'}`}>
            {/* Results */}
            <div className="space-y-4">
              {results.map((post) => {
                const isExpanded = expandedPosts.has(post.id);
                const isSelected = selectedPosts.has(post.id);
                return (
                  <div
                    key={post.id}
                    onClick={() => togglePostSelection(post)}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden relative flex flex-col transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                    }`}
                  >
                    {/* Post Header */}
                    <div className="p-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                            {post.author_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                              {post.author_name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {post.time_posted} • 🌐
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div className="px-3 py-1 bg-primary text-white text-sm font-medium rounded">
                              Selected
                            </div>
                          )}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-4 pb-3">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {isExpanded ? (
                          post.content || post.hook
                        ) : (
                          post.content_preview || post.hook || post.content.substring(0, 280)
                        )}
                        {post.content && post.content.length > 280 && !isExpanded && (
                          <>
                            {'... '}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePostExpansion(post.id);
                              }}
                              className="text-gray-600 hover:underline font-medium"
                            >
                              see more
                            </button>
                          </>
                        )}
                        {isExpanded && post.content && post.content.length > 280 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePostExpansion(post.id);
                            }}
                            className="block text-gray-600 hover:underline font-medium mt-2"
                          >
                            see less
                          </button>
                        )}
                      </p>
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs text-blue-600 hover:underline cursor-pointer"
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Engagement Stats */}
                    <div className="px-4 py-3 flex items-center text-xs text-gray-500 border-t">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <ThumbIcon className="w-4 h-4" />
                          <HeartIcon className="w-4 h-4" />
                          <ClapIcon className="w-4 h-4" />
                        </div>
                        <span className="ml-1">{post.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {searchQuery && !isLoading && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-2">Try different keywords or adjust your filters</p>
              </div>
            )}

            {/* Initial State */}
            {!searchQuery && !isLoading && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Search for trending LinkedIn posts</p>
                <p className="text-sm text-gray-400 mt-2">Posts are automatically filtered by your topics</p>
              </div>
            )}

            {/* Load More */}
            {hasMore && !isLoading && results.length > 0 && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && results.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
                <p className="text-gray-500 mt-4">Searching for posts...</p>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-full sm:w-96 overflow-y-auto p-4 sm:p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">
                Selected Posts ({selectedPostsArray.length})
              </h3>

              {selectedPostsArray.length === 0 ? (
                <p className="text-sm text-gray-500">No posts selected yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedPostsArray.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      {/* Mini Post Header */}
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                              {post.author_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{post.author_name}</p>
                              <p className="text-xs text-gray-500">{post.time_posted}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => togglePostSelection(post)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                          {post.content_preview || post.hook || post.content.substring(0, 100)}
                        </p>
                      </div>
                      {/* Mini Stats */}
                      <div className="px-3 py-1.5 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            <ThumbIcon className="w-3 h-3" />
                            <HeartIcon className="w-3 h-3" />
                          </div>
                          <span className="ml-1">{post.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {selectedPostsArray.length > 0 ? (
                <span>
                  {selectedPostsArray.length} post{selectedPostsArray.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>Select posts for inspiration</span>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedPostsArray.length === 0}
                className={`flex-1 sm:flex-none ${selectedPostsArray.length === 0 ? 'opacity-50' : ''}`}
              >
                <span className="hidden sm:inline">Use Selected Posts</span>
                <span className="sm:hidden">Use Selected</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}