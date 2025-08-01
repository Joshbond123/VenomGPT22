import { apiRequest } from "./queryClient";
import type { LoginData, RegisterData, User, Chat, Message, Settings } from "@shared/schema";

export const api = {
  auth: {
    register: async (data: RegisterData) => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return res.json();
    },
    login: async (data: LoginData) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return res.json();
    },
    logout: async () => {
      const res = await apiRequest('POST', '/api/auth/logout');
      return res.json();
    },
    me: async () => {
      const res = await apiRequest('GET', '/api/auth/me');
      return res.json();
    },
  },
  
  chats: {
    list: async () => {
      const res = await apiRequest('GET', '/api/chats');
      return res.json();
    },
    create: async (title?: string) => {
      const res = await apiRequest('POST', '/api/chats', { title });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/chats/${id}`);
      return res.json();
    },
    getMessages: async (id: string) => {
      const res = await apiRequest('GET', `/api/chats/${id}/messages`);
      return res.json();
    },
    sendMessage: async (id: string, content: string) => {
      const res = await apiRequest('POST', `/api/chats/${id}/messages`, { content });
      return res.json();
    },
  },
  
  admin: {
    getStats: async () => {
      const res = await apiRequest('GET', '/api/admin/stats');
      return res.json();
    },
    getKeys: async () => {
      const res = await apiRequest('GET', '/api/admin/keys');
      return res.json();
    },
    addKey: async (key: string, type: 'summary' | 'response') => {
      const res = await apiRequest('POST', '/api/admin/keys', { key, type });
      return res.json();
    },
    removeKey: async (key: string, type: 'summary' | 'response') => {
      const res = await apiRequest('DELETE', `/api/admin/keys/${key}?type=${type}`);
      return res.json();
    },
    getSettings: async () => {
      const res = await apiRequest('GET', '/api/admin/settings');
      return res.json();
    },
    updateSettings: async (settings: Partial<Settings>) => {
      const res = await apiRequest('PATCH', '/api/admin/settings', settings);
      return res.json();
    },
  },
};
