import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

// Singleton para la conexión MongoDB
let client: MongoClient | null = null;
let db: Db | null = null;

// Wrapper para mantener compatibilidad con código existente
export interface DatabaseConnection {
  execute: (query: string, params?: any[]) => Promise<[any[], any]>;
  getConnection?: () => Promise<Collection>;
}

/**
 * Obtener conexión a MongoDB
 */
export const getConnection = async (): Promise<DatabaseConnection> => {
  if (!db || !client) {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('❌ Variable de entorno requerida no encontrada: MONGODB_URI');
      }

      client = new MongoClient(mongoUri);
      await client.connect();
      db = client.db('zplendid');
      
      console.log('✅ Conexión a MongoDB establecida');
      
      // Verificar conexión
      try {
        await db.admin().ping();
        console.log('✅ Conexión a MongoDB verificada exitosamente');
      } catch (pingError) {
        console.error('❌ Error al verificar conexión MongoDB:', pingError);
      }
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      throw error;
    }
  }

  // Retornar wrapper para compatibilidad (no se usa directamente)
  return {
    execute: async (query: string, params?: any[]) => {
      // Este método no se usará directamente, los modelos usarán las colecciones
      throw new Error('Use getCollection() instead of execute()');
    }
  };
};

/**
 * Obtener una colección específica
 */
export const getCollection = async <T = any>(collectionName: string): Promise<Collection<T>> => {
  if (!db) {
    await getConnection();
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db.collection<T>(collectionName);
};

/**
 * Obtener la instancia de la base de datos directamente
 */
export const getDatabase = async (): Promise<Db> => {
  if (!db) {
    await getConnection();
  }
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
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

export default { getConnection, getCollection, getDatabase, closeConnection };
