import { API_CONFIG } from '@/shared/config/api';
import type { FetchPostsResponse, LinkedInPost, LinkedInPostResponse } from './postTypes';

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
}

export const postService = new PostService();