import sql from 'mssql';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

export interface DatabaseConfig {
  server: string;
  user: string;
  password: string;
  database: string;
  port: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
  };
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
  server: getRequiredEnvVar('DB_HOST'),
  user: getRequiredEnvVar('DB_USER'),
  password: getRequiredEnvVar('DB_PASSWORD'),
  database: getRequiredEnvVar('DB_NAME'),
  port: getRequiredPort(),
  options: {
    encrypt: false, // Cambiar a true si usas SSL
    trustServerCertificate: true, // Para desarrollo local
    enableArithAbort: true
  }
};

// Debug: Log configuration (sin mostrar password)
console.log('🔧 Database config:', {
  server: config.server,
  user: config.user,
  database: config.database,
  port: config.port,
  hasPassword: !!config.password
});

let pool: sql.ConnectionPool | null = null;

export const getConnection = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    try {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('✅ Conexión a SQL Server establecida correctamente');
    } catch (error) {
      console.error('❌ Error al conectar con SQL Server:', error);
      throw error;
    }
  }
  return pool;
};

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('🔌 Conexión a SQL Server cerrada');
  }
};

export default config;
