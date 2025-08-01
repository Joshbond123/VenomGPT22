import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading = false, placeholder = "Ask VenomGPT anything..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = message.length;
  const maxChars = 4000;

  return (
    <div className="border-t-2 border-cyan-400/30 p-2 sm:p-4 bg-black backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full bg-slate-900 border-2 border-cyan-400/50 rounded-2xl px-4 py-3 pr-12 text-slate-200 placeholder-cyan-400/70 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 min-h-[52px] max-h-32 font-mono"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="absolute right-3 bottom-3 w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-full p-0 border border-green-400"
          >
            <Send className="w-4 h-4 text-black" />
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-xs font-mono gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-slate-400 gap-1 sm:gap-0">
            <span className="hidden sm:inline">Powered by <span className="text-cyan-400">Cerebras</span> • <span className="text-green-400">Llama-3.3-70B</span></span>
            <span className="sm:hidden">Cerebras • Llama-3.3-70B</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              <span className="text-green-400">NEURAL LINK ACTIVE</span>
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-2">
            <span className={cn(
              "transition-colors",
              charCount > maxChars * 0.9 ? 'text-yellow-400' : 'text-slate-400'
            )}>
              {charCount}/{maxChars}
            </span>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 h-auto p-1">
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
