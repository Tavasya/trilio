import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { API_CONFIG } from '@/shared/config/api';
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
  facets?: {
    top_authors: Array<{ name: string; count: number }>;
    engagement_ranges: Record<string, number>;
  };
}

type SortOption = 'relevance' | 'likes' | 'date' | 'date_desc';

const Research = () => {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [minLikes, setMinLikes] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

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

      const url = `${API_CONFIG.BASE_URL}/api/search/posts?${params}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        await response.text();
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
      } else {
        toast.error('Search returned no results');
      }
    } catch (error) {
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
    if (searchQuery) {
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

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Research LinkedIn Posts
          </h1>
          <p className="text-sm text-gray-600">Search through 20,000+ viral LinkedIn posts</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts... (e.g., AI startup, leadership, remote work)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
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
            <option value="relevance">Most Relevant</option>
            <option value="likes">Most Liked</option>
            <option value="date_desc">Newest First</option>
            <option value="date">Oldest First</option>
          </select>

          {totalResults > 0 && (
            <span className="text-sm text-gray-600">
              {totalResults.toLocaleString()} results
            </span>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-gray-600">Min Likes</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minLikes}
                  onChange={(e) => setMinLikes(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((post) => {
            const isExpanded = expandedPosts.has(post.id);
            return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
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
                    <div className="flex items-center gap-1">
                      {post.post_url && (
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700 transition-colors"
                          title="View on LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded">
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
                          onClick={() => togglePostExpansion(post.id)}
                          className="text-gray-600 hover:underline font-medium"
                        >
                          see more
                        </button>
                      </>
                    )}
                    {isExpanded && post.content && post.content.length > 280 && (
                      <button
                        onClick={() => togglePostExpansion(post.id)}
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
        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Start typing to search LinkedIn posts</p>
            <p className="text-sm text-gray-400 mt-2">Try searching for topics like "AI", "leadership", or "startup"</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading More State */}
        {isLoading && results.length > 0 && (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;