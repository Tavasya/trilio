import { useState, useEffect, useCallback } from 'react';
import { X, Search, Filter, Heart, MessageCircle, ChevronDown, Loader2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { debounce } from 'lodash';
import { API_CONFIG } from '@/shared/config/api';
import { toast } from 'sonner';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending LinkedIn Posts</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select posts for inspiration or reference
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="px-6 py-3 border-b flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="likes">Most Liked</option>
            <option value="relevance">Most Relevant</option>
            <option value="date_desc">Newest First</option>
            <option value="date">Oldest First</option>
          </select>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors text-sm ${
              showPreview ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            Preview ({selectedPostsArray.length})
          </button>

          {totalResults > 0 && (
            <span className="text-sm text-gray-600 ml-auto">
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
          <div className={`flex-1 overflow-y-auto p-6 ${showPreview ? 'border-r' : ''}`}>
            {/* Results */}
            <div className="space-y-4">
              {results.map((post) => {
                const isExpanded = expandedPosts.has(post.id);
                const isSelected = selectedPosts.has(post.id);
                return (
                  <div
                    key={post.id}
                    className={`relative bg-gray-50 rounded-xl border-2 p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:shadow-md'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => togglePostSelection(post)}
                      className={`absolute top-4 right-4 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Author Info */}
                    <div className="flex items-start justify-between mb-3 pr-8">
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author_name}</h3>
                        <p className="text-xs text-gray-500">{post.author_title}</p>
                      </div>
                      <span className="text-xs text-gray-500">{post.time_posted}</span>
                    </div>

                    {/* Hook */}
                    {post.hook && (
                      <p className="font-medium text-gray-800 mb-3">{post.hook}</p>
                    )}

                    {/* Content */}
                    <div className="text-sm text-gray-700 mb-3">
                      {isExpanded ? (
                        <div className="whitespace-pre-wrap">{post.content}</div>
                      ) : (
                        <p>{post.content_preview}</p>
                      )}
                      {post.content && post.content.length > post.content_preview.length && (
                        <button
                          onClick={() => togglePostExpansion(post.id)}
                          className="text-primary hover:text-primary/80 font-medium mt-2 flex items-center gap-1"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-primary bg-primary/10 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                      {post.post_url && (
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-primary hover:text-primary/80"
                        >
                          View on LinkedIn →
                        </a>
                      )}
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
            <div className="w-96 overflow-y-auto p-6 bg-gray-50">
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
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{post.author_name}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{post.hook || post.content_preview}</p>
                        </div>
                        <button
                          onClick={() => togglePostSelection(post)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedPostsArray.length > 0 ? (
                <span>
                  {selectedPostsArray.length} post{selectedPostsArray.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>Select posts for inspiration</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedPostsArray.length === 0}
                className={selectedPostsArray.length === 0 ? 'opacity-50' : ''}
              >
                Use Selected Posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}