import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedMessageProps {
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export function EnhancedMessage({ content, isUser, isStreaming }: EnhancedMessageProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => ({ ...prev, [blockId]: true }));
      setTimeout(() => {
        setCopiedBlocks(prev => ({ ...prev, [blockId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CodeBlock = ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const blockId = `${Date.now()}-${Math.random()}`;

    if (!match) {
      return (
        <code 
          {...props} 
          className="bg-slate-800 text-cyan-300 px-2 py-1 rounded border border-cyan-400/30 font-mono text-sm"
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4">
        <div className="flex items-center justify-between bg-slate-900 border border-cyan-400/30 rounded-t-lg px-4 py-2">
          <span className="text-cyan-400 text-sm font-mono uppercase">{language}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code, blockId)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-cyan-400 hover:text-cyan-300"
          >
            {copiedBlocks[blockId] ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          className="rounded-t-none border-x border-b border-cyan-400/30 !bg-slate-900 !m-0 overflow-x-auto"
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            backgroundColor: '#0f172a',
            border: 'none',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.75rem',
              fontFamily: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex gap-2 sm:gap-4 p-3 sm:p-6 group",
      isUser 
        ? "bg-slate-900/50 border-r-2 border-cyan-400/50" 
        : "bg-black/50 border-r-2 border-green-400/50"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        isUser 
          ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-black" 
          : "bg-gradient-to-br from-green-500 to-cyan-500 text-black animate-pulse"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "prose prose-invert max-w-none",
          isUser ? "prose-cyan" : "prose-green"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-cyan-300 border-b border-cyan-400/30 pb-2 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-cyan-300 border-b border-cyan-400/20 pb-1 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold text-cyan-300 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-200 leading-relaxed mb-4 last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-slate-200 space-y-1 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-slate-200 space-y-1 mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">→</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 bg-slate-800/50 rounded-r italic text-slate-300 mb-4">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-cyan-400/30 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-slate-800 text-cyan-300 font-bold p-3 text-left border-b border-cyan-400/30">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-slate-200 p-3 border-b border-slate-700/50">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-center mt-2 text-green-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="ml-2 text-sm font-mono">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}