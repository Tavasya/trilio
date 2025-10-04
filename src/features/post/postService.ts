import { API_CONFIG } from '@/shared/config/api';
import { handleSSEStream } from '@/shared/utils/sse';
import type { FetchPostsResponse, LinkedInPost, LinkedInPostResponse, DraftPostRequest, DraftPostResponse, GetPostResponse, UpdateDraftResponse, SchedulePostRequest, SchedulePostResponse, GenerateIdeasRequest, RegenerateVariationRequest, EditSelectionRequest } from './postTypes';

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
    // Backend now expects FormData instead of JSON
    const formData = new FormData();
    formData.append('content', draft.content);
    formData.append('visibility', draft.visibility || 'PUBLIC');

    if (draft.media_url) {
      formData.append('media_url', draft.media_url);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/draft`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
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

  async updateDraft(postId: string, content: string, imageFiles?: File[], token?: string): Promise<UpdateDraftResponse> {
    const formData = new FormData();
    formData.append('content', content);

    // Only append files if they were changed
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/posting/draft/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
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
            // Replace em dashes with regular hyphens
            const cleanedChunk = data.content.replace(/—/g, '-');
            onVariationChunk(data.index, cleanedChunk);
            break;
          case 'variation_complete':
            // Replace em dashes with regular hyphens
            const cleanedContent = data.content.replace(/—/g, '-');
            onVariationComplete(data.index, cleanedContent);
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

  async streamRegenerateVariation(
    request: RegenerateVariationRequest,
    token: string,
    onVariationStart: (index: number, title: string) => void,
    onVariationChunk: (index: number, content: string) => void,
    onVariationComplete: (index: number, content: string) => void,
    onComplete: () => void,
    onError: (error: Error, index?: number) => void
  ): Promise<void> {
    await handleSSEStream(
      `${API_CONFIG.BASE_URL}/api/ideas/regenerate`,
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
            // Replace em dashes with regular hyphens
            const cleanedChunk = data.content.replace(/—/g, '-');
            onVariationChunk(data.index, cleanedChunk);
            break;
          case 'variation_complete':
            // Replace em dashes with regular hyphens
            const cleanedContent = data.content.replace(/—/g, '-');
            onVariationComplete(data.index, cleanedContent);
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

  async streamEditSelection(
    request: EditSelectionRequest,
    token: string,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    await handleSSEStream(
      `${API_CONFIG.BASE_URL}/api/ideas/edit-selection`,
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
          case 'edit_chunk':
            if (data.content) {
              onChunk(data.content);
            }
            break;
          case 'edit_complete':
          case 'done':
            onComplete();
            break;
          case 'error':
            onError(new Error(data.error || 'Failed to edit selection'));
            break;
        }
      },
      onError
    );
  }
}

export const postService = new PostService();