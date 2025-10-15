export interface CategoryRating {
  score: number;
  feedback: string;
}

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  relevant_coursework?: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeData {
  name: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  technical_skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects?: ResumeProject[];
  certifications?: string[];
}

export interface ResumeReviewResult {
  candidate_name: string;
  overall_score: number;

  // Experience context
  experience_level: 'entry-level' | 'mid-level' | 'senior' | 'staff+';
  target_roles: string[];

  // 6 Scoring Categories (0-10 each)
  technical_skills: CategoryRating;
  project_impact: CategoryRating;
  experience_quality: CategoryRating;
  education_credentials: CategoryRating;
  resume_formatting: CategoryRating;
  tech_credibility: CategoryRating;

  // Actionable Feedback
  strengths: string[];
  critical_issues: string[];
  improvements: string[];
  quick_wins: string[];

  // Tech-Specific Insights
  missing_tech_elements: string[];
  ats_issues: string[];
  keyword_suggestions: string[];
  role_fit_analysis: string;

  // Extracted Resume Content
  resume_data?: ResumeData;
}

export interface ResumeReviewApiResponse {
  success: boolean;
  result?: ResumeReviewResult;
  error?: string;
}

export interface ResumeReviewState {
  isUploading: boolean;
  result: ResumeReviewResult | null;
  error: string | null;
}
