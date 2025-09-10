import { useState } from 'react';
import { Send, Plus, FileText, Link, Hash, Image } from 'lucide-react';
import { Button } from '../ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I'll help you generate an engaging LinkedIn post. What topic would you like to write about?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Placeholder for AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand. Let me help you craft a compelling post about that topic...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
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
            className="self-end"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}