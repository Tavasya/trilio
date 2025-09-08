import { API_CONFIG } from '../../shared/config/api';
import type { OnboardingStatusResponse, CompleteOnboardingResponse } from './onboardingTypes';

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

  async getOnboardingStatus(token: string): Promise<OnboardingStatusResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/onboarding/onboarding-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch onboarding status');
    }

    return response.json();
  }

  async completeOnboarding(token: string): Promise<CompleteOnboardingResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/onboarding/complete-onboarding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete onboarding');
    }

    return response.json();
  }

}

export const onboardingService = new OnboardingService();