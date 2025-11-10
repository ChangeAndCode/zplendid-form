/**
 * Script para crear la tabla medical_records si no existe
 * Ejecutar con: npm run create-medical-records-table
 * o: npx tsx src/lib/scripts/create-medical-records-table.ts
 */

import { getConnection } from '../config/database';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

async function createMedicalRecordsTable() {
  try {
    console.log('🔨 Creando tabla medical_records...');
    
    const connection = await getConnection();
    
    // Verificar si la tabla ya existe
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'medical_records'`,
      [process.env.DB_NAME || 'db_zplendid']
    );
    
    const tableExists = Array.isArray(tables) && tables.length > 0;
    
    if (tableExists) {
      console.log('✅ La tabla medical_records ya existe');
      return;
    }
    
    // Crear la tabla medical_records
    const createTableQuery = `
      CREATE TABLE medical_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        recordNumber VARCHAR(20) NOT NULL,
        formType VARCHAR(50) DEFAULT 'form',
        formData JSON,
        isCompleted TINYINT(1) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_userId (userId),
        INDEX idx_recordNumber (recordNumber),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Tabla medical_records creada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al crear la tabla medical_records:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createMedicalRecordsTable()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { createMedicalRecordsTable };

