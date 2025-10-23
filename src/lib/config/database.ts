import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_zplendid',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// Debug: Log configuration (sin mostrar password)
console.log('🔧 Database config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  port: config.port,
  hasPassword: !!config.password
});

let connection: mysql.Connection | null = null;

export const getConnection = async (): Promise<mysql.Connection> => {
  if (!connection) {
    try {
      connection = await mysql.createConnection(config);
      console.log('✅ Conexión a MySQL establecida correctamente');
    } catch (error) {
      console.error('❌ Error al conectar con MySQL:', error);
      throw error;
    }
  }
  return connection;
};

export const closeConnection = async (): Promise<void> => {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('🔌 Conexión a MySQL cerrada');
  }
};

export default config;
