import { getConnection } from '../config/database';

/**
 * Utilidad para asegurar que las columnas de una tabla existan automáticamente
 * Similar al comportamiento de Excel donde las columnas se crean cuando se necesitan
 */
export class AutoSchema {
  
  /**
   * Asegurar que una tabla tenga todas las columnas especificadas
   * @param tableName Nombre de la tabla
   * @param requiredColumns Array de objetos con {name: string, type: string, nullable?: boolean}
   */
  static async ensureColumns(
    tableName: string, 
    requiredColumns: Array<{name: string, type: string, nullable?: boolean}>
  ): Promise<void> {
    const connection = await getConnection();
    
    try {
      // Verificar si la tabla existe
      const [tables] = await connection.execute(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
      `, [tableName]);
      
      const tableExists = Array.isArray(tables) && tables.length > 0;
      
      if (!tableExists) {
        // CREAR LA TABLA COMPLETA desde cero
        console.log(`🔨 Creando tabla completa: ${tableName}`);
        
        const columnDefinitions = requiredColumns.map(col => {
          const nullable = col.nullable !== false ? 'NULL' : 'NOT NULL';
          return `${col.name} ${col.type} ${nullable}`;
        }).join(',\n        ');
        
        const createTableQuery = `
          CREATE TABLE ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            medicalRecordId INT NOT NULL UNIQUE,
            ${columnDefinitions},
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (medicalRecordId) REFERENCES medical_records(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        await connection.execute(createTableQuery);
        console.log(`✅ Tabla ${tableName} creada completamente con todas las columnas`);
        
      } else {
        // La tabla existe, solo agregar columnas faltantes
        console.log(`📋 Verificando columnas faltantes en tabla existente: ${tableName}`);
        
        const [columns] = await connection.execute(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = ?
        `, [tableName]);
        
        const existingColumns = Array.isArray(columns) 
          ? (columns as { COLUMN_NAME: string }[]).map(col => col.COLUMN_NAME)
          : [];
        
        // Agregar solo las columnas que no existen
        for (const column of requiredColumns) {
          if (!existingColumns.includes(column.name)) {
            const nullable = column.nullable !== false ? 'NULL' : 'NOT NULL';
            await connection.execute(`
              ALTER TABLE ${tableName} 
              ADD COLUMN ${column.name} ${column.type} ${nullable}
            `);
            console.log(`✅ Columna automáticamente agregada: ${tableName}.${column.name}`);
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error al verificar/crear tabla ${tableName}:`, error);
      // No lanzar el error para no interrumpir el flujo principal
    }
  }
  
  /**
   * Asegurar que la tabla medical_history tenga TODAS las columnas necesarias
   * DINÁMICAMENTE basado en los campos del formulario
   */
  static async ensureMedicalHistoryColumns(): Promise<void> {
    // Definir todos los campos del formulario con sus tipos
    const medicalHistoryFields = {
      // Past Medical History
      sleepApnea: 'VARCHAR(255)',
      useCpap: 'VARCHAR(255)',
      cpapDetails: 'TEXT',
      diabetes: 'VARCHAR(255)',
      useInsulin: 'VARCHAR(255)',
      otherMedicalConditions: 'TEXT',
      
      // Heart Problems
      highBloodPressure: 'VARCHAR(255)',
      heartProblems: 'VARCHAR(255)',
      
      // Respiratory
      respiratoryProblems: 'VARCHAR(255)',
      respiratoryProblemsDetails: 'TEXT',
      
      // Other Systems
      urinaryConditions: 'VARCHAR(255)',
      urinaryConditionsDetails: 'TEXT',
      muscularConditions: 'VARCHAR(255)',
      muscularConditionsDetails: 'TEXT',
      neurologicalConditions: 'VARCHAR(255)',
      neurologicalConditionsDetails: 'TEXT',
      bloodDisorders: 'VARCHAR(255)',
      bloodDisordersDetails: 'TEXT',
      endocrineCondition: 'VARCHAR(255)',
      endocrineConditionDetails: 'TEXT',
      gastrointestinalConditions: 'VARCHAR(255)',
      headNeckConditions: 'VARCHAR(255)',
      skinConditions: 'VARCHAR(255)',
      constitutionalSymptoms: 'VARCHAR(255)',
      
      // Infectious Diseases
      hepatitis: 'VARCHAR(255)',
      hiv: 'VARCHAR(255)',
      refuseBlood: 'VARCHAR(255)',
      
      // Psychiatric
      psychiatricHospital: 'VARCHAR(255)',
      attemptedSuicide: 'VARCHAR(255)',
      depression: 'VARCHAR(255)',
      anxiety: 'VARCHAR(255)',
      eatingDisorders: 'VARCHAR(255)',
      psychiatricMedications: 'TEXT',
      psychiatricTherapy: 'VARCHAR(255)',
      psychiatricHospitalization: 'VARCHAR(255)',
      
      // Social History
      tobacco: 'VARCHAR(255)',
      tobaccoDetails: 'TEXT',
      alcohol: 'VARCHAR(255)',
      alcoholDetails: 'TEXT',
      drugs: 'VARCHAR(255)',
      drugsDetails: 'TEXT',
      caffeine: 'VARCHAR(255)',
      diet: 'VARCHAR(255)',
      otherSubstances: 'TEXT',
      
      // Medications & Allergies
      medications: 'TEXT',
      allergies: 'TEXT',
      
      // Past Surgical History
      previousSurgeries: 'TEXT',
      surgicalComplications: 'TEXT',
      
      // Diet Program
      dietProgram: 'VARCHAR(255)',
      
      // Only for Women
      pregnancy: 'VARCHAR(255)',
      pregnancyDetails: 'TEXT',
      
      // Referral
      referral: 'VARCHAR(255)',
      referralDetails: 'TEXT',
      
      // Other
      otherConditions: 'TEXT',
      hospitalizations: 'VARCHAR(255)',
      hospitalizationsDetails: 'TEXT'
    };
    
    // Convertir a formato requerido por ensureColumns
    const requiredColumns = Object.entries(medicalHistoryFields).map(([name, type]) => ({
      name,
      type
    }));
    
    await this.ensureColumns('medical_history', requiredColumns);
  }
  
  /**
   * Asegurar que la tabla surgery_interest tenga TODAS las columnas necesarias
   * Todas las preguntas del formulario de interés quirúrgico
   */
  static async ensureSurgeryInterestColumns(): Promise<void> {
    const requiredColumns: Array<{name: string, type: string, nullable?: boolean}> = [
      // Previous Weight Loss Surgery
      { name: 'previousWeightLossSurgery', type: 'VARCHAR(255)' },
      { name: 'previousSurgeonName', type: 'VARCHAR(255)' },
      { name: 'consultedAboutWeightLoss', type: 'VARCHAR(255)' },
      { name: 'consultationType', type: 'VARCHAR(255)' },
      { name: 'consultationDate', type: 'VARCHAR(255)' },
      
      // Surgery Interest
      { name: 'surgeryInterest', type: 'VARCHAR(255)' },
      { name: 'firstTimeBariatricName', type: 'VARCHAR(255)' },
      { name: 'revisionalBariatricName', type: 'VARCHAR(255)' },
      { name: 'primaryPlasticName', type: 'VARCHAR(255)' },
      { name: 'postBariatricPlasticName', type: 'VARCHAR(255)' },
      
      // Weight History
      { name: 'highestWeight', type: 'VARCHAR(255)' },
      { name: 'highestWeightDate', type: 'VARCHAR(255)' },
      { name: 'surgeryWeight', type: 'VARCHAR(255)' },
      { name: 'lowestWeight', type: 'VARCHAR(255)' },
      { name: 'lowestWeightDate', type: 'VARCHAR(255)' },
      { name: 'currentWeight', type: 'VARCHAR(255)' },
      { name: 'currentWeightDuration', type: 'VARCHAR(255)' },
      { name: 'goalWeight', type: 'VARCHAR(255)' },
      { name: 'goalWeightDate', type: 'VARCHAR(255)' },
      { name: 'weightRegained', type: 'VARCHAR(255)' },
      { name: 'weightRegainedDate', type: 'VARCHAR(255)' },
      { name: 'weightRegainTime', type: 'VARCHAR(255)' },
      
      // Surgery Details
      { name: 'surgeryReadiness', type: 'VARCHAR(255)' },
      { name: 'surgeonPreference', type: 'VARCHAR(255)' },
      { name: 'additionalProcedures', type: 'TEXT' },
      { name: 'estimatedSurgeryDate', type: 'VARCHAR(255)' },
      
      // GERD Information
      { name: 'gerdHeartburn', type: 'VARCHAR(255)' },
      { name: 'gerdRegurgitation', type: 'VARCHAR(255)' },
      { name: 'gerdChestPain', type: 'VARCHAR(255)' },
      { name: 'gerdDifficultySwallowing', type: 'VARCHAR(255)' },
      { name: 'gerdNausea', type: 'VARCHAR(255)' },
      { name: 'gerdSleepDisturbance', type: 'VARCHAR(255)' },
      { name: 'gerdEndoscopy', type: 'VARCHAR(255)' },
      { name: 'gerdPhStudy', type: 'VARCHAR(255)' },
      { name: 'gerdManometry', type: 'VARCHAR(255)' },
      
      // PGWBI Questions (1-18)
      { name: 'pgwbi1Anxious', type: 'VARCHAR(255)' },
      { name: 'pgwbi2Depressed', type: 'VARCHAR(255)' },
      { name: 'pgwbi3SelfControl', type: 'VARCHAR(255)' },
      { name: 'pgwbi4Vitality', type: 'VARCHAR(255)' },
      { name: 'pgwbi5Health', type: 'VARCHAR(255)' },
      { name: 'pgwbi6Spirits', type: 'VARCHAR(255)' },
      { name: 'pgwbi7Worried', type: 'VARCHAR(255)' },
      { name: 'pgwbi8Energy', type: 'VARCHAR(255)' },
      { name: 'pgwbi9Mood', type: 'VARCHAR(255)' },
      { name: 'pgwbi10Tension', type: 'VARCHAR(255)' },
      { name: 'pgwbi11Happiness', type: 'VARCHAR(255)' },
      { name: 'pgwbi12Interest', type: 'VARCHAR(255)' },
      { name: 'pgwbi13Calm', type: 'VARCHAR(255)' },
      { name: 'pgwbi14Sad', type: 'VARCHAR(255)' },
      { name: 'pgwbi15Active', type: 'VARCHAR(255)' },
      { name: 'pgwbi16Cheerful', type: 'VARCHAR(255)' },
      { name: 'pgwbi17Tired', type: 'VARCHAR(255)' },
      { name: 'pgwbi18Pressure', type: 'VARCHAR(255)' }
    ];
    
    await this.ensureColumns('surgery_interest', requiredColumns);
  }
  
  /**
   * Asegurar que la tabla patient_info tenga TODAS las columnas necesarias
   * Todas las preguntas del formulario de información del paciente
   */
  static async ensurePatientInfoColumns(): Promise<void> {
    const requiredColumns: Array<{name: string, type: string, nullable?: boolean}> = [
      // Personal Information
      { name: 'firstName', type: 'VARCHAR(255)' },
      { name: 'lastName', type: 'VARCHAR(255)' },
      { name: 'dateOfBirth', type: 'VARCHAR(255)' },
      { name: 'age', type: 'VARCHAR(255)' },
      { name: 'gender', type: 'VARCHAR(255)' },
      
      // Address Information
      { name: 'addressLine', type: 'VARCHAR(255)' },
      { name: 'city', type: 'VARCHAR(255)' },
      { name: 'country', type: 'VARCHAR(255)' },
      { name: 'state', type: 'VARCHAR(255)' },
      { name: 'zipcode', type: 'VARCHAR(255)' },
      
      // Contact Information
      { name: 'phoneNumber', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'preferredContact', type: 'VARCHAR(255)' },
      
      // Personal Details
      { name: 'occupation', type: 'VARCHAR(255)' },
      { name: 'employer', type: 'VARCHAR(255)' },
      { name: 'education', type: 'VARCHAR(255)' },
      
      // Emergency Contact
      { name: 'emergencyFirstName', type: 'VARCHAR(255)' },
      { name: 'emergencyLastName', type: 'VARCHAR(255)' },
      { name: 'emergencyRelationship', type: 'VARCHAR(255)' },
      { name: 'emergencyPhone', type: 'VARCHAR(255)' },
      
      // BMI Information
      { name: 'measurementSystem', type: 'VARCHAR(255)' },
      { name: 'heightFeet', type: 'VARCHAR(255)' },
      { name: 'heightInches', type: 'VARCHAR(255)' },
      { name: 'heightCm', type: 'VARCHAR(255)' },
      { name: 'weightLbs', type: 'VARCHAR(255)' },
      { name: 'weightKg', type: 'VARCHAR(255)' },
      { name: 'bmi', type: 'VARCHAR(255)' },
      
      // How did you hear about us
      { name: 'hearAboutUs', type: 'VARCHAR(255)' },
      { name: 'hearAboutUsOther', type: 'TEXT' },
      
      // Insurance Information
      { name: 'hasInsurance', type: 'VARCHAR(255)' },
      { name: 'insuranceProvider', type: 'VARCHAR(255)' },
      { name: 'policyNumber', type: 'VARCHAR(255)' },
      { name: 'groupNumber', type: 'VARCHAR(255)' },
      
      // Additional Information
      { name: 'additionalInfo', type: 'TEXT' }
    ];
    
    await this.ensureColumns('patient_info', requiredColumns);
  }
  
  /**
   * Asegurar que la tabla family_history tenga TODAS las columnas necesarias
   * Todas las preguntas del formulario de historial familiar
   */
  static async ensureFamilyHistoryColumns(): Promise<void> {
    const requiredColumns: Array<{name: string, type: string, nullable?: boolean}> = [
      // Family Medical Conditions
      { name: 'heartDisease', type: 'VARCHAR(255)' },
      { name: 'pulmonaryEdema', type: 'VARCHAR(255)' },
      { name: 'diabetesMellitus', type: 'VARCHAR(255)' },
      { name: 'highBloodPressure', type: 'VARCHAR(255)' },
      { name: 'alcoholism', type: 'VARCHAR(255)' },
      { name: 'liverProblems', type: 'VARCHAR(255)' },
      { name: 'lungProblems', type: 'VARCHAR(255)' },
      { name: 'bleedingDisorder', type: 'VARCHAR(255)' },
      { name: 'gallstones', type: 'VARCHAR(255)' },
      { name: 'mentalIllness', type: 'VARCHAR(255)' },
      { name: 'malignantHyperthermia', type: 'VARCHAR(255)' },
      { name: 'cancer', type: 'VARCHAR(255)' },
      { name: 'otherFamilyConditions', type: 'TEXT' }
    ];
    
    await this.ensureColumns('family_history', requiredColumns);
  }
}
