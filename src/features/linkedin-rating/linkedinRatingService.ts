import { API_CONFIG } from '@/shared/config/api';
import type { RatingResult } from './linkedinRatingTypes';

export class LinkedInRatingService {
  /**
   * Upload LinkedIn profile PDF and get AI analysis
   * This is a public endpoint - no authentication required
   */
  async rateProfile(file: File): Promise<RatingResult> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/linkedin/rate`, {
      method: 'POST',
      body: formData,
      // No Authorization header - this is a public endpoint
      // No Content-Type header - browser sets it automatically for FormData with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || 'Failed to analyze profile');
    }

    const data = await response.json();
    return data;
  }
}

export const linkedInRatingService = new LinkedInRatingService();
