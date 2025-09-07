import { API_CONFIG } from '../../shared/config/api';

export interface OnboardingSubmissionData {
  description: string[];
  postingFrequency: string;
  contentFocus: string[];
  linkedinGoals: string[];
  targetAudience: string[];
  selectedCreators: string[];
}

export class OnboardingService {
  async submitOnboarding(data: OnboardingSubmissionData) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/onboarding/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Onboarding submission failed');
    }

    return response.json();
  }
}

export const onboardingService = new OnboardingService();