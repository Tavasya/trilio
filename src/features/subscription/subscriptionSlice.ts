import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { subscriptionService } from './subscriptionService';
import type { PendingRequest } from './subscriptionTypes';

export interface SubscriptionState {
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  pendingRequest: PendingRequest | null;
}

const initialState: SubscriptionState = {
  isSubscribed: false,
  isLoading: false,
  error: null,
  pendingRequest: null,
};

// Async thunk to check subscription status
export const checkSubscriptionStatus = createAsyncThunk(
  'subscription/checkStatus',
  async (token: string) => {
    const data = await subscriptionService.checkStatus(token);
    // User is subscribed if tier is "pro" and status is active or trialing
    const isSubscribed = data.tier === 'pro' && ['active', 'trialing'].includes(data.status);
    return isSubscribed;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPendingRequest: (state, action: PayloadAction<PendingRequest>) => {
      state.pendingRequest = action.payload;
      // Save to localStorage for persistence across page reloads
      localStorage.setItem('pendingRequest', JSON.stringify(action.payload));
    },
    clearPendingRequest: (state) => {
      state.pendingRequest = null;
      localStorage.removeItem('pendingRequest');
    },
    loadPendingRequest: (state) => {
      const saved = localStorage.getItem('pendingRequest');
      if (saved) {
        try {
          state.pendingRequest = JSON.parse(saved);
        } catch (e) {
          // Invalid JSON, clear it
          localStorage.removeItem('pendingRequest');
        }
      }
    },
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSubscribed = action.payload;
      })
      .addCase(checkSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to check subscription';
      });
  },
});

export const {
  setPendingRequest,
  clearPendingRequest,
  loadPendingRequest,
  setSubscribed,
} = subscriptionSlice.actions;

export const selectSubscription = (state: RootState) => state.subscription;

export default subscriptionSlice.reducer;
