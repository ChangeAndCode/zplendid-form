// Preguntas del cuestionario médico - Información del Paciente
export const patientInfoQuestions = [
  {
    id: 'firstName',
    category: 'personal',
    questionText: '¿Cuál es su nombre de pila?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'firstName' as const
  },
  {
    id: 'lastName',
    category: 'personal',
    questionText: '¿Cuál es su apellido?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'lastName' as const
  },
  {
    id: 'dateOfBirth',
    category: 'personal',
    questionText: '¿Cuál es su fecha de nacimiento? Puede decirla en cualquier formato, por ejemplo: 10 de enero de 1979, o 10/01/1979',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: true
    },
    fieldName: 'dateOfBirth' as const
  },
  {
    id: 'age',
    category: 'personal',
    questionText: '¿Cuántos años tiene?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true
    },
    fieldName: 'age' as const
  },
  {
    id: 'gender',
    category: 'personal',
    questionText: '¿Cuál es su género?',
    expectedResponseType: 'select' as const,
    options: ['Masculino', 'Femenino', 'Otro'],
    validationRules: {
      required: true
    },
    fieldName: 'gender' as const
  },
  {
    id: 'addressLine',
    category: 'personal',
    questionText: '¿Cuál es su dirección completa? Por ejemplo: 3501 Soleil Boulevard',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    fieldName: 'addressLine' as const
  },
  {
    id: 'city',
    category: 'personal',
    questionText: '¿En qué ciudad vive?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'city' as const
  },
  {
    id: 'country',
    category: 'personal',
    questionText: '¿En qué país reside?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'country' as const
  },
  {
    id: 'state',
    category: 'personal',
    questionText: '¿Cuál es su estado o provincia?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'state' as const
  },
  {
    id: 'zipcode',
    category: 'personal',
    questionText: '¿Cuál es su código postal?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 3,
      maxLength: 10
    },
    fieldName: 'zipcode' as const
  },
  {
    id: 'hearAboutUs',
    category: 'survey',
    questionText: '¿Cómo se enteró de nosotros?',
    expectedResponseType: 'select' as const,
    options: ['Instagram', 'Facebook', 'Google', 'Referido', 'Otro'],
    validationRules: {
      required: true
    },
    fieldName: 'hearAboutUs' as const
  },
  {
    id: 'hearAboutUsOther',
    category: 'survey',
    questionText: '¿Podría especificar cómo se enteró de nosotros?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 3
    },
    fieldName: 'hearAboutUsOther' as const
  },
  {
    id: 'phoneNumber',
    category: 'contact',
    questionText: '¿Cuál es su número de teléfono?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 10
    },
    fieldName: 'phoneNumber' as const
  },
  {
    id: 'email',
    category: 'contact',
    questionText: '¿Cuál es su correo electrónico?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    fieldName: 'email' as const
  },
  {
    id: 'preferredContact',
    category: 'contact',
    questionText: '¿Cuál es su método de contacto preferido?',
    expectedResponseType: 'select' as const,
    options: ['Texto', 'Llamada', 'Email'],
    validationRules: {
      required: true
    },
    fieldName: 'preferredContact' as const
  },
  {
    id: 'occupation',
    category: 'work',
    questionText: '¿Cuál es su ocupación?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2
    },
    fieldName: 'occupation' as const
  },
  {
    id: 'employer',
    category: 'work',
    questionText: '¿Para quién trabaja?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2
    },
    fieldName: 'employer' as const
  },
  {
    id: 'education',
    category: 'work',
    questionText: '¿Cuál es su nivel educativo?',
    expectedResponseType: 'select' as const,
    options: ['Bachillerato', 'Universidad', 'Posgrado', 'Otro'],
    validationRules: {
      required: true
    },
    fieldName: 'education' as const
  },
  {
    id: 'heightFeet',
    category: 'health',
    questionText: '¿Cuál es su altura en pies?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 3,
      max: 8
    },
    fieldName: 'heightFeet' as const
  },
  {
    id: 'heightInches',
    category: 'health',
    questionText: '¿Cuántas pulgadas adicionales?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0,
      max: 11
    },
    fieldName: 'heightInches' as const
  },
  {
    id: 'weightLbs',
    category: 'health',
    questionText: '¿Cuál es su peso actual en libras?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 50,
      max: 1000
    },
    fieldName: 'weightLbs' as const
  },
  {
    id: 'heightCm',
    category: 'health',
    questionText: '¿Cuál es su altura en centímetros?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 100,
      max: 250
    },
    fieldName: 'heightCm' as const
  },
  {
    id: 'weightKg',
    category: 'health',
    questionText: '¿Cuál es su peso en kilogramos?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 20,
      max: 500
    },
    fieldName: 'weightKg' as const
  },
  {
    id: 'bmi',
    category: 'health',
    questionText: 'Su IMC será calculado automáticamente',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false
    },
    fieldName: 'bmi' as const
  },
  {
    id: 'emergencyFirstName',
    category: 'emergency',
    questionText: '¿Cuál es el nombre de su contacto de emergencia?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'emergencyFirstName' as const
  },
  {
    id: 'emergencyLastName',
    category: 'emergency',
    questionText: '¿Cuál es el apellido de su contacto de emergencia?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'emergencyLastName' as const
  },
  {
    id: 'emergencyRelationship',
    category: 'emergency',
    questionText: '¿Cuál es su relación con el contacto de emergencia?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fieldName: 'emergencyRelationship' as const
  },
  {
    id: 'emergencyPhone',
    category: 'emergency',
    questionText: '¿Cuál es el número de teléfono del contacto de emergencia?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 10
    },
    fieldName: 'emergencyPhone' as const
  },
  {
    id: 'previousWeightLossSurgery',
    category: 'weightHistory',
    questionText: '¿Ha tenido alguna cirugía de pérdida de peso anteriormente?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'previousWeightLossSurgery' as const
  },
  {
    id: 'surgeonName',
    category: 'weightHistory',
    questionText: '¿Cuál es el nombre del cirujano de su cirugía de pérdida de peso más reciente?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'surgeonName' as const
  },
  {
    id: 'consultedWeightLossSurgery',
    category: 'weightHistory',
    questionText: '¿Ha sido consultado sobre cirugía de pérdida de peso?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'consultedWeightLossSurgery' as const
  },
  {
    id: 'surgeryType',
    category: 'weightHistory',
    questionText: '¿Cuál fue el tipo de cirugía o consulta?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 200
    },
    fieldName: 'surgeryType' as const
  },
  // FAMILY HISTORY
  {
    id: 'familyHeartDisease',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de enfermedades cardíacas en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyHeartDisease' as const
  },
  {
    id: 'familyDiabetes',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de diabetes mellitus en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyDiabetes' as const
  },
  {
    id: 'familyAlcoholism',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de alcoholismo en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyAlcoholism' as const
  },
  {
    id: 'familyLungProblems',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de problemas pulmonares en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyLungProblems' as const
  },
  {
    id: 'familyGallstones',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de cálculos biliares en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyGallstones' as const
  },
  {
    id: 'familyMalignantHyperthermia',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de hipertermia maligna en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyMalignantHyperthermia' as const
  },
  {
    id: 'familyPulmonaryEdema',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de edema pulmonar en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyPulmonaryEdema' as const
  },
  {
    id: 'familyHighBloodPressure',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de presión arterial alta en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyHighBloodPressure' as const
  },
  {
    id: 'familyLiverProblems',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de problemas hepáticos en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyLiverProblems' as const
  },
  {
    id: 'familyBleedingDisorder',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de trastornos hemorrágicos en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyBleedingDisorder' as const
  },
  {
    id: 'familyMentalIllness',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de enfermedades mentales en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyMentalIllness' as const
  },
  {
    id: 'familyCancer',
    category: 'familyHistory',
    questionText: '¿Hay antecedentes de cáncer en su familia?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'familyCancer' as const
  },
  // PAST MEDICAL HISTORY
  {
    id: 'sleepApnea',
    category: 'medicalHistory',
    questionText: '¿Ha sido diagnosticado con apnea del sueño?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'sleepApnea' as const
  },
  {
    id: 'diabetes',
    category: 'medicalHistory',
    questionText: '¿Tiene diabetes?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'diabetes' as const
  },
  {
    id: 'useInsulin',
    category: 'medicalHistory',
    questionText: 'Si tiene diabetes, ¿usa insulina?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: false
    },
    fieldName: 'useInsulin' as const
  },
  {
    id: 'useCpap',
    category: 'medicalHistory',
    questionText: 'Si tiene apnea del sueño, ¿usa CPAP?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: false
    },
    fieldName: 'useCpap' as const
  },
  {
    id: 'useBipap',
    category: 'medicalHistory',
    questionText: 'Si usa CPAP, ¿usa BiPAP?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: false
    },
    fieldName: 'useBipap' as const
  },
  {
    id: 'cpapDetails',
    category: 'medicalHistory',
    questionText: 'If you use CPAP/BiPAP, how many hours per night?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false
    },
    fieldName: 'cpapDetails' as const
  },
  // HEART PROBLEMS
  { id: 'heartAttack', category: 'heartConditions', questionText: 'Have you had a heart attack?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'heartAttack' as const },
  { id: 'angina', category: 'heartConditions', questionText: 'Do you have angina?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'angina' as const },
  { id: 'rhythmDisturbance', category: 'heartConditions', questionText: 'Do you have rhythm disturbance?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'rhythmDisturbance' as const },
  { id: 'congestiveHeartFailure', category: 'heartConditions', questionText: 'Do you have congestive heart failure?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'congestiveHeartFailure' as const },
  { id: 'ankleSwelling', category: 'heartConditions', questionText: 'Do you have ankle swelling?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'ankleSwelling' as const },
  { id: 'varicoseVeins', category: 'heartConditions', questionText: 'Do you have varicose veins?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'varicoseVeins' as const },
  { id: 'hemorrhoids', category: 'heartConditions', questionText: 'Do you have hemorrhoids?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hemorrhoids' as const },
  { id: 'phlebitis', category: 'heartConditions', questionText: 'Do you have phlebitis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'phlebitis' as const },
  { id: 'ankleLegUlcers', category: 'heartConditions', questionText: 'Do you have ankle/leg ulcers?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'ankleLegUlcers' as const },
  { id: 'heartBypass', category: 'heartConditions', questionText: 'Have you had heart bypass surgery?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'heartBypass' as const },
  { id: 'pacemaker', category: 'heartConditions', questionText: 'Do you have a pacemaker?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'pacemaker' as const },
  { id: 'cloggedHeartArteries', category: 'heartConditions', questionText: 'Do you have clogged heart arteries?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'cloggedHeartArteries' as const },
  { id: 'rheumaticFever', category: 'heartConditions', questionText: 'Have you had rheumatic fever?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'rheumaticFever' as const },
  { id: 'heartMurmur', category: 'heartConditions', questionText: 'Do you have a heart murmur?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'heartMurmur' as const },
  { id: 'irregularHeartBeat', category: 'heartConditions', questionText: 'Do you have an irregular heart beat?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'irregularHeartBeat' as const },
  { id: 'crampingLegs', category: 'heartConditions', questionText: 'Do you have cramping in legs when walking?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'crampingLegs' as const },
  { id: 'otherHeartSymptoms', category: 'heartConditions', questionText: 'Any other heart symptoms?', expectedResponseType: 'text' as const, validationRules: { required: false }, fieldName: 'otherHeartSymptoms' as const },

  // RESPIRATORY PROBLEMS
  { id: 'emphysema', category: 'respiratoryConditions', questionText: 'Do you have emphysema?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'emphysema' as const },
  { id: 'bronchitis', category: 'respiratoryConditions', questionText: 'Do you have bronchitis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'bronchitis' as const },
  { id: 'pneumonia', category: 'respiratoryConditions', questionText: 'Have you had pneumonia?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'pneumonia' as const },
  { id: 'chronicCough', category: 'respiratoryConditions', questionText: 'Do you have a chronic cough?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'chronicCough' as const },
  { id: 'shortOfBreath', category: 'respiratoryConditions', questionText: 'Are you short of breath?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'shortOfBreath' as const },
  { id: 'oxygenSupplement', category: 'respiratoryConditions', questionText: 'Do you use oxygen supplement?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'oxygenSupplement' as const },
  { id: 'tuberculosis', category: 'respiratoryConditions', questionText: 'Have you had tuberculosis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'tuberculosis' as const },
  { id: 'pulmonaryEmbolism', category: 'respiratoryConditions', questionText: 'Have you had a pulmonary embolism?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'pulmonaryEmbolism' as const },
  { id: 'hypoventilationSyndrome', category: 'respiratoryConditions', questionText: 'Do you have hypoventilation syndrome?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hypoventilationSyndrome' as const },
  { id: 'coughUpBlood', category: 'respiratoryConditions', questionText: 'Do you cough up blood?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'coughUpBlood' as const },
  { id: 'snoring', category: 'respiratoryConditions', questionText: 'Do you snore?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'snoring' as const },
  { id: 'lungSurgery', category: 'respiratoryConditions', questionText: 'Have you had lung surgery?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lungSurgery' as const },
  { id: 'lungCancer', category: 'respiratoryConditions', questionText: 'Have you had lung cancer?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lungCancer' as const },

  // URINARY CONDITIONS
  { id: 'kidneyStones', category: 'urinaryConditions', questionText: 'Do you have kidney stones?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'kidneyStones' as const },
  { id: 'frequentUrination', category: 'urinaryConditions', questionText: 'Do you have frequent urination?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'frequentUrination' as const },
  { id: 'bladderControl', category: 'urinaryConditions', questionText: 'Do you have bladder control problems?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'bladderControl' as const },
  { id: 'painfulUrination', category: 'urinaryConditions', questionText: 'Do you have painful urination?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'painfulUrination' as const },

  // MUSCULAR CONDITIONS
  { id: 'neckPain', category: 'muscularConditions', questionText: 'Do you have neck pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'neckPain' as const },
  { id: 'shoulderPain', category: 'muscularConditions', questionText: 'Do you have shoulder pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'shoulderPain' as const },
  { id: 'wristPain', category: 'muscularConditions', questionText: 'Do you have wrist pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'wristPain' as const },
  { id: 'backPain', category: 'muscularConditions', questionText: 'Do you have back pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'backPain' as const },
  { id: 'hipPain', category: 'muscularConditions', questionText: 'Do you have hip pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hipPain' as const },
  { id: 'kneePain', category: 'muscularConditions', questionText: 'Do you have knee pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'kneePain' as const },
  { id: 'anklePain', category: 'muscularConditions', questionText: 'Do you have ankle pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'anklePain' as const },
  { id: 'footPain', category: 'muscularConditions', questionText: 'Do you have foot pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'footPain' as const },
  { id: 'heelPain', category: 'muscularConditions', questionText: 'Do you have heel pain?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'heelPain' as const },
  { id: 'plantarFasciitis', category: 'muscularConditions', questionText: 'Do you have plantar fasciitis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'plantarFasciitis' as const },
  { id: 'carpalTunnel', category: 'muscularConditions', questionText: 'Do you have carpal tunnel syndrome?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'carpalTunnel' as const },
  { id: 'lupus', category: 'muscularConditions', questionText: 'Do you have lupus?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lupus' as const },

  // NEUROLOGICAL CONDITIONS
  { id: 'migraineHeadaches', category: 'neurologicalConditions', questionText: 'Do you have migraine headaches?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'migraineHeadaches' as const },
  { id: 'balanceDisturbance', category: 'neurologicalConditions', questionText: 'Do you have balance disturbance?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'balanceDisturbance' as const },
  { id: 'seizureConvulsions', category: 'neurologicalConditions', questionText: 'Do you have seizures or convulsions?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'seizureConvulsions' as const },
  { id: 'weakness', category: 'neurologicalConditions', questionText: 'Do you have weakness?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'weakness' as const },
  { id: 'stroke', category: 'neurologicalConditions', questionText: 'Have you had a stroke?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'stroke' as const },
  { id: 'alzheimers', category: 'neurologicalConditions', questionText: 'Do you have Alzheimers?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'alzheimers' as const },
  { id: 'pseudoTumorCerebral', category: 'neurologicalConditions', questionText: 'Do you have pseudo tumor cerebral?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'pseudoTumorCerebral' as const },
  { id: 'multipleSclerosis', category: 'neurologicalConditions', questionText: 'Do you have multiple sclerosis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'multipleSclerosis' as const },
  { id: 'frequencySevereHeadaches', category: 'neurologicalConditions', questionText: 'Do you have frequent severe headaches?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'frequencySevereHeadaches' as const },
  { id: 'knockedUnconscious', category: 'neurologicalConditions', questionText: 'Have you been knocked unconscious?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'knockedUnconscious' as const },

  // BLOOD DISORDERS
  { id: 'anemiaIronDeficient', category: 'bloodConditions', questionText: 'Do you have iron deficient anemia?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'anemiaIronDeficient' as const },
  { id: 'anemiaVitaminB12Deficient', category: 'bloodConditions', questionText: 'Do you have Vitamin B12 deficient anemia?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'anemiaVitaminB12Deficient' as const },
  { id: 'lowPlatelets', category: 'bloodConditions', questionText: 'Do you have low platelets?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lowPlatelets' as const },
  { id: 'lymphoma', category: 'bloodConditions', questionText: 'Do you have lymphoma?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lymphoma' as const },
  { id: 'swollenLymphNodes', category: 'bloodConditions', questionText: 'Do you have swollen lymph nodes?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'swollenLymphNodes' as const },
  { id: 'superficialBloodClot', category: 'bloodConditions', questionText: 'Have you had a superficial blood clot in leg?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'superficialBloodClot' as const },
  { id: 'deepBloodClot', category: 'bloodConditions', questionText: 'Have you had a deep blood clot in leg?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'deepBloodClot' as const },
  { id: 'bloodClotLungs', category: 'bloodConditions', questionText: 'Have you had a blood clot in lungs?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'bloodClotLungs' as const },
  { id: 'bleedingDisorder', category: 'bloodConditions', questionText: 'Do you have a bleeding disorder?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'bleedingDisorder' as const },

  // ENDOCRINE CONDITIONS
  { id: 'hypothyroid', category: 'endocrineConditions', questionText: 'Do you have hypothyroid?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hypothyroid' as const },
  { id: 'hyperthyroid', category: 'endocrineConditions', questionText: 'Do you have hyperthyroid?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hyperthyroid' as const },
  { id: 'goiter', category: 'endocrineConditions', questionText: 'Do you have a goiter?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'goiter' as const },
  { id: 'parathyroid', category: 'endocrineConditions', questionText: 'Do you have parathyroid problems?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'parathyroid' as const },
  { id: 'elevatedCholesterol', category: 'endocrineConditions', questionText: 'Do you have elevated cholesterol?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'elevatedCholesterol' as const },
  { id: 'elevatedTriglycerides', category: 'endocrineConditions', questionText: 'Do you have elevated triglycerides?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'elevatedTriglycerides' as const },
  { id: 'lowBloodSugar', category: 'endocrineConditions', questionText: 'Do you have low blood sugar?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lowBloodSugar' as const },
  { id: 'prediabetes', category: 'endocrineConditions', questionText: 'Do you have prediabetes?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'prediabetes' as const },
  { id: 'gout', category: 'endocrineConditions', questionText: 'Do you have gout?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'gout' as const },
  { id: 'endocrineGlandTumor', category: 'endocrineConditions', questionText: 'Do you have an endocrine gland tumor?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'endocrineGlandTumor' as const },
  { id: 'cancerEndocrineGland', category: 'endocrineConditions', questionText: 'Have you had cancer of endocrine gland?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'cancerEndocrineGland' as const },
  { id: 'highCalciumLevel', category: 'endocrineConditions', questionText: 'Do you have high calcium level?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'highCalciumLevel' as const },
  { id: 'abnormalFacialHair', category: 'endocrineConditions', questionText: 'Do you have abnormal facial hair growth?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'abnormalFacialHair' as const },

  // GASTROINTESTINAL CONDITIONS
  { id: 'heartburn', category: 'gastrointestinalConditions', questionText: 'Do you have heartburn?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'heartburn' as const },
  { id: 'hiatalHernia', category: 'gastrointestinalConditions', questionText: 'Do you have a hiatal hernia?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hiatalHernia' as const },
  { id: 'ulcers', category: 'gastrointestinalConditions', questionText: 'Do you have ulcers?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'ulcers' as const },
  { id: 'diarrhea', category: 'gastrointestinalConditions', questionText: 'Do you have diarrhea?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'diarrhea' as const },
  { id: 'bloodInStool', category: 'gastrointestinalConditions', questionText: 'Do you have blood in stool?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'bloodInStool' as const },
  { id: 'changeInBowelHabit', category: 'gastrointestinalConditions', questionText: 'Have you had a change in bowel habit?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'changeInBowelHabit' as const },
  { id: 'constipation', category: 'gastrointestinalConditions', questionText: 'Do you have constipation?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'constipation' as const },
  { id: 'irritableBowel', category: 'gastrointestinalConditions', questionText: 'Do you have irritable bowel syndrome?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'irritableBowel' as const },
  { id: 'colitis', category: 'gastrointestinalConditions', questionText: 'Do you have colitis?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'colitis' as const },
  { id: 'crohns', category: 'gastrointestinalConditions', questionText: 'Do you have Crohns disease?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'crohns' as const },
  { id: 'fissure', category: 'gastrointestinalConditions', questionText: 'Do you have a fissure?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'fissure' as const },
  { id: 'rectalBleeding', category: 'gastrointestinalConditions', questionText: 'Do you have rectal bleeding?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'rectalBleeding' as const },
  { id: 'blackTarryStools', category: 'gastrointestinalConditions', questionText: 'Do you have black tarry stools?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'blackTarryStools' as const },
  { id: 'polyps', category: 'gastrointestinalConditions', questionText: 'Do you have polyps?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'polyps' as const },

  // HEAD AND NECK CONDITIONS
  { id: 'wearGlasses', category: 'headNeckConditions', questionText: 'Do you wear glasses?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'wearGlasses' as const },
  { id: 'cataracts', category: 'headNeckConditions', questionText: 'Do you have cataracts?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'cataracts' as const },
  { id: 'glaucoma', category: 'headNeckConditions', questionText: 'Do you have glaucoma?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'glaucoma' as const },
  { id: 'wearContacts', category: 'headNeckConditions', questionText: 'Do you wear contacts?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'wearContacts' as const },
  { id: 'hardOfHearing', category: 'headNeckConditions', questionText: 'Are you hard of hearing?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hardOfHearing' as const },
  { id: 'wearHearingAid', category: 'headNeckConditions', questionText: 'Do you wear a hearing aid?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'wearHearingAid' as const },
  { id: 'dizziness', category: 'headNeckConditions', questionText: 'Do you have dizziness?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'dizziness' as const },
  { id: 'faintingSpells', category: 'headNeckConditions', questionText: 'Do you have fainting spells?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'faintingSpells' as const },
  { id: 'difficultySwallowing', category: 'headNeckConditions', questionText: 'Do you have difficulty swallowing?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'difficultySwallowing' as const },
  { id: 'wearDentures', category: 'headNeckConditions', questionText: 'Do you wear dentures?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'wearDentures' as const },
  { id: 'sinusProblems', category: 'headNeckConditions', questionText: 'Do you have sinus problems?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'sinusProblems' as const },
  { id: 'lumpsInNeck', category: 'headNeckConditions', questionText: 'Do you have lumps in neck?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'lumpsInNeck' as const },
  { id: 'hoarseness', category: 'headNeckConditions', questionText: 'Do you have hoarseness?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'hoarseness' as const },
  { id: 'thyroidProblems', category: 'headNeckConditions', questionText: 'Do you have thyroid problems?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'thyroidProblems' as const },

  // SKIN CONDITIONS
  { id: 'rashes', category: 'skinConditions', questionText: 'Do you have rashes?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'rashes' as const },
  { id: 'keloids', category: 'skinConditions', questionText: 'Do you have keloids?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'keloids' as const },
  { id: 'poorWoundHealing', category: 'skinConditions', questionText: 'Do you have poor wound healing?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'poorWoundHealing' as const },
  { id: 'frequentSkinInfections', category: 'skinConditions', questionText: 'Do you have frequent skin infections?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'frequentSkinInfections' as const },

  // CONSTITUTIONAL SYMPTOMS
  { id: 'fevers', category: 'constitutionalConditions', questionText: 'Do you have fevers?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'fevers' as const },
  { id: 'nightSweats', category: 'constitutionalConditions', questionText: 'Do you have night sweats?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'nightSweats' as const },
  { id: 'weightLoss', category: 'constitutionalConditions', questionText: 'Have you had weight loss?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'weightLoss' as const },
  { id: 'chronicFatigue', category: 'constitutionalConditions', questionText: 'Do you have chronic fatigue?', expectedResponseType: 'yesno' as const, validationRules: { required: true }, fieldName: 'chronicFatigue' as const },
  // OTHER MEDICAL CONDITIONS
  {
    id: 'otherMedicalConditions',
    category: 'additionalMedical',
    questionText: '¿Hay alguna otra condición médica o hospitalización (no quirúrgica) importante que debamos conocer?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'otherMedicalConditions' as const
  },
  // SURGERY OF INTEREST
  {
    id: 'surgeryInterest',
    category: 'surgicalInterest',
    questionText: '¿Cuál es el tipo de cirugía que le interesa?',
    expectedResponseType: 'select' as const,
    options: ['First-time Bariatric Surgery', 'Revisional Bariatric Surgery', 'Primary Plastic Surgery', 'Post Bariatric Plastic Surgery'],
    validationRules: {
      required: true
    },
    fieldName: 'surgeryInterest' as const
  },
  {
    id: 'firstTimeBariatricSurgeryName',
    category: 'surgicalInterest',
    questionText: '¿Cuál es el nombre específico de la cirugía bariátrica que le interesa?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'firstTimeBariatricSurgeryName' as const
  },
  {
    id: 'revisionalBariatricSurgeryName',
    category: 'surgicalInterest',
    questionText: '¿Cuál es el nombre específico de la cirugía bariátrica de revisión que le interesa?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'revisionalBariatricSurgeryName' as const
  },
  {
    id: 'primaryPlasticSurgeryName',
    category: 'surgicalInterest',
    questionText: '¿Cuál es el nombre específico de la cirugía plástica primaria que le interesa?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'primaryPlasticSurgeryName' as const
  },
  {
    id: 'postBariatricPlasticSurgeryName',
    category: 'surgicalInterest',
    questionText: '¿Cuál es el nombre específico de la cirugía plástica post-bariátrica que le interesa?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'postBariatricPlasticSurgeryName' as const
  },
  // WEIGHT HISTORY
  {
    id: 'highestWeight',
    category: 'weightHistory',
    questionText: '¿Cuál ha sido su peso más alto?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 50,
      max: 1000
    },
    fieldName: 'highestWeight' as const
  },
  {
    id: 'highestWeightDate',
    category: 'weightHistory',
    questionText: '¿Cuándo fue su peso más alto?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: true
    },
    fieldName: 'highestWeightDate' as const
  },
  {
    id: 'surgeryWeight',
    category: 'weightHistory',
    questionText: '¿Cuál fue su peso al momento de la cirugía?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 50,
      max: 1000
    },
    fieldName: 'surgeryWeight' as const
  },
  {
    id: 'lowestWeight',
    category: 'weightHistory',
    questionText: '¿Cuál ha sido su peso más bajo?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 50,
      max: 1000
    },
    fieldName: 'lowestWeight' as const
  },
  {
    id: 'lowestWeightDate',
    category: 'weightHistory',
    questionText: '¿Cuándo fue su peso más bajo?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: true
    },
    fieldName: 'lowestWeightDate' as const
  },
  {
    id: 'currentWeight',
    category: 'weightHistory',
    questionText: '¿Cuál es su peso actual?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 50,
      max: 1000
    },
    fieldName: 'currentWeight' as const
  },
  {
    id: 'maintainedCurrentWeight',
    category: 'weightHistory',
    questionText: '¿Cuánto tiempo ha mantenido su peso actual?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'maintainedCurrentWeight' as const
  },
  {
    id: 'goalWeight',
    category: 'weightHistory',
    questionText: '¿Cuál es su peso objetivo?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 50,
      max: 1000
    },
    fieldName: 'goalWeight' as const
  },
  {
    id: 'goalWeightDate',
    category: 'weightHistory',
    questionText: '¿Cuándo planea alcanzar su peso objetivo?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'goalWeightDate' as const
  },
  {
    id: 'weightRegained',
    category: 'weightHistory',
    questionText: '¿Cuánto peso ha recuperado?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0,
      max: 500
    },
    fieldName: 'weightRegained' as const
  },
  {
    id: 'weightRegainedDate',
    category: 'weightHistory',
    questionText: '¿Cuándo recuperó ese peso?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'weightRegainedDate' as const
  },
  {
    id: 'weightRegainedTime',
    category: 'weightHistory',
    questionText: '¿En cuánto tiempo recuperó ese peso?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      minLength: 2,
      maxLength: 100
    },
    fieldName: 'weightRegainedTime' as const
  },
  // SURGERY DETAILS
  {
    id: 'surgeryProcessStage',
    category: 'surgeryDetails',
    questionText: '¿Qué tan avanzado está en el proceso de cirugía?',
    expectedResponseType: 'select' as const,
    options: ['Just starting', 'Consultation scheduled', 'Pre-op appointments', 'Ready to schedule', 'Surgery scheduled'],
    validationRules: {
      required: true
    },
    fieldName: 'surgeryProcessStage' as const
  },
  {
    id: 'surgeonPreference',
    category: 'surgeryDetails',
    questionText: '¿Tiene alguna preferencia de cirujano?',
    expectedResponseType: 'select' as const,
    options: ['No preference', 'Specific surgeon', 'Specific clinic', 'Other'],
    validationRules: {
      required: true
    },
    fieldName: 'surgeonPreference' as const
  },
  {
    id: 'additionalProcedures',
    category: 'surgeryDetails',
    questionText: '¿Hay procedimientos adicionales de interés?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'additionalProcedures' as const
  },
  {
    id: 'estimatedSurgeryDate',
    category: 'surgeryDetails',
    questionText: '¿Cuál es la fecha estimada de cirugía?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'estimatedSurgeryDate' as const
  },
  // GERD INFORMATION
  {
    id: 'gerdHeartburnFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tenido una sensación de ardor detrás del esternón (acidez estomacal)?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdHeartburnFrequency' as const
  },
  {
    id: 'gerdRegurgitationFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tenido contenido estomacal (líquido o alimento) moviéndose hacia la garganta o la boca (regurgitación)?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdRegurgitationFrequency' as const
  },
  {
    id: 'gerdUpperStomachPainFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tenido dolor en el centro de la parte superior del estómago?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdUpperStomachPainFrequency' as const
  },
  {
    id: 'gerdNauseaFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tenido náuseas?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdNauseaFrequency' as const
  },
  {
    id: 'gerdSleepDifficultyFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tenido dificultad para dormir bien por la noche debido a la acidez estomacal y/o regurgitación?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdSleepDifficultyFrequency' as const
  },
  {
    id: 'gerdAdditionalMedicationFrequency',
    category: 'gerdInformation',
    questionText: '¿Con qué frecuencia (por semana) ha tomado medicación adicional para la acidez estomacal y/o regurgitación, aparte de lo que le indicó el médico (como Tums, Rolaids y Maalox)?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: true,
      min: 0
    },
    fieldName: 'gerdAdditionalMedicationFrequency' as const
  },
  {
    id: 'gerdTotalScore',
    category: 'gerdInformation',
    questionText: 'Puntuación total de síntomas de GERD (calculado automáticamente)',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0
    },
    fieldName: 'gerdTotalScore' as const
  },
  {
    id: 'gerdUpperGiEndoscopy',
    category: 'gerdInformation',
    questionText: '¿Le han realizado una endoscopia gastrointestinal superior?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'gerdUpperGiEndoscopy' as const
  },
  {
    id: 'gerdUpperGiEndoscopyWhen',
    category: 'gerdInformation',
    questionText: '¿Cuándo le realizaron la endoscopia gastrointestinal superior?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'gerdUpperGiEndoscopyWhen' as const
  },
  {
    id: 'gerdUpperGiEndoscopyFindings',
    category: 'gerdInformation',
    questionText: '¿Cuáles fueron los hallazgos de la endoscopia gastrointestinal superior?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'gerdUpperGiEndoscopyFindings' as const
  },
  {
    id: 'gerdEsophagealManometry',
    category: 'gerdInformation',
    questionText: '¿Le han realizado una manometría esofágica?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'gerdEsophagealManometry' as const
  },
  {
    id: 'gerdEsophagealManometryWhen',
    category: 'gerdInformation',
    questionText: '¿Cuándo le realizaron la manometría esofágica?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'gerdEsophagealManometryWhen' as const
  },
  {
    id: 'gerdEsophagealManometryFindings',
    category: 'gerdInformation',
    questionText: '¿Cuáles fueron los hallazgos de la manometría esofágica?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'gerdEsophagealManometryFindings' as const
  },
  {
    id: 'gerd24HourPhMonitoring',
    category: 'gerdInformation',
    questionText: '¿Le han realizado una prueba de monitorización de pH de 24 horas?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'gerd24HourPhMonitoring' as const
  },
  {
    id: 'gerd24HourPhMonitoringWhen',
    category: 'gerdInformation',
    questionText: '¿Cuándo le realizaron la prueba de monitorización de pH de 24 horas?',
    expectedResponseType: 'date' as const,
    validationRules: {
      required: false
    },
    fieldName: 'gerd24HourPhMonitoringWhen' as const
  },
  {
    id: 'gerd24HourPhMonitoringFindings',
    category: 'gerdInformation',
    questionText: '¿Cuáles fueron los hallazgos de la prueba de monitorización de pH de 24 horas?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'gerd24HourPhMonitoringFindings' as const
  },
  // CURRENT MEDICAL CONDITIONS
  {
    id: 'currentHighBloodPressure',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene presión arterial alta?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentHighBloodPressure' as const
  },
  {
    id: 'currentSleepApnea',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene apnea del sueño?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentSleepApnea' as const
  },
  {
    id: 'currentUrinaryConditions',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene alguna condición urinaria?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentUrinaryConditions' as const
  },
  {
    id: 'currentUrinaryConditionsDetails',
    category: 'currentMedicalConditions',
    questionText: 'Por favor, especifique sus condiciones urinarias.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'currentUrinaryConditionsDetails' as const
  },
  {
    id: 'currentMuscularConditions',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene alguna condición muscular?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentMuscularConditions' as const
  },
  {
    id: 'currentMuscularConditionsDetails',
    category: 'currentMedicalConditions',
    questionText: 'Por favor, especifique sus condiciones musculares.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'currentMuscularConditionsDetails' as const
  },
  {
    id: 'currentNeurologicalConditions',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene alguna condición neurológica?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentNeurologicalConditions' as const
  },
  {
    id: 'currentNeurologicalConditionsDetails',
    category: 'currentMedicalConditions',
    questionText: 'Por favor, especifique sus condiciones neurológicas.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'currentNeurologicalConditionsDetails' as const
  },
  {
    id: 'currentBloodDisorders',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene algún trastorno sanguíneo?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentBloodDisorders' as const
  },
  {
    id: 'currentBloodDisordersDetails',
    category: 'currentMedicalConditions',
    questionText: 'Por favor, especifique sus trastornos sanguíneos.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'currentBloodDisordersDetails' as const
  },
  {
    id: 'currentEndocrineConditions',
    category: 'currentMedicalConditions',
    questionText: '¿Actualmente tiene alguna condición endocrina?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentEndocrineConditions' as const
  },
  {
    id: 'currentEndocrineConditionsDetails',
    category: 'currentMedicalConditions',
    questionText: 'Por favor, especifique sus condiciones endocrinas.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'currentEndocrineConditionsDetails' as const
  },
  // PSYCHIATRIC CONDITIONS
  {
    id: 'psychiatricHospital',
    category: 'psychiatricConditions',
    questionText: '¿Ha estado alguna vez en un hospital psiquiátrico?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'psychiatricHospital' as const
  },
  {
    id: 'attemptedSuicide',
    category: 'psychiatricConditions',
    questionText: '¿Ha intentado suicidarse alguna vez?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'attemptedSuicide' as const
  },
  {
    id: 'physicallyAbused',
    category: 'psychiatricConditions',
    questionText: '¿Ha sido abusado físicamente alguna vez?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'physicallyAbused' as const
  },
  {
    id: 'seenPsychiatristCounselor',
    category: 'psychiatricConditions',
    questionText: '¿Ha visto alguna vez a un psiquiatra o consejero?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'seenPsychiatristCounselor' as const
  },
  {
    id: 'takenPsychiatricMedications',
    category: 'psychiatricConditions',
    questionText: '¿Ha tomado alguna vez medicamentos para problemas psiquiátricos o para la depresión?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'takenPsychiatricMedications' as const
  },
  {
    id: 'chemicalDependencyProgram',
    category: 'psychiatricConditions',
    questionText: '¿Ha estado alguna vez en un programa de dependencia química?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'chemicalDependencyProgram' as const
  },
  // GASTROINTESTINAL CONDITIONS
  {
    id: 'gastrointestinalConditions',
    category: 'gastrointestinalConditions',
    questionText: '¿Tiene alguna condición gastrointestinal?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'gastrointestinalConditions' as const
  },
  {
    id: 'gastrointestinalConditionsDetails',
    category: 'gastrointestinalConditions',
    questionText: 'Por favor, especifique sus condiciones gastrointestinales.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'gastrointestinalConditionsDetails' as const
  },
  // HEAD AND NECK CONDITIONS
  {
    id: 'headAndNeckConditions',
    category: 'headAndNeckConditions',
    questionText: '¿Tiene alguna condición de cabeza y cuello?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'headAndNeckConditions' as const
  },
  {
    id: 'headAndNeckConditionsDetails',
    category: 'headAndNeckConditions',
    questionText: 'Por favor, especifique sus condiciones de cabeza y cuello.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'headAndNeckConditionsDetails' as const
  },
  // SKIN CONDITIONS
  {
    id: 'skinConditions',
    category: 'skinConditions',
    questionText: '¿Tiene alguna condición de la piel?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'skinConditions' as const
  },
  {
    id: 'skinConditionsDetails',
    category: 'skinConditions',
    questionText: 'Por favor, especifique sus condiciones de la piel.',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'skinConditionsDetails' as const
  },
  // CONSTITUTIONAL CONDITIONS
  {
    id: 'hairLoss',
    category: 'constitutionalConditions',
    questionText: '¿Ha experimentado pérdida de cabello?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'hairLoss' as const
  },
  // INFECTIOUS DISEASES
  {
    id: 'hepatitis',
    category: 'infectiousDiseases',
    questionText: '¿Ha tenido hepatitis alguna vez?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'hepatitis' as const
  },
  {
    id: 'hiv',
    category: 'infectiousDiseases',
    questionText: '¿Tiene VIH?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'hiv' as const
  },
  // BLOOD TRANSFUSION
  {
    id: 'refuseBlood',
    category: 'bloodTransfusion',
    questionText: '¿Se niega a recibir transfusiones de sangre?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'refuseBlood' as const
  },
  // SOCIAL HISTORY - TOBACCO USE
  {
    id: 'currentlySmoke',
    category: 'socialHistory',
    questionText: '¿Actualmente fuma tabaco?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'currentlySmoke' as const
  },
  {
    id: 'cigarettesPerDay',
    category: 'socialHistory',
    questionText: '¿Cuántos cigarrillos y/o paquetes al día fuma?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'cigarettesPerDay' as const
  },
  {
    id: 'useSnuffOrChew',
    category: 'socialHistory',
    questionText: '¿Usa tabaco de aspirar (snuff) o de mascar?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useSnuffOrChew' as const
  },
  {
    id: 'snuffChewFrequency',
    category: 'socialHistory',
    questionText: '¿Con qué frecuencia usa tabaco de aspirar o de mascar?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'snuffChewFrequency' as const
  },
  {
    id: 'useVape',
    category: 'socialHistory',
    questionText: '¿Usa vape o cigarrillo electrónico?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useVape' as const
  },
  {
    id: 'vapeFrequency',
    category: 'socialHistory',
    questionText: '¿Con qué frecuencia usa vape o cigarrillo electrónico?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'vapeFrequency' as const
  },
  {
    id: 'yearsTobaccoUse',
    category: 'socialHistory',
    questionText: '¿Por cuántos años ha usado o usó tabaco?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'yearsTobaccoUse' as const
  },
  {
    id: 'quitTobaccoHowLongAgo',
    category: 'socialHistory',
    questionText: 'Si dejó de fumar, ¿hace cuánto tiempo dejó de usar productos de tabaco?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'quitTobaccoHowLongAgo' as const
  },
  // ALCOHOL USE
  {
    id: 'consumeAlcoholNow',
    category: 'socialHistory',
    questionText: '¿Consume alcohol actualmente?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'consumeAlcoholNow' as const
  },
  {
    id: 'alcoholTimesPerWeek',
    category: 'socialHistory',
    questionText: 'Si consume alcohol, ¿cuántas veces por semana?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0,
      max: 7
    },
    fieldName: 'alcoholTimesPerWeek' as const
  },
  {
    id: 'alcoholDrinksPerTime',
    category: 'socialHistory',
    questionText: 'Si consume alcohol, ¿cuántas bebidas cada vez?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0,
      max: 20
    },
    fieldName: 'alcoholDrinksPerTime' as const
  },
  {
    id: 'alcoholYearsOfUse',
    category: 'socialHistory',
    questionText: '¿Por cuántos años ha consumido o consumió alcohol?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'alcoholYearsOfUse' as const
  },
  {
    id: 'alcoholQuitHowLongAgo',
    category: 'socialHistory',
    questionText: 'Si dejó de beber alcohol, ¿hace cuánto tiempo?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'alcoholQuitHowLongAgo' as const
  },
  {
    id: 'alcoholConcernFromOthers',
    category: 'socialHistory',
    questionText: '¿Alguien está preocupado por la cantidad que bebe?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'alcoholConcernFromOthers' as const
  },
  // DRUG USE
  {
    id: 'useStreetDrugsNow',
    category: 'socialHistory',
    questionText: '¿Usa actualmente drogas ilícitas?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useStreetDrugsNow' as const
  },
  {
    id: 'streetDrugsWhich',
    category: 'socialHistory',
    questionText: 'Si usa, ¿cuáles drogas?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 200
    },
    fieldName: 'streetDrugsWhich' as const
  },
  {
    id: 'streetDrugsFrequency',
    category: 'socialHistory',
    questionText: 'Si usa, ¿con qué frecuencia las usa?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'streetDrugsFrequency' as const
  },
  {
    id: 'streetDrugsQuitHowLongAgo',
    category: 'socialHistory',
    questionText: 'Si dejó de usarlas, ¿hace cuánto tiempo dejó de usar drogas?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'streetDrugsQuitHowLongAgo' as const
  },
  // CAFFEINE USE
  {
    id: 'drinkCaffeineNow',
    category: 'socialHistory',
    questionText: '¿Bebe café u otras bebidas con cafeína actualmente?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'drinkCaffeineNow' as const
  },
  {
    id: 'caffeineCupsPerDay',
    category: 'socialHistory',
    questionText: 'Si bebe cafeína, ¿cuántas tazas por día?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0,
      max: 20
    },
    fieldName: 'caffeineCupsPerDay' as const
  },
  {
    id: 'caffeineDrinkType',
    category: 'socialHistory',
    questionText: '¿Qué tipo de bebida con cafeína consume? (por ejemplo: café, té, energía)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'caffeineDrinkType' as const
  },
  {
    id: 'caffeineOtherDrinkType',
    category: 'socialHistory',
    questionText: 'Si es otra, ¿qué bebida es?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'caffeineOtherDrinkType' as const
  },
  {
    id: 'drinkCarbonatedBeverages',
    category: 'socialHistory',
    questionText: '¿Bebe bebidas carbonatadas?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'drinkCarbonatedBeverages' as const
  },
  {
    id: 'carbonatedBeverageTypes',
    category: 'socialHistory',
    questionText: 'Si bebe carbonatadas, ¿qué tipos? (por ejemplo: refrescos, energía)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 200
    },
    fieldName: 'carbonatedBeverageTypes' as const
  },
  {
    id: 'carbonatedOtherCupsPerDay',
    category: 'socialHistory',
    questionText: 'For those beverages, how many cups (or cans) per day?',
    expectedResponseType: 'number' as const,
    validationRules: {
      required: false,
      min: 0,
      max: 20
    },
    fieldName: 'carbonatedOtherCupsPerDay' as const
  },
  // DIETARY HABITS
  {
    id: 'howOftenEatSweets',
    category: 'dietaryHabits',
    questionText: 'How often do you eat sweets?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'howOftenEatSweets' as const
  },
  {
    id: 'howOftenEatFastFood',
    category: 'dietaryHabits',
    questionText: 'How often do you eat fast food?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'howOftenEatFastFood' as const
  },
  // OTHER SOCIALS
  {
    id: 'useMarijuanaProducts',
    category: 'otherSocials',
    questionText: 'Do you use Marijuana products?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useMarijuanaProducts' as const
  },
  {
    id: 'useAspirinProducts',
    category: 'otherSocials',
    questionText: 'Do you use Aspirin products?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useAspirinProducts' as const
  },
  {
    id: 'useSexualHormones',
    category: 'otherSocials',
    questionText: 'Do you use sexual hormones? (including birth control or hormonal replacement)',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'useSexualHormones' as const
  },
  {
    id: 'otherSubstancesSpecify',
    category: 'otherSocials',
    questionText: 'Other substances (Specify)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 200
    },
    fieldName: 'otherSubstancesSpecify' as const
  },
  {
    id: 'referralNameIfApplicable',
    category: 'otherSocials',
    questionText: 'Referral name (if applicable)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'referralNameIfApplicable' as const
  },
  // PAST SURGICAL HISTORY
  {
    id: 'pastSurgicalHistory',
    category: 'surgicalHistory',
    questionText: 'Past surgical history',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 500
    },
    fieldName: 'pastSurgicalHistory' as const
  },
  // WOMEN ONLY
  {
    id: 'dateOfMenstrualCycle',
    category: 'womenOnly',
    questionText: 'Date of menstrual cycle',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 50
    },
    fieldName: 'dateOfMenstrualCycle' as const
  },
  {
    id: 'useHormonalContraception',
    category: 'womenOnly',
    questionText: 'Do you use any hormonal contraception (ex: birth control)?',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: false
    },
    fieldName: 'useHormonalContraception' as const
  },
  {
    id: 'listPregnancies',
    category: 'womenOnly',
    questionText: 'List pregnancies, date and outcome (ex: full term, premature, C-section, miscarriage)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 500
    },
    fieldName: 'listPregnancies' as const
  },
  // MEDICATIONS
  {
    id: 'currentMedications',
    category: 'medications',
    questionText: 'Current medications',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 1000
    },
    fieldName: 'currentMedications' as const
  },
  // ALLERGIES
  {
    id: 'allergies',
    category: 'allergies',
    questionText: 'Allergies',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 500
    },
    fieldName: 'allergies' as const
  },
  // DIET PROGRAM
  {
    id: 'dietProgramName',
    category: 'dietProgram',
    questionText: 'What is the name of the diet?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 200
    },
    fieldName: 'dietProgramName' as const
  },
  {
    id: 'dietProgramStartDate',
    category: 'dietProgram',
    questionText: 'When did you start it?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'dietProgramStartDate' as const
  },
  {
    id: 'dietProgramDuration',
    category: 'dietProgram',
    questionText: 'How long did you follow it?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'dietProgramDuration' as const
  },
  {
    id: 'dietProgramWeightLost',
    category: 'dietProgram',
    questionText: 'How much weight did you lose?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'dietProgramWeightLost' as const
  },
  {
    id: 'dietProgramWeightRegain',
    category: 'dietProgram',
    questionText: 'If there was weight regain, how much was it?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 100
    },
    fieldName: 'dietProgramWeightRegain' as const
  },
  // PSYCHOLOGICAL GENERAL WELL-BEING INDEX (PGWBI)
  {
    id: 'pgwbiNervousness',
    category: 'pgwbi',
    questionText: 'Have you been bothered by nervousness or your "nerves"? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiNervousness' as const
  },
  {
    id: 'pgwbiEnergy',
    category: 'pgwbi',
    questionText: 'How much energy, pop, or vitality did you have or feel? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiEnergy' as const
  },
  {
    id: 'pgwbiDownhearted',
    category: 'pgwbi',
    questionText: 'I felt downhearted and blue (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiDownhearted' as const
  },
  {
    id: 'pgwbiTension',
    category: 'pgwbi',
    questionText: 'Were you generally tense – or did you feel any tension? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiTension' as const
  },
  {
    id: 'pgwbiPersonalLifeSatisfaction',
    category: 'pgwbi',
    questionText: 'How happy, satisfied, or pleased have you been with your personal life during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiPersonalLifeSatisfaction' as const
  },
  {
    id: 'pgwbiHealthyEnough',
    category: 'pgwbi',
    questionText: 'Did you feel healthy enough to carry out the things you like to do or had to do? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiHealthyEnough' as const
  },
  {
    id: 'pgwbiSadDiscouraged',
    category: 'pgwbi',
    questionText: 'Have you felt so sad, discouraged, hopeless, or had so many problems that you wondered if anything was worthwhile? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiSadDiscouraged' as const
  },
  {
    id: 'pgwbiFreshRested',
    category: 'pgwbi',
    questionText: 'I woke up feeling fresh and rested during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiFreshRested' as const
  },
  {
    id: 'pgwbiHealthConcerns',
    category: 'pgwbi',
    questionText: 'Have you been concerned, worried, or had any fears about your health? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiHealthConcerns' as const
  },
  {
    id: 'pgwbiLosingControl',
    category: 'pgwbi',
    questionText: 'Have you had any reason to wonder if you were losing your mind, or losing control over the way you act, talk, think, feel or of your memory? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiLosingControl' as const
  },
  {
    id: 'pgwbiInterestingLife',
    category: 'pgwbi',
    questionText: 'My daily life was full of things that were interesting to me during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiInterestingLife' as const
  },
  {
    id: 'pgwbiActiveVigorous',
    category: 'pgwbi',
    questionText: 'Did you feel active, vigorous, or dull, sluggish? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiActiveVigorous' as const
  },
  {
    id: 'pgwbiAnxiousWorried',
    category: 'pgwbi',
    questionText: 'Have you been anxious, worried, or upset? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiAnxiousWorried' as const
  },
  {
    id: 'pgwbiEmotionallyStable',
    category: 'pgwbi',
    questionText: 'I was emotionally stable and sure of myself during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiEmotionallyStable' as const
  },
  {
    id: 'pgwbiRelaxedAtEase',
    category: 'pgwbi',
    questionText: 'Did you feel relaxed, at ease, or high strung, tight, or keyed-up? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiRelaxedAtEase' as const
  },
  {
    id: 'pgwbiCheerfulLighthearted',
    category: 'pgwbi',
    questionText: 'I felt cheerful, lighthearted during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiCheerfulLighthearted' as const
  },
  {
    id: 'pgwbiTiredExhausted',
    category: 'pgwbi',
    questionText: 'I felt tired, worn out, used up or exhausted during the past month?',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiTiredExhausted' as const
  },
  {
    id: 'pgwbiStrainStressPressure',
    category: 'pgwbi',
    questionText: 'Have you been under or felt you were under any strain, stress, or pressure? (during the past month)',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: true,
      maxLength: 100
    },
    fieldName: 'pgwbiStrainStressPressure' as const
  },
  // ADDITIONAL COMMENTS
  {
    id: 'additionalComments',
    category: 'additionalComments',
    questionText: 'Additional comments',
    expectedResponseType: 'text' as const,
    validationRules: {
      required: false,
      maxLength: 1000
    },
    fieldName: 'additionalComments' as const
  },
  // TERMS & CONDITIONS
  {
    id: 'termsAndConditionsAccepted',
    category: 'termsAndConditions',
    questionText: 'I have read and accepted the terms and conditions',
    expectedResponseType: 'yesno' as const,
    validationRules: {
      required: true
    },
    fieldName: 'termsAndConditionsAccepted' as const
  }
];

// Preguntas conversacionales para Claude
export const conversationalPatientInfo = {
  category: 'personal',
  introduction: 'Hola, soy tu asistente médico. Vamos a comenzar recopilando tu información personal básica. Esto nos ayudará a crear tu perfil médico.',

  questions: [
    {
      id: 'firstName',
      conversational: 'Para empezar, ¿me podrías decir tu nombre de pila?',
      followUp: 'Perfecto, {firstName}. Ahora necesito tu apellido completo.',
      fieldName: 'firstName'
    },
    {
      id: 'lastName',
      conversational: '¿Cuál es tu apellido?',
      followUp: 'Excelente. Ahora, ¿cuándo naciste? Puedes decirlo como prefieras, por ejemplo: "el 10 de enero de 1979" o "10/01/1979".',
      fieldName: 'lastName'
    },
    {
      id: 'dateOfBirth',
      conversational: '¿Cuál es tu fecha de nacimiento?',
      followUp: 'Perfecto, tienes {age} años. ¿Podrías confirmarme tu género?',
      fieldName: 'dateOfBirth'
    },
    {
      id: 'age',
      conversational: '¿Cuántos años tienes?',
      followUp: 'Gracias. ¿Cuál es tu género?',
      fieldName: 'age',
      autoCalculate: true // Se calcula automáticamente desde dateOfBirth
    },
    {
      id: 'gender',
      conversational: '¿Cuál es tu género?',
      followUp: 'Excelente. Ahora necesito tu información de contacto. ¿Cuál es tu dirección completa?',
      fieldName: 'gender'
    },
    {
      id: 'addressLine',
      conversational: '¿Cuál es tu dirección completa? Por ejemplo: 3501 Soleil Boulevard',
      followUp: 'Perfecto. ¿En qué ciudad vives?',
      fieldName: 'addressLine'
    },
    {
      id: 'city',
      conversational: '¿En qué ciudad vives?',
      followUp: 'Excelente. ¿En qué país resides?',
      fieldName: 'city'
    },
    {
      id: 'country',
      conversational: '¿En qué país resides?',
      followUp: 'Gracias. ¿Cuál es tu estado o provincia?',
      fieldName: 'country'
    },
    {
      id: 'state',
      conversational: '¿Cuál es tu estado o provincia?',
      followUp: 'Perfecto. Por último, ¿cuál es tu código postal?',
      fieldName: 'state'
    },
    {
      id: 'zipcode',
      conversational: '¿Cuál es tu código postal?',
      followUp: 'Perfecto. Ahora me gustaría saber cómo llegaste a nosotros y algunos datos de contacto. ¿Cómo te enteraste de nuestros servicios?',
      fieldName: 'zipcode'
    },
    {
      id: 'hearAboutUs',
      conversational: '¿Cómo te enteraste de nuestros servicios? Puedes decirme si fue por Instagram, Facebook, Google, un referido, o alguna otra forma.',
      followUp: 'Gracias. Ahora, para poder contactarte, ¿me podrías dar tu número de teléfono y tu correo electrónico?',
      fieldName: 'hearAboutUs'
    },
    {
      id: 'phoneNumber',
      conversational: '¿Cuál es tu número de teléfono y tu correo electrónico?',
      followUp: 'Excelente. ¿Cuál prefieres que usemos para contactarte: mensaje de texto, llamada telefónica o correo electrónico?',
      fieldName: 'phoneNumber'
    },
    {
      id: 'email',
      conversational: '¿Cuál es tu correo electrónico?',
      followUp: 'Perfecto. ¿Cuál prefieres que usemos para contactarte: mensaje de texto, llamada telefónica o correo electrónico?',
      fieldName: 'email'
    },
    {
      id: 'preferredContact',
      conversational: '¿Cuál prefieres que usemos para contactarte: mensaje de texto, llamada telefónica o correo electrónico?',
      followUp: 'Perfecto. Ahora, para completar tu perfil, ¿me podrías decir cuál es tu ocupación actual y tu nivel educativo?',
      fieldName: 'preferredContact'
    },
    {
      id: 'occupation',
      conversational: '¿Cuál es tu ocupación actual y tu nivel educativo?',
      followUp: 'Gracias. ¿Para qué empresa trabajas?',
      fieldName: 'occupation'
    },
    {
      id: 'employer',
      conversational: '¿Para qué empresa trabajas?',
      followUp: 'Excelente. Ya tenemos toda tu información básica. Ahora vamos a hablar sobre tu historial médico.',
      fieldName: 'employer'
    },
    {
      id: 'education',
      conversational: '¿Cuál es tu nivel educativo más alto?',
      followUp: 'Excelente. Ahora necesito algunas métricas de salud importantes. Para calcular tu IMC, ¿me podrías decir tu altura en pies y pulgadas? Por ejemplo: 6 pies 8 pulgadas.',
      fieldName: 'education'
    },
    {
      id: 'heightFeet',
      conversational: '¿Cuál es tu altura en pies y pulgadas? Por ejemplo: 6 pies 8 pulgadas.',
      followUp: 'Perfecto. Y ¿cuál es tu peso actual en libras?',
      fieldName: 'heightFeet'
    },
    {
      id: 'heightInches',
      conversational: '¿Cuántas pulgadas adicionales?',
      followUp: 'Gracias. Y ¿cuál es tu peso actual en libras?',
      fieldName: 'heightInches'
    },
    {
      id: 'weightLbs',
      conversational: '¿Cuál es tu peso actual en libras?',
      followUp: 'Perfecto. Si también tienes tu altura en centímetros y peso en kilogramos, me los puedes dar, pero no es obligatorio.',
      fieldName: 'weightLbs'
    },
    {
      id: 'heightCm',
      conversational: '¿Tienes tu altura en centímetros?',
      followUp: 'Y ¿tu peso en kilogramos?',
      fieldName: 'heightCm'
    },
    {
      id: 'weightKg',
      conversational: '¿Y tu peso en kilogramos?',
      followUp: 'Excelente. Con esta información calcularemos tu IMC automáticamente. Ahora, necesito un contacto de emergencia. ¿Me podrías dar el nombre completo de tu contacto de emergencia?',
      fieldName: 'weightKg'
    },
    {
      id: 'bmi',
      conversational: 'Tu IMC será calculado automáticamente con la información que me diste.',
      followUp: 'Ahora, necesito un contacto de emergencia. ¿Me podrías dar el nombre completo de tu contacto de emergencia?',
      fieldName: 'bmi'
    },
    {
      id: 'emergencyFirstName',
      conversational: '¿Me podrías dar el nombre completo de tu contacto de emergencia?',
      followUp: '¿Cuál es su apellido?',
      fieldName: 'emergencyFirstName'
    },
    {
      id: 'emergencyLastName',
      conversational: '¿Cuál es su apellido?',
      followUp: '¿Cuál es su relación contigo? Por ejemplo: esposo, madre, hermano, etc.',
      fieldName: 'emergencyLastName'
    },
    {
      id: 'emergencyRelationship',
      conversational: '¿Cuál es su relación contigo? Por ejemplo: esposo, madre, hermano, etc.',
      followUp: 'Finalmente, ¿cuál es su número de teléfono?',
      fieldName: 'emergencyRelationship'
    },
    {
      id: 'emergencyPhone',
      conversational: '¿Cuál es su número de teléfono?',
      followUp: 'Perfecto. Ahora me gustaría saber sobre tu historial de reducción de peso. ¿Has tenido alguna cirugía de pérdida de peso anteriormente?',
      fieldName: 'emergencyPhone'
    },
    {
      id: 'previousWeightLossSurgery',
      conversational: '¿Has tenido alguna cirugía de pérdida de peso anteriormente?',
      followUp: 'Gracias. ¿Has sido consultado sobre cirugía de pérdida de peso?',
      fieldName: 'previousWeightLossSurgery'
    },
    {
      id: 'surgeonName',
      conversational: '¿Cuál es el nombre del cirujano de tu cirugía de pérdida de peso más reciente?',
      followUp: 'Gracias. ¿Has sido consultado sobre cirugía de pérdida de peso?',
      fieldName: 'surgeonName'
    },
    {
      id: 'consultedWeightLossSurgery',
      conversational: '¿Has sido consultado sobre cirugía de pérdida de peso?',
      followUp: 'Gracias. ¿Cuál fue el tipo de cirugía o consulta?',
      fieldName: 'consultedWeightLossSurgery'
    },
    {
      id: 'surgeryType',
      conversational: '¿Cuál fue el tipo de cirugía o consulta?',
      followUp: 'Perfecto. Ahora me gustaría saber sobre tu historial familiar. ¿Hay antecedentes de enfermedades cardíacas, diabetes, alcoholismo, problemas pulmonares, cálculos biliares, hipertermia maligna, edema pulmonar, presión arterial alta, problemas hepáticos, trastornos hemorrágicos, enfermedades mentales o cáncer en tu familia?',
      fieldName: 'surgeryType'
    },
    {
      id: 'familyHeartDisease',
      conversational: '¿Hay antecedentes de enfermedades cardíacas, diabetes, alcoholismo, problemas pulmonares, cálculos biliares, hipertermia maligna, edema pulmonar, presión arterial alta, problemas hepáticos, trastornos hemorrágicos, enfermedades mentales o cáncer en tu familia?',
      followUp: 'Gracias. Ahora hablemos de tu historial médico personal. ¿Has sido diagnosticado con apnea del sueño o diabetes?',
      fieldName: 'familyHeartDisease'
    },
    {
      id: 'familyDiabetes',
      conversational: '¿Hay antecedentes de diabetes en tu familia?',
      followUp: '¿Y de alcoholismo?',
      fieldName: 'familyDiabetes'
    },
    {
      id: 'familyAlcoholism',
      conversational: '¿Hay antecedentes de alcoholismo en tu familia?',
      followUp: '¿Y de problemas pulmonares?',
      fieldName: 'familyAlcoholism'
    },
    {
      id: 'familyLungProblems',
      conversational: '¿Hay antecedentes de problemas pulmonares en tu familia?',
      followUp: '¿Y de cálculos biliares?',
      fieldName: 'familyLungProblems'
    },
    {
      id: 'familyGallstones',
      conversational: '¿Hay antecedentes de cálculos biliares en tu familia?',
      followUp: '¿Y de hipertermia maligna?',
      fieldName: 'familyGallstones'
    },
    {
      id: 'familyMalignantHyperthermia',
      conversational: '¿Hay antecedentes de hipertermia maligna en tu familia?',
      followUp: '¿Y de edema pulmonar?',
      fieldName: 'familyMalignantHyperthermia'
    },
    {
      id: 'familyPulmonaryEdema',
      conversational: '¿Hay antecedentes de edema pulmonar en tu familia?',
      followUp: '¿Y de presión arterial alta?',
      fieldName: 'familyPulmonaryEdema'
    },
    {
      id: 'familyHighBloodPressure',
      conversational: '¿Hay antecedentes de presión arterial alta en tu familia?',
      followUp: '¿Y de problemas hepáticos?',
      fieldName: 'familyHighBloodPressure'
    },
    {
      id: 'familyLiverProblems',
      conversational: '¿Hay antecedentes de problemas hepáticos en tu familia?',
      followUp: '¿Y de trastornos hemorrágicos?',
      fieldName: 'familyLiverProblems'
    },
    {
      id: 'familyBleedingDisorder',
      conversational: '¿Hay antecedentes de trastornos hemorrágicos en tu familia?',
      followUp: '¿Y de enfermedades mentales?',
      fieldName: 'familyBleedingDisorder'
    },
    {
      id: 'familyMentalIllness',
      conversational: '¿Hay antecedentes de enfermedades mentales en tu familia?',
      followUp: '¿Y de cáncer?',
      fieldName: 'familyMentalIllness'
    },
    {
      id: 'familyCancer',
      conversational: '¿Hay antecedentes de cáncer en tu familia?',
      followUp: 'Gracias. Ahora hablemos de tu historial médico personal. ¿Has sido diagnosticado con apnea del sueño o diabetes?',
      fieldName: 'familyCancer'
    },
    {
      id: 'sleepApnea',
      conversational: '¿Has sido diagnosticado con apnea del sueño?',
      followUp: '¿Y tienes diabetes?',
      fieldName: 'sleepApnea'
    },
    {
      id: 'diabetes',
      conversational: '¿Tienes diabetes?',
      followUp: 'Si tienes diabetes, ¿usas insulina? Y si tienes apnea del sueño, ¿usas CPAP?',
      fieldName: 'diabetes'
    },
    {
      id: 'useInsulin',
      conversational: 'Si tienes diabetes, ¿usas insulina?',
      followUp: 'Y si tienes apnea del sueño, ¿usas CPAP?',
      fieldName: 'useInsulin'
    },
    {
      id: 'useCpap',
      conversational: 'Si tienes apnea del sueño, ¿usas CPAP?',
      followUp: 'Si usas CPAP, ¿usas BiPAP?',
      fieldName: 'useCpap'
    },
    {
      id: 'useBipap',
      conversational: 'Si usas CPAP, ¿usas BiPAP?',
      followUp: 'Perfecto. Ahora, ¿hay alguna otra condición médica o hospitalización (no quirúrgica) importante que debamos conocer?',
      fieldName: 'useBipap'
    },
    {
      id: 'otherMedicalConditions',
      conversational: '¿Hay alguna otra condición médica o hospitalización (no quirúrgica) importante que debamos conocer?',
      followUp: 'Gracias. Ahora me gustaría saber sobre el tipo de cirugía que te interesa. ¿Es una cirugía bariátrica por primera vez, una cirugía bariátrica de revisión, una cirugía plástica primaria o una cirugía plástica post-bariátrica?',
      fieldName: 'otherMedicalConditions'
    },
    {
      id: 'surgeryInterest',
      conversational: '¿Cuál es el tipo de cirugía que te interesa? Puede ser una cirugía bariátrica por primera vez, una cirugía bariátrica de revisión, una cirugía plástica primaria o una cirugía plástica post-bariátrica.',
      followUp: 'Perfecto. ¿Cuál es el nombre específico de la cirugía que te interesa?',
      fieldName: 'surgeryInterest'
    },
    {
      id: 'firstTimeBariatricSurgeryName',
      conversational: '¿Cuál es el nombre específico de la cirugía bariátrica que te interesa? Por ejemplo: Gastric Sleeve (VSG), Gastric Bypass, etc.',
      followUp: 'Excelente. Ya tenemos tu interés quirúrgico. Hemos completado una gran parte del cuestionario.',
      fieldName: 'firstTimeBariatricSurgeryName'
    },
    {
      id: 'revisionalBariatricSurgeryName',
      conversational: '¿Cuál es el nombre específico de la cirugía bariátrica de revisión que te interesa?',
      followUp: 'Excelente. Ya tenemos tu interés quirúrgico. Hemos completado una gran parte del cuestionario.',
      fieldName: 'revisionalBariatricSurgeryName'
    },
    {
      id: 'primaryPlasticSurgeryName',
      conversational: '¿Cuál es el nombre específico de la cirugía plástica primaria que te interesa?',
      followUp: 'Excelente. Ya tenemos tu interés quirúrgico. Hemos completado una gran parte del cuestionario.',
      fieldName: 'primaryPlasticSurgeryName'
    },
    {
      id: 'postBariatricPlasticSurgeryName',
      conversational: '¿Cuál es el nombre específico de la cirugía plástica post-bariátrica que te interesa?',
      followUp: 'Excelente. Ahora me gustaría saber sobre tu historial de peso. ¿Cuál ha sido tu peso más alto y cuándo fue?',
      fieldName: 'postBariatricPlasticSurgeryName'
    },
    {
      id: 'highestWeight',
      conversational: '¿Cuál ha sido tu peso más alto y cuándo fue?',
      followUp: 'Gracias. ¿Cuál ha sido tu peso más bajo y cuándo fue?',
      fieldName: 'highestWeight'
    },
    {
      id: 'highestWeightDate',
      conversational: '¿Cuándo fue tu peso más alto?',
      followUp: '¿Cuál ha sido tu peso más bajo y cuándo fue?',
      fieldName: 'highestWeightDate'
    },
    {
      id: 'lowestWeight',
      conversational: '¿Cuál ha sido tu peso más bajo y cuándo fue?',
      followUp: 'Perfecto. ¿Cuál es tu peso actual y cuánto tiempo lo has mantenido?',
      fieldName: 'lowestWeight'
    },
    {
      id: 'lowestWeightDate',
      conversational: '¿Cuándo fue tu peso más bajo?',
      followUp: '¿Cuál es tu peso actual y cuánto tiempo lo has mantenido?',
      fieldName: 'lowestWeightDate'
    },
    {
      id: 'surgeryWeight',
      conversational: '¿Cuál fue tu peso al momento de la cirugía?',
      followUp: 'Gracias. ¿Cuál es tu peso actual y cuánto tiempo lo has mantenido?',
      fieldName: 'surgeryWeight'
    },
    {
      id: 'currentWeight',
      conversational: '¿Cuál es tu peso actual y cuánto tiempo lo has mantenido?',
      followUp: 'Excelente. ¿Cuál es tu peso objetivo y cuándo planeas alcanzarlo?',
      fieldName: 'currentWeight'
    },
    {
      id: 'maintainedCurrentWeight',
      conversational: '¿Cuánto tiempo has mantenido tu peso actual?',
      followUp: '¿Cuál es tu peso objetivo y cuándo planeas alcanzarlo?',
      fieldName: 'maintainedCurrentWeight'
    },
    {
      id: 'goalWeight',
      conversational: '¿Cuál es tu peso objetivo y cuándo planeas alcanzarlo?',
      followUp: 'Perfecto. ¿Has recuperado algo de peso? Si es así, ¿cuánto y cuándo?',
      fieldName: 'goalWeight'
    },
    {
      id: 'goalWeightDate',
      conversational: '¿Cuándo planeas alcanzar tu peso objetivo?',
      followUp: '¿Has recuperado algo de peso? Si es así, ¿cuánto y cuándo?',
      fieldName: 'goalWeightDate'
    },
    {
      id: 'weightRegained',
      conversational: '¿Has recuperado algo de peso? Si es así, ¿cuánto y cuándo?',
      followUp: '¿En cuánto tiempo recuperaste ese peso?',
      fieldName: 'weightRegained'
    },
    {
      id: 'weightRegainedDate',
      conversational: '¿Cuándo recuperaste ese peso?',
      followUp: '¿En cuánto tiempo recuperaste ese peso?',
      fieldName: 'weightRegainedDate'
    },
    {
      id: 'weightRegainedTime',
      conversational: '¿En cuánto tiempo recuperaste ese peso?',
      followUp: 'Excelente. Ahora me gustaría saber sobre los detalles de tu cirugía. ¿Qué tan avanzado estás en el proceso?',
      fieldName: 'weightRegainedTime'
    },
    {
      id: 'surgeryProcessStage',
      conversational: '¿Qué tan avanzado estás en el proceso de cirugía? Puedes decirme si apenas estás comenzando, tienes consulta programada, tienes citas preoperatorias, estás listo para programar, o ya tienes la cirugía programada.',
      followUp: 'Perfecto. ¿Tienes alguna preferencia de cirujano?',
      fieldName: 'surgeryProcessStage'
    },
    {
      id: 'surgeonPreference',
      conversational: '¿Tienes alguna preferencia de cirujano? Puedes decirme si no tienes preferencia, tienes un cirujano específico en mente, prefieres una clínica específica, o tienes otra preferencia.',
      followUp: 'Gracias. ¿Hay algún procedimiento adicional de interés?',
      fieldName: 'surgeonPreference'
    },
    {
      id: 'additionalProcedures',
      conversational: '¿Hay algún procedimiento adicional de interés?',
      followUp: 'Perfecto. ¿Tienes una fecha estimada para la cirugía?',
      fieldName: 'additionalProcedures'
    },
    {
      id: 'estimatedSurgeryDate',
      conversational: '¿Tienes una fecha estimada para la cirugía?',
      followUp: 'Excelente. Ahora vamos a hablar sobre la enfermedad por reflujo gastroesofágico (GERD). ¿Con qué frecuencia (por semana) has tenido una sensación de ardor detrás del esternón (acidez estomacal), contenido estomacal moviéndose hacia la garganta (regurgitación), dolor en la parte superior del estómago, náuseas o dificultad para dormir debido a la acidez o regurgitación?',
      fieldName: 'estimatedSurgeryDate'
    },
    {
      id: 'gerdHeartburnFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tenido una sensación de ardor detrás del esternón (acidez estomacal), contenido estomacal moviéndose hacia la garganta (regurgitación), dolor en la parte superior del estómago, náuseas o dificultad para dormir debido a la acidez o regurgitación?',
      followUp: 'Gracias. Y, ¿con qué frecuencia (por semana) has tomado medicación adicional para la acidez o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      fieldName: 'gerdHeartburnFrequency'
    },
    {
      id: 'gerdRegurgitationFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tenido contenido estomacal (líquido o alimento) moviéndose hacia la garganta o la boca (regurgitación)?',
      followUp: 'Gracias. Y, ¿con qué frecuencia (por semana) has tomado medicación adicional para la acidez o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      fieldName: 'gerdRegurgitationFrequency'
    },
    {
      id: 'gerdUpperStomachPainFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tenido dolor en el centro de la parte superior del estómago?',
      followUp: 'Gracias. Y, ¿con qué frecuencia (por semana) has tomado medicación adicional para la acidez o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      fieldName: 'gerdUpperStomachPainFrequency'
    },
    {
      id: 'gerdNauseaFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tenido náuseas?',
      followUp: 'Gracias. Y, ¿con qué frecuencia (por semana) has tomado medicación adicional para la acidez o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      fieldName: 'gerdNauseaFrequency'
    },
    {
      id: 'gerdSleepDifficultyFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tenido dificultad para dormir bien por la noche debido a la acidez estomacal y/o regurgitación?',
      followUp: 'Gracias. Y, ¿con qué frecuencia (por semana) has tomado medicación adicional para la acidez o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      fieldName: 'gerdSleepDifficultyFrequency'
    },
    {
      id: 'gerdAdditionalMedicationFrequency',
      conversational: '¿Con qué frecuencia (por semana) has tomado medicación adicional para la acidez estomacal y/o regurgitación, aparte de lo que te indicó el médico (como Tums, Rolaids y Maalox)?',
      followUp: 'Perfecto. Ahora, ¿te han realizado alguna vez una endoscopia gastrointestinal superior, una manometría esofágica o una prueba de monitorización de pH de 24 horas?',
      fieldName: 'gerdAdditionalMedicationFrequency'
    },
    {
      id: 'gerdUpperGiEndoscopy',
      conversational: '¿Te han realizado alguna vez una endoscopia gastrointestinal superior, una manometría esofágica o una prueba de monitorización de pH de 24 horas?',
      followUp: 'Si te han realizado alguna de estas pruebas, ¿cuándo fue y cuáles fueron los hallazgos?',
      fieldName: 'gerdUpperGiEndoscopy'
    },
    {
      id: 'gerdEsophagealManometry',
      conversational: '¿Te han realizado alguna vez una manometría esofágica?',
      followUp: 'Si te han realizado alguna de estas pruebas, ¿cuándo fue y cuáles fueron los hallazgos?',
      fieldName: 'gerdEsophagealManometry'
    },
    {
      id: 'gerd24HourPhMonitoring',
      conversational: '¿Te han realizado alguna vez una prueba de monitorización de pH de 24 horas?',
      followUp: 'Si te han realizado alguna de estas pruebas, ¿cuándo fue y cuáles fueron los hallazgos?',
      fieldName: 'gerd24HourPhMonitoring'
    },
    {
      id: 'gerdUpperGiEndoscopyWhen',
      conversational: 'Si te han realizado alguna de estas pruebas, ¿cuándo fue y cuáles fueron los hallazgos?',
      followUp: 'Excelente. Hemos cubierto la información sobre GERD. Ahora podemos continuar con otras secciones del cuestionario.',
      fieldName: 'gerdUpperGiEndoscopyWhen'
    },
    {
      id: 'gerdUpperGiEndoscopyFindings',
      conversational: '¿Cuáles fueron los hallazgos de la endoscopia gastrointestinal superior?',
      followUp: 'Excelente. Hemos cubierto la información sobre GERD. Ahora podemos continuar con otras secciones del cuestionario.',
      fieldName: 'gerdUpperGiEndoscopyFindings'
    },
    {
      id: 'gerdEsophagealManometryWhen',
      conversational: '¿Cuándo te realizaron la manometría esofágica y cuáles fueron los hallazgos?',
      followUp: 'Excelente. Hemos cubierto la información sobre GERD. Ahora podemos continuar con otras secciones del cuestionario.',
      fieldName: 'gerdEsophagealManometryWhen'
    },
    {
      id: 'gerdEsophagealManometryFindings',
      conversational: '¿Cuáles fueron los hallazgos de la manometría esofágica?',
      followUp: 'Excelente. Hemos cubierto la información sobre GERD. Ahora podemos continuar con otras secciones del cuestionario.',
      fieldName: 'gerdEsophagealManometryFindings'
    },
    {
      id: 'gerd24HourPhMonitoringWhen',
      conversational: '¿Cuándo te realizaron la prueba de monitorización de pH de 24 horas y cuáles fueron los hallazgos?',
      followUp: 'Excelente. Hemos cubierto la información sobre GERD. Ahora podemos continuar con otras secciones del cuestionario.',
      fieldName: 'gerd24HourPhMonitoringWhen'
    },
    {
      id: 'gerd24HourPhMonitoringFindings',
      conversational: '¿Cuáles fueron los hallazgos de la prueba de monitorización de pH de 24 horas?',
      followUp: 'Excelente. Ahora vamos a hablar sobre algunas condiciones médicas actuales. ¿Actualmente tiene presión arterial alta o apnea del sueño?',
      fieldName: 'gerd24HourPhMonitoringFindings'
    },
    {
      id: 'currentHighBloodPressure',
      conversational: '¿Actualmente tiene presión arterial alta o apnea del sueño?',
      followUp: 'Gracias. Ahora, ¿tiene alguna condición urinaria, muscular, neurológica, trastorno sanguíneo o condición endocrina?',
      fieldName: 'currentHighBloodPressure'
    },
    {
      id: 'currentSleepApnea',
      conversational: '¿Actualmente tiene apnea del sueño?',
      followUp: 'Gracias. Ahora, ¿tiene alguna condición urinaria, muscular, neurológica, trastorno sanguíneo o condición endocrina?',
      fieldName: 'currentSleepApnea'
    },
    {
      id: 'currentUrinaryConditions',
      conversational: '¿Tiene alguna condición urinaria, muscular, neurológica, trastorno sanguíneo o condición endocrina?',
      followUp: 'Si tiene alguna de estas condiciones, ¿podría especificarlas?',
      fieldName: 'currentUrinaryConditions'
    },
    {
      id: 'currentUrinaryConditionsDetails',
      conversational: '¿Podría especificar sus condiciones urinarias?',
      followUp: 'Gracias. ¿Tiene alguna condición muscular?',
      fieldName: 'currentUrinaryConditionsDetails'
    },
    {
      id: 'currentMuscularConditions',
      conversational: '¿Tiene alguna condición muscular?',
      followUp: 'Si tiene alguna condición muscular, ¿podría especificarla?',
      fieldName: 'currentMuscularConditions'
    },
    {
      id: 'currentMuscularConditionsDetails',
      conversational: '¿Podría especificar sus condiciones musculares?',
      followUp: 'Gracias. ¿Tiene alguna condición neurológica?',
      fieldName: 'currentMuscularConditionsDetails'
    },
    {
      id: 'currentNeurologicalConditions',
      conversational: '¿Tiene alguna condición neurológica?',
      followUp: 'Si tiene alguna condición neurológica, ¿podría especificarla?',
      fieldName: 'currentNeurologicalConditions'
    },
    {
      id: 'currentNeurologicalConditionsDetails',
      conversational: '¿Podría especificar sus condiciones neurológicas?',
      followUp: 'Gracias. ¿Tiene algún trastorno sanguíneo?',
      fieldName: 'currentNeurologicalConditionsDetails'
    },
    {
      id: 'currentBloodDisorders',
      conversational: '¿Tiene algún trastorno sanguíneo?',
      followUp: 'Si tiene algún trastorno sanguíneo, ¿podría especificarlo?',
      fieldName: 'currentBloodDisorders'
    },
    {
      id: 'currentBloodDisordersDetails',
      conversational: '¿Podría especificar sus trastornos sanguíneos?',
      followUp: 'Gracias. ¿Tiene alguna condición endocrina?',
      fieldName: 'currentBloodDisordersDetails'
    },
    {
      id: 'currentEndocrineConditions',
      conversational: '¿Tiene alguna condición endocrina?',
      followUp: 'Si tiene alguna condición endocrina, ¿podría especificarla?',
      fieldName: 'currentEndocrineConditions'
    },
    {
      id: 'currentEndocrineConditionsDetails',
      conversational: '¿Podría especificar sus condiciones endocrinas?',
      followUp: 'Excelente. Ahora vamos a hablar sobre su historial psiquiátrico. ¿Ha estado alguna vez en un hospital psiquiátrico, ha intentado suicidarse, ha sido abusado físicamente, ha visto a un psiquiatra o consejero, ha tomado medicamentos para problemas psiquiátricos o para la depresión, o ha estado en un programa de dependencia química?',
      fieldName: 'currentEndocrineConditionsDetails'
    },
    {
      id: 'psychiatricHospital',
      conversational: '¿Ha estado alguna vez en un hospital psiquiátrico, ha intentado suicidarse, ha sido abusado físicamente, ha visto a un psiquiatra o consejero, ha tomado medicamentos para problemas psiquiátricos o para la depresión, o ha estado en un programa de dependencia química?',
      followUp: 'Gracias por compartir esa información. ¿Hay algo más que deba saber sobre su historial psiquiátrico?',
      fieldName: 'psychiatricHospital'
    },
    {
      id: 'attemptedSuicide',
      conversational: '¿Ha intentado suicidarse alguna vez?',
      followUp: 'Gracias. ¿Ha sido abusado físicamente alguna vez?',
      fieldName: 'attemptedSuicide'
    },
    {
      id: 'physicallyAbused',
      conversational: '¿Ha sido abusado físicamente alguna vez?',
      followUp: 'Gracias. ¿Ha visto alguna vez a un psiquiatra o consejero?',
      fieldName: 'physicallyAbused'
    },
    {
      id: 'seenPsychiatristCounselor',
      conversational: '¿Ha visto alguna vez a un psiquiatra o consejero?',
      followUp: 'Gracias. ¿Ha tomado alguna vez medicamentos para problemas psiquiátricos o para la depresión?',
      fieldName: 'seenPsychiatristCounselor'
    },
    {
      id: 'takenPsychiatricMedications',
      conversational: '¿Ha tomado alguna vez medicamentos para problemas psiquiátricos o para la depresión?',
      followUp: 'Gracias. ¿Ha estado alguna vez en un programa de dependencia química?',
      fieldName: 'takenPsychiatricMedications'
    },
    {
      id: 'chemicalDependencyProgram',
      conversational: '¿Ha estado alguna vez en un programa de dependencia química?',
      followUp: 'Excelente. Ahora vamos a hablar sobre algunas otras condiciones médicas. ¿Tiene alguna condición gastrointestinal, de cabeza y cuello, de la piel, o ha experimentado pérdida de cabello?',
      fieldName: 'chemicalDependencyProgram'
    },
    {
      id: 'gastrointestinalConditions',
      conversational: '¿Tiene alguna condición gastrointestinal, de cabeza y cuello, de la piel, o ha experimentado pérdida de cabello?',
      followUp: 'Si tiene alguna de estas condiciones, ¿podría especificarlas?',
      fieldName: 'gastrointestinalConditions'
    },
    {
      id: 'gastrointestinalConditionsDetails',
      conversational: '¿Podría especificar sus condiciones gastrointestinales?',
      followUp: 'Gracias. ¿Tiene alguna condición de cabeza y cuello?',
      fieldName: 'gastrointestinalConditionsDetails'
    },
    {
      id: 'headAndNeckConditions',
      conversational: '¿Tiene alguna condición de cabeza y cuello?',
      followUp: 'Si tiene alguna condición de cabeza y cuello, ¿podría especificarla?',
      fieldName: 'headAndNeckConditions'
    },
    {
      id: 'headAndNeckConditionsDetails',
      conversational: '¿Podría especificar sus condiciones de cabeza y cuello?',
      followUp: 'Gracias. ¿Tiene alguna condición de la piel?',
      fieldName: 'headAndNeckConditionsDetails'
    },
    {
      id: 'skinConditions',
      conversational: '¿Tiene alguna condición de la piel?',
      followUp: 'Si tiene alguna condición de la piel, ¿podría especificarla?',
      fieldName: 'skinConditions'
    },
    {
      id: 'skinConditionsDetails',
      conversational: '¿Podría especificar sus condiciones de la piel?',
      followUp: 'Gracias. ¿Ha experimentado pérdida de cabello?',
      fieldName: 'skinConditionsDetails'
    },
    {
      id: 'hairLoss',
      conversational: '¿Ha experimentado pérdida de cabello?',
      followUp: 'Gracias. Ahora, ¿ha tenido hepatitis alguna vez, tiene VIH, o se niega a recibir transfusiones de sangre?',
      fieldName: 'hairLoss'
    },
    {
      id: 'hepatitis',
      conversational: '¿Ha tenido hepatitis alguna vez, tiene VIH, o se niega a recibir transfusiones de sangre?',
      followUp: 'Gracias por esa información. ¿Hay algo más que deba saber sobre su historial médico?',
      fieldName: 'hepatitis'
    },
    {
      id: 'hiv',
      conversational: '¿Tiene VIH?',
      followUp: 'Gracias. ¿Se niega a recibir transfusiones de sangre?',
      fieldName: 'hiv'
    },
    {
      id: 'refuseBlood',
      conversational: '¿Se niega a recibir transfusiones de sangre?',
      followUp: 'Excelente. Hemos completado una gran parte del cuestionario médico. Hemos cubierto todas las condiciones médicas importantes.',
      fieldName: 'refuseBlood'
    },
    {
      id: 'currentlySmoke',
      conversational: 'Ahora, sobre tu historial social. ¿Actualmente fumas tabaco? Si es así, ¿cuántos cigarrillos o paquetes al día?',
      followUp: '¿Usas tabaco de aspirar (snuff) o de mascar? Si lo usas, ¿con qué frecuencia?',
      fieldName: 'currentlySmoke'
    },
    {
      id: 'cigarettesPerDay',
      conversational: '¿Cuántos cigarrillos y/o paquetes al día fumas?',
      followUp: '¿Usas tabaco de aspirar (snuff) o de mascar? Si lo usas, ¿con qué frecuencia?',
      fieldName: 'cigarettesPerDay'
    },
    {
      id: 'useSnuffOrChew',
      conversational: '¿Usas tabaco de aspirar (snuff) o de mascar?',
      followUp: 'Gracias. ¿Con qué frecuencia lo usas?',
      fieldName: 'useSnuffOrChew'
    },
    {
      id: 'snuffChewFrequency',
      conversational: '¿Con qué frecuencia usas tabaco de aspirar o de mascar?',
      followUp: '¿Usas vape o cigarrillo electrónico? Si es así, ¿con qué frecuencia?',
      fieldName: 'snuffChewFrequency'
    },
    {
      id: 'useVape',
      conversational: '¿Usas vape o cigarrillo electrónico?',
      followUp: '¿Con qué frecuencia usas vape o cigarrillo electrónico?',
      fieldName: 'useVape'
    },
    {
      id: 'vapeFrequency',
      conversational: '¿Con qué frecuencia usas vape o cigarrillo electrónico?',
      followUp: '¿Por cuántos años has usado o usaste tabaco?',
      fieldName: 'vapeFrequency'
    },
    {
      id: 'yearsTobaccoUse',
      conversational: '¿Por cuántos años has usado o usaste tabaco?',
      followUp: 'Si dejaste de fumar, ¿hace cuánto tiempo dejaste de usar productos de tabaco?',
      fieldName: 'yearsTobaccoUse'
    },
    {
      id: 'quitTobaccoHowLongAgo',
      conversational: 'Si dejaste de fumar, ¿hace cuánto tiempo dejaste de usar productos de tabaco?',
      followUp: 'Gracias. Ahora, sobre el consumo de alcohol. ¿Consumes alcohol actualmente? Si es así, ¿cuántas veces por semana y cuántas bebidas cada vez?',
      fieldName: 'quitTobaccoHowLongAgo'
    },
    {
      id: 'consumeAlcoholNow',
      conversational: '¿Consumes alcohol actualmente? Si es así, ¿cuántas veces por semana y cuántas bebidas cada vez?',
      followUp: '¿Por cuántos años has consumido o consumes alcohol?',
      fieldName: 'consumeAlcoholNow'
    },
    {
      id: 'alcoholTimesPerWeek',
      conversational: '¿Cuántas veces por semana consumes alcohol?',
      followUp: '¿Cuántas bebidas consumes cada vez?',
      fieldName: 'alcoholTimesPerWeek'
    },
    {
      id: 'alcoholDrinksPerTime',
      conversational: '¿Cuántas bebidas consumes cada vez?',
      followUp: '¿Por cuántos años has consumido o consumes alcohol?',
      fieldName: 'alcoholDrinksPerTime'
    },
    {
      id: 'alcoholYearsOfUse',
      conversational: '¿Por cuántos años has consumido o consumes alcohol?',
      followUp: 'Si dejaste de beber alcohol, ¿hace cuánto tiempo?',
      fieldName: 'alcoholYearsOfUse'
    },
    {
      id: 'alcoholQuitHowLongAgo',
      conversational: 'Si dejaste de beber alcohol, ¿hace cuánto tiempo?',
      followUp: '¿Alguien está preocupado por la cantidad que bebes?',
      fieldName: 'alcoholQuitHowLongAgo'
    },
    {
      id: 'alcoholConcernFromOthers',
      conversational: '¿Alguien está preocupado por la cantidad que bebes?',
      followUp: 'Gracias. Ahora, sobre el uso de drogas. ¿Usas actualmente drogas ilícitas? Si es así, ¿cuáles y con qué frecuencia?',
      fieldName: 'alcoholConcernFromOthers'
    },
    {
      id: 'useStreetDrugsNow',
      conversational: '¿Usas actualmente drogas ilícitas? Si es así, ¿cuáles y con qué frecuencia?',
      followUp: 'Si dejaste de usarlas, ¿hace cuánto tiempo dejaste de usar drogas?',
      fieldName: 'useStreetDrugsNow'
    },
    {
      id: 'streetDrugsWhich',
      conversational: '¿Cuáles drogas usas o usaste?',
      followUp: '¿Con qué frecuencia las usas?',
      fieldName: 'streetDrugsWhich'
    },
    {
      id: 'streetDrugsFrequency',
      conversational: '¿Con qué frecuencia usas esas drogas?',
      followUp: 'Si dejaste de usarlas, ¿hace cuánto tiempo?',
      fieldName: 'streetDrugsFrequency'
    },
    {
      id: 'streetDrugsQuitHowLongAgo',
      conversational: 'Si dejaste de usarlas, ¿hace cuánto tiempo dejaste de usar drogas?',
      followUp: 'Gracias. Ahora, sobre la cafeína. ¿Bebes café u otras bebidas con cafeína? Si es así, ¿cuántas tazas por día y qué tipo de bebida es?',
      fieldName: 'streetDrugsQuitHowLongAgo'
    },
    {
      id: 'drinkCaffeineNow',
      conversational: '¿Bebes café u otras bebidas con cafeína? Si es así, ¿cuántas tazas por día y qué tipo de bebida es?',
      followUp: '¿Bebes bebidas carbonatadas? Si es así, ¿qué tipos y cuántas por día?',
      fieldName: 'drinkCaffeineNow'
    },
    {
      id: 'caffeineCupsPerDay',
      conversational: '¿Cuántas tazas por día consumes de cafeína?',
      followUp: '¿Qué tipo de bebida con cafeína consumes?',
      fieldName: 'caffeineCupsPerDay'
    },
    {
      id: 'caffeineDrinkType',
      conversational: '¿Qué tipo de bebida con cafeína consumes? (p. ej., café, té, bebida energética)',
      followUp: 'Si es otra, ¿qué bebida es?',
      fieldName: 'caffeineDrinkType'
    },
    {
      id: 'caffeineOtherDrinkType',
      conversational: 'Si es otra, ¿qué bebida es?',
      followUp: '¿Bebes bebidas carbonatadas? Si es así, ¿qué tipos y cuántas por día?',
      fieldName: 'caffeineOtherDrinkType'
    },
    {
      id: 'drinkCarbonatedBeverages',
      conversational: '¿Bebes bebidas carbonatadas?',
      followUp: 'Si bebes, ¿qué tipos consumes?',
      fieldName: 'drinkCarbonatedBeverages'
    },
    {
      id: 'carbonatedBeverageTypes',
      conversational: '¿Qué tipos de bebidas carbonatadas consumes? (refrescos, energéticas, etc.)',
      followUp: 'Para esas bebidas, ¿cuántas tazas o latas por día?',
      fieldName: 'carbonatedBeverageTypes'
    },
    {
      id: 'carbonatedOtherCupsPerDay',
      conversational: 'For those beverages, how many cups or cans per day?',
      followUp: 'Thank you. Now let\'s talk about your dietary habits. How often do you eat sweets and fast food?',
      fieldName: 'carbonatedOtherCupsPerDay'
    },
    {
      id: 'howOftenEatSweets',
      conversational: 'How often do you eat sweets and fast food?',
      followUp: 'Thank you. Now, about other substances. Do you use marijuana products, aspirin products, or sexual hormones?',
      fieldName: 'howOftenEatSweets'
    },
    {
      id: 'howOftenEatFastFood',
      conversational: 'How often do you eat fast food?',
      followUp: 'Thank you. Now, about other substances. Do you use marijuana products, aspirin products, or sexual hormones?',
      fieldName: 'howOftenEatFastFood'
    },
    {
      id: 'useMarijuanaProducts',
      conversational: 'Do you use marijuana products, aspirin products, or sexual hormones?',
      followUp: 'If you use any other substances, please specify. Also, do you have a referral name?',
      fieldName: 'useMarijuanaProducts'
    },
    {
      id: 'useAspirinProducts',
      conversational: 'Do you use aspirin products?',
      followUp: 'Do you use sexual hormones?',
      fieldName: 'useAspirinProducts'
    },
    {
      id: 'useSexualHormones',
      conversational: 'Do you use sexual hormones? (including birth control or hormonal replacement)',
      followUp: 'If you use any other substances, please specify.',
      fieldName: 'useSexualHormones'
    },
    {
      id: 'otherSubstancesSpecify',
      conversational: 'If you use any other substances, please specify.',
      followUp: 'Do you have a referral name?',
      fieldName: 'otherSubstancesSpecify'
    },
    {
      id: 'referralNameIfApplicable',
      conversational: 'Do you have a referral name?',
      followUp: 'Thank you. Now, what is your past surgical history?',
      fieldName: 'referralNameIfApplicable'
    },
    {
      id: 'pastSurgicalHistory',
      conversational: 'What is your past surgical history?',
      followUp: 'Thank you. If you are a woman, I need to ask about your menstrual cycle, hormonal contraception, and pregnancy history.',
      fieldName: 'pastSurgicalHistory'
    },
    {
      id: 'dateOfMenstrualCycle',
      conversational: 'If you are a woman, what is the date of your menstrual cycle?',
      followUp: 'Do you use any hormonal contraception?',
      fieldName: 'dateOfMenstrualCycle'
    },
    {
      id: 'useHormonalContraception',
      conversational: 'Do you use any hormonal contraception? (ex: birth control)',
      followUp: 'Please list any pregnancies, dates and outcomes.',
      fieldName: 'useHormonalContraception'
    },
    {
      id: 'listPregnancies',
      conversational: 'Please list any pregnancies, dates and outcomes (ex: full term, premature, C-section, miscarriage)',
      followUp: 'Thank you. What are your current medications?',
      fieldName: 'listPregnancies'
    },
    {
      id: 'currentMedications',
      conversational: 'What are your current medications?',
      followUp: 'What are your allergies?',
      fieldName: 'currentMedications'
    },
    {
      id: 'allergies',
      conversational: 'What are your allergies?',
      followUp: 'Finally, what is the name of your diet program?',
      fieldName: 'allergies'
    },
    {
      id: 'dietProgramName',
      conversational: 'What is the name of your diet program? If you have one, when did you start it, how long did you follow it, how much weight did you lose, and if there was weight regain, how much was it?',
      followUp: 'Thank you. We have completed the medical questionnaire.',
      fieldName: 'dietProgramName'
    },
    {
      id: 'dietProgramStartDate',
      conversational: 'When did you start your diet program?',
      followUp: 'How long did you follow it?',
      fieldName: 'dietProgramStartDate'
    },
    {
      id: 'dietProgramDuration',
      conversational: 'How long did you follow your diet program?',
      followUp: 'How much weight did you lose?',
      fieldName: 'dietProgramDuration'
    },
    {
      id: 'dietProgramWeightLost',
      conversational: 'How much weight did you lose on your diet program?',
      followUp: 'If there was weight regain, how much was it?',
      fieldName: 'dietProgramWeightLost'
    },
    {
      id: 'dietProgramWeightRegain',
      conversational: 'If there was weight regain, how much was it?',
      followUp: 'Thank you. Now I need to ask you some questions about your psychological well-being during the past month. Have you been bothered by nervousness or your "nerves", how much energy did you have, did you feel downhearted and blue, and were you generally tense or feel any tension?',
      fieldName: 'dietProgramWeightRegain'
    },
    {
      id: 'pgwbiNervousness',
      conversational: 'During the past month, have you been bothered by nervousness or your "nerves", how much energy did you have, did you feel downhearted and blue, and were you generally tense or feel any tension?',
      followUp: 'How happy, satisfied, or pleased have you been with your personal life during the past month?',
      fieldName: 'pgwbiNervousness'
    },
    {
      id: 'pgwbiEnergy',
      conversational: 'How much energy, pop, or vitality did you have or feel during the past month?',
      followUp: 'Did you feel downhearted and blue during the past month?',
      fieldName: 'pgwbiEnergy'
    },
    {
      id: 'pgwbiDownhearted',
      conversational: 'Did you feel downhearted and blue during the past month?',
      followUp: 'Were you generally tense or did you feel any tension during the past month?',
      fieldName: 'pgwbiDownhearted'
    },
    {
      id: 'pgwbiTension',
      conversational: 'Were you generally tense or did you feel any tension during the past month?',
      followUp: 'How happy, satisfied, or pleased have you been with your personal life during the past month?',
      fieldName: 'pgwbiTension'
    },
    {
      id: 'pgwbiPersonalLifeSatisfaction',
      conversational: 'How happy, satisfied, or pleased have you been with your personal life during the past month?',
      followUp: 'Did you feel healthy enough to carry out the things you like to do or had to do during the past month?',
      fieldName: 'pgwbiPersonalLifeSatisfaction'
    },
    {
      id: 'pgwbiHealthyEnough',
      conversational: 'Did you feel healthy enough to carry out the things you like to do or had to do during the past month?',
      followUp: 'Have you felt so sad, discouraged, hopeless, or had so many problems that you wondered if anything was worthwhile during the past month?',
      fieldName: 'pgwbiHealthyEnough'
    },
    {
      id: 'pgwbiSadDiscouraged',
      conversational: 'Have you felt so sad, discouraged, hopeless, or had so many problems that you wondered if anything was worthwhile during the past month?',
      followUp: 'Did you wake up feeling fresh and rested during the past month?',
      fieldName: 'pgwbiSadDiscouraged'
    },
    {
      id: 'pgwbiFreshRested',
      conversational: 'Did you wake up feeling fresh and rested during the past month?',
      followUp: 'Have you been concerned, worried, or had any fears about your health during the past month?',
      fieldName: 'pgwbiFreshRested'
    },
    {
      id: 'pgwbiHealthConcerns',
      conversational: 'Have you been concerned, worried, or had any fears about your health during the past month?',
      followUp: 'Have you had any reason to wonder if you were losing your mind, or losing control over the way you act, talk, think, feel or of your memory during the past month?',
      fieldName: 'pgwbiHealthConcerns'
    },
    {
      id: 'pgwbiLosingControl',
      conversational: 'Have you had any reason to wonder if you were losing your mind, or losing control over the way you act, talk, think, feel or of your memory during the past month?',
      followUp: 'Was your daily life full of things that were interesting to you during the past month?',
      fieldName: 'pgwbiLosingControl'
    },
    {
      id: 'pgwbiInterestingLife',
      conversational: 'Was your daily life full of things that were interesting to you during the past month?',
      followUp: 'Did you feel active, vigorous, or dull, sluggish during the past month?',
      fieldName: 'pgwbiInterestingLife'
    },
    {
      id: 'pgwbiActiveVigorous',
      conversational: 'Did you feel active, vigorous, or dull, sluggish during the past month?',
      followUp: 'Have you been anxious, worried, or upset during the past month?',
      fieldName: 'pgwbiActiveVigorous'
    },
    {
      id: 'pgwbiAnxiousWorried',
      conversational: 'Have you been anxious, worried, or upset during the past month?',
      followUp: 'Were you emotionally stable and sure of yourself during the past month?',
      fieldName: 'pgwbiAnxiousWorried'
    },
    {
      id: 'pgwbiEmotionallyStable',
      conversational: 'Were you emotionally stable and sure of yourself during the past month?',
      followUp: 'Did you feel relaxed, at ease, or high strung, tight, or keyed-up during the past month?',
      fieldName: 'pgwbiEmotionallyStable'
    },
    {
      id: 'pgwbiRelaxedAtEase',
      conversational: 'Did you feel relaxed, at ease, or high strung, tight, or keyed-up during the past month?',
      followUp: 'Did you feel cheerful, lighthearted during the past month?',
      fieldName: 'pgwbiRelaxedAtEase'
    },
    {
      id: 'pgwbiCheerfulLighthearted',
      conversational: 'Did you feel cheerful, lighthearted during the past month?',
      followUp: 'Did you feel tired, worn out, used up or exhausted during the past month?',
      fieldName: 'pgwbiCheerfulLighthearted'
    },
    {
      id: 'pgwbiTiredExhausted',
      conversational: 'Did you feel tired, worn out, used up or exhausted during the past month?',
      followUp: 'Have you been under or felt you were under any strain, stress, or pressure during the past month?',
      fieldName: 'pgwbiTiredExhausted'
    },
    {
      id: 'pgwbiStrainStressPressure',
      conversational: 'Have you been under or felt you were under any strain, stress, or pressure during the past month?',
      followUp: 'Thank you. Do you have any additional comments you would like to add?',
      fieldName: 'pgwbiStrainStressPressure'
    },
    {
      id: 'additionalComments',
      conversational: 'Do you have any additional comments you would like to add?',
      followUp: 'Finally, I need to confirm that you have read and accepted the terms and conditions. Have you read and accepted them?',
      fieldName: 'additionalComments'
    },
    {
      id: 'termsAndConditionsAccepted',
      conversational: 'Finally, I need to confirm that you have read and accepted the terms and conditions. Have you read and accepted them?',
      followUp: 'Thank you. We have completed the entire medical questionnaire. All your information has been collected successfully.',
      fieldName: 'termsAndConditionsAccepted'
    }
  ]
};
