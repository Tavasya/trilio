import { useState, useEffect } from 'react';
import { Send, Plus, FileText, Link, Hash, Image } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendMessage, startNewConversation } from '@/features/chat/chatSlice';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';

export default function ChatInterface() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const { 
    conversations, 
    activeConversationId, 
    currentStreamingMessage, 
    isStreaming 
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
      
      await dispatch(sendMessage({ message: messageText, token })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">AI Post Generator</h2>
        <p className="text-sm text-gray-500">Chat with AI to create your LinkedIn post</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        
        {/* Typing Indicator */}
        {isStreaming && !currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          {/* Toolbar Button */}
          <div className="relative">
            <Button
              onClick={() => setShowTooltip(!showTooltip)}
              variant="outline"
              className="self-end"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            {/* Tooltip Menu */}
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px]">
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <FileText className="w-4 h-4" />
                  <span>Add draft</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <Link className="w-4 h-4" />
                  <span>Add link</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <Hash className="w-4 h-4" />
                  <span>Add hashtags</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <Image className="w-4 h-4" />
                  <span>Add image idea</span>
                </button>
              </div>
            )}
          </div>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
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