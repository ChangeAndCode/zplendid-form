'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones simples en un objeto
const translations = {
  es: {
    // Header
    'header.title': 'Cuestionario de salud',
    'header.subtitle': 'Comience hoy su viaje de pérdida de peso completando nuestro Formulario de Salud.',
    'progress.step': 'Paso',
    'progress.of': 'de',
    'progress.complete': 'Completo',
    
    // Step titles
    'step.personal': 'Información Personal',
    'step.medical': 'Historial Médico',
    'step.surgery': 'Interés Quirúrgico',
    'step.weight': 'Historial de Peso',
    'step.confirmation': 'Confirmación y Envío',
    
    // Personal info
    'field.firstName': 'Nombre',
    'field.lastName': 'Apellido',
    'field.dateOfBirth': 'Fecha de Nacimiento',
    'field.age': 'Edad',
    'field.gender': 'Género',
    'field.phone': 'Teléfono',
    'field.email': 'Email',
    'field.preferredContact': 'Método de Contacto Preferido',
    'field.optional': '(Opcional)',
    
    // Address
    'section.address': 'Dirección',
    'field.addressLine': 'Dirección',
    'field.city': 'Ciudad',
    'field.state': 'Estado/Provincia',
    'field.country': 'País',
    'field.zipcode': 'Código Postal',
    
    // Emergency contact
    'section.emergency': 'Contacto de Emergencia',
    'field.emergencyFirstName': 'Nombre',
    'field.emergencyLastName': 'Apellido',
    'field.emergencyRelationship': 'Relación',
    'field.emergencyPhone': 'Teléfono de Emergencia',
    
    // Medical conditions
    'section.medicalConditions': 'Condiciones Médicas Actuales',
    'field.highBloodPressure': 'Presión Arterial Alta',
    'field.diabetes': 'Diabetes',
    'field.useInsulin': '¿Usa insulina?',
    'field.sleepApnea': 'Apnea del Sueño',
    'field.useCpap': '¿Usa CPAP?',
    
    // Medications
    'section.medications': 'Medicamentos y Alergias',
    'field.medications': 'Medicamentos actuales (separe con comas)',
    'field.allergies': 'Alergias',
    
    // Social history
    'section.socialHistory': 'Historia Social',
    'field.smoking': '¿Fuma actualmente?',
    'field.alcohol': '¿Consume alcohol?',
    
    // Previous surgeries
    'section.previousSurgery': 'Cirugías Previas',
    'field.previousWeightLossSurgery': '¿Ha tenido alguna cirugía de pérdida de peso anteriormente?',
    
    // Surgery interest
    'field.surgeryType': '¿Qué tipo de procedimiento le interesa?',
    'field.specificProcedure': 'Procedimiento Específico',
    'field.surgeryReadiness': '¿Qué tan avanzado está en el proceso?',
    
    // Surgery options
    'surgery.firstTimeBariatric': 'Cirugía Bariátrica (Primera Vez)',
    'surgery.revisionalBariatric': 'Cirugía Bariátrica Revisional',
    'surgery.primaryPlastic': 'Cirugía Plástica Primaria',
    'surgery.postBariatricPlastic': 'Cirugía Plástica Post-Bariátrica',
    'surgery.metabolicRehab': 'Rehabilitación Metabólica',
    
    // BMI
    'section.bmi': 'BMI e Información Física',
    'field.measurementSystem': 'Sistema de Medida',
    'measurement.standard': 'Estándar (lb/ft)',
    'measurement.metric': 'Métrico (kg/cm)',
    'field.heightFeet': 'Altura (pies)',
    'field.heightInches': 'Altura (pulgadas)',
    'field.heightCm': 'Altura (cm)',
    'field.weightLbs': 'Peso (libras)',
    'field.weightKg': 'Peso (kg)',
    'bmi.calculated': 'BMI Calculado:',
    
    // Weight history
    'field.highestWeight': 'Peso Más Alto (HW):',
    'field.lowestWeight': 'Peso Más Bajo (LW):',
    'field.currentWeight': 'Peso Actual (CW):',
    'field.goalWeight': 'Peso Meta (GW):',
    'field.when': '¿Cuándo?',
    
    // Comments
    'section.comments': 'Comentarios Adicionales',
    'field.comments': 'Cualquier información adicional que considere importante...',
    
    // Terms
    'section.terms': 'Términos y Condiciones',
    'terms.text1': 'Estas preguntas son importantes para que nuestros cirujanos determinen la mejor opción de cirugía para usted. Completar este formulario no lo compromete a nada. Es simplemente un paso para ayudarlo en su proceso.',
    'terms.text2': 'Confirmo que la información que proporcioné en este cuestionario de salud es verdadera y precisa. Entiendo que si no soy sincero, mi cotización puede ser incorrecta y podría haber consecuencias graves, incluyendo malos resultados, complicaciones y riesgos para mi salud.',
    'terms.accept': 'He leído y acepto los términos y condiciones. Acepto recibir correos electrónicos, llamadas telefónicas y/o SMS de zplendid.',
    
    // Buttons
    'button.previous': 'Anterior',
    'button.next': 'Siguiente',
    'button.submit': 'Enviar Formulario',
    
    // Common
    'common.select': 'Seleccione...',
    'common.yes': 'Sí',
    'common.no': 'No',
    'gender.male': 'Masculino',
    'gender.female': 'Femenino',
    'gender.other': 'Otro',
    'contact.text': 'Mensaje de Texto',
    'contact.call': 'Llamada',
    'contact.email': 'Email',
    
    // Placeholders
    'placeholder.firstName': 'Ingrese su nombre',
    'placeholder.lastName': 'Ingrese su apellido',
    'placeholder.autoCalculated': 'Se calcula automáticamente',
    'placeholder.phone': '+1 (555) 123-4567',
    'placeholder.email': 'su@email.com',
    'placeholder.address': 'Calle, número, apartamento',
    'placeholder.city': 'Ciudad',
    'placeholder.state': 'Estado',
    'placeholder.country': 'País',
    'placeholder.zipcode': '12345',
    'placeholder.emergencyName': 'Nombre del contacto',
    'placeholder.emergencyLastName': 'Apellido del contacto',
    'placeholder.emergencyRelationship': 'Ej: Esposo/a, Hermano/a...',
    'placeholder.medications': 'Ej: Metformina 500mg, Aspirina, Lisinopril...',
    'placeholder.allergies': 'Ej: Penicilina, Mariscos, Ninguna...',
    'placeholder.height': '6',
    'placeholder.heightInches': '0',
    'placeholder.weight': '200',
    'placeholder.heightCm': '180',
    'placeholder.weightKg': '90',
    'placeholder.weightHistory': '250',
  },
  en: {
    // Header
    'header.title': 'Health Questionnaire',
    'header.subtitle': 'Begin your weight loss journey today by completing our Health Form.',
    'progress.step': 'Step',
    'progress.of': 'of',
    'progress.complete': 'Complete',
    
    // Step titles
    'step.personal': 'Personal Information',
    'step.medical': 'Medical History',
    'step.surgery': 'Surgery Interest',
    'step.weight': 'Weight History',
    'step.confirmation': 'Confirmation and Submit',
    
    // Personal info
    'field.firstName': 'First Name',
    'field.lastName': 'Last Name',
    'field.dateOfBirth': 'Date of Birth',
    'field.age': 'Age',
    'field.gender': 'Gender',
    'field.phone': 'Phone',
    'field.email': 'Email',
    'field.preferredContact': 'Preferred Contact Method',
    'field.optional': '(Optional)',
    
    // Address
    'section.address': 'Address',
    'field.addressLine': 'Address',
    'field.city': 'City',
    'field.state': 'State/Province',
    'field.country': 'Country',
    'field.zipcode': 'Zip Code',
    
    // Emergency contact
    'section.emergency': 'Emergency Contact',
    'field.emergencyFirstName': 'First Name',
    'field.emergencyLastName': 'Last Name',
    'field.emergencyRelationship': 'Relationship',
    'field.emergencyPhone': 'Emergency Phone',
    
    // Medical conditions
    'section.medicalConditions': 'Current Medical Conditions',
    'field.highBloodPressure': 'High Blood Pressure',
    'field.diabetes': 'Diabetes',
    'field.useInsulin': 'Do you use insulin?',
    'field.sleepApnea': 'Sleep Apnea',
    'field.useCpap': 'Do you use CPAP?',
    
    // Medications
    'section.medications': 'Medications and Allergies',
    'field.medications': 'Current medications (separate with commas)',
    'field.allergies': 'Allergies',
    
    // Social history
    'section.socialHistory': 'Social History',
    'field.smoking': 'Do you currently smoke?',
    'field.alcohol': 'Do you consume alcohol?',
    
    // Previous surgeries
    'section.previousSurgery': 'Previous Surgeries',
    'field.previousWeightLossSurgery': 'Have you ever had weight loss surgery?',
    
    // Surgery interest
    'field.surgeryType': 'What type of procedure interests you?',
    'field.specificProcedure': 'Specific Procedure',
    'field.surgeryReadiness': 'How far are you in the process?',
    
    // Surgery options
    'surgery.firstTimeBariatric': 'First-time Bariatric Surgery',
    'surgery.revisionalBariatric': 'Revisional Bariatric Surgery',
    'surgery.primaryPlastic': 'Primary Plastic Surgery',
    'surgery.postBariatricPlastic': 'Post-Bariatric Plastic Surgery',
    'surgery.metabolicRehab': 'Metabolic Rehab',
    
    // BMI
    'section.bmi': 'BMI and Physical Information',
    'field.measurementSystem': 'Measurement System',
    'measurement.standard': 'Standard (lb/ft)',
    'measurement.metric': 'Metric (kg/cm)',
    'field.heightFeet': 'Height (feet)',
    'field.heightInches': 'Height (inches)',
    'field.heightCm': 'Height (cm)',
    'field.weightLbs': 'Weight (pounds)',
    'field.weightKg': 'Weight (kg)',
    'bmi.calculated': 'Calculated BMI:',
    
    // Weight history
    'field.highestWeight': 'Highest Weight (HW):',
    'field.lowestWeight': 'Lowest Weight (LW):',
    'field.currentWeight': 'Current Weight (CW):',
    'field.goalWeight': 'Goal Weight (GW):',
    'field.when': 'When?',
    
    // Comments
    'section.comments': 'Additional Comments',
    'field.comments': 'Any additional information you consider important...',
    
    // Terms
    'section.terms': 'Terms and Conditions',
    'terms.text1': 'These questions are important for our surgeons to determine the best weight loss surgery option for you. Completing this form does not commit you to anything. It\'s simply a step to help guide you on your journey.',
    'terms.text2': 'I confirm that the information I provided in this health questionnaire is true and accurate. I understand that if I am not truthful, my quote may be incorrect, and there could be serious consequences, including poor results, complications, and risks to my health.',
    'terms.accept': 'I have read and accept the terms and conditions. I agree to receive emails, phone calls, and/or SMS from zplendid.',
    
    // Buttons
    'button.previous': 'Previous',
    'button.next': 'Next',
    'button.submit': 'Submit Form',
    
    // Common
    'common.select': 'Select...',
    'common.yes': 'Yes',
    'common.no': 'No',
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.other': 'Other',
    'contact.text': 'Text Message',
    'contact.call': 'Call',
    'contact.email': 'Email',
    
    // Placeholders
    'placeholder.firstName': 'Enter your first name',
    'placeholder.lastName': 'Enter your last name',
    'placeholder.autoCalculated': 'Automatically calculated',
    'placeholder.phone': '+1 (555) 123-4567',
    'placeholder.email': 'your@email.com',
    'placeholder.address': 'Street, number, apartment',
    'placeholder.city': 'City',
    'placeholder.state': 'State',
    'placeholder.country': 'Country',
    'placeholder.zipcode': '12345',
    'placeholder.emergencyName': 'Contact name',
    'placeholder.emergencyLastName': 'Contact last name',
    'placeholder.emergencyRelationship': 'Ex: Spouse, Sibling...',
    'placeholder.medications': 'Ex: Metformin 500mg, Aspirin, Lisinopril...',
    'placeholder.allergies': 'Ex: Penicillin, Seafood, None...',
    'placeholder.height': '6',
    'placeholder.heightInches': '0',
    'placeholder.weight': '200',
    'placeholder.heightCm': '180',
    'placeholder.weightKg': '90',
    'placeholder.weightHistory': '250',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

