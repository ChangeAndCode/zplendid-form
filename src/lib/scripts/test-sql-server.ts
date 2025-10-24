import { getConnection, closeConnection } from '../config/database';
import { UserModel } from '../models/User';
import { PatientRecordModel } from '../models/PatientRecord';
import { PatientFormDataModel } from '../models/PatientFormData';

async function testSqlServerConnection() {
  console.log('🔧 Iniciando prueba de conexión a SQL Server...\n');

  try {
    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const pool = await getConnection();
    console.log('✅ Conexión establecida correctamente\n');

    // 2. Crear tablas
    console.log('2️⃣ Creando tablas...');
    await UserModel.createTable();
    console.log('✅ Tabla users creada/verificada');
    
    await PatientRecordModel.createTable();
    console.log('✅ Tabla patient_records creada/verificada');
    
    await PatientFormDataModel.createTable();
    console.log('✅ Tabla patient_form_data creada/verificada\n');

    // 3. Probar operaciones básicas
    console.log('3️⃣ Probando operaciones básicas...');
    
    // Crear un usuario de prueba
    const testUser = await UserModel.create({
      email: 'test@zplendid.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });
    console.log('✅ Usuario de prueba creado:', testUser.email);

    // Crear un expediente de paciente
    const patientRecord = await PatientRecordModel.create(testUser.id);
    console.log('✅ Expediente de paciente creado:', patientRecord.patientId);

    // Guardar datos de formulario
    const formData = {
      name: 'Test Patient',
      age: 30,
      medicalHistory: ['diabetes', 'hypertension']
    };
    await PatientFormDataModel.saveFormData(patientRecord.patientId, 'medical-history', formData);
    console.log('✅ Datos de formulario guardados');

    // Recuperar datos
    const retrievedData = await PatientFormDataModel.getFormData(patientRecord.patientId, 'medical-history');
    console.log('✅ Datos recuperados:', retrievedData);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('✅ SQL Server está funcionando correctamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await closeConnection();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testSqlServerConnection()
    .then(() => {
      console.log('\n✅ Prueba completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Prueba falló:', error);
      process.exit(1);
    });
}

export { testSqlServerConnection };
