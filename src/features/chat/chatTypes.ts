export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string for serialization
  isStreaming?: boolean;
}

export interface Conversation {
  conversation_id: string;
  messages: Message[];
  title?: string;
  createdAt: string; // ISO string for serialization
  updatedAt: string; // ISO string for serialization
}

export interface ToolStatus {
  status: 'started' | 'completed';
  tool: string;
  message: string;
}

export interface GeneratedPost {
  id?: string;        // Real DB ID if saved
  content: string;    // Current live content
  isEdited: boolean;  // Track if manually edited
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  currentStreamingMessage: string;
  isStreaming: boolean;
  currentToolStatus: ToolStatus | null;
  error: string | null;
  generatedPost: GeneratedPost | null;
  saveStatus: SaveStatus;
}

// API Request Types
export interface MessageContext {
  post_id?: string;   // Post ID to fetch from database
  content?: string;   // Current live content from frontend
}

export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
  tools?: string[]; // Array of tool names to use
  context?: MessageContext;
}

// SSE Event Types
export interface ConversationEvent {
  conversation_id: string;
}

export interface MessageEvent {
  content: string;
}

export interface DoneEvent {
  status: 'complete';
  conversation_id: string;
}

export interface ErrorEvent {
  error: string;
}

export interface ToolStatusEvent {
  status: 'started' | 'completed';
  tool: string;
  message: string;
}

export interface ToolCallEvent {
  tool: string;
  result: {
    success: boolean;
    content_id?: string;  // The post_id if provided
    content?: string;     // The edited content
  };
}

export type SSEEvent = 
  | { type: 'conversation'; data: ConversationEvent }
  | { type: 'message'; data: MessageEvent }
  | { type: 'done'; data: DoneEvent }
  | { type: 'error'; data: ErrorEvent }
  | { type: 'tool_status'; data: ToolStatusEvent }
  | { type: 'tool_call'; data: ToolCallEvent };

// Conversation history response types
export interface ConversationHistoryResponse {
  conversation: {
    id: string;
    user_id: string;
    title?: string;
    post_id: string;
    created_at: string;
    updated_at: string;
  };
  messages: Array<{
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }>;
}