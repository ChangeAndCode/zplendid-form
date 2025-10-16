const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function recreateTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('🗑️ Eliminando tabla surgery_interest...');
    await connection.execute('DROP TABLE IF EXISTS surgery_interest');
    
    console.log('🔍 Revisando estructura de patient_info (que funciona)...');
    const [patientColumns] = await connection.execute('DESCRIBE patient_info');
    const patientDataColumns = patientColumns.filter(col => !['id', 'createdAt', 'updatedAt'].includes(col.Field));
    console.log('📊 patient_info tiene', patientDataColumns.length, 'columnas de datos');
    
    console.log('🔍 Revisando estructura de family_history (que funciona)...');
    const [familyColumns] = await connection.execute('DESCRIBE family_history');
    const familyDataColumns = familyColumns.filter(col => !['id', 'createdAt', 'updatedAt'].includes(col.Field));
    console.log('📊 family_history tiene', familyDataColumns.length, 'columnas de datos');
    
    console.log('🔍 Revisando estructura de medical_history (que funciona)...');
    const [medicalColumns] = await connection.execute('DESCRIBE medical_history');
    const medicalDataColumns = medicalColumns.filter(col => !['id', 'createdAt', 'updatedAt'].includes(col.Field));
    console.log('📊 medical_history tiene', medicalDataColumns.length, 'columnas de datos');
    
    console.log('🔨 Creando tabla surgery_interest con estructura correcta...');
    
    const createTableQuery = `
      CREATE TABLE surgery_interest (
        id INT AUTO_INCREMENT PRIMARY KEY,
        medicalRecordId INT NOT NULL UNIQUE,
        
        -- Previous Weight Loss Surgery
        previousWeightLossSurgery ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        previousSurgeonName VARCHAR(255),
        consultedAboutWeightLoss ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        consultationType VARCHAR(255),
        consultationDate DATE,
        
        -- Surgery Interest
        surgeryInterest VARCHAR(255),
        firstTimeBariatricName VARCHAR(255),
        revisionalBariatricName VARCHAR(255),
        primaryPlasticName VARCHAR(255),
        postBariatricPlasticName VARCHAR(255),
        
        -- Weight History
        highestWeight VARCHAR(50),
        highestWeightDate DATE,
        surgeryWeight VARCHAR(50),
        lowestWeight VARCHAR(50),
        lowestWeightDate DATE,
        currentWeight VARCHAR(50),
        currentWeightDuration VARCHAR(255),
        goalWeight VARCHAR(50),
        goalWeightDate DATE,
        weightRegained ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        weightRegainedDate DATE,
        weightRegainTime VARCHAR(255),
        
        -- Surgery Details
        surgeryReadiness ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        surgeonPreference VARCHAR(255),
        additionalProcedures TEXT,
        estimatedSurgeryDate DATE,
        
        -- GERD Information
        gerdHeartburn ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdRegurgitation ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdChestPain ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdDifficultySwallowing ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdNausea ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdSleepDisturbance ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdEndoscopy ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdPhStudy ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        gerdManometry ENUM('yes', 'no', 'unknown') DEFAULT 'unknown',
        
        -- PGWBI Questions (1-18)
        pgwbi1Anxious VARCHAR(10),
        pgwbi2Depressed VARCHAR(10),
        pgwbi3SelfControl VARCHAR(10),
        pgwbi4Vitality VARCHAR(10),
        pgwbi5Health VARCHAR(10),
        pgwbi6Spirits VARCHAR(10),
        pgwbi7Worried VARCHAR(10),
        pgwbi8Energy VARCHAR(10),
        pgwbi9Mood VARCHAR(10),
        pgwbi10Tension VARCHAR(10),
        pgwbi11Happiness VARCHAR(10),
        pgwbi12Interest VARCHAR(10),
        pgwbi13Calm VARCHAR(10),
        pgwbi14Sad VARCHAR(10),
        pgwbi15Active VARCHAR(10),
        pgwbi16Cheerful VARCHAR(10),
        pgwbi17Tired VARCHAR(10),
        pgwbi18Pressure VARCHAR(10),
        
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (medicalRecordId) REFERENCES medical_records(id) ON DELETE CASCADE
      )
    `;
    
    await connection.execute(createTableQuery);
    
    console.log('✅ Tabla surgery_interest recreada correctamente');
    
    // Verificar la estructura
    const [columns] = await connection.execute('DESCRIBE surgery_interest');
    const dataColumns = columns.filter(col => !['id', 'createdAt', 'updatedAt'].includes(col.Field));
    
    console.log('📊 Total de columnas:', columns.length);
    console.log('📊 Columnas de datos:', dataColumns.length);
    console.log('📊 Columnas para INSERT:', dataColumns.length + 2);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

recreateTable();
