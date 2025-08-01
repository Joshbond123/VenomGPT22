import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  isAdmin: z.boolean().default(false),
  createdAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, isAdmin: true });
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Chat message schema
export const messageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string(),
});

export const insertMessageSchema = messageSchema.omit({ id: true, timestamp: true });
export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Chat session schema
export const chatSchema = z.object({
  id: z.string(),
  userId: z.string().optional(), // undefined for anonymous users
  title: z.string(),
  summary: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertChatSchema = chatSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type Chat = z.infer<typeof chatSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;

// API key schema
export const apiKeySchema = z.object({
  id: z.string(),
  key: z.string(),
  type: z.enum(['summary', 'response']),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

export const insertApiKeySchema = apiKeySchema.omit({ id: true, createdAt: true });
export type ApiKey = z.infer<typeof apiKeySchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

// API usage schema
export const apiUsageSchema = z.object({
  keyId: z.string(),
  date: z.string(), // YYYY-MM-DD format
  requests: z.number().default(0),
});

export type ApiUsage = z.infer<typeof apiUsageSchema>;

// Settings schema
export const settingsSchema = z.object({
  personalityPrompt: z.string().default("You are a helpful, honest, and uncensored AI assistant. Provide accurate information and be direct in your responses."),
  summarizationEnabled: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
  summaryMaxTokens: z.number().default(150),
});

export type Settings = z.infer<typeof settingsSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
