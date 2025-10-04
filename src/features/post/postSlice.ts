import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import type { LinkedInPost, LinkedInPostResponse, PostState, FetchPostsResponse, SchedulePostRequest, SchedulePostResponse } from './postTypes';

import { postService } from './postService';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: PostState = {
  currentPost: null,
  posts: [],
  lastFetched: null,
  isLoading: false,
  error: null,
  lastPostId: null,
  filter: 'all',
};

// Async thunk for fetching user posts
export const fetchUserPosts = createAsyncThunk<FetchPostsResponse, string>(
  'post/fetchUserPosts',
  async (token: string) => {
    return await postService.fetchUserPosts(token);
  }
);

// Async thunk for publishing to LinkedIn
export const publishToLinkedIn = createAsyncThunk<LinkedInPostResponse, { post: LinkedInPost; token: string }>(
  'post/publishToLinkedIn',
  async ({ post, token }) => {
    return await postService.publishToLinkedIn(post, token);
  }
);

// Async thunk for scheduling a post
export const schedulePost = createAsyncThunk<SchedulePostResponse, { scheduleData: SchedulePostRequest; token: string }>(
  'post/schedulePost',
  async ({ scheduleData, token }) => {
    return await postService.schedulePost(scheduleData, token);
  }
);

// Async thunk for updating/rescheduling a scheduled post
export const updateScheduledPost = createAsyncThunk<SchedulePostResponse, { postId: string; updateData: Partial<SchedulePostRequest>; token: string }>(
  'post/updateScheduledPost',
  async ({ postId, updateData, token }) => {
    return await postService.updateScheduledPost(postId, updateData, token);
  }
);

// Async thunk for deleting any post (universal delete)
export const deletePost = createAsyncThunk<{ success: boolean; postId: string }, { postId: string; token: string }>(
  'post/deletePost',
  async ({ postId, token }) => {
    const result = await postService.deletePost(postId, token);
    return { ...result, postId };
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<LinkedInPost>) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updateCurrentPost: (state, action: PayloadAction<Partial<LinkedInPost>>) => {
      if (state.currentPost) {
        state.currentPost = { ...state.currentPost, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPostsCache: (state) => {
      state.posts = [];
      state.lastFetched = null;
    },
    setFilter: (state, action: PayloadAction<'all' | 'published' | 'scheduled' | 'draft'>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts';
        toast.error('Failed to load posts');
      })
      // Publish to LinkedIn
      .addCase(publishToLinkedIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishToLinkedIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastPostId = action.payload.post_id || null;
        state.currentPost = null;
        
        // Add the new post to the posts array if it exists
        if (action.payload.post) {
          state.posts.unshift(action.payload.post);
        }
        
        toast.success('Successfully published to LinkedIn!');
      })
      .addCase(publishToLinkedIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to publish to LinkedIn';
        toast.error(action.error.message || 'Failed to publish to LinkedIn');
      })
      // Schedule post
      .addCase(schedulePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(schedulePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = null;

        // Add the scheduled post to the posts array
        if (action.payload.post) {
          state.posts.unshift(action.payload.post);
        }

        toast.success('Post scheduled successfully!');
      })
      .addCase(schedulePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to schedule post';
        toast.error(action.error.message || 'Failed to schedule post');
      })
      // Update scheduled post
      .addCase(updateScheduledPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateScheduledPost.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update the post in the posts array
        if (action.payload.post) {
          const index = state.posts.findIndex(p => p.id === action.payload.post!.id);
          if (index !== -1) {
            state.posts[index] = action.payload.post;
          }
        }

        toast.success('Post rescheduled successfully!');
      })
      .addCase(updateScheduledPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to reschedule post';
        toast.error(action.error.message || 'Failed to reschedule post');
      })
      // Delete post (universal)
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;

        // Remove the post from the posts array
        state.posts = state.posts.filter(p => p.id !== action.payload.postId);

        toast.success('Post deleted successfully!');
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete post';
        toast.error(action.error.message || 'Failed to delete post');
      });
  },
});

export const {
  setCurrentPost,
  clearCurrentPost,
  updateCurrentPost,
  clearError,
  clearPostsCache,
  setFilter,
} = postSlice.actions;

// Selector to check if cache is stale
export const selectShouldFetchPosts = (state: { post: PostState }) => {
  const { posts, lastFetched } = state.post;
  if (!posts.length || !lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default postSlice.reducer;