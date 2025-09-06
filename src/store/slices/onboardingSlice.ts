import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface OnboardingFormData {
  description: string[];
  postingFrequency: string;
  contentFocus: string[];
  linkedinGoals: string[];
  targetAudience: string[];
  selectedCreators: string[];
}

interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  validation: {
    errors: Record<number, string[]>;
  };
  submission: {
    isLoading: boolean;
    error: string | null;
    isComplete: boolean;
  };
}

const STORAGE_KEY = 'onboarding_draft';

const initialState: OnboardingState = {
  currentStep: 1,
  formData: {
    description: [],
    postingFrequency: '',
    contentFocus: [],
    linkedinGoals: [],
    targetAudience: [],
    selectedCreators: []
  },
  validation: {
    errors: {}
  },
  submission: {
    isLoading: false,
    error: null,
    isComplete: false
  }
};

// Load saved data from localStorage
const loadSavedData = (): OnboardingFormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Save data to localStorage
const saveDataToStorage = (formData: OnboardingFormData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Validation function
const validateStep = (step: number, formData: OnboardingFormData): string[] => {
  const errors: string[] = [];
  
  switch (step) {
    case 1:
      if (formData.description.length === 0) {
        errors.push('Please select at least one description');
      }
      break;
    case 2:
      if (!formData.postingFrequency) {
        errors.push('Please select your posting frequency');
      }
      break;
    case 3:
      if (formData.contentFocus.length === 0) {
        errors.push('Please select at least one content focus area');
      }
      break;
    case 4:
      if (formData.linkedinGoals.length === 0) {
        errors.push('Please select at least one LinkedIn goal');
      }
      break;
    case 5:
      if (formData.targetAudience.length === 0) {
        errors.push('Please select at least one target audience');
      }
      break;
    case 6:
      if (!formData.selectedCreators || formData.selectedCreators.length === 0) {
        errors.push('Please select at least one creator to learn from');
      }
      break;
  }
  
  return errors;
};

// Async thunk for submitting onboarding data
export const submitOnboarding = createAsyncThunk(
  'onboarding/submit',
  async (_formData: OnboardingFormData) => {
    // Simulate API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear localStorage on successful submission
    localStorage.removeItem(STORAGE_KEY);
    
    return { success: true };
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: () => {
    const savedData = loadSavedData();
    if (savedData) {
      return {
        ...initialState,
        formData: {
          ...initialState.formData,
          ...savedData,
          selectedCreators: savedData.selectedCreators || []
        }
      };
    }
    return initialState;
  },
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      // Validate the new current step
      const errors = validateStep(action.payload, state.formData);
      state.validation.errors[action.payload] = errors;
    },
    setDescription: (state, action: PayloadAction<string[]>) => {
      state.formData.description = action.payload;
      state.validation.errors[1] = validateStep(1, state.formData);
      saveDataToStorage(state.formData);
    },
    setPostingFrequency: (state, action: PayloadAction<string>) => {
      state.formData.postingFrequency = action.payload;
      state.validation.errors[2] = validateStep(2, state.formData);
      saveDataToStorage(state.formData);
    },
    setContentFocus: (state, action: PayloadAction<string[]>) => {
      state.formData.contentFocus = action.payload;
      state.validation.errors[3] = validateStep(3, state.formData);
      saveDataToStorage(state.formData);
    },
    setLinkedInGoals: (state, action: PayloadAction<string[]>) => {
      state.formData.linkedinGoals = action.payload;
      state.validation.errors[4] = validateStep(4, state.formData);
      saveDataToStorage(state.formData);
    },
    setTargetAudience: (state, action: PayloadAction<string[]>) => {
      state.formData.targetAudience = action.payload;
      state.validation.errors[5] = validateStep(5, state.formData);
      saveDataToStorage(state.formData);
    },
    setSelectedCreators: (state, action: PayloadAction<string[]>) => {
      state.formData.selectedCreators = action.payload;
      state.validation.errors[6] = validateStep(6, state.formData);
      saveDataToStorage(state.formData);
    },
    resetOnboarding: () => {
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    },
    clearError: (state) => {
      state.submission.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.submission.isLoading = true;
        state.submission.error = null;
      })
      .addCase(submitOnboarding.fulfilled, (state) => {
        state.submission.isLoading = false;
        state.submission.isComplete = true;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.submission.isLoading = false;
        state.submission.error = action.error.message || 'Failed to submit onboarding data';
      });
  }
});

// Selectors
export const selectIsCurrentStepValid = (state: { onboarding: OnboardingState }) => {
  const errors = state.onboarding.validation.errors[state.onboarding.currentStep];
  return !errors || errors.length === 0;
};

// Memoized selector to prevent unnecessary re-renders
const EMPTY_ERRORS: string[] = [];
export const selectCurrentStepErrors = (state: { onboarding: OnboardingState }) => {
  return state.onboarding.validation.errors[state.onboarding.currentStep] || EMPTY_ERRORS;
};

export const selectIsStepValid = (state: { onboarding: OnboardingState }, step: number) => {
  const errors = state.onboarding.validation.errors[step];
  return !errors || errors.length === 0;
};

export const {
  setCurrentStep,
  setDescription,
  setPostingFrequency,
  setContentFocus,
  setLinkedInGoals,
  setTargetAudience,
  setSelectedCreators,
  resetOnboarding,
  clearError
} = onboardingSlice.actions;

export default onboardingSlice.reducer;