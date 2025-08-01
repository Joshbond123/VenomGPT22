import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import bcrypt from 'bcryptjs';
import session from 'express-session';
import MemoryStore from 'memorystore';
import { storage } from "./storage";
import { cerebrasService } from "./services/cerebras";
import { loginSchema, registerSchema, settingsSchema } from "@shared/schema";

// Session type declaration
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'venom-gpt-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    // Check for admin bypass header (sent by frontend when localStorage adminAccess is true)
    const adminBypass = req.headers['x-admin-bypass'] as string;
    console.log('Admin bypass header:', adminBypass);
    
    if (adminBypass === 'true') {
      console.log('Admin bypass approved');
      return next();
    }
    
    if (!req.session?.userId) {
      console.log('No session userId');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const user = await storage.createUser(data);
      
      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isAdmin: user.isAdmin 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      
      if (!user || !await bcrypt.compare(data.password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isAdmin: user.isAdmin 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        isAdmin: user.isAdmin 
      } 
    });
  });

  // Check maintenance mode middleware for chat routes
  const checkMaintenanceMode = async (req: any, res: any, next: any) => {
    const settings = await storage.getSettings();
    if (settings.maintenanceMode) {
      return res.status(503).json({ message: 'System is in maintenance mode' });
    }
    next();
  };

  // Chat routes
  app.get('/api/chats', requireAuth, async (req, res) => {
    try {
      const chats = await storage.getChatsByUserId(req.session.userId);
      res.json({ chats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/chats', async (req, res) => {
    try {
      const { title, userId } = req.body;
      
      // For anonymous users, userId will be undefined
      const chatUserId = req.session?.userId || userId;
      
      const chat = await storage.createChat({
        title: title || 'New Chat',
        userId: chatUserId,
      });
      
      res.json({ chat });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/chats/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByChatId(id);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/chats/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      // Create user message
      const userMessage = await storage.createMessage({
        chatId: id,
        role: 'user',
        content,
      });

      // Get all messages for this chat
      const messages = await storage.getMessagesByChatId(id);
      
      // Implement sliding window context (4-message window)
      let context = '';
      if (messages.length >= 5) {
        // After 5th message, summarize messages 2-5 (sliding window)
        const windowStart = Math.max(0, messages.length - 4);
        const windowEnd = messages.length;
        const windowMessages = messages.slice(windowStart, windowEnd);
        
        const messageTexts = windowMessages.map(m => `${m.role}: ${m.content}`);
        context = await cerebrasService.summarizeMessages(messageTexts);
      } else if (messages.length > 1) {
        // For conversations with less than 5 messages, use all previous messages as context
        const messageTexts = messages.slice(0, -1).map(m => `${m.role}: ${m.content}`);
        context = messageTexts.join('\n');
      }

      // Generate AI response
      const aiResponse = await cerebrasService.generateResponse(content, context);

      // Save AI response
      const aiMessage = await storage.createMessage({
        chatId: id,
        role: 'assistant',
        content: aiResponse,
      });

      // Update chat title if this is the first user message
      if (messages.length === 1) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await storage.updateChat(id, { title });
      }

      res.json({ userMessage, aiMessage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/api/chats/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteChat(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      
      res.json({ message: 'Chat deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
      const users = []; // Mock data for now since readFile is not available
      const usage = await storage.getApiUsage();
      const keys = await storage.getApiKeys();
      
      const today = new Date().toISOString().split('T')[0];
      const todayUsage = usage.filter(u => u.date === today);
      const totalRequestsToday = todayUsage.reduce((sum, u) => sum + u.requests, 0);
      
      const stats = {
        totalUsers: users.length,
        apiRequestsToday: totalRequestsToday,
        activeKeys: keys.summaryKeys.length + keys.responseKeys.length,
        systemStatus: 'online'
      };
      
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/keys', requireAdmin, async (req, res) => {
    try {
      const keys = await storage.getApiKeys();
      const usage = await storage.getApiUsage();
      const today = new Date().toISOString().split('T')[0];
      
      // Add usage information to keys
      const summaryKeys = keys.summaryKeys.map(key => {
        const todayUsage = usage.find(u => u.keyId === key && u.date === today);
        return {
          id: key,
          key: key.slice(0, 8) + '...' + key.slice(-4),
          type: 'summary',
          requestsToday: todayUsage?.requests || 0
        };
      });
      
      const responseKeys = keys.responseKeys.map(key => {
        const todayUsage = usage.find(u => u.keyId === key && u.date === today);
        return {
          id: key,
          key: key.slice(0, 8) + '...' + key.slice(-4),
          type: 'response',
          requestsToday: todayUsage?.requests || 0
        };
      });
      
      res.json({ summaryKeys, responseKeys });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/keys', requireAdmin, async (req, res) => {
    try {
      const { key, type } = req.body;
      
      if (!key || !type || !['summary', 'response'].includes(type)) {
        return res.status(400).json({ message: 'Invalid key or type' });
      }
      
      await storage.addApiKey(key, type);
      res.json({ message: 'API key added successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/api/admin/keys/:key', requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { type } = req.query;
      
      if (!type || !['summary', 'response'].includes(type as string)) {
        return res.status(400).json({ message: 'Invalid type parameter' });
      }
      
      await storage.removeApiKey(key, type as 'summary' | 'response');
      res.json({ message: 'API key removed successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json({ settings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const updates = settingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(updates);
      res.json({ settings });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
