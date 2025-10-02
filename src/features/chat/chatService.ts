import { API_CONFIG } from '@/shared/config/api';
import { handleSSEStream } from '@/shared/utils/sse';
import type { SendMessageRequest, SSEEvent, ConversationHistoryResponse } from './chatTypes';

export class ChatService {
  private eventSource: EventSource | null = null;

  async streamChat(
    request: SendMessageRequest,
    token: string,
    onEvent: (event: SSEEvent) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // Close any existing connection
    this.closeConnection();

    // Create the request body
    const body = JSON.stringify({
      message: request.message,
      ...(request.conversation_id && { conversation_id: request.conversation_id }),
      ...(request.tools && request.tools.length > 0 && { tools: request.tools }),
      ...(request.context && { context: request.context })
    });

    // Use the shared SSE handler
    await handleSSEStream(
      `${API_CONFIG.BASE_URL}/api/ai/chat/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      },
      (eventType, data) => {
        // Map event types to typed SSEEvent
        switch (eventType) {
          case 'conversation':
            onEvent({ type: 'conversation', data });
            break;
          case 'message':
            onEvent({ type: 'message', data });
            break;
          case 'tool_status':
            onEvent({ type: 'tool_status', data });
            break;
          case 'tool_call':
            onEvent({ type: 'tool_call', data });
            break;
          case 'research_cards':
            onEvent({ type: 'research_cards', data });
            break;
          case 'done':
            onEvent({ type: 'done', data });
            break;
          case 'error':
            onEvent({ type: 'error', data });
            break;
        }
      },
      (error) => {
        onError(error);
        this.closeConnection();
      }
    );
  }

  closeConnection(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  async fetchConversationByPost(postId: string, token: string): Promise<ConversationHistoryResponse | null> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/conversations/by-post/${postId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No conversation history for this post
          return null;
        }
        throw new Error(`Failed to fetch conversation history: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  }
}

export const chatService = new ChatService();