import { getConnection } from '../config/database';

/**
 * Script para verificar la conexión a la base de datos
 * Ejecutar con: npx tsx src/backend/scripts/check-db.ts
 */
async function main() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    console.log('📋 Configuración actual:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Usuario: ${process.env.DB_USER || 'root'}`);
    console.log(`   Base de datos: ${process.env.DB_NAME || 'db_zplendid'}`);
    console.log(`   Puerto: ${process.env.DB_PORT || '3306'}`);
    console.log('');

    const connection = await getConnection();
    
    // Ejecutar una consulta simple para verificar la conexión
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa!');
    console.log('📊 Resultado de prueba:', result);
    
    // Verificar si la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbList = databases as { Database: string }[];
    const targetDb = process.env.DB_NAME || 'db_zplendid';
    
    const dbExists = dbList.some(db => db.Database === targetDb);
    
    if (dbExists) {
      console.log(`✅ Base de datos '${targetDb}' encontrada`);
    } else {
      console.log(`❌ Base de datos '${targetDb}' NO encontrada`);
      console.log('📝 Bases de datos disponibles:');
      dbList.forEach(db => console.log(`   - ${db.Database}`));
      console.log('');
      console.log('💡 Para crear la base de datos, ejecuta:');
      console.log(`   CREATE DATABASE ${targetDb} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
        console.log('');
        console.log('🔐 Error de autenticación:');
        console.log('   - Verifica que el usuario y contraseña sean correctos');
        console.log('   - Asegúrate de que el archivo .env.local esté configurado');
        console.log('   - Verifica que MySQL esté ejecutándose');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('');
        console.log('🔌 Error de conexión:');
        console.log('   - Verifica que MySQL esté ejecutándose');
        console.log('   - Verifica que el puerto sea correcto (por defecto 3306)');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('');
        console.log('🌐 Error de host:');
        console.log('   - Verifica que el host sea correcto (localhost)');
      }
    }
    
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}
