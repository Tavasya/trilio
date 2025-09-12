import { API_CONFIG } from '@/shared/config/api';
import type { SendMessageRequest, SSEEvent } from './chatTypes';

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

    try {
      // Create the request body
      const body = JSON.stringify({
        message: request.message,
        ...(request.conversation_id && { conversation_id: request.conversation_id }),
        ...(request.tools && request.tools.length > 0 && { tools: request.tools }),
        ...(request.context && { context: request.context })
      });

      // Make the initial request to get the SSE stream
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is SSE
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/event-stream')) {
        throw new Error('Server did not return an event stream');
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let buffer = '';
      let currentEvent: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Skip empty lines
          if (line.trim() === '') {
            currentEvent = null;
            continue;
          }
          
          // Handle event type lines
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim();
          }
          // Handle data lines
          else if (line.startsWith('data:') && currentEvent) {
            const dataStr = line.slice(5).trim();
            
            try {
              const data = JSON.parse(dataStr);
              
              switch (currentEvent) {
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
                case 'done':
                  onEvent({ type: 'done', data });
                  break;
                case 'error':
                  onEvent({ type: 'error', data });
                  break;
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', dataStr, parseError);
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
      this.closeConnection();
    }
  }

  closeConnection(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const chatService = new ChatService();