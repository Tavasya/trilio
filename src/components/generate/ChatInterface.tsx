import { useState, useEffect } from 'react';
import { Send, Search, Loader2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendMessage, startNewConversation } from '@/features/chat/chatSlice';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';

// Define available tools with their metadata
const AVAILABLE_TOOLS = [
  { id: 'linkedin_research', name: 'LinkedIn Research', icon: Search, description: 'Search LinkedIn data' },
  // Easy to add more tools here:
  // { id: 'ai_enhance', name: 'AI Enhance', icon: Brain, description: 'Enhance with AI' },
  // { id: 'trending', name: 'Trending Topics', icon: TrendingUp, description: 'Find trending topics' },
  // { id: 'audience', name: 'Audience Analysis', icon: Users, description: 'Analyze target audience' },
];

interface ChatInterfaceProps {
  postId?: string | null;
  onToggleView?: () => void;
  showToggle?: boolean;
}

export default function ChatInterface({ postId, onToggleView, showToggle }: ChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const { 
    conversations, 
    activeConversationId, 
    currentStreamingMessage, 
    isStreaming,
    currentToolStatus,
    generatedPost 
  } = useAppSelector((state) => state.chat);

  const currentConversation = activeConversationId 
    ? conversations[activeConversationId] 
    : null;
  
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    // Initialize with a welcome message if no conversation exists
    if (!activeConversationId && messages.length === 0) {
      dispatch(startNewConversation());
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (isStreaming) {
      toast.error('Please wait for the current response to complete', { position: 'top-right' });
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
      
      // Build context with live content and post_id
      const context: { post_id?: string; content?: string } = {};

      // Always include post_id if we have one (from props)
      if (postId) {
        context.post_id = postId;
      }

      // Include live content if we have a generated post
      if (generatedPost) {
        context.content = generatedPost.content;
      }
      
      await dispatch(sendMessage({ 
        message: messageText, 
        token,
        tools: selectedTools.length > 0 ? selectedTools : undefined,
        context: Object.keys(context).length > 0 ? context : undefined
      })).unwrap();
      
      setSelectedTools([]); // Reset selected tools after sending
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="border-b p-4 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">AI Post Generator</h2>
            <p className="text-sm text-gray-500">Chat with AI to create your LinkedIn post</p>
          </div>
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
              <p className="text-sm">I'll help you generate an engaging LinkedIn post. What topic would you like to write about?</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Streaming Message */}
        {isStreaming && currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
              <p className="text-sm">{currentStreamingMessage}</p>
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
                    {currentToolStatus.message}
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
      <div className="border-t p-4 flex-shrink-0">
        <div className="flex gap-2">
          {/* Tool Selector Buttons */}
          <div className="flex flex-col gap-2">
            {AVAILABLE_TOOLS.map(tool => {
              const Icon = tool.icon;
              const isSelected = selectedTools.includes(tool.id);
              return (
                <Button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  title={tool.description}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 min-h-[80px] max-h-[200px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            className={`self-end ${(!inputValue.trim() || isStreaming) ? 'opacity-50' : ''}`}
            disabled={false}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}