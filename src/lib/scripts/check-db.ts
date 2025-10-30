import dotenv from 'dotenv';
import { getConnection } from '../config/database';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

/**
 * Script para verificar la conexión a la base de datos
 * Ejecutar con: npx tsx src/backend/scripts/check-db.ts
 */
async function main() {
  try {
    const connection = await getConnection();
    
    // Ejecutar una consulta simple para verificar la conexión
    await connection.execute('SELECT 1 as test');
    
    // Verificar si la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbList = databases as { Database: string }[];
    const targetDb = process.env.DB_NAME || 'db_zplendid';
    
    const dbExists = dbList.some(db => db.Database === targetDb);
    
    if (!dbExists) {
      throw new Error(`Base de datos '${targetDb}' no encontrada`);
    }
    
    await connection.end();
    
  } catch {
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}
