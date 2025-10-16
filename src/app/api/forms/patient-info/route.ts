import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';

interface PatientInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  addressLine: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  occupation: string;
  employer: string;
  education: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  // BMI
  measurementSystem: 'standard' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  bmi: string;
  // How did you hear about us
  hearAboutUs: string;
  hearAboutUsOther: string;
  // Insurance
  hasInsurance: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  // Additional info
  additionalInfo: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    
    // Obtener el expediente del paciente
    const patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      return NextResponse.json(
        { success: false, message: 'No se encontró expediente del paciente' },
        { status: 404 }
      );
    }

    // Buscar registro médico
    const connection = await getConnection();
    const [medicalRecords] = await connection.execute(
      'SELECT id FROM medical_records WHERE userId = ? LIMIT 1',
      [decoded.userId]
    );
    
    if (!Array.isArray(medicalRecords) || medicalRecords.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos guardados'
      });
    }

    const medicalRecordId = (medicalRecords[0] as { id: number }).id;

    // Obtener datos del formulario desde patient_info
    const [patientData] = await connection.execute(
      'SELECT * FROM patient_info WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(patientData) || patientData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de información del paciente guardados'
      });
    }

    const data = patientData[0] as {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      age: string;
      gender: string;
      addressLine: string;
      city: string;
      country: string;
      state: string;
      zipcode: string;
      phoneNumber: string;
      email: string;
      preferredContact: string;
      occupation: string;
      employer: string;
      education: string;
      emergencyFirstName: string;
      emergencyLastName: string;
      emergencyRelationship: string;
      emergencyPhone: string;
      measurementSystem: string;
      heightFeet: string;
      heightInches: string;
      heightCm: string;
      weightLbs: string;
      weightKg: string;
      bmi: string;
      hearAboutUs: string;
      hearAboutUsOther: string;
      hasInsurance: string;
      insuranceProvider: string;
      policyNumber: string;
      groupNumber: string;
      additionalInfo: string;
    };

    return NextResponse.json({
      success: true,
      data: {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || '',
        age: data.age || '',
        gender: data.gender || '',
        addressLine: data.addressLine || '',
        city: data.city || '',
        country: data.country || '',
        state: data.state || '',
        zipcode: data.zipcode || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        preferredContact: data.preferredContact || '',
        occupation: data.occupation || '',
        employer: data.employer || '',
        education: data.education || '',
        emergencyFirstName: data.emergencyFirstName || '',
        emergencyLastName: data.emergencyLastName || '',
        emergencyRelationship: data.emergencyRelationship || '',
        emergencyPhone: data.emergencyPhone || '',
        measurementSystem: data.measurementSystem || '',
        heightFeet: data.heightFeet || '',
        heightInches: data.heightInches || '',
        heightCm: data.heightCm || '',
        weightLbs: data.weightLbs || '',
        weightKg: data.weightKg || '',
        bmi: data.bmi || '',
        hearAboutUs: data.hearAboutUs || '',
        hearAboutUsOther: data.hearAboutUsOther || '',
        hasInsurance: data.hasInsurance || '',
        insuranceProvider: data.insuranceProvider || '',
        policyNumber: data.policyNumber || '',
        groupNumber: data.groupNumber || '',
        additionalInfo: data.additionalInfo || ''
      },
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar datos del paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Recibiendo petición para guardar formulario de paciente...');
    
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Auth header:', authHeader ? 'Presente' : 'Ausente');
    
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);
    console.log('🔍 Token extraído:', token ? 'Sí' : 'No');

    if (!token) {
      console.log('❌ No hay token');
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    console.log('🔍 Token verificado, userId:', decoded.userId);
    
    const body = await request.json();
    const formData: PatientInfoData = body;
    console.log('🔍 Datos del formulario recibidos:', Object.keys(formData));

    // Obtener el expediente del paciente
    let patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      // Si no existe, crear uno nuevo
      patientRecord = await PatientRecordModel.create(decoded.userId);
    }

    // Buscar o crear registro médico
    const connection = await getConnection();
    const [medicalRecords] = await connection.execute(
      'SELECT id FROM medical_records WHERE userId = ? LIMIT 1',
      [decoded.userId]
    );
    
    let medicalRecordId: number;
    if (Array.isArray(medicalRecords) && medicalRecords.length > 0) {
      medicalRecordId = (medicalRecords[0] as { id: number }).id;
    } else {
      // Crear registro médico
      const [result] = await connection.execute(
        `INSERT INTO medical_records 
         (userId, recordNumber, formType, formData, isCompleted, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [decoded.userId, patientRecord.patientId, 'patient_info', '{}', 0]
      );
      const insertResult = result as { insertId: number };
      medicalRecordId = insertResult.insertId;
    }

    // Guardar los datos del formulario en la tabla específica
    console.log('🔍 Guardando datos en la base de datos...');
    
    // Función para limpiar datos undefined -> null
    const cleanData = (data: any) => {
      const cleaned: any = {};
      
      // Lista de todos los campos que necesita la tabla
      const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'age', 'gender', 'addressLine', 'city',
        'country', 'state', 'zipcode', 'phoneNumber', 'email', 'preferredContact',
        'occupation', 'employer', 'education', 'emergencyFirstName', 'emergencyLastName',
        'emergencyRelationship', 'emergencyPhone', 'measurementSystem', 'heightFeet',
        'heightInches', 'heightCm', 'weightLbs', 'weightKg', 'bmi', 'hearAboutUs',
        'hearAboutUsOther', 'hasInsurance', 'insuranceProvider', 'policyNumber',
        'groupNumber', 'additionalInfo'
      ];
      
      // Inicializar todos los campos como null
      requiredFields.forEach(field => {
        cleaned[field] = null;
      });
      
      // Llenar con los datos del formulario
      for (const [key, value] of Object.entries(data)) {
        if (requiredFields.includes(key)) {
          cleaned[key] = value === undefined || value === '' ? null : value;
        }
      }
      
      return cleaned;
    };

    const cleanedData = cleanData(formData);
    
    // Debug completo de datos
    console.log('🔍 Datos originales del formulario:');
    console.log('📊 Total campos:', Object.keys(formData).length);
    console.log('📋 Campos:', Object.keys(formData));
    console.log('📝 Valores:', formData);
    
    console.log('🔍 Datos limpiados:');
    console.log('📊 Total campos:', Object.keys(cleanedData).length);
    console.log('📋 Campos:', Object.keys(cleanedData));
    console.log('📝 Valores:', cleanedData);
    
    // Verificar tipos de datos específicos
    console.log('🔍 Verificación de tipos:');
    Object.entries(cleanedData).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value} = ${value}`);
    });
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM patient_info WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      await connection.execute(
        `UPDATE patient_info SET 
         firstName = ?, lastName = ?, dateOfBirth = ?, age = ?, gender = ?,
         addressLine = ?, city = ?, country = ?, state = ?, zipcode = ?,
         phoneNumber = ?, email = ?, preferredContact = ?, occupation = ?,
         employer = ?, education = ?, emergencyFirstName = ?, emergencyLastName = ?,
         emergencyRelationship = ?, emergencyPhone = ?, measurementSystem = ?,
         heightFeet = ?, heightInches = ?, heightCm = ?, weightLbs = ?,
         weightKg = ?, bmi = ?, hearAboutUs = ?, hearAboutUsOther = ?,
         hasInsurance = ?, insuranceProvider = ?, policyNumber = ?,
         groupNumber = ?, additionalInfo = ?, updatedAt = NOW() 
         WHERE medicalRecordId = ?`,
        [
          cleanedData.firstName, cleanedData.lastName, cleanedData.dateOfBirth, cleanedData.age, cleanedData.gender,
          cleanedData.addressLine, cleanedData.city, cleanedData.country, cleanedData.state, cleanedData.zipcode,
          cleanedData.phoneNumber, cleanedData.email, cleanedData.preferredContact, cleanedData.occupation,
          cleanedData.employer, cleanedData.education, cleanedData.emergencyFirstName, cleanedData.emergencyLastName,
          cleanedData.emergencyRelationship, cleanedData.emergencyPhone, cleanedData.measurementSystem,
          cleanedData.heightFeet, cleanedData.heightInches, cleanedData.heightCm, cleanedData.weightLbs,
          cleanedData.weightKg, cleanedData.bmi, cleanedData.hearAboutUs, cleanedData.hearAboutUsOther,
          cleanedData.hasInsurance, cleanedData.insuranceProvider, cleanedData.policyNumber,
          cleanedData.groupNumber, cleanedData.additionalInfo, medicalRecordId
        ]
      );
      console.log(`✅ Datos de información del paciente actualizados para paciente ${patientRecord.patientId}`);
    } else {
      // Crear nuevo registro
      console.log('🔍 Preparando INSERT con estos valores:');
      const insertValues = [
        medicalRecordId, cleanedData.firstName, cleanedData.lastName, cleanedData.dateOfBirth, cleanedData.age, cleanedData.gender,
        cleanedData.addressLine, cleanedData.city, cleanedData.country, cleanedData.state, cleanedData.zipcode,
        cleanedData.phoneNumber, cleanedData.email, cleanedData.preferredContact, cleanedData.occupation,
        cleanedData.employer, cleanedData.education, cleanedData.emergencyFirstName, cleanedData.emergencyLastName,
        cleanedData.emergencyRelationship, cleanedData.emergencyPhone, cleanedData.measurementSystem,
        cleanedData.heightFeet, cleanedData.heightInches, cleanedData.heightCm, cleanedData.weightLbs,
        cleanedData.weightKg, cleanedData.bmi, cleanedData.hearAboutUs, cleanedData.hearAboutUsOther,
        cleanedData.hasInsurance, cleanedData.insuranceProvider, cleanedData.policyNumber,
        cleanedData.groupNumber, cleanedData.additionalInfo
      ];
      
      console.log('📊 Total valores para INSERT:', insertValues.length);
      console.log('📝 Valores del INSERT:', insertValues);
      
      // Verificar si hay undefined en los valores
      const undefinedValues = insertValues.filter((val, index) => val === undefined);
      if (undefinedValues.length > 0) {
        console.log('❌ ERROR: Valores undefined encontrados:', undefinedValues.length);
        insertValues.forEach((val, index) => {
          if (val === undefined) {
            console.log(`  Índice ${index}: undefined`);
          }
        });
      }
      
      await connection.execute(
        `INSERT INTO patient_info 
         (medicalRecordId, firstName, lastName, dateOfBirth, age, gender, addressLine, city, 
          country, state, zipcode, phoneNumber, email, preferredContact, occupation, employer, 
          education, emergencyFirstName, emergencyLastName, emergencyRelationship, emergencyPhone,
          measurementSystem, heightFeet, heightInches, heightCm, weightLbs, weightKg, bmi,
          hearAboutUs, hearAboutUsOther, hasInsurance, insuranceProvider, policyNumber, 
          groupNumber, additionalInfo, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        insertValues
      );
      console.log(`✅ Datos de información del paciente guardados para paciente ${patientRecord.patientId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del formulario guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error al guardar formulario de paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
