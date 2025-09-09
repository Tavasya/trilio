export interface LinkedInPost {
  content: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

export interface LinkedInPostResponse {
  success: boolean;
  post_id?: string;
  error?: string;
  details?: string;
}

export interface PostState {
  currentPost: LinkedInPost | null;
  isLoading: boolean;
  error: string | null;
  lastPostId: string | null;
}