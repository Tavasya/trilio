export interface LinkedInPost {
  content: string;
  media_url?: string;
  image_urls?: string[];
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  draft_id?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  image_urls?: string[] | null;
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

export interface DraftPostRequest {
  content: string;
  media_url?: string;
  image_urls?: string[];
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

export interface DraftPostResponse {
  success: boolean;
  post_id: string;
  post: Post;
}

export interface ConversationData {
  conversation_id: string;
  title?: string;
  messages: Array<{
    id: string;
    conversation_id: string;
    role: string;
    content: string;
    created_at: string;
  }>;
  research_cards?: Array<any>;
}

export interface GetPostResponse {
  success: boolean;
  post: Post;
  conversation?: ConversationData | null;
  error?: string;
}

export interface UpdateDraftRequest {
  content: string;
  media_url?: string;
  image_urls?: string[];
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
  image_urls?: string[];
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

export interface IdeaVariation {
  title: string;
  content: string;
}

export interface GenerateIdeasRequest {
  topic?: string;
  draft_content?: string;
}

export interface RegenerateVariationRequest {
  topic: string;
  index: number;
  previous_content: string;
}

export interface GenerateIdeasResponse {
  success: boolean;
  variations: IdeaVariation[];
}

export interface EditSelectionRequest {
  full_content: string;
  selected_text: string;
  edit_instruction: string;
  selection_start: number;
  selection_end: number;
}