export interface UserMetric {
  user_id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  linkedin_connected: boolean;
  onboarding_completed: boolean;
  user_created_at: string;
  last_login_at: string;
  total_posts: number;
  draft_posts: number;
  scheduled_posts: number;
  published_posts: number;
  failed_posts: number;
  cancelled_posts: number;
  total_conversations: number;
  total_messages: number;
  has_created_posts: boolean;
  has_published_posts: boolean;
  last_post_created_at: string | null;
  last_message_at: string | null;
  is_admin: boolean;
}

export interface DashboardSummary {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_with_published_posts: number;
  activation_rate: number;
  publish_rate: number;
  posts: {
    total: number;
    drafts: number;
    scheduled: number;
    published: number;
    failed: number;
    publish_conversion: number;
  };
}

export interface UserActivityTimeline {
  date: string;
  posts_created: number;
  messages_sent: number;
  conversations_started: number;
  drafts_created: number;
  posts_published: number;
}

export interface GrowthTimeline {
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
}

export interface PostsTimeline {
  date: string;
  drafts_created: number;
  posts_published: number;
  posts_scheduled: number;
  posts_failed: number;
}

export interface DevDashboardState {
  allUsers: UserMetric[];
  activeUsers: UserMetric[];
  summary: DashboardSummary | null;
  growthTimeline: GrowthTimeline[];
  postsTimeline: PostsTimeline[];
  userActivityTimeline: Record<string, UserActivityTimeline[]>; // userId -> timeline
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'inactive';
  searchQuery: string;
  hideAdmins: boolean;
}
