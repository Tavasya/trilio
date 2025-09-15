import { API_CONFIG } from '@/shared/config/api';
import type { FetchPostsResponse, LinkedInPost, LinkedInPostResponse, DraftPostRequest, DraftPostResponse, GetPostResponse, UpdateDraftRequest, UpdateDraftResponse, SchedulePostRequest, SchedulePostResponse } from './postTypes';

export class PostService {
  async fetchUserPosts(token: string): Promise<FetchPostsResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/posts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch posts');
    }

    return response.json();
  }

  async publishToLinkedIn(post: LinkedInPost, token: string): Promise<LinkedInPostResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/linkedin/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to publish to LinkedIn');
    }

    return data;
  }

  async saveDraft(draft: DraftPostRequest, token: string): Promise<DraftPostResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/draft`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save draft');
    }

    return data;
  }

  async fetchPostById(postId: string, token: string): Promise<GetPostResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch post');
    }

    return data;
  }

  async updateDraft(postId: string, draft: UpdateDraftRequest, token: string): Promise<UpdateDraftResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/draft/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update draft');
    }

    return data;
  }

  async schedulePost(scheduleData: SchedulePostRequest, token: string): Promise<SchedulePostResponse> {
    console.log('Scheduling post with data:', scheduleData);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posts/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response from server');
    }

    console.log('Schedule response:', response.status, data);

    if (!response.ok || !data.success) {
      console.error('Schedule failed:', data);
      throw new Error(data.error || data.detail || 'Failed to schedule post');
    }

    return data;
  }
}

export const postService = new PostService();