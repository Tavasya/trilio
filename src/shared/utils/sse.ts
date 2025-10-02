/**
 * Reusable Server-Sent Events (SSE) stream handler
 *
 * Handles the low-level SSE protocol parsing for any streaming endpoint.
 * Supports the standard SSE format with event types and data payloads.
 *
 * @example
 * ```typescript
 * await handleSSEStream(
 *   'https://api.example.com/stream',
 *   { method: 'POST', headers: {...}, body: JSON.stringify({...}) },
 *   (eventType, data) => {
 *     console.log(`Received ${eventType}:`, data);
 *   },
 *   (error) => {
 *     console.error('Stream error:', error);
 *   }
 * );
 * ```
 */

/**
 * Handle an SSE stream from a fetch response
 *
 * @param url - The URL to fetch from
 * @param options - Fetch options (headers, method, body, etc.)
 * @param onEvent - Callback invoked for each SSE event with (eventType, parsedData)
 * @param onError - Callback invoked if an error occurs
 */
export async function handleSSEStream(
  url: string,
  options: RequestInit,
  onEvent: (eventType: string, data: any) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verify we got an event stream
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/event-stream')) {
      throw new Error('Server did not return an event stream');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent: string | null = null;

    // Read the stream chunk by chunk
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by newlines to get individual lines
      const lines = buffer.split('\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      // Process each complete line
      for (const line of lines) {
        // Empty line signals end of an event
        if (line.trim() === '') {
          currentEvent = null;
          continue;
        }

        // Parse event type
        if (line.startsWith('event:')) {
          currentEvent = line.slice(6).trim();
        }
        // Parse data payload
        else if (line.startsWith('data:') && currentEvent) {
          const dataStr = line.slice(5).trim();

          try {
            // Attempt to parse as JSON
            const data = JSON.parse(dataStr);
            onEvent(currentEvent, data);
          } catch {
            // If JSON parsing fails, pass raw string
            onEvent(currentEvent, dataStr);
          }
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
