import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IdeaVariation } from '../post/postTypes';

interface DashboardState {
  idea: string;
  draftContent: string;
  variations: IdeaVariation[];
  isGenerating: boolean;
  error: string | null;
  streamingContents: Record<number, string>;  // Per-variation streaming text
  chatMode: 'topic' | 'draft';
}

const initialState: DashboardState = {
  idea: '',
  draftContent: '',
  variations: [],
  isGenerating: false,
  error: null,
  streamingContents: {},
  chatMode: 'topic',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setIdea: (state, action: PayloadAction<string>) => {
      state.idea = action.payload;
    },

    setDraftContent: (state, action: PayloadAction<string>) => {
      state.draftContent = action.payload;
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

    setChatMode: (state, action: PayloadAction<'topic' | 'draft'>) => {
      state.chatMode = action.payload;
      // Reset variations when switching modes
      state.variations = [];
      state.streamingContents = {};
    },

    resetDashboard: () => initialState,
  },
});

export const {
  setIdea,
  setDraftContent,
  setGenerating,
  setVariations,
  setError,
  startVariation,
  appendVariationContent,
  completeVariation,
  setChatMode,
  resetDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardState = (state: { dashboard: DashboardState }) => state.dashboard;

export default dashboardSlice.reducer;