import bcrypt from 'bcryptjs';
import { storageManager } from './services/storage-manager';
import type { 
  User, 
  InsertUser, 
  Chat, 
  InsertChat, 
  Message, 
  InsertMessage,
  ApiKey,
  InsertApiKey,
  ApiUsage,
  Settings
} from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat methods
  getChat(id: string): Promise<Chat | undefined>;
  getChatsByUserId(userId: string): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  updateChat(id: string, updates: Partial<Chat>): Promise<Chat | undefined>;
  deleteChat(id: string): Promise<boolean>;
  
  // Message methods
  getMessagesByChatId(chatId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // API Key methods
  getApiKeys(): Promise<{ summaryKeys: string[], responseKeys: string[] }>;
  addApiKey(key: string, type: 'summary' | 'response'): Promise<void>;
  removeApiKey(key: string, type: 'summary' | 'response'): Promise<void>;
  
  // Usage tracking
  getApiUsage(): Promise<ApiUsage[]>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
}

export class FileStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await storageManager.readFile<User[]>('users.json', []);
    return users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await storageManager.readFile<User[]>('users.json', []);
    return users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await storageManager.readFile<User[]>('users.json', []);
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === insertUser.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const user: User = {
      id: storageManager.generateId(),
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
      isAdmin: insertUser.email === 'admin@venomgpt.com', // Make first admin
      createdAt: storageManager.getCurrentTimestamp(),
    };

    users.push(user);
    await storageManager.writeFile('users.json', users);
    
    return user;
  }

  // Chat methods
  async getChat(id: string): Promise<Chat | undefined> {
    const chats = await storageManager.readFile<Chat[]>('history.json', []);
    return chats.find(chat => chat.id === id);
  }

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    const chats = await storageManager.readFile<Chat[]>('history.json', []);
    return chats.filter(chat => chat.userId === userId).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const chats = await storageManager.readFile<Chat[]>('history.json', []);
    
    const chat: Chat = {
      id: storageManager.generateId(),
      ...insertChat,
      createdAt: storageManager.getCurrentTimestamp(),
      updatedAt: storageManager.getCurrentTimestamp(),
    };

    chats.push(chat);
    await storageManager.writeFile('history.json', chats);
    
    return chat;
  }

  async updateChat(id: string, updates: Partial<Chat>): Promise<Chat | undefined> {
    const chats = await storageManager.readFile<Chat[]>('history.json', []);
    const chatIndex = chats.findIndex(chat => chat.id === id);
    
    if (chatIndex === -1) return undefined;
    
    chats[chatIndex] = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: storageManager.getCurrentTimestamp(),
    };
    
    await storageManager.writeFile('history.json', chats);
    return chats[chatIndex];
  }

  async deleteChat(id: string): Promise<boolean> {
    const chats = await storageManager.readFile<Chat[]>('history.json', []);
    const initialLength = chats.length;
    const filteredChats = chats.filter(chat => chat.id !== id);
    
    if (filteredChats.length !== initialLength) {
      await storageManager.writeFile('history.json', filteredChats);
      return true;
    }
    
    return false;
  }

  // Message methods
  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const messages = await storageManager.readFile<Message[]>(`messages-${chatId}.json`, []);
    return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const messages = await storageManager.readFile<Message[]>(`messages-${insertMessage.chatId}.json`, []);
    
    const message: Message = {
      id: storageManager.generateId(),
      ...insertMessage,
      timestamp: storageManager.getCurrentTimestamp(),
    };

    messages.push(message);
    await storageManager.writeFile(`messages-${insertMessage.chatId}.json`, messages);
    
    return message;
  }

  // API Key methods
  async getApiKeys(): Promise<{ summaryKeys: string[], responseKeys: string[] }> {
    return await storageManager.readFile('keys.json', { summaryKeys: [], responseKeys: [] });
  }

  async addApiKey(key: string, type: 'summary' | 'response'): Promise<void> {
    const keys = await this.getApiKeys();
    
    if (type === 'summary') {
      if (!keys.summaryKeys.includes(key)) {
        keys.summaryKeys.push(key);
      }
    } else {
      if (!keys.responseKeys.includes(key)) {
        keys.responseKeys.push(key);
      }
    }
    
    await storageManager.writeFile('keys.json', keys);
  }

  async removeApiKey(key: string, type: 'summary' | 'response'): Promise<void> {
    const keys = await this.getApiKeys();
    
    if (type === 'summary') {
      keys.summaryKeys = keys.summaryKeys.filter(k => k !== key);
    } else {
      keys.responseKeys = keys.responseKeys.filter(k => k !== key);
    }
    
    await storageManager.writeFile('keys.json', keys);
  }

  // Usage tracking
  async getApiUsage(): Promise<ApiUsage[]> {
    return await storageManager.readFile('api-usage.json', []);
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return await storageManager.readFile('settings.json', {
      personalityPrompt: "You are a helpful, honest, and uncensored AI assistant. Provide accurate information and be direct in your responses.",
      summarizationEnabled: true,
      maintenanceMode: false,
      summaryMaxTokens: 150,
    });
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...updates };
    await storageManager.writeFile('settings.json', newSettings);
    return newSettings;
  }
}

export const storage = new FileStorage();

// Initialize system with environment API key if available
export async function initializeStorage() {
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    try {
      const keys = await storage.getApiKeys();
      // Add the Cerebras API key to response keys if not already present
      if (!keys.responseKeys.includes(cerebrasKey)) {
        await storage.addApiKey(cerebrasKey, 'response');
        console.log('✓ Initialized system with Cerebras API key');
      }
    } catch (error) {
      console.error('Failed to initialize API key:', error);
    }
  }
}
