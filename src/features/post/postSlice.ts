import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import type { LinkedInPost, LinkedInPostResponse, PostState } from './postTypes';
import { API_CONFIG } from '@/shared/config/api';

const initialState: PostState = {
  currentPost: null,
  isLoading: false,
  error: null,
  lastPostId: null,
};

// Async thunk for publishing to LinkedIn
export const publishToLinkedIn = createAsyncThunk<LinkedInPostResponse, { post: LinkedInPost; token: string }>(
  'post/publishToLinkedIn',
  async ({ post, token }) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/linkedin/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to publish to LinkedIn');
    }

    return data;
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
  },
  extraReducers: (builder) => {
    builder
      // Publish to LinkedIn
      .addCase(publishToLinkedIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishToLinkedIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastPostId = action.payload.post_id || null;
        state.currentPost = null;
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
} = postSlice.actions;

export default postSlice.reducer;