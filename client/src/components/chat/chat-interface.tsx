import { useEffect, useRef } from 'react';
import { Share2, MoreVertical, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedMessage } from './enhanced-message';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';

export function ChatInterface() {
  const { messages, messagesLoading, sendMessage, isSendingMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Chat Header */}
      <div className="bg-black border-b-2 border-cyan-400/30 p-4 flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-mono">VenomGPT</h1>
              <p className="text-sm text-green-400 flex items-center font-mono">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                NEURAL LINK ACTIVE
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-slate-900">
        {messages.length === 0 && (
          <div className="p-6 border-r-2 border-green-400/50">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="text-black text-sm" />
              </div>
              <div className="flex-1">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-200 leading-relaxed mb-0">
                    <span className="text-green-400 font-mono">{'>>>'} NEURAL INTERFACE INITIALIZED {'<<<'}</span>
                    <br /><br />
                    Welcome to <span className="text-cyan-400 font-bold">VenomGPT</span> - your uncensored AI companion powered by Cerebras. 
                    <br /><br />
                    I specialize in:
                    <br />
                    → <span className="text-cyan-400">Code development & debugging</span>
                    <br />
                    → <span className="text-green-400">Creative writing & analysis</span>
                    <br />
                    → <span className="text-purple-400">Technical problem solving</span>
                    <br />
                    → <span className="text-yellow-400">Unrestricted conversations</span>
                    <br /><br />
                    <span className="text-green-400 font-mono">What shall we hack together today?</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message: any, index: number) => (
          <EnhancedMessage 
            key={`message-${message.id}-${index}`} 
            content={message.content} 
            isUser={message.role === 'user'}
            isStreaming={false}
          />
        ))}

        {/* Typing Indicator */}
        {isSendingMessage && (
          <div key="typing-indicator">
            <EnhancedMessage 
              content="Processing neural pathways..." 
              isUser={false}
              isStreaming={true}
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isSendingMessage} />
    </div>
  );
}
