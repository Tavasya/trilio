import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Eye, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendMessage, startNewConversation, clearResearchCards, toggleEditMode } from '@/features/chat/chatSlice';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import ResearchCards from './ResearchCards';

// Define available tools with their metadata
// const AVAILABLE_TOOLS = [
//   { id: 'linkedin_research', name: 'LinkedIn Research', icon: Search, description: 'Search LinkedIn data' },
//   // Easy to add more tools here:
//   // { id: 'ai_enhance', name: 'AI Enhance', icon: Brain, description: 'Enhance with AI' },
//   // { id: 'trending', name: 'Trending Topics', icon: TrendingUp, description: 'Find trending topics' },
//   // { id: 'audience', name: 'Audience Analysis', icon: Users, description: 'Analyze target audience' },
// ];

interface ChatInterfaceProps {
  postId?: string | null;
  onToggleView?: () => void;
  showToggle?: boolean;
}

// Function to render text with markdown bold support
const renderMarkdownText = (text: string) => {
  // Split by ** markers and create spans
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and make bold
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function ChatInterface({ postId, onToggleView, showToggle }: ChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [inputValue, setInputValue] = useState('');
  // const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    conversations,
    activeConversationId,
    currentStreamingMessage,
    isStreaming,
    currentToolStatus,
    generatedPost,
    researchCards,
    persistedResearchCards,
    isEditMode,
    isLoadingPost
  } = useAppSelector((state) => state.chat);
  const isPublishing = useAppSelector((state) => state.post.isLoading);


  const currentConversation = activeConversationId
    ? conversations[activeConversationId]
    : null;

  const messages = currentConversation?.messages || [];

  // Merge messages with persisted research cards chronologically
  const getMessagesWithCards = () => {
    const items: Array<{ type: 'message' | 'cards'; data: any; timestamp: string }> = [];

    // Add messages
    messages.forEach(msg => {
      items.push({
        type: 'message',
        data: msg,
        timestamp: msg.timestamp
      });
    });

    // Add persisted research cards
    if (persistedResearchCards) {
      persistedResearchCards.forEach(cardBatch => {
        items.push({
          type: 'cards',
          data: {
            cards: cardBatch.cards.map(card => ({
              author_name: card.author_name,
              author_title: card.author_title,
              content: card.post_content,
              likes: card.likes,
              time_posted: card.time_posted,
              url: card.profile_url,
              hook: card.post_content ? card.post_content.split('.')[0] : '',  // Use first sentence as hook
              engagement_score: 0,
              hook_type: ''
            })),
            query: cardBatch.query,
            mode: cardBatch.search_mode
          },
          timestamp: cardBatch.created_at
        });
      });
    } else {
    }

    // Sort by timestamp
    const sorted = items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted;
  };

  const mergedContent = getMessagesWithCards();

  useEffect(() => {
    // Initialize with a welcome message if no conversation exists
    if (!activeConversationId && messages.length === 0) {
      dispatch(startNewConversation());
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive or when streaming
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, currentStreamingMessage]);

  // Add keyboard listener for End key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'End' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (isStreaming) {
      toast.error('Please wait for the current response to complete', { position: 'top-right' });
      return;
    }
    if (isPublishing) {
      toast.error('Please wait for post to finish publishing', { position: 'top-right' });
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      const messageText = inputValue;
      setInputValue('');

      // Clear research cards when sending new message
      dispatch(clearResearchCards());

      // Build context with live content, post_id, and edit_mode
      const context: { post_id?: string; content?: string; edit_mode?: boolean } = {};

      // Always include post_id if we have one (from props)
      if (postId) {
        context.post_id = postId;
      }

      // Include live content if we have a generated post
      if (generatedPost) {
        context.content = generatedPost.content;
      }

      // Include edit mode flag
      context.edit_mode = isEditMode;

      await dispatch(sendMessage({
        message: messageText,
        token,
        tools: undefined, // selectedTools.length > 0 ? selectedTools : undefined,
        context: Object.keys(context).length > 0 ? context : undefined
      })).unwrap();
    } catch {
      // Error is handled by the Redux thunk
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // const toggleTool = (toolId: string) => {
  //   setSelectedTools(prev =>
  //     prev.includes(toolId)
  //       ? prev.filter(id => id !== toolId)
  //       : [...prev, toolId]
  //   );
  // };

  // Skeleton loading state
  if (isLoadingPost) {
    return (
      <div className="h-full flex flex-col overflow-hidden rounded-lg">
        {/* Chat Header */}
        <div className="p-4 flex-shrink-0 min-h-[60px]">
          <div className="flex justify-between items-center h-full">
            <div></div>
            {showToggle && (
              <Button
                onClick={onToggleView}
                variant="outline"
                size="sm"
                className="lg:hidden"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </div>

        {/* Skeleton Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Assistant message skeleton */}
          <div className="flex justify-start">
            <div className="max-w-[80%] space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
          {/* User message skeleton */}
          <div className="flex justify-end">
            <div className="max-w-[80%] space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
          {/* Assistant message skeleton */}
          <div className="flex justify-start">
            <div className="max-w-[80%] space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="p-4 flex-shrink-0">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-lg">
      {/* Chat Header */}
      <div className="p-4 flex-shrink-0 min-h-[60px]">
        <div className="flex justify-between items-center h-full">
          <div></div>
          {showToggle && (
            <Button
              onClick={onToggleView}
              variant="outline"
              size="sm"
              className="lg:hidden"
              data-onboarding="preview-button"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 custom-scrollbar">
        {mergedContent.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900 break-words">
              <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{renderMarkdownText("What else do you want to change?")}</div>
            </div>
          </div>
        )}

        {mergedContent.map((item, index) => {
          if (item.type === 'message') {
            const message = item.data;
            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  } break-words`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{renderMarkdownText(message.content)}</div>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          } else if (item.type === 'cards') {
            return (
              <ResearchCards
                key={`cards-${index}`}
                cards={item.data.cards}
                query={item.data.query}
                mode={item.data.mode}
                onCardClick={() => {
                }}
              />
            );
          }
          return null;
        })}

        {/* Research Cards - Show after user message, before AI response */}
        {researchCards && (
          <ResearchCards
            cards={researchCards.cards}
            query={researchCards.query}
            mode={researchCards.mode}
            onCardClick={() => {
              // Optional: Handle card clicks, e.g., copy content or use as inspiration
            }}
          />
        )}

        {/* Streaming Message */}
        {isStreaming && currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900 break-words">
              <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{renderMarkdownText(currentStreamingMessage)}</div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tool Status or Typing Indicator */}
        {isStreaming && !currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
              {currentToolStatus ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {renderMarkdownText(currentToolStatus.message)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 sm:p-4 pb-4 sm:pb-4 flex-shrink-0 space-y-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-1 sm:gap-2 items-center bg-gray-100 rounded-lg p-1.5 sm:p-2">
          {/* Tool Selector Buttons */}
          <div className="flex gap-1 sm:gap-2 pl-1 sm:pl-2 flex-shrink-0">
            {/* {AVAILABLE_TOOLS.map(tool => {
              const Icon = tool.icon;
              const isSelected = selectedTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  title={tool.description}
                  className={`h-8 w-8 p-0 flex items-center justify-center rounded transition-colors ${
                    isSelected
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })} */}
            {/* Edit Mode Toggle - Only show when there's content */}
            {generatedPost && (
              <button
                onClick={() => dispatch(toggleEditMode())}
                title={isEditMode ? 'Edit Mode: ON - AI will modify content' : 'Edit Mode: OFF - AI will discuss only'}
                className={`h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center rounded transition-all flex-shrink-0 ${
                  isEditMode
                    ? 'text-white bg-primary shadow-md ring-2 ring-primary/20'
                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700'
                }`}
                data-onboarding="edit-button"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isPublishing ? "Publishing post..." : "Type your message here..."}
            className="flex-1 min-h-[32px] max-h-[120px] p-1.5 bg-transparent border-none resize-none focus:outline-none overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            rows={1}
            style={{ lineHeight: '1.25rem' }}
            disabled={isPublishing}
          />
          <button
            onClick={handleSend}
            className={`h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded transition-colors flex-shrink-0 ${
              (!inputValue.trim() || isStreaming || isPublishing)
                ? 'text-gray-400'
                : 'text-primary hover:text-primary/80'
            }`}
            disabled={isPublishing}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}