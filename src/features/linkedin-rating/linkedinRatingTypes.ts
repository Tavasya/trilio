export interface CategoryRating {
  score: number;
  feedback: string;
}

export interface ProfileClassification {
  industry: string;
  career_stage: string;
  profile_strategy: string;
  content_style: string;
}

export interface LinkedInProfileData {
  headline?: string;
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  skills?: string[];
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    duration?: string;
  }>;
  has_portfolio_links?: boolean;
  has_custom_url?: boolean;
}

export interface RatingResult {
  id: string;
  profile_name: string;
  overall_score: number;

  // NEW: Classification
  profile_classification: ProfileClassification;

  // NEW: Rating categories
  strategic_fit: CategoryRating;
  professional_positioning: CategoryRating;
  experience_presentation: CategoryRating;
  credibility_signals: CategoryRating;
  discoverability: CategoryRating;

  strengths: string[];
  improvements: string[];
  actionable_tips: string[];
  profile_approach_notes: string;

  pdf_url: string;
  created_at: string;
  profile_data?: LinkedInProfileData;
}

export interface RatingApiResponse {
  success: boolean;
  result?: RatingResult;
  error?: string;
}

export interface LinkedInRatingState {
  isUploading: boolean;
  result: RatingResult | null;
  error: string | null;
}
