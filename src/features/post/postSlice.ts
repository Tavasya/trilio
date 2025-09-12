import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import type { LinkedInPost, LinkedInPostResponse, PostState, FetchPostsResponse, Post } from './postTypes';
import { postService } from './postService';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: PostState = {
  currentPost: null,
  posts: [],
  lastFetched: null,
  isLoading: false,
  error: null,
  lastPostId: null,
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
      });
  },
});

export const {
  setCurrentPost,
  clearCurrentPost,
  updateCurrentPost,
  clearError,
  clearPostsCache,
} = postSlice.actions;

// Selector to check if cache is stale
export const selectShouldFetchPosts = (state: { post: PostState }) => {
  const { posts, lastFetched } = state.post;
  if (!posts.length || !lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default postSlice.reducer;