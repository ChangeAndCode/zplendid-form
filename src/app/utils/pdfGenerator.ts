import { jsPDF } from 'jspdf';
import type { HealthFormData } from '../hooks/useHealthForm';

interface FieldDefinition {
  key: keyof HealthFormData;
  label: string;
  labelEn: string;
  section?: string;
  sectionEn?: string;
  condition?: (formData: HealthFormData) => boolean;
}

const fieldDefinitions: FieldDefinition[] = [
  // Información Personal
  { key: 'firstName', label: 'Nombre', labelEn: 'First Name', section: 'Información Personal', sectionEn: 'Personal Information' },
  { key: 'lastName', label: 'Apellido', labelEn: 'Last Name' },
  { key: 'dateOfBirth', label: 'Fecha de Nacimiento', labelEn: 'Date of Birth' },
  { key: 'age', label: 'Edad', labelEn: 'Age' },
  { key: 'gender', label: 'Género', labelEn: 'Gender' },
  { key: 'phoneNumber', label: 'Teléfono', labelEn: 'Phone' },
  { key: 'email', label: 'Email', labelEn: 'Email' },
  { key: 'preferredContact', label: 'Método de Contacto Preferido', labelEn: 'Preferred Contact Method' },
  
  // Dirección
  { key: 'addressLine', label: 'Dirección', labelEn: 'Address', section: 'Dirección', sectionEn: 'Address' },
  { key: 'city', label: 'Ciudad', labelEn: 'City' },
  { key: 'state', label: 'Estado/Provincia', labelEn: 'State/Province' },
  { key: 'country', label: 'País', labelEn: 'Country' },
  { key: 'zipcode', label: 'Código Postal', labelEn: 'Zip Code' },
  
  // Contacto de Emergencia
  { key: 'emergencyFirstName', label: 'Nombre de Contacto de Emergencia', labelEn: 'Emergency Contact First Name', section: 'Contacto de Emergencia', sectionEn: 'Emergency Contact' },
  { key: 'emergencyLastName', label: 'Apellido de Contacto de Emergencia', labelEn: 'Emergency Contact Last Name' },
  { key: 'emergencyRelationship', label: 'Relación', labelEn: 'Relationship' },
  { key: 'emergencyPhone', label: 'Teléfono de Emergencia', labelEn: 'Emergency Phone' },
  
  // Interés Quirúrgico
  { key: 'surgeryInterest', label: 'Tipo de Procedimiento de Interés', labelEn: 'Surgery Interest', section: 'Interés Quirúrgico', sectionEn: 'Surgery Interest' },
  { key: 'specificProcedure', label: 'Procedimiento Específico', labelEn: 'Specific Procedure' },
  { key: 'surgeryReadiness', label: 'Avance en el Proceso', labelEn: 'Readiness' },
  
  // Información Física
  { key: 'measurementSystem', label: 'Sistema de Medida', labelEn: 'Measurement System', section: 'Información Física y BMI', sectionEn: 'Physical Information and BMI' },
  { key: 'heightFeet', label: 'Altura (pies)', labelEn: 'Height (feet)', condition: (fd) => fd.measurementSystem === 'standard' },
  { key: 'heightInches', label: 'Altura (pulgadas)', labelEn: 'Height (inches)', condition: (fd) => fd.measurementSystem === 'standard' },
  { key: 'heightCm', label: 'Altura (cm)', labelEn: 'Height (cm)', condition: (fd) => fd.measurementSystem === 'metric' },
  { key: 'weightLbs', label: 'Peso (libras)', labelEn: 'Weight (lbs)', condition: (fd) => fd.measurementSystem === 'standard' },
  { key: 'weightKg', label: 'Peso (kg)', labelEn: 'Weight (kg)', condition: (fd) => fd.measurementSystem === 'metric' },
  { key: 'bmi', label: 'BMI Calculado', labelEn: 'Calculated BMI' },
  
  // Historial de Peso
  { key: 'highestWeight', label: 'Peso Más Alto', labelEn: 'Highest Weight', section: 'Historial de Peso', sectionEn: 'Weight History' },
  { key: 'highestWeightDate', label: 'Fecha del Peso Más Alto', labelEn: 'Highest Weight Date' },
  { key: 'lowestWeight', label: 'Peso Más Bajo', labelEn: 'Lowest Weight' },
  { key: 'lowestWeightDate', label: 'Fecha del Peso Más Bajo', labelEn: 'Lowest Weight Date' },
  { key: 'currentWeight', label: 'Peso Actual', labelEn: 'Current Weight' },
  { key: 'goalWeight', label: 'Peso Meta', labelEn: 'Goal Weight' },
  
  // Historial Médico
  { key: 'previousWeightLossSurgery', label: 'Cirugía de Pérdida de Peso Previa', labelEn: 'Previous Weight Loss Surgery', section: 'Historial Médico', sectionEn: 'Medical History' },
  { key: 'highBloodPressure', label: 'Presión Arterial Alta', labelEn: 'High Blood Pressure' },
  { key: 'diabetes', label: 'Diabetes', labelEn: 'Diabetes' },
  { key: 'useInsulin', label: 'Usa Insulina', labelEn: 'Uses Insulin', condition: (fd) => fd.diabetes === 'yes' },
  { key: 'sleepApnea', label: 'Apnea del Sueño', labelEn: 'Sleep Apnea' },
  { key: 'useCpap', label: 'Usa CPAP', labelEn: 'Uses CPAP', condition: (fd) => fd.sleepApnea === 'yes' },
  { key: 'heartburnFrequency', label: 'Frecuencia de Acidez', labelEn: 'Heartburn Frequency' },
  { key: 'currentlySmoking', label: 'Fuma Actualmente', labelEn: 'Currently Smoking' },
  { key: 'alcoholConsumption', label: 'Consumo de Alcohol', labelEn: 'Alcohol Consumption' },
  { key: 'medications', label: 'Medicamentos Actuales', labelEn: 'Current Medications' },
  { key: 'allergies', label: 'Alergias', labelEn: 'Allergies' },
  { key: 'additionalComments', label: 'Comentarios Adicionales', labelEn: 'Additional Comments' },
];

function isFieldFilled(value: string): boolean {
  return value !== '' && value !== 'no' && value !== '0';
}

function formatValue(value: string, key: keyof HealthFormData, language: 'es' | 'en'): string {
  // Traducciones específicas
  const translations: Record<string, Record<'es' | 'en', string>> = {
    'yes': { es: 'Sí', en: 'Yes' },
    'no': { es: 'No', en: 'No' },
    'male': { es: 'Masculino', en: 'Male' },
    'female': { es: 'Femenino', en: 'Female' },
    'other': { es: 'Otro', en: 'Other' },
    'text': { es: 'Mensaje de Texto', en: 'Text Message' },
    'call': { es: 'Llamada', en: 'Call' },
    'email': { es: 'Email', en: 'Email' },
    'standard': { es: 'Estándar (lb/ft)', en: 'Standard (lb/ft)' },
    'metric': { es: 'Métrico (kg/cm)', en: 'Metric (kg/cm)' },
    'first-time-bariatric': { es: 'Cirugía Bariátrica (Primera Vez)', en: 'First-time Bariatric Surgery' },
    'revisional-bariatric': { es: 'Cirugía Bariátrica Revisional', en: 'Revisional Bariatric Surgery' },
    'primary-plastic': { es: 'Cirugía Plástica Primaria', en: 'Primary Plastic Surgery' },
    'post-bariatric-plastic': { es: 'Cirugía Plástica Post-Bariátrica', en: 'Post-Bariatric Plastic Surgery' },
    'metabolic-rehab': { es: 'Rehabilitación Metabólica', en: 'Metabolic Rehab' },
  };

  return translations[value]?.[language] || value;
}

export function generatePDF(formData: HealthFormData, language: 'es' | 'en' = 'es', patientId?: string): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Colores de la marca (ajustar según zplendid)
  const primaryColor: [number, number, number] = [33, 46, 92]; // #212e5c
  const accentColor: [number, number, number] = [66, 133, 244]; // Azul suave
  const lightGray: [number, number, number] = [245, 245, 245];

  // Función para verificar si necesitamos una nueva página
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header con logo y branding
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('zplendid', margin, 18);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const subtitle = language === 'es' ? 'Cuestionario de Salud' : 'Health Questionnaire';
  doc.text(subtitle, margin, 27);

  // Fecha de generación y número de expediente
  doc.setFontSize(9);
  const dateText = language === 'es' 
    ? `Generado: ${new Date().toLocaleDateString('es-ES')}` 
    : `Generated: ${new Date().toLocaleDateString('en-US')}`;
  doc.text(dateText, pageWidth - margin, 18, { align: 'right' });

  // Número de expediente
  if (patientId) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const expedienteLabel = language === 'es' ? 'Expediente: ' : 'Patient ID: ';
    doc.text(expedienteLabel + patientId, pageWidth - margin, 26, { align: 'right' });
  }

  yPosition = 50;

  // Información del paciente destacada
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const patientName = `${formData.firstName} ${formData.lastName}`.trim() || 
    (language === 'es' ? 'Paciente' : 'Patient');
  doc.text(patientName, margin + 5, yPosition + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (formData.email) {
    doc.text(`📧 ${formData.email}`, margin + 5, yPosition + 18);
  }
  
  yPosition += 35;

  // Procesar campos por sección
  let currentSection = '';
  
  fieldDefinitions.forEach((field) => {
    const value = formData[field.key];
    
    // Verificar condición si existe
    if (field.condition && !field.condition(formData)) {
      return;
    }

    // Solo mostrar campos llenos
    if (!isFieldFilled(String(value))) {
      return;
    }

    // Nueva sección
    if (field.section && field.section !== currentSection) {
      checkPageBreak(20);
      currentSection = field.section;
      
      yPosition += 5;
      doc.setFillColor(...lightGray);
      doc.rect(margin, yPosition, contentWidth, 10, 'F');
      
      doc.setTextColor(...primaryColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const sectionTitle = language === 'es' ? field.section : field.sectionEn || field.section;
      doc.text(sectionTitle, margin + 3, yPosition + 7);
      
      yPosition += 15;
    }

    // Campo individual
    checkPageBreak(15);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const label = language === 'es' ? field.label : field.labelEn;
    doc.text(label + ':', margin + 5, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    const formattedValue = formatValue(String(value), field.key, language);
    const lines = doc.splitTextToSize(formattedValue, contentWidth - 15);
    doc.text(lines, margin + 5, yPosition + 5);
    
    yPosition += 5 + (lines.length * 5) + 3;
  });

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerText = language === 'es'
    ? 'Documento confidencial - zplendid Health Questionnaire'
    : 'Confidential document - zplendid Health Questionnaire';
  doc.text(footerText, pageWidth / 2, footerY + 7, { align: 'center' });

  return doc;
}

// Función para obtener resumen de datos completados (para correo)
export function getFilledFieldsSummary(formData: HealthFormData, language: 'es' | 'en' = 'es'): string {
  let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">';
  
  let currentSection = '';
  
  fieldDefinitions.forEach((field) => {
    const value = formData[field.key];
    
    if (field.condition && !field.condition(formData)) {
      return;
    }

    if (!isFieldFilled(String(value))) {
      return;
    }

    if (field.section && field.section !== currentSection) {
      if (currentSection) {
        html += '</div>';
      }
      currentSection = field.section;
      
      const sectionTitle = language === 'es' ? field.section : field.sectionEn || field.section;
      html += `
        <div style="margin-top: 20px;">
          <h3 style="background-color: #212e5c; color: white; padding: 10px; border-radius: 5px; margin: 0;">
            ${sectionTitle}
          </h3>
          <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-top: none;">
      `;
    }

    const label = language === 'es' ? field.label : field.labelEn;
    const formattedValue = formatValue(String(value), field.key, language);
    
    html += `
      <div style="margin-bottom: 10px;">
        <strong style="color: #555;">${label}:</strong>
        <span style="color: #000;">${formattedValue}</span>
      </div>
    `;
  });

  if (currentSection) {
    html += '</div></div>';
  }
  
  html += '</div>';
  
  return html;
}

