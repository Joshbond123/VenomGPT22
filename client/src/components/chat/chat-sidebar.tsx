import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useChat } from '@/hooks/use-chat';
import type { Chat } from '@shared/schema';

interface ChatSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ChatSidebar({ isCollapsed = false }: ChatSidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const { chats, currentChatId, setCurrentChatId, deleteChat, startNewChat } = useChat();

  const handleNewChat = async () => {
    await startNewChat();
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
    }
  };

  const formatChatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-black border-r-2 border-cyan-400/30 w-80 sm:w-80 flex-shrink-0 flex flex-col h-full backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b-2 border-cyan-400/30">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cyan-400 font-mono">CHAT MATRIX</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-green-400 hover:text-green-300 p-1 border border-green-400/50 hover:border-green-400"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* User Status */}
      <div className="p-4 bg-slate-900/50 border-b border-cyan-400/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
            <User className="text-black text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cyan-300 truncate font-mono">
              {user ? `USER: ${user.username}` : 'ANONYMOUS_USER'}
            </p>
            <p className="text-xs text-green-400 font-mono">
              {user ? 'ACCESS_GRANTED' : 'GUEST_MODE'}
            </p>
          </div>
        </div>
        
        {!isAuthenticated && (
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-400 mb-2">Register to save chat history</p>
            <div className="flex space-x-2">
              <Link href="/login" className="flex-1">
                <Button variant="default" size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-slate-600 hover:border-slate-500 text-slate-300 text-xs">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-2">
              You must register or log in to access chat history.
            </p>
            <div className="space-y-2">
              <Link href="/register">
                <Button variant="default" size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full border-slate-600 hover:border-slate-500 text-slate-300">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-4">No chat history yet</p>
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500 text-slate-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start your first chat
            </Button>
          </div>
        ) : (
          chats.map((chat: Chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id
                  ? 'bg-slate-700/70 border border-slate-600'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {chat.title}
                  </p>
                  {chat.summary && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {chat.summary}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200 p-1 h-auto"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="text-slate-400 hover:text-red-400 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {formatChatTime(chat.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Powered by Cerebras</span>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 p-1 h-auto">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
