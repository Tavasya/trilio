import { API_CONFIG } from '@/shared/config/api';
import type { UserMetric, DashboardSummary, UserActivityTimeline, GrowthTimeline, PostsTimeline } from '@/types/devDashboard';

interface DashboardResponse {
  status: string;
  timestamp: string;
  total_users?: number;
  total_active_users?: number;
  data: UserMetric[];
}

interface SummaryResponse {
  status: string;
  timestamp: string;
  summary: DashboardSummary;
}

interface UserActivityResponse {
  status: string;
  timestamp: string;
  user_id: string;
  timeline: UserActivityTimeline[];
}

interface GrowthResponse {
  status: string;
  timestamp: string;
  timeline: GrowthTimeline[];
}

interface PostsTimelineResponse {
  status: string;
  timestamp: string;
  timeline: PostsTimeline[];
}

export class DevDashboardService {
  async fetchAllUsers(): Promise<UserMetric[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
      throw new Error(error.message || 'Failed to fetch users');
    }

    const data: DashboardResponse = await response.json();
    return data.data;
  }

  async fetchActiveUsers(): Promise<UserMetric[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/dashboard/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch active users' }));
      throw new Error(error.message || 'Failed to fetch active users');
    }

    const data: DashboardResponse = await response.json();
    return data.data;
  }

  async fetchSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch summary' }));
      throw new Error(error.message || 'Failed to fetch summary');
    }

    const data: SummaryResponse = await response.json();
    return data.summary;
  }

  async fetchUserActivity(userId: string, days: number = 30): Promise<UserActivityTimeline[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/user/${userId}/activity?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch user activity' }));
      throw new Error(error.message || 'Failed to fetch user activity');
    }

    const data: UserActivityResponse = await response.json();
    return data.timeline;
  }

  async fetchGrowthTimeline(days: number = 90): Promise<GrowthTimeline[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/growth?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch growth timeline' }));
      throw new Error(error.message || 'Failed to fetch growth timeline');
    }

    const data: GrowthResponse = await response.json();
    return data.timeline;
  }

  async fetchPostsTimeline(days: number = 90): Promise<PostsTimeline[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/posts/timeline?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch posts timeline' }));
      throw new Error(error.message || 'Failed to fetch posts timeline');
    }

    const data: PostsTimelineResponse = await response.json();
    return data.timeline;
  }
}

export const devDashboardService = new DevDashboardService();
