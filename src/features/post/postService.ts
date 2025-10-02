import { API_CONFIG } from '@/shared/config/api';
import { handleSSEStream } from '@/shared/utils/sse';
import type { FetchPostsResponse, LinkedInPost, LinkedInPostResponse, DraftPostRequest, DraftPostResponse, GetPostResponse, UpdateDraftRequest, UpdateDraftResponse, SchedulePostRequest, SchedulePostResponse, GenerateIdeasRequest } from './postTypes';

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
      throw new Error('Invalid response from server');
    }


    if (!response.ok || !data.success) {
      throw new Error(data.error || data.detail || 'Failed to schedule post');
    }

    return data;
  }

  async updateScheduledPost(postId: string, updateData: Partial<SchedulePostRequest>, token: string): Promise<SchedulePostResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posts/schedule/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update scheduled post');
    }

    return data;
  }

  async deletePost(postId: string, token: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete post');
    }

    return data;
  }

  async streamGenerateIdeas(
    request: GenerateIdeasRequest,
    token: string,
    onVariationStart: (index: number, title: string) => void,
    onVariationChunk: (index: number, content: string) => void,
    onVariationComplete: (index: number, content: string) => void,
    onComplete: () => void,
    onError: (error: Error, index?: number) => void
  ): Promise<void> {
    await handleSSEStream(
      `${API_CONFIG.BASE_URL}/api/ideas/generate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
      (eventType, data) => {
        switch (eventType) {
          case 'variation_start':
            onVariationStart(data.index, data.title);
            break;
          case 'variation_chunk':
            onVariationChunk(data.index, data.content);
            break;
          case 'variation_complete':
            onVariationComplete(data.index, data.content);
            break;
          case 'done':
            onComplete();
            break;
          case 'error':
            onError(new Error(data.error), data.index);
            break;
        }
      },
      onError
    );
  }
}

export const postService = new PostService();