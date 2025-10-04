import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { chatService } from './chatService';
import type { ChatState, Message, SSEEvent, ToolStatus, MessageContext, GeneratedPost, SaveStatus, ResearchCardsData } from './chatTypes';
import { toast } from 'sonner';
import { postService } from '../post/postService';

const initialState: ChatState = {
  conversations: {},
  activeConversationId: null,
  currentStreamingMessage: '',
  isStreaming: false,
  currentToolStatus: null,
  error: null,
  generatedPost: null,
  saveStatus: 'saved',
  researchCards: null,
  persistedResearchCards: null,
  isEditMode: false,
};

// Async thunk for saving draft to database
export const saveDraftToDatabase = createAsyncThunk(
  'chat/saveDraft',
  async ({ postId, content, imageUrl, token }: { postId: string; content: string; imageUrl?: string; token: string }) => {
    const response = await postService.updateDraft(
      postId,
      {
        content,
        ...(imageUrl && { image_urls: [imageUrl] })
      },
      token
    );
    return response;
  }
);

// Async thunk for loading conversation history for a post
export const loadConversationHistory = createAsyncThunk(
  'chat/loadConversationHistory',
  async ({ postId, token }: { postId: string; token: string }) => {
    const response = await chatService.fetchConversationByPost(postId, token);
    return response;
  }
);

// Async thunk for sending a message and handling the stream
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { message, token, tools, context }: { message: string; token: string; tools?: string[]; context?: MessageContext },
    { dispatch, getState }
  ) => {
    const state = getState() as { chat: ChatState };
    const conversationId = state.chat.activeConversationId;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    dispatch(addUserMessage(userMessage));

    // Start streaming
    dispatch(startStreaming());

    return new Promise<void>((resolve, reject) => {
      chatService.streamChat(
        {
          message,
          conversation_id: conversationId || undefined,
          tools,
          context,
        },
        token,
        (event: SSEEvent) => {
          switch (event.type) {
            case 'conversation':
              dispatch(setConversationId(event.data.conversation_id));
              break;
            case 'message':
              dispatch(appendStreamingContent(event.data.content));
              break;
            case 'tool_status':
              dispatch(setToolStatus(event.data));
              break;
            case 'tool_call':
              // Handle edit_content tool responses
              if (event.data.tool === 'edit_content' && event.data.result.success && event.data.result.content) {
                dispatch(replaceGeneratedPostContent({
                  content: event.data.result.content,
                  id: event.data.result.content_id
                }));
              }
              break;
            case 'research_cards':
              // Handle research cards from LinkedIn Research tool
              dispatch(setResearchCards(event.data));
              break;
            case 'done':
              dispatch(completeStreaming(event.data.conversation_id));
              resolve();
              break;
            case 'error':
              dispatch(streamingError(event.data.error));
              reject(new Error(event.data.error));
              break;
          }
        },
        (error: Error) => {
          dispatch(streamingError(error.message));
          reject(error);
        }
      );
    });
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<Message>) => {
      // Use the active conversation ID if it exists, otherwise use 'temp'
      const conversationId = state.activeConversationId || 'temp';
      
      if (!state.conversations[conversationId]) {
        state.conversations[conversationId] = {
          conversation_id: conversationId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      state.conversations[conversationId].messages.push(action.payload);
      state.conversations[conversationId].updatedAt = new Date().toISOString();
      
      // Set as active if no conversation is active
      if (!state.activeConversationId) {
        state.activeConversationId = conversationId;
      }
    },
    
    setConversationId: (state, action: PayloadAction<string>) => {
      const newId = action.payload;
      
      // If we had a temp conversation, move it to the new ID
      if (state.activeConversationId === 'temp' && state.conversations.temp) {
        state.conversations[newId] = {
          ...state.conversations.temp,
          conversation_id: newId,
        };
        delete state.conversations.temp;
      } else if (!state.conversations[newId] && state.activeConversationId && state.conversations[state.activeConversationId]) {
        // If switching to a new conversation ID but we already have an active one, keep it
        state.conversations[newId] = {
          ...state.conversations[state.activeConversationId],
          conversation_id: newId,
        };
        if (state.activeConversationId !== newId) {
          delete state.conversations[state.activeConversationId];
        }
      }
      
      state.activeConversationId = newId;
    },
    
    startStreaming: (state) => {
      state.isStreaming = true;
      state.currentStreamingMessage = '';
      state.currentToolStatus = null;
      state.error = null;
    },
    
    setToolStatus: (state, action: PayloadAction<ToolStatus>) => {
      state.currentToolStatus = action.payload;
    },
    
    appendStreamingContent: (state, action: PayloadAction<string>) => {
      state.currentStreamingMessage += action.payload;
    },
    
    completeStreaming: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      
      // First ensure we have the right conversation
      if (!state.conversations[conversationId] && state.activeConversationId) {
        // The conversation might still be under temp or activeConversationId
        const sourceId = state.activeConversationId;
        if (state.conversations[sourceId]) {
          state.conversations[conversationId] = {
            ...state.conversations[sourceId],
            conversation_id: conversationId,
          };
          if (sourceId !== conversationId) {
            delete state.conversations[sourceId];
          }
        }
      }
      
      // Now add the message to the correct conversation
      if (state.currentStreamingMessage) {
        const targetConversation = state.conversations[conversationId];
        if (targetConversation) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: state.currentStreamingMessage,
            timestamp: new Date().toISOString(),
          };
          
          targetConversation.messages.push(assistantMessage);
          targetConversation.updatedAt = new Date().toISOString();
        }
      }
      
      // Update the active conversation ID
      state.activeConversationId = conversationId;
      state.isStreaming = false;
      state.currentStreamingMessage = '';
      state.currentToolStatus = null;
    },
    
    streamingError: (state, action: PayloadAction<string>) => {
      state.isStreaming = false;
      state.error = action.payload;
      toast.error(action.payload, { position: 'top-right' });
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    startNewConversation: (state) => {
      state.activeConversationId = null;
      state.currentStreamingMessage = '';
      state.isStreaming = false;
      state.error = null;
      state.researchCards = null;
      state.persistedResearchCards = null;
    },
    
    setGeneratedPost: (state, action: PayloadAction<GeneratedPost>) => {
      state.generatedPost = action.payload;
    },
    
    updateGeneratedPostContent: (state, action: PayloadAction<string>) => {
      if (state.generatedPost) {
        state.generatedPost.content = action.payload;
        state.generatedPost.isEdited = true;
        state.saveStatus = 'unsaved';
      }
    },
    
    replaceGeneratedPostContent: (state, action: PayloadAction<{ content: string; id?: string }>) => {
      if (state.generatedPost) {
        state.generatedPost.content = action.payload.content;
        if (action.payload.id) {
          state.generatedPost.id = action.payload.id;
        }
        state.generatedPost.isEdited = false;
      } else {
        // Create new post if doesn't exist
        state.generatedPost = {
          content: action.payload.content,
          id: action.payload.id,
          isEdited: false
        };
      }
    },
    
    clearGeneratedPost: (state) => {
      state.generatedPost = null;
    },

    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload;
    },

    setResearchCards: (state, action: PayloadAction<ResearchCardsData>) => {
      state.researchCards = action.payload;
    },

    clearResearchCards: (state) => {
      state.researchCards = null;
    },

    setPersistedResearchCards: (state, action: PayloadAction<any[]>) => {
      state.persistedResearchCards = action.payload;
    },

    loadConversationFromPostResponse: (state, action: PayloadAction<{
      conversation_id: string;
      messages: Array<{
        id: string;
        conversation_id: string;
        role: string;
        content: string;
        created_at: string;
      }>;
      research_cards?: Array<any>;
    }>) => {
      const { conversation_id, messages, research_cards } = action.payload;

      state.conversations[conversation_id] = {
        conversation_id,
        messages: messages.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.created_at,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.activeConversationId = conversation_id;

      if (research_cards && research_cards.length > 0) {
        state.persistedResearchCards = research_cards;
      }
    },

    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.rejected, (state, action) => {
        state.isStreaming = false;
        state.error = action.error.message || 'Failed to send message';
        toast.error(state.error, { position: 'top-right' });
      })
      .addCase(saveDraftToDatabase.pending, (state) => {
        state.saveStatus = 'saving';
      })
      .addCase(saveDraftToDatabase.fulfilled, (state) => {
        state.saveStatus = 'saved';
      })
      .addCase(saveDraftToDatabase.rejected, (state) => {
        state.saveStatus = 'error';
        toast.error('Failed to save draft', { position: 'top-right' });
      })
      .addCase(loadConversationHistory.fulfilled, (state, action) => {
        if (action.payload) {
          const { conversation, messages, research_cards } = action.payload;

          if (conversation && messages) {
            const conversationId = conversation.id;
            state.conversations[conversationId] = {
              conversation_id: conversationId,
              messages: messages.map((msg) => ({
                id: msg.id,
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
                timestamp: msg.created_at,
              })),
              title: conversation.title,
              createdAt: conversation.created_at,
              updatedAt: conversation.updated_at,
            };
            state.activeConversationId = conversationId;
          }

          // Load persisted research cards if available
          if (research_cards) {
            state.persistedResearchCards = research_cards;
          }
        }
      });
  },
});

export const {
  addUserMessage,
  setConversationId,
  startStreaming,
  setToolStatus,
  appendStreamingContent,
  completeStreaming,
  streamingError,
  clearError,
  startNewConversation,
  setGeneratedPost,
  updateGeneratedPostContent,
  replaceGeneratedPostContent,
  clearGeneratedPost,
  setSaveStatus,
  setResearchCards,
  clearResearchCards,
  setPersistedResearchCards,
  loadConversationFromPostResponse,
  toggleEditMode,
} = chatSlice.actions;

export default chatSlice.reducer;