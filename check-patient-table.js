const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    console.log('🔍 Verificando estructura de patient_info...');
    
    // Obtener estructura de la tabla
    const [columns] = await connection.execute('DESCRIBE patient_info');
    console.log('📊 Total columnas en patient_info:', columns.length);
    console.log('📋 Columnas:');
    columns.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.Field} (${col.Type})`);
    });
    
    // Contar columnas de datos (excluyendo id, createdAt, updatedAt)
    const dataColumns = columns.filter(col => 
      !['id', 'createdAt', 'updatedAt'].includes(col.Field)
    );
    console.log('📊 Columnas de datos:', dataColumns.length);
    
    // Verificar cuántos placeholders necesitamos
    const placeholders = dataColumns.length + 2; // +2 para createdAt, updatedAt
    console.log('📊 Placeholders necesarios:', placeholders);
    console.log('📊 Valores que estamos enviando: 35');
    
    if (placeholders !== 35) {
      console.log('❌ PROBLEMA: La tabla tiene', placeholders, 'columnas pero estamos enviando 35 valores');
    } else {
      console.log('✅ Correcto: La tabla tiene', placeholders, 'columnas y estamos enviando 35 valores');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable();
