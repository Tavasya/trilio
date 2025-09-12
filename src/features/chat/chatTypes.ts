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

export interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  currentStreamingMessage: string;
  isStreaming: boolean;
  error: string | null;
}

// API Request Types
export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
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

export type SSEEvent = 
  | { type: 'conversation'; data: ConversationEvent }
  | { type: 'message'; data: MessageEvent }
  | { type: 'done'; data: DoneEvent }
  | { type: 'error'; data: ErrorEvent };