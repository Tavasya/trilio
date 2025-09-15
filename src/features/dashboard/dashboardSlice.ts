import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type PostLength = 'short' | 'medium' | 'long';

export interface TrendingPost {
  id: string;
  author_name?: string;
  author_title?: string;
  hook?: string;
  content_preview?: string;
  content?: string;
  likes?: number | string;
  comments?: number | string;
  views?: string;
  time_posted?: string;
}

interface DashboardState {
  content: string;
  identity: string;  // Changed to single string
  contentTopics: string[];
  writingStyle: string;  // Changed to single string
  postLength: PostLength;
  trendingPosts: TrendingPost[];
  isValid: boolean;
  validationErrors: string[];
}

const initialState: DashboardState = {
  content: '',
  identity: '',  // Changed to empty string
  contentTopics: [],
  writingStyle: '',  // Changed to empty string
  postLength: 'medium',
  trendingPosts: [],
  isValid: false,
  validationErrors: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      // Parse topics from content
      state.contentTopics = action.payload
        .split(',')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0);
    },

    setIdentity: (state, action: PayloadAction<string>) => {
      state.identity = action.payload;
    },

    setWritingStyle: (state, action: PayloadAction<string>) => {
      state.writingStyle = action.payload;
    },

    setPostLength: (state, action: PayloadAction<PostLength>) => {
      state.postLength = action.payload;
    },

    setTrendingPosts: (state, action: PayloadAction<TrendingPost[]>) => {
      state.trendingPosts = action.payload;
    },

    validateForm: (state) => {
      const errors: string[] = [];

      if (!state.content.trim()) {
        errors.push('Please enter content topics');
      }

      if (!state.identity) {
        errors.push('Please select an identity');
      }

      if (!state.writingStyle) {
        errors.push('Please select a writing style');
      }

      if (state.trendingPosts.length === 0) {
        errors.push('Please select at least one trending post for inspiration');
      }

      state.validationErrors = errors;
      state.isValid = errors.length === 0;
    },

    resetDashboard: () => initialState,
  },
});

export const {
  setContent,
  setIdentity,
  setWritingStyle,
  setPostLength,
  setTrendingPosts,
  validateForm,
  resetDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardState = (state: { dashboard: DashboardState }) => state.dashboard;
export const selectIsFormValid = (state: { dashboard: DashboardState }) => state.dashboard.isValid;
export const selectValidationErrors = (state: { dashboard: DashboardState }) => state.dashboard.validationErrors;

export default dashboardSlice.reducer;