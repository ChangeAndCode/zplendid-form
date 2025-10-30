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
    keepAliveInitialDelay: 0
  });
}

export const getConnection = async (): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = createPool();
      console.log('✅ Pool MySQL inicializado');
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
