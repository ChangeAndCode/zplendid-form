import { UserModel } from '../models/User';
import { PatientRecordModel } from '../models/PatientRecord';
import { PatientFormDataModel } from '../models/PatientFormData';
import { getConnection } from './database';

/**
 * Verificar conexión a la base de datos
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await getConnection();
    await connection.execute('SELECT 1 as test');
    console.log('✅ Conexión a la base de datos verificada');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
}

/**
 * Inicializar la base de datos y crear tablas necesarias
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Verificar conexión primero
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar con la base de datos');
    }
    
    // Crear tabla de usuarios
    await UserModel.createTable();
    
    // Crear tabla de expedientes de pacientes
    await PatientRecordModel.createTable();
    
    // Crear tabla de datos de formularios
    await PatientFormDataModel.createTable();
    
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}
