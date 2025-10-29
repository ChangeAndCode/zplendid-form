import { MongoClient, Db, Collection } from 'mongodb';

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
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<ChatSession> | null = null;

  constructor() {
    // No conectar automáticamente en el constructor
  }

  private async connect() {
    if (this.client && this.db && this.collection) {
      return; // Ya conectado
    }

    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      this.client = new MongoClient(mongoUri);
      await this.client.connect();
      this.db = this.client.db('zplendid');
      this.collection = this.db.collection<ChatSession>('chat_sessions');
      
      console.log('Connected to MongoDB for chat sessions');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  private async ensureConnection() {
    await this.connect();
  }

  async createSession(patientId: string): Promise<ChatSession> {
    await this.ensureConnection();

    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      patientId,
      messages: [],
      currentCategory: 'personal',
      completedCategories: [],
      extractedData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.collection.insertOne(session);
    return session;
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    await this.ensureConnection();

    return await this.collection.findOne({ id: sessionId });
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession | null> {
    await this.ensureConnection();

    const result = await this.collection.findOneAndUpdate(
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
    await this.ensureConnection();

    const result = await this.collection.findOneAndUpdate(
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
    await this.ensureConnection();

    const result = await this.collection.findOneAndUpdate(
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
    await this.ensureConnection();

    return await this.collection
      .find({ patientId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

export default ChatSessionService;
