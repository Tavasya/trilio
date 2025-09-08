export interface OnboardingFormData {
  description: string[];
  postingFrequency: string;
  contentFocus: string[];
  linkedinGoals: string[];
  targetAudience: string[];
  selectedCreators: string[];
}

export interface OnboardingState {
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

export interface OnboardingSubmissionResponse {
  success: boolean;
  message?: string;
}

export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  linkedin_connected: boolean;
}

export interface CompleteOnboardingResponse {
  message: string;
  onboarding_completed: boolean;
}

export interface LinkedInConnectResponse {
  linkedin_connected: boolean;
}