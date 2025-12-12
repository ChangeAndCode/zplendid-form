import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

// Singleton para la conexión MongoDB
let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<void> | null = null;
let isConnecting = false;
let connectionEstablished = false;

// Wrapper para mantener compatibilidad con código existente
export interface DatabaseConnection {
  execute: (query: string, params?: any[]) => Promise<[any[], any]>;
  getConnection?: () => Promise<Collection>;
}

/**
 * Obtener conexión a MongoDB (mejorado para evitar múltiples conexiones)
 */
export const getConnection = async (): Promise<DatabaseConnection> => {
  // Si ya hay una conexión establecida, retornar inmediatamente
  if (db && client && connectionEstablished) {
    return {
      execute: async (query: string, params?: any[]) => {
        throw new Error('Use getCollection() instead of execute()');
      }
    };
  }

  // Si ya hay una conexión en proceso, esperar a que termine
  if (isConnecting && connectionPromise) {
    try {
      await connectionPromise;
    } catch (error) {
      // Si la conexión falló, resetear el estado
      isConnecting = false;
      connectionPromise = null;
      throw error;
    }
    // Verificar nuevamente después de esperar
    if (db && client && connectionEstablished) {
      return {
        execute: async (query: string, params?: any[]) => {
          throw new Error('Use getCollection() instead of execute()');
        }
      };
    }
  }

  // Crear nueva conexión
  isConnecting = true;
  connectionPromise = (async () => {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('❌ Variable de entorno requerida no encontrada: MONGODB_URI');
      }

      client = new MongoClient(mongoUri, {
        maxPoolSize: 10, // Limitar pool de conexiones
        minPoolSize: 1,
      });
      await client.connect();
      db = client.db('zplendid');
      
      // Solo mostrar log una vez al establecer la conexión
      if (!connectionEstablished) {
        console.log('✅ Conexión a MongoDB establecida');
        connectionEstablished = true;
      }
      
      // Verificar conexión (solo una vez)
      try {
        await db.admin().ping();
      } catch (pingError) {
        console.error('❌ Error al verificar conexión MongoDB:', pingError);
      }
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      client = null;
      db = null;
      connectionEstablished = false;
      isConnecting = false;
      connectionPromise = null;
      throw error;
    } finally {
      isConnecting = false;
    }
  })();

  try {
    await connectionPromise;
  } catch (error) {
    // Resetear estado en caso de error
    isConnecting = false;
    connectionPromise = null;
    throw error;
  }

  // Retornar wrapper para compatibilidad (no se usa directamente)
  return {
    execute: async (query: string, params?: any[]) => {
      throw new Error('Use getCollection() instead of execute()');
    }
  };
};

/**
 * Obtener una colección específica
 */
export const getCollection = async <T = any>(collectionName: string): Promise<Collection<T>> => {
  // Si hay una conexión en proceso, esperar a que termine
  if (isConnecting && connectionPromise) {
    try {
      await connectionPromise;
    } catch (error) {
      // Si falló, intentar reconectar
      await getConnection();
    }
  }
  
  // Asegurar que la conexión esté establecida
  if (!db || !client || !connectionEstablished) {
    await getConnection();
  }
  
  // Verificar nuevamente después de esperar la conexión
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db.collection<T>(collectionName);
};

/**
 * Obtener la instancia de la base de datos directamente
 */
export const getDatabase = async (): Promise<Db> => {
  // Si hay una conexión en proceso, esperar a que termine
  if (isConnecting && connectionPromise) {
    try {
      await connectionPromise;
    } catch (error) {
      // Si falló, intentar reconectar
      await getConnection();
    }
  }
  
  // Asegurar que la conexión esté establecida
  if (!db || !client || !connectionEstablished) {
    await getConnection();
  }
  
  // Verificar nuevamente después de esperar la conexión
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    connectionEstablished = false;
    isConnecting = false;
    connectionPromise = null;
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

export default { getConnection, getCollection, getDatabase, closeConnection };
