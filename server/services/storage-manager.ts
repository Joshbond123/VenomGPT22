import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const STORAGE_DIR = path.resolve(process.cwd(), 'storage');

export class StorageManager {
  private async ensureStorageDir() {
    try {
      await fs.access(STORAGE_DIR);
    } catch {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
    }
  }

  private async ensureFile(filename: string, defaultContent: any = []) {
    await this.ensureStorageDir();
    const filePath = path.join(STORAGE_DIR, filename);
    
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  }

  async readFile<T>(filename: string, defaultContent: T): Promise<T> {
    await this.ensureFile(filename, defaultContent);
    const filePath = path.join(STORAGE_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async writeFile(filename: string, data: any): Promise<void> {
    await this.ensureStorageDir();
    const filePath = path.join(STORAGE_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  generateId(): string {
    return randomUUID();
  }

  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export const storageManager = new StorageManager();
