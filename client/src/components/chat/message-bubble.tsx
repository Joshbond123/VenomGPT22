import { useState } from 'react';
import { Copy, Share, ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@shared/schema';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const shareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VenomGPT Message',
          text: message.content,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      copyToClipboard();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="text-white text-sm" />
        </div>
      )}
      
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`max-w-3xl ${isUser ? 'order-1' : ''}`}>
          <div
            className={`rounded-2xl p-4 ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-md'
                : 'bg-slate-700 border border-slate-600 text-slate-200 rounded-tl-md'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
          
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs text-slate-500">
              {formatTime(message.timestamp)}
            </span>
            
            {!isUser && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200 h-auto p-1"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200 h-auto p-1"
                  onClick={shareMessage}
                >
                  <Share className="w-3 h-3 mr-1" />
                  Share
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-green-400 h-auto p-1"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Good
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-400 h-auto p-1"
                >
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  Poor
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="text-slate-300 text-sm" />
        </div>
      )}
    </div>
  );
}
