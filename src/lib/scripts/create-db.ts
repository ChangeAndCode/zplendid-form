import mysql from 'mysql2/promise';

/**
 * Script para crear la base de datos
 * Ejecutar con: npx tsx src/backend/scripts/create-db.ts
 */
async function main() {
  try {
    
    // Configuración para conectar sin especificar base de datos
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    };
    // Conectar sin especificar base de datos
    const connection = await mysql.createConnection(config);

    const dbName = process.env.DB_NAME;
    
    // Crear la base de datos
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    // Verificar que se creó correctamente
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbList = databases as { Database: string }[];
    const dbExists = dbList.some(db => db.Database === dbName);
    
    if (!dbExists) {
      throw new Error('No se pudo crear la base de datos');
    }

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
      } else if (error.message.includes('ECONNREFUSED')) {
      }
    }
    
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}
