export interface CategoryRating {
  score: number;
  feedback: string;
}

export interface RatingResult {
  id: string;
  profile_name: string;
  overall_score: number;
  profile_completeness: CategoryRating;
  headline_quality: CategoryRating;
  summary_quality: CategoryRating;
  experience_quality: CategoryRating;
  skills_relevance: CategoryRating;
  strengths: string[];
  improvements: string[];
  actionable_tips: string[];
  pdf_url: string;
  created_at: string;
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
