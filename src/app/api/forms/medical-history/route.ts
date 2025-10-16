import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';

interface MedicalHistoryData {
  // Past Medical History
  sleepApnea: string;
  useCpap: string;
  cpapDetails: string;
  diabetes: string;
  useInsulin: string;
  
  // Other Conditions
  otherMedicalConditions: string;
  
  // Heart Problems
  highBloodPressure: string;
  heartProblems: string;
  
  // Respiratory
  respiratoryProblems: string;
  
  // Other Systems
  urinaryConditions: string;
  muscularConditions: string;
  neurologicalConditions: string;
  bloodDisorders: string;
  endocrineCondition: string;
  gastrointestinalConditions: string;
  headNeckConditions: string;
  skinConditions: string;
  constitutionalSymptoms: string;
  
  // Infectious Diseases
  hepatitis: string;
  hiv: string;
  refuseBlood: string;
  
  // Psychiatric
  psychiatricHospital: string;
  attemptedSuicide: string;
  depression: string;
  anxiety: string;
  eatingDisorders: string;
  psychiatricMedications: string;
  psychiatricTherapy: string;
  psychiatricHospitalization: string;
  
  // Social History
  tobacco: string;
  tobaccoDetails: string;
  alcohol: string;
  alcoholDetails: string;
  drugs: string;
  drugsDetails: string;
  caffeine: string;
  diet: string;
  otherSubstances: string;
  
  // Medications & Allergies
  medications: string;
  allergies: string;
  
  // Past Surgical History
  previousSurgeries: string;
  surgicalComplications: string;
  
  // Diet Program
  dietProgram: string;
  
  // Only for Women
  pregnancy: string;
  pregnancyDetails: string;
  
  // Referral
  referral: string;
  referralDetails: string;
  
  // Other
  otherConditions: string;
  hospitalizations: string;
  hospitalizationsDetails: string;
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

    // Obtener datos del historial médico
    const [medicalData] = await connection.execute(
      'SELECT * FROM medical_history WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(medicalData) || medicalData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de historial médico guardados'
      });
    }

    const data = medicalData[0] as {
      sleepApnea: string;
      useCpap: string;
      cpapDetails: string;
      diabetes: string;
      useInsulin: string;
      highBloodPressure: string;
      heartProblems: string;
      respiratoryProblems: string;
      urinaryConditions: string;
      muscularConditions: string;
      neurologicalConditions: string;
      bloodDisorders: string;
      endocrineCondition: string;
      gastrointestinalConditions: string;
      headNeckConditions: string;
      skinConditions: string;
      constitutionalSymptoms: string;
      hepatitis: string;
      hiv: string;
      refuseBlood: string;
      psychiatricHospital: string;
      attemptedSuicide: string;
      depression: string;
      anxiety: string;
      eatingDisorders: string;
      psychiatricMedications: string;
      psychiatricTherapy: string;
      psychiatricHospitalization: string;
      tobacco: string;
      tobaccoDetails: string;
      alcohol: string;
      alcoholDetails: string;
      drugs: string;
      drugsDetails: string;
      caffeine: string;
      diet: string;
      otherSubstances: string;
      medications: string;
      allergies: string;
      previousSurgeries: string;
      surgicalComplications: string;
      dietProgram: string;
      pregnancy: string;
      pregnancyDetails: string;
      referral: string;
      referralDetails: string;
      otherConditions: string;
      hospitalizations: string;
      hospitalizationsDetails: string;
    };
    
        // Función para mapear valores ENUM de la base de datos al formulario
        const mapFormValue = (value: string): string => {
          if (!value || value === 'unknown') return '';
          return value;
        };

        // Mapear los datos de la base de datos al formato del formulario
        const formData = {
          // Past Medical History
          sleepApnea: mapFormValue(data.sleepApnea),
          useCpap: mapFormValue(data.useCpap),
          cpapDetails: data.cpapDetails || '',
          diabetes: mapFormValue(data.diabetes),
          useInsulin: mapFormValue(data.useInsulin),
          
          // Other Conditions
          otherMedicalConditions: data.otherMedicalConditions || '',

          // Heart Problems
          highBloodPressure: mapFormValue(data.highBloodPressure),
          heartProblems: mapFormValue(data.heartProblems),

          // Respiratory
          respiratoryProblems: mapFormValue(data.respiratoryProblems),

          // Other Systems
          urinaryConditions: mapFormValue(data.urinaryConditions),
          muscularConditions: mapFormValue(data.muscularConditions),
          neurologicalConditions: mapFormValue(data.neurologicalConditions),
          bloodDisorders: mapFormValue(data.bloodDisorders),
          endocrineCondition: mapFormValue(data.endocrineCondition),
          gastrointestinalConditions: mapFormValue(data.gastrointestinalConditions),
          headNeckConditions: mapFormValue(data.headNeckConditions),
          skinConditions: mapFormValue(data.skinConditions),
          constitutionalSymptoms: mapFormValue(data.constitutionalSymptoms),

          // Infectious Diseases
          hepatitis: mapFormValue(data.hepatitis),
          hiv: mapFormValue(data.hiv),
          refuseBlood: mapFormValue(data.refuseBlood),

          // Psychiatric
          psychiatricHospital: mapFormValue(data.psychiatricHospital),
          attemptedSuicide: mapFormValue(data.attemptedSuicide),
          depression: mapFormValue(data.depression),
          anxiety: mapFormValue(data.anxiety),
          eatingDisorders: mapFormValue(data.eatingDisorders),
          psychiatricMedications: mapFormValue(data.psychiatricMedications),
          psychiatricTherapy: mapFormValue(data.psychiatricTherapy),
          psychiatricHospitalization: mapFormValue(data.psychiatricHospitalization),

          // Social History
          tobacco: mapFormValue(data.tobacco),
          tobaccoDetails: data.tobaccoDetails || '',
          alcohol: mapFormValue(data.alcohol),
          alcoholDetails: data.alcoholDetails || '',
          drugs: mapFormValue(data.drugs),
          drugsDetails: data.drugsDetails || '',
          caffeine: mapFormValue(data.caffeine),
          diet: data.diet || '',
          otherSubstances: data.otherSubstances || '',

          // Medications & Allergies
          medications: data.medications || '',
          allergies: data.allergies || '',

          // Past Surgical History
          previousSurgeries: data.previousSurgeries || '',
          surgicalComplications: data.surgicalComplications || '',

          // Diet Program
          dietProgram: data.dietProgram || '',

          // Only for Women
          pregnancy: mapFormValue(data.pregnancy),
          pregnancyDetails: data.pregnancyDetails || '',

          // Referral
          referral: data.referral || '',
          referralDetails: data.referralDetails || '',

          // Other
          otherConditions: data.otherConditions || '',
          hospitalizations: mapFormValue(data.hospitalizations),
          hospitalizationsDetails: data.hospitalizationsDetails || ''
        };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar historial médico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Recibiendo petición para guardar formulario de historial médico...');
    
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    const body = await request.json();
    const formData: MedicalHistoryData = body;
    
    console.log('🔍 Datos recibidos del frontend:', formData);
    console.log('🔍 Campos específicos recibidos:', {
      sleepApnea: formData.sleepApnea,
      diabetes: formData.diabetes,
      highBloodPressure: formData.highBloodPressure,
      medications: formData.medications,
      allergies: formData.allergies,
      tobacco: formData.tobacco,
      alcohol: formData.alcohol
    });

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
        [decoded.userId, patientRecord.patientId, 'medical_history', '{}', 0]
      );
      const insertResult = result as { insertId: number };
      medicalRecordId = insertResult.insertId;
    }

    // Guardar los datos del formulario en la tabla específica
    console.log('🔍 Guardando datos de historial médico...');
    
    // Función para asegurar que todos los valores sean strings
    const mapStringValue = (value: string): string => {
      // Si está vacío, undefined, null, o no es string, devolver string vacío
      if (!value || value === '' || value === 'undefined' || value === 'null') {
        return '';
      }
      // Devolver el valor como string
      return String(value);
    };

    // Mapear los datos del formulario directamente a las columnas individuales
    const mappedData = {
      // Past Medical History
      sleepApnea: mapStringValue(formData.sleepApnea),
      useCpap: mapStringValue(formData.useCpap),
      cpapDetails: mapStringValue(formData.cpapDetails),
      diabetes: mapStringValue(formData.diabetes),
      useInsulin: mapStringValue(formData.useInsulin),
      
      // Other Conditions
      otherMedicalConditions: mapStringValue(formData.otherMedicalConditions),
      
      // Heart Problems
      highBloodPressure: mapStringValue(formData.highBloodPressure),
      heartProblems: mapStringValue(formData.heartProblems),
      
      // Respiratory
      respiratoryProblems: mapStringValue(formData.respiratoryProblems),
      
      // Other Systems
      urinaryConditions: mapStringValue(formData.urinaryConditions),
      muscularConditions: mapStringValue(formData.muscularConditions),
      neurologicalConditions: mapStringValue(formData.neurologicalConditions),
      bloodDisorders: mapStringValue(formData.bloodDisorders),
      endocrineCondition: mapStringValue(formData.endocrineCondition),
      gastrointestinalConditions: mapStringValue(formData.gastrointestinalConditions),
      headNeckConditions: mapStringValue(formData.headNeckConditions),
      skinConditions: mapStringValue(formData.skinConditions),
      constitutionalSymptoms: mapStringValue(formData.constitutionalSymptoms),
      
      // Infectious Diseases
      hepatitis: mapStringValue(formData.hepatitis),
      hiv: mapStringValue(formData.hiv),
      refuseBlood: mapStringValue(formData.refuseBlood),
      
      // Psychiatric
      psychiatricHospital: mapStringValue(formData.psychiatricHospital),
      attemptedSuicide: mapStringValue(formData.attemptedSuicide),
      depression: mapStringValue(formData.depression),
      anxiety: mapStringValue(formData.anxiety),
      eatingDisorders: mapStringValue(formData.eatingDisorders),
      psychiatricMedications: mapStringValue(formData.psychiatricMedications),
      psychiatricTherapy: mapStringValue(formData.psychiatricTherapy),
      psychiatricHospitalization: mapStringValue(formData.psychiatricHospitalization),
      
      // Social History
      tobacco: mapStringValue(formData.tobacco),
      tobaccoDetails: mapStringValue(formData.tobaccoDetails),
      alcohol: mapStringValue(formData.alcohol),
      alcoholDetails: mapStringValue(formData.alcoholDetails),
      drugs: mapStringValue(formData.drugs),
      drugsDetails: mapStringValue(formData.drugsDetails),
      caffeine: mapStringValue(formData.caffeine),
      diet: mapStringValue(formData.diet),
      otherSubstances: mapStringValue(formData.otherSubstances),
      
      // Medications & Allergies
      medications: mapStringValue(formData.medications),
      allergies: mapStringValue(formData.allergies),
      
      // Past Surgical History
      previousSurgeries: mapStringValue(formData.previousSurgeries),
      surgicalComplications: mapStringValue(formData.surgicalComplications),
      
      // Diet Program
      dietProgram: mapStringValue(formData.dietProgram),
      
      // Only for Women
      pregnancy: mapStringValue(formData.pregnancy),
      pregnancyDetails: mapStringValue(formData.pregnancyDetails),
      
      // Referral
      referral: mapStringValue(formData.referral),
      referralDetails: mapStringValue(formData.referralDetails),
      
      // Other
      otherConditions: mapStringValue(formData.otherConditions),
      hospitalizations: mapStringValue(formData.hospitalizations),
      hospitalizationsDetails: mapStringValue(formData.hospitalizationsDetails)
    };
    
    console.log('🔍 Datos DESPUÉS del mapeo:', mappedData);
    console.log('🔍 Campos específicos DESPUÉS del mapeo:', {
      sleepApnea: mappedData.sleepApnea,
      diabetes: mappedData.diabetes,
      highBloodPressure: mappedData.highBloodPressure,
      medications: mappedData.medications,
      allergies: mappedData.allergies,
      tobacco: mappedData.tobacco,
      alcohol: mappedData.alcohol
    });
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM medical_history WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      await connection.execute(
        `UPDATE medical_history SET 
         sleepApnea = ?, useCpap = ?, cpapDetails = ?, diabetes = ?, useInsulin = ?,
         otherMedicalConditions = ?, highBloodPressure = ?, heartProblems = ?, respiratoryProblems = ?,
         urinaryConditions = ?, muscularConditions = ?, neurologicalConditions = ?,
         bloodDisorders = ?, endocrineCondition = ?, gastrointestinalConditions = ?,
         headNeckConditions = ?, skinConditions = ?, constitutionalSymptoms = ?,
         hepatitis = ?, hiv = ?, refuseBlood = ?, psychiatricHospital = ?,
         attemptedSuicide = ?, depression = ?, anxiety = ?, eatingDisorders = ?,
         psychiatricMedications = ?, psychiatricTherapy = ?, psychiatricHospitalization = ?,
         tobacco = ?, tobaccoDetails = ?, alcohol = ?, alcoholDetails = ?,
         drugs = ?, drugsDetails = ?, caffeine = ?, diet = ?, otherSubstances = ?,
         medications = ?, allergies = ?, previousSurgeries = ?, surgicalComplications = ?,
         dietProgram = ?, pregnancy = ?, pregnancyDetails = ?, referral = ?,
         referralDetails = ?, otherConditions = ?, hospitalizations = ?,
         hospitalizationsDetails = ?, updatedAt = NOW()
         WHERE medicalRecordId = ?`,
        [
          mappedData.sleepApnea, mappedData.useCpap, mappedData.cpapDetails, mappedData.diabetes, mappedData.useInsulin,
          mappedData.otherMedicalConditions, mappedData.highBloodPressure, mappedData.heartProblems, mappedData.respiratoryProblems,
          mappedData.urinaryConditions, mappedData.muscularConditions, mappedData.neurologicalConditions,
          mappedData.bloodDisorders, mappedData.endocrineCondition, mappedData.gastrointestinalConditions,
          mappedData.headNeckConditions, mappedData.skinConditions, mappedData.constitutionalSymptoms,
          mappedData.hepatitis, mappedData.hiv, mappedData.refuseBlood, mappedData.psychiatricHospital,
          mappedData.attemptedSuicide, mappedData.depression, mappedData.anxiety, mappedData.eatingDisorders,
          mappedData.psychiatricMedications, mappedData.psychiatricTherapy, mappedData.psychiatricHospitalization,
          mappedData.tobacco, mappedData.tobaccoDetails, mappedData.alcohol, mappedData.alcoholDetails,
          mappedData.drugs, mappedData.drugsDetails, mappedData.caffeine, mappedData.diet, mappedData.otherSubstances,
          mappedData.medications, mappedData.allergies, mappedData.previousSurgeries, mappedData.surgicalComplications,
          mappedData.dietProgram, mappedData.pregnancy, mappedData.pregnancyDetails, mappedData.referral,
          mappedData.referralDetails, mappedData.otherConditions, mappedData.hospitalizations,
          mappedData.hospitalizationsDetails, medicalRecordId
        ]
      );
      console.log(`✅ Datos de historial médico actualizados para paciente ${patientRecord.patientId}`);
    } else {
      // Crear nuevo registro
      await connection.execute(
        `INSERT INTO medical_history 
         (medicalRecordId, sleepApnea, useCpap, cpapDetails, diabetes, useInsulin,
          otherMedicalConditions, highBloodPressure, heartProblems, respiratoryProblems, urinaryConditions, 
          muscularConditions, neurologicalConditions, bloodDisorders, endocrineCondition, 
          gastrointestinalConditions, headNeckConditions, skinConditions, constitutionalSymptoms,
          hepatitis, hiv, refuseBlood, psychiatricHospital, attemptedSuicide, depression, 
          anxiety, eatingDisorders, psychiatricMedications, psychiatricTherapy, psychiatricHospitalization,
          tobacco, tobaccoDetails, alcohol, alcoholDetails, drugs, drugsDetails, caffeine, 
          diet, otherSubstances, medications, allergies, previousSurgeries, surgicalComplications,
          dietProgram, pregnancy, pregnancyDetails, referral, referralDetails, otherConditions,
          hospitalizations, hospitalizationsDetails)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          medicalRecordId, mappedData.sleepApnea, mappedData.useCpap, mappedData.cpapDetails, mappedData.diabetes, mappedData.useInsulin,
          mappedData.otherMedicalConditions, mappedData.highBloodPressure, mappedData.heartProblems, mappedData.respiratoryProblems, mappedData.urinaryConditions,
          mappedData.muscularConditions, mappedData.neurologicalConditions, mappedData.bloodDisorders, mappedData.endocrineCondition,
          mappedData.gastrointestinalConditions, mappedData.headNeckConditions, mappedData.skinConditions, mappedData.constitutionalSymptoms,
          mappedData.hepatitis, mappedData.hiv, mappedData.refuseBlood, mappedData.psychiatricHospital, mappedData.attemptedSuicide, mappedData.depression,
          mappedData.anxiety, mappedData.eatingDisorders, mappedData.psychiatricMedications, mappedData.psychiatricTherapy, mappedData.psychiatricHospitalization,
          mappedData.tobacco, mappedData.tobaccoDetails, mappedData.alcohol, mappedData.alcoholDetails, mappedData.drugs, mappedData.drugsDetails, mappedData.caffeine,
          mappedData.diet, mappedData.otherSubstances, mappedData.medications, mappedData.allergies, mappedData.previousSurgeries, mappedData.surgicalComplications,
          mappedData.dietProgram, mappedData.pregnancy, mappedData.pregnancyDetails, mappedData.referral, mappedData.referralDetails, mappedData.otherConditions,
          mappedData.hospitalizations, mappedData.hospitalizationsDetails
        ]
      );
      console.log(`✅ Datos de historial médico guardados para paciente ${patientRecord.patientId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del historial médico guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error al guardar formulario de historial médico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
