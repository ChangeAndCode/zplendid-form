import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

// Función para validar variables de entorno requeridas
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Variable de entorno requerida no encontrada: ${name}`);
  }
  return value;
};

// Función para validar puerto
const getRequiredPort = (): number => {
  const portStr = process.env.DB_PORT;
  if (!portStr) {
    throw new Error('❌ Variable de entorno requerida no encontrada: DB_PORT');
  }
  const port = parseInt(portStr);
  if (isNaN(port)) {
    throw new Error(`❌ DB_PORT debe ser un número válido, recibido: ${portStr}`);
  }
  return port;
};

const config: DatabaseConfig = {
  host: getRequiredEnvVar('DB_HOST'),
  user: getRequiredEnvVar('DB_USER'),
  password: getRequiredEnvVar('DB_PASSWORD'),
  database: getRequiredEnvVar('DB_NAME'),
  port: getRequiredPort(),
};

// Debug: Log configuration (sin mostrar password)
console.log('🔧 Database config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  port: config.port,
  hasPassword: !!config.password
});

// Pool singleton para entornos serverless (Render) — evita "connection is in closed state"
let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Configuración de timeouts para Render
    connectTimeout: 30000, // 30 segundos para establecer conexión
    acquireTimeout: 30000, // 30 segundos para adquirir conexión del pool
    timeout: 30000, // 30 segundos para queries
    // SSL si es necesario (para bases de datos remotas)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });
}

export const getConnection = async (): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = createPool();
      console.log('✅ Pool MySQL inicializado');
      
      // Verificar conexión inmediatamente
      try {
        const testConnection = await pool.getConnection();
        await testConnection.ping();
        testConnection.release();
        console.log('✅ Conexión a MySQL verificada exitosamente');
      } catch (pingError) {
        console.error('❌ Error al verificar conexión MySQL:', pingError);
        // No lanzar error aquí, solo loguear - el pool se creó pero la conexión falla
      }
    } catch (error) {
      console.error('❌ Error al crear el pool de MySQL:', error);
      throw error;
    }
  }
  return pool;
};

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 Pool MySQL cerrado');
  }
};

export default config;
