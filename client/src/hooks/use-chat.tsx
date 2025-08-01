import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './use-auth';
import type { Chat, Message } from '@shared/schema';

export function useChat() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Get chat history for authenticated users
  const { data: chatsData } = useQuery({
    queryKey: ['/api/chats'],
    queryFn: () => api.chats.list(),
    enabled: isAuthenticated,
  });

  const chats = chatsData?.chats || [];

  // Get messages for current chat
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/chats', currentChatId, 'messages'],
    queryFn: () => api.chats.getMessages(currentChatId!),
    enabled: !!currentChatId,
  });

  const messages = messagesData?.messages || [];

  // Create new chat
  const createChatMutation = useMutation({
    mutationFn: (title?: string) => api.chats.create(title),
    onSuccess: (data) => {
      setCurrentChatId(data.chat.id);
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      }
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      api.chats.sendMessage(chatId, content),
    onSuccess: (data, variables) => {
      // Update messages cache
      queryClient.setQueryData(
        ['/api/chats', variables.chatId, 'messages'],
        (old: any) => ({
          messages: [...(old?.messages || []), data.userMessage, data.aiMessage],
        })
      );
      
      // Invalidate chats list to update last message timestamp
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      }
    },
  });

  // Delete chat
  const deleteChatMutation = useMutation({
    mutationFn: api.chats.delete,
    onSuccess: (_, chatId) => {
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
    },
  });

  // Start new chat
  const startNewChat = async (firstMessage?: string) => {
    const result = await createChatMutation.mutateAsync(undefined);
    const chatId = result.chat.id;
    
    if (firstMessage) {
      await sendMessageMutation.mutateAsync({ chatId, content: firstMessage });
    }
    
    return chatId;
  };

  // Send message to current or new chat
  const sendMessage = async (content: string) => {
    let chatId = currentChatId;
    
    // Create new chat if none exists
    if (!chatId) {
      const result = await createChatMutation.mutateAsync(undefined);
      chatId = result.chat.id;
    }
    
    await sendMessageMutation.mutateAsync({ chatId: chatId!, content });
  };

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    messages,
    messagesLoading,
    sendMessage,
    startNewChat,
    deleteChat: deleteChatMutation.mutate,
    isCreatingChat: createChatMutation.isPending,
    isSendingMessage: sendMessageMutation.isPending,
    isDeletingChat: deleteChatMutation.isPending,
  };
}
