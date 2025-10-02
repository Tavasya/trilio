import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IdeaVariation } from '../post/postTypes';

interface DashboardState {
  idea: string;
  variations: IdeaVariation[];
  isGenerating: boolean;
  error: string | null;
  streamingContents: Record<number, string>;  // Per-variation streaming text
}

const initialState: DashboardState = {
  idea: '',
  variations: [],
  isGenerating: false,
  error: null,
  streamingContents: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setIdea: (state, action: PayloadAction<string>) => {
      state.idea = action.payload;
    },

    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },

    setVariations: (state, action: PayloadAction<IdeaVariation[]>) => {
      state.variations = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    startVariation: (state, action: PayloadAction<{ index: number; title: string }>) => {
      const { index, title } = action.payload;
      state.variations[index] = { title, content: '' };
      state.streamingContents[index] = '';
    },

    appendVariationContent: (state, action: PayloadAction<{ index: number; content: string }>) => {
      const { index, content } = action.payload;
      if (!state.streamingContents[index]) {
        state.streamingContents[index] = '';
      }
      state.streamingContents[index] += content;
    },

    completeVariation: (state, action: PayloadAction<{ index: number; content: string }>) => {
      const { index, content } = action.payload;
      if (state.variations[index]) {
        state.variations[index].content = content;
      }
      delete state.streamingContents[index];
    },

    resetDashboard: () => initialState,
  },
});

export const {
  setIdea,
  setGenerating,
  setVariations,
  setError,
  startVariation,
  appendVariationContent,
  completeVariation,
  resetDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardState = (state: { dashboard: DashboardState }) => state.dashboard;

export default dashboardSlice.reducer;