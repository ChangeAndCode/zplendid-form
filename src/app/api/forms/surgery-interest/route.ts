import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';

interface SurgeryInterestData {
  // Previous Weight Loss Surgery
  previousWeightLossSurgery: string;
  previousSurgeonName: string;
  consultedAboutWeightLoss: string;
  consultationType: string;
  consultationDate: string;

  // Surgery Interest
  surgeryInterest: string;
  firstTimeBariatricName: string;
  revisionalBariatricName: string;
  primaryPlasticName: string;
  postBariatricPlasticName: string;

  // Weight History
  highestWeight: string;
  highestWeightDate: string;
  surgeryWeight: string;
  lowestWeight: string;
  lowestWeightDate: string;
  currentWeight: string;
  currentWeightDuration: string;
  goalWeight: string;
  goalWeightDate: string;
  weightRegained: string;
  weightRegainedDate: string;
  weightRegainTime: string;

  // Surgery Details
  surgeryReadiness: string;
  surgeonPreference: string;
  additionalProcedures: string;
  estimatedSurgeryDate: string;

  // GERD Information
  gerdHeartburn: string;
  gerdRegurgitation: string;
  gerdChestPain: string;
  gerdDifficultySwallowing: string;
  gerdNausea: string;
  gerdSleepDisturbance: string;
  gerdEndoscopy: string;
  gerdPhStudy: string;
  gerdManometry: string;

  // PGWBI Questions (1-18)
  pgwbi1Anxious: string;
  pgwbi2Depressed: string;
  pgwbi3SelfControl: string;
  pgwbi4Vitality: string;
  pgwbi5Health: string;
  pgwbi6Spirits: string;
  pgwbi7Worried: string;
  pgwbi8Energy: string;
  pgwbi9Mood: string;
  pgwbi10Tension: string;
  pgwbi11Happiness: string;
  pgwbi12Interest: string;
  pgwbi13Calm: string;
  pgwbi14Sad: string;
  pgwbi15Active: string;
  pgwbi16Cheerful: string;
  pgwbi17Tired: string;
  pgwbi18Pressure: string;
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

    // Obtener datos del interés quirúrgico
    const [surgeryData] = await connection.execute(
      'SELECT * FROM surgery_interest WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(surgeryData) || surgeryData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de interés quirúrgico guardados'
      });
    }

    const data = surgeryData[0] as {
      previousWeightLossSurgery: string;
      previousSurgeonName: string;
      consultedAboutWeightLoss: string;
      consultationType: string;
      consultationDate: string;
      surgeryInterest: string;
      firstTimeBariatricName: string;
      revisionalBariatricName: string;
      primaryPlasticName: string;
      postBariatricPlasticName: string;
      highestWeight: string;
      highestWeightDate: string;
      surgeryWeight: string;
      lowestWeight: string;
      lowestWeightDate: string;
      currentWeight: string;
      currentWeightDuration: string;
      goalWeight: string;
      goalWeightDate: string;
      weightRegained: string;
      weightRegainedDate: string;
      weightRegainTime: string;
      surgeryReadiness: string;
      surgeonPreference: string;
      additionalProcedures: string;
      estimatedSurgeryDate: string;
      gerdHeartburn: string;
      gerdRegurgitation: string;
      gerdChestPain: string;
      gerdDifficultySwallowing: string;
      gerdNausea: string;
      gerdSleepDisturbance: string;
      gerdEndoscopy: string;
      gerdPhStudy: string;
      gerdManometry: string;
      pgwbi1Anxious: string;
      pgwbi2Depressed: string;
      pgwbi3SelfControl: string;
      pgwbi4Vitality: string;
      pgwbi5Health: string;
      pgwbi6Spirits: string;
      pgwbi7Worried: string;
      pgwbi8Energy: string;
      pgwbi9Mood: string;
      pgwbi10Tension: string;
      pgwbi11Happiness: string;
      pgwbi12Interest: string;
      pgwbi13Calm: string;
      pgwbi14Sad: string;
      pgwbi15Active: string;
      pgwbi16Cheerful: string;
      pgwbi17Tired: string;
      pgwbi18Pressure: string;
    };

    // Función para mapear valores de la base de datos al formulario
    const mapFormValue = (value: string): string => {
      if (!value || value === '' || value === 'unknown' || value === 'EMPTY') return '';
      return value;
    };

    // Mapear los datos de la base de datos al formato del formulario
    const formData = {
      // Previous Weight Loss Surgery
      previousWeightLossSurgery: mapFormValue(data.previousWeightLossSurgery),
      previousSurgeonName: data.previousSurgeonName || '',
      consultedAboutWeightLoss: mapFormValue(data.consultedAboutWeightLoss),
      consultationType: data.consultationType || '',
      consultationDate: data.consultationDate || '',

      // Surgery Interest
      surgeryInterest: data.surgeryInterest || '',
      firstTimeBariatricName: data.firstTimeBariatricName || '',
      revisionalBariatricName: data.revisionalBariatricName || '',
      primaryPlasticName: data.primaryPlasticName || '',
      postBariatricPlasticName: data.postBariatricPlasticName || '',

      // Weight History
      highestWeight: data.highestWeight || '',
      highestWeightDate: data.highestWeightDate || '',
      surgeryWeight: data.surgeryWeight || '',
      lowestWeight: data.lowestWeight || '',
      lowestWeightDate: data.lowestWeightDate || '',
      currentWeight: data.currentWeight || '',
      currentWeightDuration: data.currentWeightDuration || '',
      goalWeight: data.goalWeight || '',
      goalWeightDate: data.goalWeightDate || '',
      weightRegained: mapFormValue(data.weightRegained),
      weightRegainedDate: data.weightRegainedDate || '',
      weightRegainTime: data.weightRegainTime || '',

      // Surgery Details
      surgeryReadiness: mapFormValue(data.surgeryReadiness),
      surgeonPreference: data.surgeonPreference || '',
      additionalProcedures: data.additionalProcedures || '',
      estimatedSurgeryDate: data.estimatedSurgeryDate || '',

      // GERD Information
      gerdHeartburn: mapFormValue(data.gerdHeartburn),
      gerdRegurgitation: mapFormValue(data.gerdRegurgitation),
      gerdChestPain: mapFormValue(data.gerdChestPain),
      gerdDifficultySwallowing: mapFormValue(data.gerdDifficultySwallowing),
      gerdNausea: mapFormValue(data.gerdNausea),
      gerdSleepDisturbance: mapFormValue(data.gerdSleepDisturbance),
      gerdEndoscopy: mapFormValue(data.gerdEndoscopy),
      gerdPhStudy: mapFormValue(data.gerdPhStudy),
      gerdManometry: mapFormValue(data.gerdManometry),
      
      // PGWBI Questions (1-18)
      pgwbi1Anxious: data.pgwbi1Anxious || '',
      pgwbi2Depressed: data.pgwbi2Depressed || '',
      pgwbi3SelfControl: data.pgwbi3SelfControl || '',
      pgwbi4Vitality: data.pgwbi4Vitality || '',
      pgwbi5Health: data.pgwbi5Health || '',
      pgwbi6Spirits: data.pgwbi6Spirits || '',
      pgwbi7Worried: data.pgwbi7Worried || '',
      pgwbi8Energy: data.pgwbi8Energy || '',
      pgwbi9Mood: data.pgwbi9Mood || '',
      pgwbi10Tension: data.pgwbi10Tension || '',
      pgwbi11Happiness: data.pgwbi11Happiness || '',
      pgwbi12Interest: data.pgwbi12Interest || '',
      pgwbi13Calm: data.pgwbi13Calm || '',
      pgwbi14Sad: data.pgwbi14Sad || '',
      pgwbi15Active: data.pgwbi15Active || '',
      pgwbi16Cheerful: data.pgwbi16Cheerful || '',
      pgwbi17Tired: data.pgwbi17Tired || '',
      pgwbi18Pressure: data.pgwbi18Pressure || ''
    };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar interés quirúrgico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const formData: SurgeryInterestData = body;
    
    console.log('🔍 Datos recibidos del frontend:', formData);
    console.log('🔍 Campos específicos recibidos:', {
      previousWeightLossSurgery: formData.previousWeightLossSurgery,
      previousSurgeonName: formData.previousSurgeonName,
      consultedAboutWeightLoss: formData.consultedAboutWeightLoss,
      consultationType: formData.consultationType,
      consultationDate: formData.consultationDate,
      surgeryInterest: formData.surgeryInterest,
      firstTimeBariatricName: formData.firstTimeBariatricName,
      estimatedSurgeryDate: formData.estimatedSurgeryDate
    });

    // Obtener el expediente del paciente
    let patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
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
      const [result] = await connection.execute(
        `INSERT INTO medical_records 
         (userId, recordNumber, formType, formData, isCompleted, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [decoded.userId, patientRecord.patientId, 'surgery_interest', '{}', 0]
      );
      const insertResult = result as { insertId: number };
      medicalRecordId = insertResult.insertId;
    }

    // Función simple para mapear todos los valores como strings
    const mapStringValue = (value: string): string => {
      // Si está vacío, es null, undefined, o contiene "EMPTY", devolver cadena vacía
      if (!value || value === '' || value === 'EMPTY' || value === 'null' || value === 'undefined') {
        return '';
      }
      return value;
    };
    
    const mappedData = {
      // Previous Weight Loss Surgery
      previousWeightLossSurgery: mapStringValue(formData.previousWeightLossSurgery),
      previousSurgeonName: mapStringValue(formData.previousSurgeonName),
      consultedAboutWeightLoss: mapStringValue(formData.consultedAboutWeightLoss),
      consultationType: mapStringValue(formData.consultationType),
      consultationDate: mapStringValue(formData.consultationDate),

      // Surgery Interest
      surgeryInterest: mapStringValue(formData.surgeryInterest),
      firstTimeBariatricName: mapStringValue(formData.firstTimeBariatricName),
      revisionalBariatricName: mapStringValue(formData.revisionalBariatricName),
      primaryPlasticName: mapStringValue(formData.primaryPlasticName),
      postBariatricPlasticName: mapStringValue(formData.postBariatricPlasticName),

      // Weight History
      highestWeight: mapStringValue(formData.highestWeight),
      highestWeightDate: mapStringValue(formData.highestWeightDate),
      surgeryWeight: mapStringValue(formData.surgeryWeight),
      lowestWeight: mapStringValue(formData.lowestWeight),
      lowestWeightDate: mapStringValue(formData.lowestWeightDate),
      currentWeight: mapStringValue(formData.currentWeight),
      currentWeightDuration: mapStringValue(formData.currentWeightDuration),
      goalWeight: mapStringValue(formData.goalWeight),
      goalWeightDate: mapStringValue(formData.goalWeightDate),
      weightRegained: mapStringValue(formData.weightRegained),
      weightRegainedDate: mapStringValue(formData.weightRegainedDate),
      weightRegainTime: mapStringValue(formData.weightRegainTime),

      // Surgery Details
      surgeryReadiness: mapStringValue(formData.surgeryReadiness),
      surgeonPreference: mapStringValue(formData.surgeonPreference),
      additionalProcedures: mapStringValue(formData.additionalProcedures),
      estimatedSurgeryDate: mapStringValue(formData.estimatedSurgeryDate),

      // GERD Information
      gerdHeartburn: mapStringValue(formData.gerdHeartburn),
      gerdRegurgitation: mapStringValue(formData.gerdRegurgitation),
      gerdChestPain: mapStringValue(formData.gerdChestPain),
      gerdDifficultySwallowing: mapStringValue(formData.gerdDifficultySwallowing),
      gerdNausea: mapStringValue(formData.gerdNausea),
      gerdSleepDisturbance: mapStringValue(formData.gerdSleepDisturbance),
      gerdEndoscopy: mapStringValue(formData.gerdEndoscopy),
      gerdPhStudy: mapStringValue(formData.gerdPhStudy),
      gerdManometry: mapStringValue(formData.gerdManometry),
      
      // PGWBI Questions (1-18)
      pgwbi1Anxious: mapStringValue(formData.pgwbi1Anxious),
      pgwbi2Depressed: mapStringValue(formData.pgwbi2Depressed),
      pgwbi3SelfControl: mapStringValue(formData.pgwbi3SelfControl),
      pgwbi4Vitality: mapStringValue(formData.pgwbi4Vitality),
      pgwbi5Health: mapStringValue(formData.pgwbi5Health),
      pgwbi6Spirits: mapStringValue(formData.pgwbi6Spirits),
      pgwbi7Worried: mapStringValue(formData.pgwbi7Worried),
      pgwbi8Energy: mapStringValue(formData.pgwbi8Energy),
      pgwbi9Mood: mapStringValue(formData.pgwbi9Mood),
      pgwbi10Tension: mapStringValue(formData.pgwbi10Tension),
      pgwbi11Happiness: mapStringValue(formData.pgwbi11Happiness),
      pgwbi12Interest: mapStringValue(formData.pgwbi12Interest),
      pgwbi13Calm: mapStringValue(formData.pgwbi13Calm),
      pgwbi14Sad: mapStringValue(formData.pgwbi14Sad),
      pgwbi15Active: mapStringValue(formData.pgwbi15Active),
      pgwbi16Cheerful: mapStringValue(formData.pgwbi16Cheerful),
      pgwbi17Tired: mapStringValue(formData.pgwbi17Tired),
      pgwbi18Pressure: mapStringValue(formData.pgwbi18Pressure)
    };
    
    console.log('🔍 Datos DESPUÉS del mapeo:', mappedData);
    console.log('🔍 Campos específicos DESPUÉS del mapeo:', {
      previousWeightLossSurgery: mappedData.previousWeightLossSurgery,
      previousSurgeonName: mappedData.previousSurgeonName,
      consultedAboutWeightLoss: mappedData.consultedAboutWeightLoss,
      consultationType: mappedData.consultationType,
      consultationDate: mappedData.consultationDate,
      surgeryInterest: mappedData.surgeryInterest,
      firstTimeBariatricName: mappedData.firstTimeBariatricName,
      estimatedSurgeryDate: mappedData.estimatedSurgeryDate
    });

    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM surgery_interest WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      console.log('🔍 Actualizando registro existente con valores:', {
        previousWeightLossSurgery: mappedData.previousWeightLossSurgery,
        previousSurgeonName: mappedData.previousSurgeonName,
        consultedAboutWeightLoss: mappedData.consultedAboutWeightLoss,
        consultationType: mappedData.consultationType,
        consultationDate: mappedData.consultationDate,
        surgeryInterest: mappedData.surgeryInterest,
        firstTimeBariatricName: mappedData.firstTimeBariatricName,
        estimatedSurgeryDate: mappedData.estimatedSurgeryDate
      });
      
      await connection.execute(
        `UPDATE surgery_interest SET
         previousWeightLossSurgery = ?, previousSurgeonName = ?, consultedAboutWeightLoss = ?,
         consultationType = ?, consultationDate = ?, surgeryInterest = ?, firstTimeBariatricName = ?,
         revisionalBariatricName = ?, primaryPlasticName = ?, postBariatricPlasticName = ?,
         highestWeight = ?, highestWeightDate = ?, surgeryWeight = ?, lowestWeight = ?,
         lowestWeightDate = ?, currentWeight = ?, currentWeightDuration = ?, goalWeight = ?,
         goalWeightDate = ?, weightRegained = ?, weightRegainedDate = ?, weightRegainTime = ?,
         surgeryReadiness = ?, surgeonPreference = ?, additionalProcedures = ?, estimatedSurgeryDate = ?,
         gerdHeartburn = ?, gerdRegurgitation = ?, gerdChestPain = ?, gerdDifficultySwallowing = ?,
         gerdNausea = ?, gerdSleepDisturbance = ?, gerdEndoscopy = ?, gerdPhStudy = ?, gerdManometry = ?,
         pgwbi1Anxious = ?, pgwbi2Depressed = ?, pgwbi3SelfControl = ?, pgwbi4Vitality = ?,
         pgwbi5Health = ?, pgwbi6Spirits = ?, pgwbi7Worried = ?, pgwbi8Energy = ?, pgwbi9Mood = ?,
         pgwbi10Tension = ?, pgwbi11Happiness = ?, pgwbi12Interest = ?, pgwbi13Calm = ?,
         pgwbi14Sad = ?, pgwbi15Active = ?, pgwbi16Cheerful = ?, pgwbi17Tired = ?, pgwbi18Pressure = ?,
         updatedAt = NOW()
         WHERE medicalRecordId = ?`,
        [
          mappedData.previousWeightLossSurgery, mappedData.previousSurgeonName, mappedData.consultedAboutWeightLoss,
          mappedData.consultationType, mappedData.consultationDate, mappedData.surgeryInterest, mappedData.firstTimeBariatricName,
          mappedData.revisionalBariatricName, mappedData.primaryPlasticName, mappedData.postBariatricPlasticName,
          mappedData.highestWeight, mappedData.highestWeightDate, mappedData.surgeryWeight, mappedData.lowestWeight,
          mappedData.lowestWeightDate, mappedData.currentWeight, mappedData.currentWeightDuration, mappedData.goalWeight,
          mappedData.goalWeightDate, mappedData.weightRegained, mappedData.weightRegainedDate, mappedData.weightRegainTime,
          mappedData.surgeryReadiness, mappedData.surgeonPreference, mappedData.additionalProcedures, mappedData.estimatedSurgeryDate,
          mappedData.gerdHeartburn, mappedData.gerdRegurgitation, mappedData.gerdChestPain, mappedData.gerdDifficultySwallowing,
          mappedData.gerdNausea, mappedData.gerdSleepDisturbance, mappedData.gerdEndoscopy, mappedData.gerdPhStudy, mappedData.gerdManometry,
          mappedData.pgwbi1Anxious, mappedData.pgwbi2Depressed, mappedData.pgwbi3SelfControl, mappedData.pgwbi4Vitality,
          mappedData.pgwbi5Health, mappedData.pgwbi6Spirits, mappedData.pgwbi7Worried, mappedData.pgwbi8Energy, mappedData.pgwbi9Mood,
          mappedData.pgwbi10Tension, mappedData.pgwbi11Happiness, mappedData.pgwbi12Interest, mappedData.pgwbi13Calm,
          mappedData.pgwbi14Sad, mappedData.pgwbi15Active, mappedData.pgwbi16Cheerful, mappedData.pgwbi17Tired, mappedData.pgwbi18Pressure,
          medicalRecordId
        ]
      );
    } else {
      // Crear nuevo registro
      console.log('🔍 Creando nuevo registro con valores:', {
        previousWeightLossSurgery: mappedData.previousWeightLossSurgery,
        previousSurgeonName: mappedData.previousSurgeonName,
        consultedAboutWeightLoss: mappedData.consultedAboutWeightLoss,
        consultationType: mappedData.consultationType,
        consultationDate: mappedData.consultationDate,
        surgeryInterest: mappedData.surgeryInterest,
        firstTimeBariatricName: mappedData.firstTimeBariatricName,
        estimatedSurgeryDate: mappedData.estimatedSurgeryDate
      });
      
      const valuesToInsert = [
        medicalRecordId, mappedData.previousWeightLossSurgery, mappedData.previousSurgeonName, mappedData.consultedAboutWeightLoss,
        mappedData.consultationType, mappedData.consultationDate, mappedData.surgeryInterest, mappedData.firstTimeBariatricName, mappedData.revisionalBariatricName,
        mappedData.primaryPlasticName, mappedData.postBariatricPlasticName, mappedData.highestWeight, mappedData.highestWeightDate, mappedData.surgeryWeight,
        mappedData.lowestWeight, mappedData.lowestWeightDate, mappedData.currentWeight, mappedData.currentWeightDuration, mappedData.goalWeight, mappedData.goalWeightDate,
        mappedData.weightRegained, mappedData.weightRegainedDate, mappedData.weightRegainTime, mappedData.surgeryReadiness, mappedData.surgeonPreference,
        mappedData.additionalProcedures, mappedData.estimatedSurgeryDate, mappedData.gerdHeartburn, mappedData.gerdRegurgitation, mappedData.gerdChestPain,
        mappedData.gerdDifficultySwallowing, mappedData.gerdNausea, mappedData.gerdSleepDisturbance, mappedData.gerdEndoscopy, mappedData.gerdPhStudy, mappedData.gerdManometry,
        mappedData.pgwbi1Anxious, mappedData.pgwbi2Depressed, mappedData.pgwbi3SelfControl, mappedData.pgwbi4Vitality, mappedData.pgwbi5Health, mappedData.pgwbi6Spirits,
        mappedData.pgwbi7Worried, mappedData.pgwbi8Energy, mappedData.pgwbi9Mood, mappedData.pgwbi10Tension, mappedData.pgwbi11Happiness, mappedData.pgwbi12Interest,
        mappedData.pgwbi13Calm, mappedData.pgwbi14Sad, mappedData.pgwbi15Active, mappedData.pgwbi16Cheerful, mappedData.pgwbi17Tired, mappedData.pgwbi18Pressure
      ];
      await connection.execute(
        `INSERT INTO surgery_interest 
         (medicalRecordId, previousWeightLossSurgery, previousSurgeonName, consultedAboutWeightLoss,
          consultationType, consultationDate, surgeryInterest, firstTimeBariatricName, revisionalBariatricName,
          primaryPlasticName, postBariatricPlasticName, highestWeight, highestWeightDate, surgeryWeight,
          lowestWeight, lowestWeightDate, currentWeight, currentWeightDuration, goalWeight, goalWeightDate,
          weightRegained, weightRegainedDate, weightRegainTime, surgeryReadiness, surgeonPreference,
          additionalProcedures, estimatedSurgeryDate, gerdHeartburn, gerdRegurgitation, gerdChestPain,
          gerdDifficultySwallowing, gerdNausea, gerdSleepDisturbance, gerdEndoscopy, gerdPhStudy, gerdManometry,
          pgwbi1Anxious, pgwbi2Depressed, pgwbi3SelfControl, pgwbi4Vitality, pgwbi5Health, pgwbi6Spirits,
          pgwbi7Worried, pgwbi8Energy, pgwbi9Mood, pgwbi10Tension, pgwbi11Happiness, pgwbi12Interest,
          pgwbi13Calm, pgwbi14Sad, pgwbi15Active, pgwbi16Cheerful, pgwbi17Tired, pgwbi18Pressure) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        valuesToInsert
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del interés quirúrgico guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error al guardar formulario de interés quirúrgico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}