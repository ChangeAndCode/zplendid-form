import mysql from 'mysql2/promise';

/**
 * Script para crear la base de datos
 * Ejecutar con: npx tsx src/backend/scripts/create-db.ts
 */
async function main() {
  try {
    console.log('🚀 Creando base de datos...');
    
    // Configuración para conectar sin especificar base de datos
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: parseInt(process.env.DB_PORT || '3306'),
    };

    console.log('📋 Configuración:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Puerto: ${config.port}`);
    console.log('');

    // Conectar sin especificar base de datos
    const connection = await mysql.createConnection(config);
    console.log('✅ Conectado a MySQL');

    const dbName = process.env.DB_NAME || 'db_zplendid';
    
    // Crear la base de datos
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Base de datos '${dbName}' creada/verificada`);

    // Verificar que se creó correctamente
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbList = databases as { Database: string }[];
    const dbExists = dbList.some(db => db.Database === dbName);
    
    if (dbExists) {
      console.log(`✅ Base de datos '${dbName}' confirmada`);
    } else {
      throw new Error('No se pudo crear la base de datos');
    }

    await connection.end();
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('');
    console.log('📝 Próximos pasos:');
    console.log('   1. npm run check-db  (verificar conexión)');
    console.log('   2. npm run init-db   (crear tablas)');
    
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
    
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
      }
    }
    
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}
