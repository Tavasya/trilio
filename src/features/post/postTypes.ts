export interface LinkedInPost {
  content: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  linkedin_post_id: string | null;
  linkedin_post_url: string | null;
  created_at: string;
}

export interface LinkedInPostResponse {
  success: boolean;
  post_id?: string;
  post?: Post;
  error?: string;
  details?: string;
}

export interface FetchPostsResponse {
  success: boolean;
  posts: Post[];
  error?: string;
}

export interface PostState {
  currentPost: LinkedInPost | null;
  posts: Post[];
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;
  lastPostId: string | null;
}