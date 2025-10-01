export interface LinkedInPost {
  content: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  draft_id?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  linkedin_post_id: string | null;
  linkedin_post_url: string | null;
  scheduled_for: string | null;
  timezone: string | null;
  status: 'draft' | 'scheduled' | 'published';
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

import type { TrendingPost } from '../dashboard/dashboardSlice';

export interface DraftPostRequest {
  content: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  identity?: string;
  content_topics?: string[];
  writing_style?: string;
  post_length?: 'short' | 'medium' | 'long';
  trending_posts?: TrendingPost[];
}

export interface DraftPostResponse {
  success: boolean;
  post_id: string;
  post: Post;
}

export interface GetPostResponse {
  success: boolean;
  post: Post;
  error?: string;
}

export interface UpdateDraftRequest {
  content: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

export interface UpdateDraftResponse {
  success: boolean;
  post: Post;
  error?: string;
}

export interface SchedulePostRequest {
  content: string;
  scheduled_for: string;
  timezone: string;
  media_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  draft_id?: string;
}

export interface SchedulePostResponse {
  success: boolean;
  post: Post;
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