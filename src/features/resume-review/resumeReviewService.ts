import { API_CONFIG } from '@/shared/config/api';
import type { ResumeReviewResult } from './resumeReviewTypes';

export class ResumeReviewService {
  /**
   * Upload resume PDF and get AI analysis
   * This is a public endpoint - no authentication required
   */
  async reviewResume(file: File): Promise<ResumeReviewResult> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/resume/review`, {
      method: 'POST',
      body: formData,
      // No Authorization header - this is a public endpoint
      // No Content-Type header - browser sets it automatically for FormData with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || 'Failed to analyze resume');
    }

    const data = await response.json();
    return data;
  }
}

export const resumeReviewService = new ResumeReviewService();
