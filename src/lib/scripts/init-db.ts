import { initializeDatabase, checkDatabaseConnection } from '../../lib/config/init';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

/**
 * Script para inicializar la base de datos
 * Ejecutar con: npx tsx src/backend/scripts/init-db.ts
 */
async function main() {
  try {
    console.log('🚀 Iniciando configuración de la base de datos...');
    
    // Verificar conexión
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos. Verifica tu configuración.');
      process.exit(1);
    }
    
    // Inicializar tablas
    await initializeDatabase();
    
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('📝 Puedes crear un usuario administrador usando la API de registro.');
    
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}
