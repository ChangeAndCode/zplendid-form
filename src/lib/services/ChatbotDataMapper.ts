/**
 * Servicio para mapear datos extraídos del chatbot a las estructuras de las tablas MySQL
 * NO modifica código existente - solo mapea datos del chatbot
 */

export interface ChatbotExtractedData {
  [key: string]: any;
}

export interface MappedPatientInfo {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: string;
  gender?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  state?: string;
  zipcode?: string;
  phoneNumber?: string;
  email?: string;
  preferredContact?: string;
  occupation?: string;
  employer?: string;
  education?: string;
  emergencyFirstName?: string;
  emergencyLastName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  measurementSystem?: 'standard' | 'metric';
  heightFeet?: string;
  heightInches?: string;
  heightCm?: string;
  weightLbs?: string;
  weightKg?: string;
  bmi?: string;
  hearAboutUs?: string;
  hearAboutUsOther?: string;
  hasInsurance?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  additionalInfo?: string;
}

export interface MappedSurgeryInterest {
  surgeryInterest?: string;
  firstTimeBariatricName?: string;
  revisionalBariatricName?: string;
  primaryPlasticName?: string;
  postBariatricPlasticName?: string;
  surgeryReadiness?: string;
  surgeonPreference?: string;
  additionalProcedures?: string;
  estimatedSurgeryDate?: string;
  highestWeight?: string;
  highestWeightDate?: string;
  surgeryWeight?: string;
  lowestWeight?: string;
  lowestWeightDate?: string;
  currentWeight?: string;
  currentWeightDuration?: string;
  goalWeight?: string;
  goalWeightDate?: string;
  weightRegained?: string;
  weightRegainedDate?: string;
  weightRegainTime?: string;
  previousWeightLossSurgery?: string;
  previousSurgeonName?: string;
  consultedAboutWeightLoss?: string;
  consultationType?: string;
  consultationDate?: string;
  gerdHeartburn?: string;
  gerdRegurgitation?: string;
  gerdChestPain?: string;
  gerdDifficultySwallowing?: string;
  gerdNausea?: string;
  gerdSleepDisturbance?: string;
  gerdEndoscopy?: string;
  gerdPhStudy?: string;
  gerdManometry?: string;
  dietProgramName?: string;
  dietProgramStartDate?: string;
  dietProgramDuration?: string;
  dietProgramWeightLost?: string;
  dietProgramWeightRegained?: string;
  pgwbi1Anxious?: string;
  pgwbi2Depressed?: string;
  pgwbi3SelfControl?: string;
  pgwbi4Vitality?: string;
  pgwbi5Health?: string;
  pgwbi6Spirits?: string;
  pgwbi7Worried?: string;
  pgwbi8Energy?: string;
  pgwbi9Mood?: string;
  pgwbi10Tension?: string;
  pgwbi11Happiness?: string;
  pgwbi12Interest?: string;
  pgwbi13Calm?: string;
  pgwbi14Sad?: string;
  pgwbi15Active?: string;
  pgwbi16Cheerful?: string;
  pgwbi17Tired?: string;
  pgwbi18Pressure?: string;
}

export interface MappedMedicalHistory {
  sleepApnea?: string;
  useCpap?: string;
  cpapDetails?: string;
  diabetes?: string;
  useInsulin?: string;
  highBloodPressure?: string;
  polycysticOvarianSyndrome?: string;
  metabolicSyndrome?: string;
  refluxDisease?: string;
  degenerativeJointDisease?: string;
  urinaryStressIncontinence?: string;
  highCholesterol?: string;
  venousStasis?: string;
  irregularMenstrualPeriod?: string;
  otherMedicalConditions?: string;
  heartProblems?: string;
  respiratoryProblems?: string;
  respiratoryProblemsDetails?: string;
  urinaryConditions?: string;
  urinaryConditionsDetails?: string;
  muscularConditions?: string;
  muscularConditionsDetails?: string;
  neurologicalConditions?: string;
  neurologicalConditionsDetails?: string;
  bloodDisorders?: string;
  bloodDisordersDetails?: string;
  endocrineCondition?: string;
  endocrineConditionDetails?: string;
  gastrointestinalConditions?: string;
  headNeckConditions?: string;
  skinConditions?: string;
  constitutionalSymptoms?: string;
  hepatitis?: string;
  hepatitisType?: string;
  hiv?: string;
  refuseBlood?: string;
  psychiatricHospital?: string;
  attemptedSuicide?: string;
  depression?: string;
  anxiety?: string;
  eatingDisorders?: string;
  psychiatricMedications?: string;
  psychiatricTherapy?: string;
  psychiatricHospitalization?: string;
  tobacco?: string;
  tobaccoDetails?: string;
  alcohol?: string;
  alcoholDetails?: string;
  drugs?: string;
  drugsDetails?: string;
  caffeine?: string;
  diet?: string;
  otherSubstances?: string;
  medications?: string;
  allergies?: string;
  previousSurgeries?: string;
  surgicalComplications?: string;
  pregnancy?: string;
  pregnancyDetails?: string;
  referral?: string;
  referralDetails?: string;
  otherConditions?: string;
  hospitalizations?: string;
  hospitalizationsDetails?: string;
}

export interface MappedFamilyHistory {
  heartDisease?: string;
  pulmonaryEdema?: string;
  diabetesMellitus?: string;
  highBloodPressure?: string;
  alcoholism?: string;
  liverProblems?: string;
  lungProblems?: string;
  bleedingDisorder?: string;
  gallstones?: string;
  mentalIllness?: string;
  malignantHyperthermia?: string;
  cancer?: string;
  otherFamilyConditions?: string;
}

export class ChatbotDataMapper {
  /**
   * Normaliza un valor a string para guardar en BD
   * Para campos TEXT, preserva el contenido completo sin truncar
   */
  private static normalizeValue(value: any, isTextField: boolean = false): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'yes' : 'no';
    if (Array.isArray(value)) {
      try {
        return JSON.stringify(value);
      } catch (error) {
        // Si el array es demasiado grande o tiene problemas, convertir a string simple
        return String(value);
      }
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (error) {
        // Si el objeto es demasiado grande o tiene problemas, convertir a string simple
        return String(value);
      }
    }
    const str = String(value);
    // Para campos TEXT, preservamos el contenido completo (solo trim de espacios iniciales/finales)
    // Para otros campos, también hacemos trim (ambos casos son iguales, pero el parámetro
    // ayuda a documentar que el campo puede ser largo)
    return str.trim();
  }

  /**
   * Normaliza una fecha a formato estándar MM/DD/YYYY
   * Acepta múltiples formatos y los convierte a formato consistente
   * Si no se puede parsear, devuelve el string original (puede ser texto descriptivo)
   */
  private static normalizeDate(value: any): string {
    if (!value || value === null || value === undefined) return '';
    
    const dateStr = String(value).trim();
    if (!dateStr || dateStr === '') return '';

    // Si ya está en formato MM/DD/YYYY o similar, intentar validarlo
    const mmddyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const yyyymmddPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

    try {
      let date: Date | null = null;
      let month: number, day: number, year: number;

      // Intentar parsear diferentes formatos
      if (mmddyyyyPattern.test(dateStr)) {
        // MM/DD/YYYY
        const match = dateStr.match(mmddyyyyPattern);
        if (match) {
          month = parseInt(match[1], 10);
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          date = new Date(year, month - 1, day);
        }
      } else if (yyyymmddPattern.test(dateStr)) {
        // YYYY-MM-DD
        const match = dateStr.match(yyyymmddPattern);
        if (match) {
          year = parseInt(match[1], 10);
          month = parseInt(match[2], 10);
          day = parseInt(match[3], 10);
          date = new Date(year, month - 1, day);
        }
      } else {
        // Intentar parsear con Date nativo (acepta muchos formatos)
        date = new Date(dateStr);
      }

      // Verificar que sea una fecha válida y razonable (entre 1900 y 2100)
      if (date && !isNaN(date.getTime())) {
        const year = date.getFullYear();
        // Validar que el año sea razonable
        if (year >= 1900 && year <= 2100) {
          // Formato preferido: MM/DD/YYYY (como se usa en el formulario)
          const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
          const formattedDay = String(date.getDate()).padStart(2, '0');
          const formattedYear = year;
          
          return `${formattedMonth}/${formattedDay}/${formattedYear}`;
        } else {
          // Año fuera de rango razonable, devolver string original
          return dateStr;
        }
      } else {
        // Si no se puede parsear, devolver el string original (puede ser texto como "hace 5 años", "2020", etc.)
        return dateStr;
      }
    } catch (error) {
      // Si hay error, devolver el string original
      return dateStr;
    }
  }

  /**
   * Mapea datos del chatbot a estructura de patient_info
   */
  static mapToPatientInfo(extractedData: ChatbotExtractedData): MappedPatientInfo {
    const map: MappedPatientInfo = {};

    // Información personal básica
    map.firstName = this.normalizeValue(extractedData.firstName || extractedData.first_name || extractedData.nombre);
    map.lastName = this.normalizeValue(extractedData.lastName || extractedData.last_name || extractedData.apellido);
    map.dateOfBirth = this.normalizeDate(extractedData.dateOfBirth || extractedData.date_of_birth || extractedData.fechaNacimiento || extractedData.dob);
    map.age = this.normalizeValue(extractedData.age || extractedData.edad);
    map.gender = this.normalizeValue(extractedData.gender || extractedData.genero);

    // Dirección
    map.addressLine = this.normalizeValue(extractedData.addressLine || extractedData.address || extractedData.direccion || extractedData.addressLine);
    map.city = this.normalizeValue(extractedData.city || extractedData.ciudad);
    map.country = this.normalizeValue(extractedData.country || extractedData.pais || extractedData.country);
    map.state = this.normalizeValue(extractedData.state || extractedData.estado || extractedData.province);
    map.zipcode = this.normalizeValue(extractedData.zipcode || extractedData.zip || extractedData.codigoPostal || extractedData.postalCode);

    // Contacto
    map.phoneNumber = this.normalizeValue(extractedData.phoneNumber || extractedData.phone || extractedData.telefono || extractedData.phone_number);
    map.email = this.normalizeValue(extractedData.email || extractedData.correo || extractedData.email_address);
    map.preferredContact = this.normalizeValue(extractedData.preferredContact || extractedData.preferred_contact || extractedData.contactoPreferido || 'text');

    // Trabajo y educación
    map.occupation = this.normalizeValue(extractedData.occupation || extractedData.ocupacion || extractedData.job);
    map.employer = this.normalizeValue(extractedData.employer || extractedData.empleador || extractedData.employer_name);
    map.education = this.normalizeValue(extractedData.education || extractedData.educacion || extractedData.education_level);

    // Contacto de emergencia
    map.emergencyFirstName = this.normalizeValue(extractedData.emergencyFirstName || extractedData.emergency_first_name || extractedData.emergencyContactFirstName);
    map.emergencyLastName = this.normalizeValue(extractedData.emergencyLastName || extractedData.emergency_last_name || extractedData.emergencyContactLastName);
    map.emergencyRelationship = this.normalizeValue(extractedData.emergencyRelationship || extractedData.emergency_relationship || extractedData.emergencyContactRelationship);
    map.emergencyPhone = this.normalizeValue(extractedData.emergencyPhone || extractedData.emergency_phone || extractedData.emergencyContactPhone);

    // BMI
    map.measurementSystem = (extractedData.measurementSystem || extractedData.measurement_system || 'standard') as 'standard' | 'metric';
    map.heightFeet = this.normalizeValue(extractedData.heightFeet || extractedData.height_feet);
    map.heightInches = this.normalizeValue(extractedData.heightInches || extractedData.height_inches);
    map.heightCm = this.normalizeValue(extractedData.heightCm || extractedData.height_cm || extractedData.heightCm);
    map.weightLbs = this.normalizeValue(extractedData.weightLbs || extractedData.weight_lbs || extractedData.weightLbs);
    map.weightKg = this.normalizeValue(extractedData.weightKg || extractedData.weight_kg || extractedData.weightKg);
    map.bmi = this.normalizeValue(extractedData.bmi || extractedData.BMI);

    // Cómo se enteró
    map.hearAboutUs = this.normalizeValue(extractedData.hearAboutUs || extractedData.hear_about_us || extractedData.comoSeEntero || extractedData.survey);
    // hearAboutUsOther es TEXT - puede ser largo
    map.hearAboutUsOther = this.normalizeValue(extractedData.hearAboutUsOther || extractedData.hear_about_us_other || extractedData.comoSeEnteroOtro, true);
    
    // Referencia (se agrega a hearAboutUsOther si existe)
    const referralName = this.normalizeValue(extractedData.referral || extractedData.referral_name || extractedData.referralName || extractedData.quienTeRefirio);
    if (referralName && referralName !== '') {
      // hearAboutUsOther es TEXT, puede ser largo, concatenamos la referencia
      map.hearAboutUsOther = map.hearAboutUsOther ? `${map.hearAboutUsOther}; Referido por: ${referralName}` : `Referido por: ${referralName}`;
    }

    // Seguro
    map.hasInsurance = this.normalizeValue(extractedData.hasInsurance || extractedData.has_insurance || extractedData.tieneSeguro || extractedData.insurance);
    map.insuranceProvider = this.normalizeValue(extractedData.insuranceProvider || extractedData.insurance_provider || extractedData.proveedorSeguro);
    map.policyNumber = this.normalizeValue(extractedData.policyNumber || extractedData.policy_number || extractedData.numeroPoliza);
    map.groupNumber = this.normalizeValue(extractedData.groupNumber || extractedData.group_number || extractedData.numeroGrupo);

    // Información adicional (campo TEXT - puede ser largo)
    map.additionalInfo = this.normalizeValue(extractedData.additionalInfo || extractedData.additional_info || extractedData.additionalComments || extractedData.comentariosAdicionales || extractedData.anythingElse, true);

    return map;
  }

  /**
   * Mapea datos del chatbot a estructura de surgery_interest
   */
  static mapToSurgeryInterest(extractedData: ChatbotExtractedData): MappedSurgeryInterest {
    const map: MappedSurgeryInterest = {};

    // Tipo de cirugía
    map.surgeryInterest = this.normalizeValue(extractedData.surgeryInterest || extractedData.surgery_interest || extractedData.surgicalInterest || extractedData.tipoCirugia);
    
    // Procedimientos específicos según tipo
    const surgeryType = map.surgeryInterest.toLowerCase();
    if (surgeryType.includes('first-time') || surgeryType.includes('primera vez')) {
      map.firstTimeBariatricName = this.normalizeValue(extractedData.specificProcedure || extractedData.specific_procedure || extractedData.procedimientoEspecifico);
    } else if (surgeryType.includes('revisional') || surgeryType.includes('revision')) {
      map.revisionalBariatricName = this.normalizeValue(extractedData.specificProcedure || extractedData.specific_procedure || extractedData.procedimientoEspecifico);
    } else if (surgeryType.includes('primary plastic') || surgeryType.includes('plastica primaria')) {
      map.primaryPlasticName = this.normalizeValue(extractedData.specificProcedure || extractedData.specific_procedure || extractedData.procedimientoEspecifico);
    } else if (surgeryType.includes('post bariatric') || surgeryType.includes('post-bariatric')) {
      map.postBariatricPlasticName = this.normalizeValue(extractedData.specificProcedure || extractedData.specific_procedure || extractedData.procedimientoEspecifico);
    }
    
    map.surgeryReadiness = this.normalizeValue(extractedData.processStage || extractedData.process_stage || extractedData.howFarInProcess || extractedData.etapaProceso || extractedData.surgeryReadiness);
    map.surgeonPreference = this.normalizeValue(extractedData.surgeonPreference || extractedData.surgeon_preference || extractedData.preferenciaCirujano);
    // additionalProcedures es TEXT - puede ser largo
    map.additionalProcedures = this.normalizeValue(extractedData.additionalProcedures || extractedData.additional_procedures || extractedData.procedimientosAdicionales, true);
    map.estimatedSurgeryDate = this.normalizeDate(extractedData.estimatedDate || extractedData.estimated_date || extractedData.fechaEstimada || extractedData.estimatedSurgeryDate);

    // Historial de peso
    map.highestWeight = this.normalizeValue(extractedData.highestWeight || extractedData.highest_weight || extractedData.HW || extractedData.pesoMasAlto);
    map.highestWeightDate = this.normalizeDate(extractedData.highestWeightDate || extractedData.highest_weight_date || extractedData.fechaPesoMasAlto);
    map.surgeryWeight = this.normalizeValue(extractedData.surgeryWeight || extractedData.surgery_weight || extractedData.SW || extractedData.pesoCirugia);
    map.lowestWeight = this.normalizeValue(extractedData.lowestWeight || extractedData.lowest_weight || extractedData.LW || extractedData.pesoMasBajo);
    map.lowestWeightDate = this.normalizeDate(extractedData.lowestWeightDate || extractedData.lowest_weight_date || extractedData.fechaPesoMasBajo);
    map.currentWeight = this.normalizeValue(extractedData.currentWeight || extractedData.current_weight || extractedData.CW || extractedData.pesoActual);
    map.currentWeightDuration = this.normalizeValue(extractedData.currentWeightMaintained || extractedData.current_weight_maintained || extractedData.tiempoMantenidoPesoActual || extractedData.currentWeightDuration);
    map.goalWeight = this.normalizeValue(extractedData.goalWeight || extractedData.goal_weight || extractedData.GW || extractedData.pesoObjetivo);
    map.goalWeightDate = this.normalizeDate(extractedData.goalWeightDate || extractedData.goal_weight_date || extractedData.fechaObjetivo);
    map.weightRegained = this.normalizeValue(extractedData.weightRegained || extractedData.weight_regained || extractedData.WR || extractedData.pesoRecuperado);
    map.weightRegainedDate = this.normalizeDate(extractedData.weightRegainedDate || extractedData.weight_regained_date || extractedData.fechaPesoRecuperado);
    map.weightRegainTime = this.normalizeValue(extractedData.weightRegainedTime || extractedData.weight_regained_time || extractedData.tiempoPesoRecuperado || extractedData.weightRegainTime);

    // Cirugía previa
    map.previousWeightLossSurgery = this.normalizeValue(extractedData.previousWeightLossSurgery || extractedData.previous_weight_loss_surgery || extractedData.cirugiaPesoPrevia);
    map.previousSurgeonName = this.normalizeValue(extractedData.previousSurgeonName || extractedData.previous_surgeon_name || extractedData.nombreCirujanoPrevio);
    map.consultedAboutWeightLoss = this.normalizeValue(extractedData.previousConsultation || extractedData.previous_consultation || extractedData.consultaPrevia || extractedData.consultedAboutWeightLoss);
    map.consultationType = this.normalizeValue(extractedData.previousConsultationType || extractedData.previous_consultation_type || extractedData.tipoConsultaPrevia || extractedData.consultationType);
    map.consultationDate = this.normalizeDate(extractedData.consultationDate || extractedData.consultation_date || extractedData.fechaConsulta);

    // GERD
    map.gerdHeartburn = this.normalizeValue(extractedData.gerdHeartburnFrequency || extractedData.gerd_heartburn_frequency || extractedData.frecuenciaAcidez || extractedData.gerdHeartburn);
    map.gerdRegurgitation = this.normalizeValue(extractedData.gerdRegurgitationFrequency || extractedData.gerd_regurgitation_frequency || extractedData.frecuenciaRegurgitacion || extractedData.gerdRegurgitation);
    map.gerdChestPain = this.normalizeValue(extractedData.gerdUpperStomachPain || extractedData.gerd_upper_stomach_pain || extractedData.dolorEstomagoSuperior || extractedData.gerdChestPain);
    map.gerdDifficultySwallowing = this.normalizeValue(extractedData.gerdDifficultySwallowing || extractedData.gerd_difficulty_swallowing || extractedData.dificultadTragar);
    map.gerdNausea = this.normalizeValue(extractedData.gerdNauseaFrequency || extractedData.gerd_nausea_frequency || extractedData.frecuenciaNauseas || extractedData.gerdNausea);
    map.gerdSleepDisturbance = this.normalizeValue(extractedData.gerdSleepDifficulty || extractedData.gerd_sleep_difficulty || extractedData.dificultadDormirGERD || extractedData.gerdSleepDisturbance);
    map.gerdEndoscopy = this.normalizeValue(extractedData.gerdEndoscopy || extractedData.gerd_endoscopy || extractedData.endoscopiaGI);
    map.gerdPhStudy = this.normalizeValue(extractedData.gerdPhMonitoring || extractedData.gerd_ph_monitoring || extractedData.monitoreoPh24h || extractedData.gerdPhStudy);
    map.gerdManometry = this.normalizeValue(extractedData.gerdManometry || extractedData.gerd_manometry || extractedData.manometriaEsofagica);

    // Programa de dieta
    map.dietProgramName = this.normalizeValue(extractedData.dietProgramName || extractedData.diet_program_name || extractedData.nombreDieta);
    map.dietProgramStartDate = this.normalizeDate(extractedData.dietProgramStartDate || extractedData.diet_program_start_date || extractedData.fechaInicioDieta);
    map.dietProgramDuration = this.normalizeValue(extractedData.dietProgramDuration || extractedData.diet_program_duration || extractedData.duracionDieta);
    map.dietProgramWeightLost = this.normalizeValue(extractedData.dietProgramWeightLost || extractedData.diet_program_weight_lost || extractedData.pesoPerdidoDieta);
    map.dietProgramWeightRegained = this.normalizeValue(extractedData.dietProgramWeightRegained || extractedData.diet_program_weight_regained || extractedData.pesoRecuperadoDieta);

    // PGWBI (Psychological General Well-Being Index) - mapeo a nombres de columnas reales
    const pgwbiMapping: Record<number, keyof MappedSurgeryInterest> = {
      1: 'pgwbi1Anxious',
      2: 'pgwbi2Depressed',
      3: 'pgwbi3SelfControl',
      4: 'pgwbi4Vitality',
      5: 'pgwbi5Health',
      6: 'pgwbi6Spirits',
      7: 'pgwbi7Worried',
      8: 'pgwbi8Energy',
      9: 'pgwbi9Mood',
      10: 'pgwbi10Tension',
      11: 'pgwbi11Happiness',
      12: 'pgwbi12Interest',
      13: 'pgwbi13Calm',
      14: 'pgwbi14Sad',
      15: 'pgwbi15Active',
      16: 'pgwbi16Cheerful',
      17: 'pgwbi17Tired',
      18: 'pgwbi18Pressure'
    };

    for (let i = 1; i <= 18; i++) {
      const columnName = pgwbiMapping[i];
      if (columnName) {
        map[columnName] = this.normalizeValue(
          extractedData[`pgwbi${i}`] || 
          extractedData[`PGWBI${i}`] || 
          extractedData[`pgwbi_${i}`] ||
          extractedData[columnName]
        );
      }
    }

    return map;
  }

  /**
   * Mapea datos del chatbot a estructura de medical_history
   */
  static mapToMedicalHistory(extractedData: ChatbotExtractedData): MappedMedicalHistory {
    const map: MappedMedicalHistory = {};

    // Condiciones médicas principales
    map.sleepApnea = this.normalizeValue(extractedData.sleepApnea || extractedData.sleep_apnea || extractedData.apneaSueño);
    map.useCpap = this.normalizeValue(extractedData.useCpap || extractedData.use_cpap || extractedData.usaCPAP || extractedData.usaBiPAP);
    // cpapDetails es TEXT - puede ser largo
    map.cpapDetails = this.normalizeValue(extractedData.cpapDetails || extractedData.cpap_details || extractedData.horasCPAP, true);
    map.diabetes = this.normalizeValue(extractedData.diabetes || extractedData.diabetesMellitus);
    map.useInsulin = this.normalizeValue(extractedData.useInsulin || extractedData.use_insulin || extractedData.usaInsulina);
    map.highBloodPressure = this.normalizeValue(extractedData.highBloodPressure || extractedData.high_blood_pressure || extractedData.presionArterialAlta);
    map.polycysticOvarianSyndrome = this.normalizeValue(extractedData.polycysticOvarianSyndrome || extractedData.PCOS);
    map.metabolicSyndrome = this.normalizeValue(extractedData.metabolicSyndrome || extractedData.metabolic_syndrome);
    map.refluxDisease = this.normalizeValue(extractedData.refluxDisease || extractedData.reflux_disease);
    map.degenerativeJointDisease = this.normalizeValue(extractedData.degenerativeJointDisease || extractedData.degenerative_joint_disease);
    map.urinaryStressIncontinence = this.normalizeValue(extractedData.urinaryStressIncontinence || extractedData.urinary_stress_incontinence);
    map.highCholesterol = this.normalizeValue(extractedData.highCholesterol || extractedData.high_cholesterol);
    map.venousStasis = this.normalizeValue(extractedData.venousStasis || extractedData.venous_stasis || extractedData.legSwelling);
    map.irregularMenstrualPeriod = this.normalizeValue(extractedData.irregularMenstrualPeriod || extractedData.irregular_menstrual_period);

    // Condiciones por sistema (pueden venir como arrays o strings)
    map.heartProblems = this.normalizeValue(extractedData.heartProblems || extractedData.heart_problems);
    map.respiratoryProblems = this.normalizeValue(extractedData.respiratoryProblems || extractedData.respiratory_problems);
    // respiratoryProblemsDetails es TEXT - puede ser largo
    map.respiratoryProblemsDetails = this.normalizeValue(extractedData.respiratoryProblemsDetails || extractedData.respiratory_problems_details || extractedData.detallesRespiratorios, true);
    map.urinaryConditions = this.normalizeValue(extractedData.urinaryConditions || extractedData.urinary_conditions);
    // urinaryConditionsDetails es TEXT - puede ser largo
    map.urinaryConditionsDetails = this.normalizeValue(extractedData.urinaryConditionsDetails || extractedData.urinary_conditions_details || extractedData.detallesUrinarios, true);
    map.muscularConditions = this.normalizeValue(extractedData.muscularConditions || extractedData.muscular_conditions);
    // muscularConditionsDetails es TEXT - puede ser largo
    map.muscularConditionsDetails = this.normalizeValue(extractedData.muscularConditionsDetails || extractedData.muscular_conditions_details || extractedData.detallesMusculares, true);
    map.neurologicalConditions = this.normalizeValue(extractedData.neurologicalConditions || extractedData.neurological_conditions);
    // neurologicalConditionsDetails es TEXT - puede ser largo
    map.neurologicalConditionsDetails = this.normalizeValue(extractedData.neurologicalConditionsDetails || extractedData.neurological_conditions_details || extractedData.detallesNeurologicos, true);
    map.bloodDisorders = this.normalizeValue(extractedData.bloodDisorders || extractedData.blood_disorders);
    // bloodDisordersDetails es TEXT - puede ser largo
    map.bloodDisordersDetails = this.normalizeValue(extractedData.bloodDisordersDetails || extractedData.blood_disorders_details || extractedData.detallesTrastornosSangre, true);
    map.endocrineCondition = this.normalizeValue(extractedData.endocrineCondition || extractedData.endocrine_condition);
    // endocrineConditionDetails es TEXT - puede ser largo
    map.endocrineConditionDetails = this.normalizeValue(extractedData.endocrineConditionDetails || extractedData.endocrine_condition_details || extractedData.detallesEndocrinos, true);
    // otherMedicalConditions es TEXT - puede ser largo
    map.otherMedicalConditions = this.normalizeValue(extractedData.otherMedicalConditions || extractedData.other_medical_conditions || extractedData.otrasCondicionesMedicas, true);
    map.gastrointestinalConditions = this.normalizeValue(extractedData.gastrointestinalConditions || extractedData.gastrointestinal_conditions);
    map.headNeckConditions = this.normalizeValue(extractedData.headNeckConditions || extractedData.head_neck_conditions);
    map.skinConditions = this.normalizeValue(extractedData.skinConditions || extractedData.skin_conditions);
    map.constitutionalSymptoms = this.normalizeValue(extractedData.constitutionalSymptoms || extractedData.constitutional || extractedData.hairLoss);

    // Enfermedades infecciosas
    map.hepatitis = this.normalizeValue(extractedData.hepatitis || extractedData.hepatitis);
    map.hepatitisType = this.normalizeValue(extractedData.hepatitisType || extractedData.hepatitis_type || extractedData.tipoHepatitis);
    map.hiv = this.normalizeValue(extractedData.hiv || extractedData.HIV);
    map.refuseBlood = this.normalizeValue(extractedData.refuseBlood || extractedData.refuse_blood || extractedData.niegaTransfusiones);

    // Psiquiátrico
    map.psychiatricHospital = this.normalizeValue(extractedData.psychiatricHospital || extractedData.psychiatric_hospital || extractedData.hospitalPsiquiatrico);
    map.attemptedSuicide = this.normalizeValue(extractedData.attemptedSuicide || extractedData.attempted_suicide || extractedData.intentoSuicidio);
    map.depression = this.normalizeValue(extractedData.depression || extractedData.depresion);
    map.anxiety = this.normalizeValue(extractedData.anxiety || extractedData.ansiedad);
    map.eatingDisorders = this.normalizeValue(extractedData.eatingDisorders || extractedData.eating_disorders || extractedData.anorexia || extractedData.bulimia);
    // psychiatricMedications es TEXT - puede ser largo
    map.psychiatricMedications = this.normalizeValue(extractedData.psychiatricMedications || extractedData.psychiatric_medications || extractedData.medicamentosPsiquiatricos, true);
    map.psychiatricTherapy = this.normalizeValue(extractedData.psychiatricTherapy || extractedData.psychiatric_therapy || extractedData.psiquiatra || extractedData.consejero);
    map.psychiatricHospitalization = this.normalizeValue(extractedData.psychiatricHospitalization || extractedData.psychiatric_hospitalization || extractedData.hospitalizacionPsiquiatrica);

    // Historial social
    map.tobacco = this.normalizeValue(extractedData.tobacco || extractedData.smoking || extractedData.fuma || extractedData.tabaco);
    // tobaccoDetails es TEXT - puede ser largo
    map.tobaccoDetails = this.normalizeValue(extractedData.tobaccoDetails || extractedData.tobacco_details || extractedData.detallesTabaco, true);
    map.alcohol = this.normalizeValue(extractedData.alcohol || extractedData.alcohol_consumption || extractedData.consumoAlcohol);
    // alcoholDetails es TEXT - puede ser largo
    map.alcoholDetails = this.normalizeValue(extractedData.alcoholDetails || extractedData.alcohol_details || extractedData.detallesAlcohol, true);
    map.drugs = this.normalizeValue(extractedData.drugs || extractedData.street_drugs || extractedData.drogas);
    // drugsDetails es TEXT - puede ser largo
    map.drugsDetails = this.normalizeValue(extractedData.drugsDetails || extractedData.drugs_details || extractedData.detallesDrogas, true);
    map.caffeine = this.normalizeValue(extractedData.caffeine || extractedData.caffeinated_beverages || extractedData.cafeina);
    map.diet = this.normalizeValue(extractedData.diet || extractedData.dietary_habits || extractedData.habitosAlimenticios);
    // otherSubstances es TEXT - puede ser largo
    map.otherSubstances = this.normalizeValue(extractedData.otherSubstances || extractedData.other_substances || extractedData.marijuana || extractedData.aspirin || extractedData.sexualHormones, true);

    // Medicamentos y alergias (pueden ser arrays) - campos TEXT
    const medications = extractedData.medications || extractedData.medication || extractedData.medicamentos;
    if (Array.isArray(medications)) {
      map.medications = JSON.stringify(medications);
    } else {
      map.medications = this.normalizeValue(medications, true);
    }

    const allergies = extractedData.allergies || extractedData.allergy || extractedData.alergias;
    if (Array.isArray(allergies)) {
      map.allergies = JSON.stringify(allergies);
    } else {
      map.allergies = this.normalizeValue(allergies, true);
    }

    // Cirugías previas (puede ser array) - campo TEXT
    const previousSurgeries = extractedData.previousSurgeries || extractedData.previous_surgeries || extractedData.surgicalHistory || extractedData.cirugiasPrevias;
    if (Array.isArray(previousSurgeries)) {
      map.previousSurgeries = JSON.stringify(previousSurgeries);
    } else {
      map.previousSurgeries = this.normalizeValue(previousSurgeries, true);
    }

    // surgicalComplications es TEXT - puede ser largo
    map.surgicalComplications = this.normalizeValue(extractedData.surgicalComplications || extractedData.surgical_complications || extractedData.complicacionesQuirurgicas, true);

    // Solo mujeres
    map.pregnancy = this.normalizeValue(extractedData.pregnancy || extractedData.pregnancies || extractedData.embarazos);
    // pregnancyDetails es TEXT - puede ser largo
    const pregnancyDetails = extractedData.pregnancyDetails || extractedData.pregnancy_details || extractedData.detallesEmbarazos;
    if (Array.isArray(pregnancyDetails)) {
      map.pregnancyDetails = JSON.stringify(pregnancyDetails);
    } else {
      map.pregnancyDetails = this.normalizeValue(pregnancyDetails, true);
    }

    // Referencia
    map.referral = this.normalizeValue(extractedData.referral || extractedData.referral_name || extractedData.referidoPor);
    // referralDetails es TEXT - puede ser largo
    map.referralDetails = this.normalizeValue(extractedData.referralDetails || extractedData.referral_details, true);

    // Otras condiciones y hospitalizaciones
    // otherConditions es TEXT - puede ser largo
    map.otherConditions = this.normalizeValue(extractedData.otherConditions || extractedData.other_conditions || extractedData.otrasCondiciones || extractedData.additionalMedical, true);
    map.hospitalizations = this.normalizeValue(extractedData.hospitalizations || extractedData.hospitalization || extractedData.hospitalizaciones);
    // hospitalizationsDetails es TEXT - puede ser largo
    const hospitalizationsDetails = extractedData.hospitalizationsDetails || extractedData.hospitalizations_details || extractedData.detallesHospitalizaciones;
    if (Array.isArray(hospitalizationsDetails)) {
      map.hospitalizationsDetails = JSON.stringify(hospitalizationsDetails);
    } else {
      map.hospitalizationsDetails = this.normalizeValue(hospitalizationsDetails, true);
    }

    return map;
  }

  /**
   * Mapea datos del chatbot a estructura de family_history
   */
  static mapToFamilyHistory(extractedData: ChatbotExtractedData): MappedFamilyHistory {
    const map: MappedFamilyHistory = {};

    map.heartDisease = this.normalizeValue(extractedData.heartDisease || extractedData.heart_disease || extractedData.enfermedadCardiaca || extractedData.familyHeartDisease);
    map.pulmonaryEdema = this.normalizeValue(extractedData.pulmonaryEdema || extractedData.familyPulmonaryEdema || extractedData.edemaPulmonar);
    map.diabetesMellitus = this.normalizeValue(extractedData.diabetesMellitus || extractedData.familyDiabetes || extractedData.diabetes);
    map.highBloodPressure = this.normalizeValue(extractedData.familyHighBloodPressure || extractedData.familyHighBP || extractedData.presionArterialAlta || extractedData.highBloodPressure);
    map.alcoholism = this.normalizeValue(extractedData.alcoholism || extractedData.familyAlcoholism || extractedData.alcoholismo);
    map.liverProblems = this.normalizeValue(extractedData.liverProblems || extractedData.familyLiverProblems || extractedData.problemasHepaticos);
    map.lungProblems = this.normalizeValue(extractedData.lungProblems || extractedData.familyLungProblems || extractedData.problemasPulmonares);
    map.bleedingDisorder = this.normalizeValue(extractedData.bleedingDisorder || extractedData.familyBleedingDisorder || extractedData.trastornoHemorragico);
    map.gallstones = this.normalizeValue(extractedData.gallstones || extractedData.familyGallstones || extractedData.calculosBiliares);
    map.mentalIllness = this.normalizeValue(extractedData.mentalIllness || extractedData.familyMentalIllness || extractedData.enfermedadMental);
    map.malignantHyperthermia = this.normalizeValue(extractedData.malignantHyperthermia || extractedData.familyMalignantHyperthermia || extractedData.hipertermiaMaligna);
    map.cancer = this.normalizeValue(extractedData.familyCancer || extractedData.cancer);
    // otherFamilyConditions es TEXT - puede ser largo
    map.otherFamilyConditions = this.normalizeValue(extractedData.otherFamilyConditions || extractedData.otrasCondicionesFamiliares, true);

    return map;
  }
}

