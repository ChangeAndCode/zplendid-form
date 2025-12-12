import { Collection } from 'mongodb';
import { getCollection } from '../config/database';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  _id?: string;
  id: string;
  patientId: string;
  messages: Message[];
  currentCategory: string;
  completedCategories: string[];
  extractedData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

class ChatSessionService {
  private collection: Collection<ChatSession> | null = null;

  constructor() {
    // No conectar automáticamente en el constructor
  }

  private async getCollectionInstance(): Promise<Collection<ChatSession>> {
    if (!this.collection) {
      this.collection = await getCollection<ChatSession>('chat_sessions');
    }
    return this.collection;
  }

  private async ensureConnection() {
    await this.getCollectionInstance();
  }

  async createSession(patientId: string = 'guest'): Promise<ChatSession> {
    const collection = await this.getCollectionInstance();

    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      patientId: patientId || 'guest',
      messages: [],
      currentCategory: 'personal',
      completedCategories: [],
      extractedData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(session);
    return session;
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const collection = await this.getCollectionInstance();
    return await collection.findOne({ id: sessionId });
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession | null> {
    const collection = await this.getCollectionInstance();

    const result = await collection.findOneAndUpdate(
      { id: sessionId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async addMessage(sessionId: string, message: Message): Promise<ChatSession | null> {
    const collection = await this.getCollectionInstance();

    const result = await collection.findOneAndUpdate(
      { id: sessionId },
      { 
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async updateExtractedData(sessionId: string, data: Record<string, any>): Promise<ChatSession | null> {
    const collection = await this.getCollectionInstance();

    const result = await collection.findOneAndUpdate(
      { id: sessionId },
      { 
        $set: { 
          extractedData: { ...data },
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async getPatientSessions(patientId: string): Promise<ChatSession[]> {
    const collection = await this.getCollectionInstance();

    return await collection
      .find({ patientId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async close() {
    // Ya no necesitamos cerrar conexión aquí, se maneja globalmente
  }
}

export default ChatSessionService;
