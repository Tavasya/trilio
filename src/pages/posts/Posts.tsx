import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserPosts, selectShouldFetchPosts, deletePost, setFilter } from '@/features/post/postSlice';
import type { Post } from '@/features/post/postTypes';

import { useAuth } from '@clerk/react-router';
import { Link, useNavigate } from 'react-router';

import { ThumbsUp, MessageSquare, Repeat2, Send, Edit, Trash2 } from 'lucide-react';

import { useUser } from '@clerk/react-router';
import { Button } from '@/components/ui/button';
import { LogoLoader } from '@/components/ui/logo-loader';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

export default function Posts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { posts, isLoading, filter } = useAppSelector(state => state.post);
  const shouldFetch = useAppSelector(selectShouldFetchPosts);
  const [expandedPosts, setExpandedPosts] = React.useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<string | null>(null);

  const getPostStatus = (post: Post) => {
    if (post.linkedin_post_id && post.linkedin_post_url) {
      return 'published';
    }
    if (post.scheduled_for) {
      return 'scheduled';
    }
    return 'draft';
  };

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter(post => getPostStatus(post) === filter);
  }, [posts, filter]);

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

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMs < 0) {
      return 'Past due';
    }

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `in ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `in ${diffInHours}h`;
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else if (diffInDays < 7) {
      return `in ${diffInDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  };

  const handleEditPost = (postId: string) => {
    navigate(`/generate?postId=${postId}`);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    const token = await getToken();
    if (token) {
      dispatch(deletePost({ postId: postToDelete, token }));
    }
    setPostToDelete(null);
    setDeleteDialogOpen(false);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <LogoLoader size="lg" text="Loading your posts..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 max-w-2xl mx-auto">
          <Button
            onClick={() => dispatch(setFilter('all'))}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
          >
            All
          </Button>
          <Button
            onClick={() => dispatch(setFilter('published'))}
            variant={filter === 'published' ? 'default' : 'outline'}
            size="sm"
          >
            Published
          </Button>
          <Button
            onClick={() => dispatch(setFilter('scheduled'))}
            variant={filter === 'scheduled' ? 'default' : 'outline'}
            size="sm"
          >
            Scheduled
          </Button>
          <Button
            onClick={() => dispatch(setFilter('draft'))}
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
          >
            Draft
          </Button>
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 max-w-2xl mx-auto">
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
              to="/dashboard"
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-left text-gray-500 text-sm font-medium"
            >
              Start a post
            </Link>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {posts.length === 0 ? 'No posts yet' : `No ${filter} posts`}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {posts.length === 0
                  ? 'Start building your LinkedIn presence by creating your first post.'
                  : `You don't have any ${filter} posts yet.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
            {filteredPosts.map((post) => {
              const MAX_CONTENT_LENGTH = 280;
              const truncatedContent = post.content.length > MAX_CONTENT_LENGTH
                ? post.content.substring(0, MAX_CONTENT_LENGTH)
                : post.content;
              const showFullContent = expandedPosts.has(post.id);

              return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col self-start"
              >
                {/* Status Badge - Removed */}

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
                          {getPostStatus(post) === 'scheduled' ? (
                            <>
                              <span className="text-blue-600 font-medium">Scheduled</span> • {formatScheduledDate(post.scheduled_for!)} • {post.timezone}
                            </>
                          ) : getPostStatus(post) === 'published' ? (
                            <>
                              <span className="text-green-600 font-medium">Published</span> • {formatDate(post.created_at)} • {post.visibility === 'PUBLIC' ? '🌐' : '👥'}
                            </>
                          ) : (
                            <>
                              <span className="text-amber-600 font-medium">Draft</span> • {formatDate(post.created_at)} • {post.visibility === 'PUBLIC' ? '🌐' : '👥'}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.linkedin_post_url && (
                        <a
                          href={post.linkedin_post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700 transition-colors"
                          title="View on LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      <Button
                        onClick={() => handleEditPost(post.id)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(post.id)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {showFullContent ? post.content : truncatedContent}
                    {post.content.length > MAX_CONTENT_LENGTH && !showFullContent && (
                      <>
                        {'... '}
                        <button
                          onClick={() => setExpandedPosts(prev => new Set(prev).add(post.id))}
                          className="text-gray-600 hover:underline font-medium"
                        >
                          see more
                        </button>
                      </>
                    )}
                    {showFullContent && post.content.length > MAX_CONTENT_LENGTH && (
                      <button
                        onClick={() => setExpandedPosts(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(post.id);
                          return newSet;
                        })}
                        className="block text-gray-600 hover:underline font-medium mt-2"
                      >
                        see less
                      </button>
                    )}
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
                      <ThumbIcon className="w-4 h-4" />
                      <HeartIcon className="w-4 h-4" />
                      <ClapIcon className="w-4 h-4" />
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

                {/* Resume Writing Button - Removed */}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemType="post"
      />
    </div>
  );
}