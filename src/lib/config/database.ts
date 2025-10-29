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
