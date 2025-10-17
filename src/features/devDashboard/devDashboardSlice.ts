import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DevDashboardState } from '@/types/devDashboard';
import { devDashboardService } from './devDashboardService';

const initialState: DevDashboardState = {
  allUsers: [],
  activeUsers: [],
  summary: null,
  growthTimeline: [],
  postsTimeline: [],
  userActivityTimeline: {},
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  hideAdmins: true,
};

// Async Thunks
export const fetchAllUsers = createAsyncThunk(
  'devDashboard/fetchAllUsers',
  async () => {
    return await devDashboardService.fetchAllUsers();
  }
);

export const fetchActiveUsers = createAsyncThunk(
  'devDashboard/fetchActiveUsers',
  async () => {
    return await devDashboardService.fetchActiveUsers();
  }
);

export const fetchSummary = createAsyncThunk(
  'devDashboard/fetchSummary',
  async () => {
    return await devDashboardService.fetchSummary();
  }
);

export const fetchUserActivity = createAsyncThunk(
  'devDashboard/fetchUserActivity',
  async ({ userId, days = 30 }: { userId: string; days?: number }) => {
    const timeline = await devDashboardService.fetchUserActivity(userId, days);
    return { userId, timeline };
  }
);

export const fetchGrowthTimeline = createAsyncThunk(
  'devDashboard/fetchGrowthTimeline',
  async (days: number = 90) => {
    return await devDashboardService.fetchGrowthTimeline(days);
  }
);

export const fetchPostsTimeline = createAsyncThunk(
  'devDashboard/fetchPostsTimeline',
  async (days: number = 90) => {
    return await devDashboardService.fetchPostsTimeline(days);
  }
);

// Slice
const devDashboardSlice = createSlice({
  name: 'devDashboard',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setHideAdmins: (state, action: PayloadAction<boolean>) => {
      state.hideAdmins = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch Active Users
      .addCase(fetchActiveUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers = action.payload;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active users';
      })
      // Fetch Summary
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary';
      })
      // Fetch User Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivityTimeline[action.payload.userId] = action.payload.timeline;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user activity';
      })
      // Fetch Growth Timeline
      .addCase(fetchGrowthTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrowthTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.growthTimeline = action.payload;
      })
      .addCase(fetchGrowthTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch growth timeline';
      })
      // Fetch Posts Timeline
      .addCase(fetchPostsTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.postsTimeline = action.payload;
      })
      .addCase(fetchPostsTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts timeline';
      });
  },
});

export const { setFilter, setSearchQuery, setHideAdmins, clearError } = devDashboardSlice.actions;
export default devDashboardSlice.reducer;
