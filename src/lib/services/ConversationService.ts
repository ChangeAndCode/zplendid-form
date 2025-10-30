interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

interface ConversationSession {
  id: string;
  userId?: string;
  messages: ConversationMessage[];
  currentCategory: string;
  completedCategories: string[];
  extractedData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationService {
  private static sessions: Map<string, ConversationSession> = new Map();

  /**
   * Crear una nueva sesión de conversación
   */
  static createSession(userId?: string): string {
    const sessionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ConversationSession = {
      id: sessionId,
      userId,
      messages: [],
      currentCategory: 'general',
      completedCategories: [],
      extractedData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Obtener una sesión existente
   */
  static getSession(sessionId: string): ConversationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Agregar mensaje a la conversación
   */
  static addMessage(
    sessionId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    category?: string
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
      category: category || session.currentCategory
    };

    session.messages.push(message);
    session.updatedAt = new Date();
    
    return true;
  }

  /**
   * Cambiar categoría de la conversación
   */
  static changeCategory(sessionId: string, category: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.currentCategory = category;
    session.updatedAt = new Date();
    
    return true;
  }

  /**
   * Marcar categoría como completada
   */
  static markCategoryCompleted(sessionId: string, category: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (!session.completedCategories.includes(category)) {
      session.completedCategories.push(category);
      session.updatedAt = new Date();
    }
    
    return true;
  }

  /**
   * Extraer datos de la conversación
   */
  static extractData(sessionId: string, fieldName: string, value: any): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.extractedData[fieldName] = value;
    session.updatedAt = new Date();
    
    return true;
  }

  /**
   * Obtener datos extraídos
   */
  static getExtractedData(sessionId: string): Record<string, any> {
    const session = this.sessions.get(sessionId);
    return session ? session.extractedData : {};
  }

  /**
   * Obtener historial de conversación para Claude
   */
  static getConversationHistory(sessionId: string, maxMessages: number = 10): ConversationMessage[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return session.messages.slice(-maxMessages);
  }

  /**
   * Verificar si una categoría está completada
   */
  static isCategoryCompleted(sessionId: string, category: string): boolean {
    const session = this.sessions.get(sessionId);
    return session ? session.completedCategories.includes(category) : false;
  }

  /**
   * Obtener progreso de la conversación
   */
  static getProgress(sessionId: string): {
    totalCategories: number;
    completedCategories: number;
    currentCategory: string;
    progressPercentage: number;
  } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        totalCategories: 0,
        completedCategories: 0,
        currentCategory: 'general',
        progressPercentage: 0
      };
    }

    const totalCategories = 5; // personal, medical, surgical, weight, confirmation
    const completedCategories = session.completedCategories.length;
    const progressPercentage = Math.round((completedCategories / totalCategories) * 100);

    return {
      totalCategories,
      completedCategories,
      currentCategory: session.currentCategory,
      progressPercentage
    };
  }

  /**
   * Limpiar sesiones antiguas (más de 24 horas)
   */
  static cleanupOldSessions(): void {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt < twentyFourHoursAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
