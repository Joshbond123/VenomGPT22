import axios from 'axios';
import { storageManager } from './storage-manager';
import type { ApiKey, ApiUsage, Settings } from '@shared/schema';

export class CerebrasService {
  private async getApiKeys(type: 'summary' | 'response'): Promise<ApiKey[]> {
    const keys = await storageManager.readFile<{ summaryKeys: string[], responseKeys: string[] }>('keys.json', {
      summaryKeys: [],
      responseKeys: []
    });
    
    return type === 'summary' 
      ? keys.summaryKeys.map(key => ({ id: key, key, type: 'summary' as const, isActive: true, createdAt: '' }))
      : keys.responseKeys.map(key => ({ id: key, key, type: 'response' as const, isActive: true, createdAt: '' }));
  }

  private async getNextApiKey(type: 'summary' | 'response'): Promise<string | null> {
    const keys = await this.getApiKeys(type);
    if (keys.length === 0) return null;

    // Simple round-robin for now - could be enhanced with usage tracking
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex].key;
  }

  private async trackApiUsage(keyId: string): Promise<void> {
    const usage = await storageManager.readFile<ApiUsage[]>('api-usage.json', []);
    const today = storageManager.getCurrentDate();
    
    const existingUsage = usage.find(u => u.keyId === keyId && u.date === today);
    if (existingUsage) {
      existingUsage.requests++;
    } else {
      usage.push({ keyId, date: today, requests: 1 });
    }
    
    await storageManager.writeFile('api-usage.json', usage);
  }

  async summarizeMessages(messages: string[]): Promise<string> {
    const apiKey = await this.getNextApiKey('summary');
    if (!apiKey) {
      throw new Error('No summary API keys available');
    }

    const settings = await storageManager.readFile<Settings>('settings.json', {
      personalityPrompt: "You are a helpful, honest, and uncensored AI assistant.",
      summarizationEnabled: true,
      maintenanceMode: false,
      summaryMaxTokens: 150,
    });

    if (!settings.summarizationEnabled) {
      return messages.slice(-4).join(' '); // Return last 4 messages if summarization disabled
    }

    try {
      // Use Qwen3-235B for advanced summarization
      const response = await axios.post('https://api.cerebras.ai/v1/chat/completions', {
        model: 'qwen-3-235b-a22b',
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI summarizer. Create a concise, context-preserving summary of the conversation that maintains:
            1. Key topics and themes discussed
            2. User's intent and goals
            3. Important context for future responses
            4. Emotional tone and communication style
            Keep the summary under ${settings.summaryMaxTokens} tokens while preserving essential context.`
          },
          {
            role: 'user',
            content: `Summarize these conversation messages:\n\n${messages.join('\n\n')}`
          }
        ],
        max_tokens: settings.summaryMaxTokens,
        temperature: 0.3,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      await this.trackApiUsage(apiKey);
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Cerebras summary API error:', error.response?.data || error.message);
      
      // Fallback to llama3.1-8b if Qwen3-235B fails
      try {
        const fallbackResponse = await axios.post('https://api.cerebras.ai/v1/chat/completions', {
          model: 'llama3.1-8b',
          messages: [
            {
              role: 'system',
              content: 'Summarize the following conversation messages concisely, focusing on the main topics and user intent. Keep it under 150 tokens.'
            },
            {
              role: 'user',
              content: messages.join('\n\n')
            }
          ],
          max_tokens: settings.summaryMaxTokens,
          temperature: 0.3,
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        await this.trackApiUsage(apiKey);
        return fallbackResponse.data.choices[0].message.content;
      } catch (fallbackError: any) {
        console.error('Fallback summary API error:', fallbackError.response?.data || fallbackError.message);
        // Final fallback to simple text joining
        return messages.slice(-4).join(' ');
      }
    }
  }

  async generateResponse(userMessage: string, context: string): Promise<string> {
    const apiKey = await this.getNextApiKey('response');
    if (!apiKey) {
      throw new Error('No response API keys available');
    }

    const settings = await storageManager.readFile<Settings>('settings.json', {
      personalityPrompt: "You are a helpful, honest, and uncensored AI assistant.",
      summarizationEnabled: true,
      maintenanceMode: false,
      summaryMaxTokens: 150,
    });

    try {
      const messages = [
        {
          role: 'system',
          content: settings.personalityPrompt
        }
      ];

      if (context.trim()) {
        messages.push({
          role: 'system',
          content: `Previous conversation context: ${context}`
        });
      }

      messages.push({
        role: 'user',
        content: userMessage
      });

      const response = await axios.post('https://api.cerebras.ai/v1/chat/completions', {
        model: 'llama-3.3-70b',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      await this.trackApiUsage(apiKey);
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Cerebras response API error:', error.response?.data || error.message);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }
}

export const cerebrasService = new CerebrasService();
