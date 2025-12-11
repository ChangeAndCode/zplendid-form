/**
 * Generador de PDF para expedientes médicos
 * Consolida datos del chatbot y formulario tradicional desde MongoDB
 * Formato específico para expediente médico
 */

import { jsPDF } from 'jspdf';

export interface PatientDataForPDF {
  // Información básica
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  patientId: string;
  
  // Datos del chatbot (desde colecciones MongoDB)
  chatbotData?: {
    patientInfo?: Record<string, unknown>;
    surgeryInterest?: Record<string, unknown>;
    medicalHistory?: Record<string, unknown>;
    familyHistory?: Record<string, unknown>;
  };
  
  // Datos del formulario tradicional (opcional)
  formData?: Record<string, unknown>;
}

/**
 * Genera PDF del expediente médico consolidando datos de chatbot y formulario
 * Respeta formato específico para expediente médico
 */
export function generatePatientPDF(
  patientData: PatientDataForPDF,
  language: 'es' | 'en' = 'es'
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Colores de la marca
  const primaryColor: [number, number, number] = [33, 46, 92]; // #212e5c
  const accentColor: [number, number, number] = [66, 133, 244];
  const lightGray: [number, number, number] = [245, 245, 245];

  // Función para verificar si necesitamos una nueva página
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 20) {
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
  const subtitle = language === 'es' ? 'Expediente Médico' : 'Medical Record';
  doc.text(subtitle, margin, 27);

  // Fecha de generación y número de expediente
  doc.setFontSize(9);
  const dateText = language === 'es' 
    ? `Generado: ${new Date().toLocaleDateString('es-ES')}` 
    : `Generated: ${new Date().toLocaleDateString('en-US')}`;
  doc.text(dateText, pageWidth - margin, 18, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const expedienteLabel = language === 'es' ? 'Expediente: ' : 'Patient ID: ';
  doc.text(expedienteLabel + patientData.patientId, pageWidth - margin, 26, { align: 'right' });

  yPosition = 50;

  // Calcular estado de completitud general
  const hasPatientInfo = patientData.chatbotData?.patientInfo && Object.keys(patientData.chatbotData.patientInfo).length > 0;
  const hasSurgeryInterest = patientData.chatbotData?.surgeryInterest && Object.keys(patientData.chatbotData.surgeryInterest).length > 0;
  const hasMedicalHistory = patientData.chatbotData?.medicalHistory && Object.keys(patientData.chatbotData.medicalHistory).length > 0;
  const hasFamilyHistory = patientData.chatbotData?.familyHistory && Object.keys(patientData.chatbotData.familyHistory).length > 0;
  const sectionsCompleted = [hasPatientInfo, hasSurgeryInterest, hasMedicalHistory, hasFamilyHistory].filter(Boolean).length;
  const totalSections = 4;
  const isComplete = sectionsCompleted === totalSections;

  // Nota de estado si el documento está en progreso
  if (!isComplete) {
    checkPageBreak(20);
    doc.setFillColor(255, 193, 7); // Amarillo para indicar en progreso
    doc.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const statusText = language === 'es' 
      ? `📝 DOCUMENTO EN PROGRESO - ${sectionsCompleted}/${totalSections} secciones completadas`
      : `📝 DOCUMENT IN PROGRESS - ${sectionsCompleted}/${totalSections} sections completed`;
    doc.text(statusText, margin + 5, yPosition + 8);
    yPosition += 18;
  }

  // Información del paciente destacada
  // Calcular altura dinámica del recuadro basado en contenido
  let infoLines = 1; // Nombre siempre está
  if (patientData.dateOfBirth) infoLines++;
  if (patientData.email) infoLines++;
  if (patientData.phoneNumber) infoLines++;
  const boxHeight = 12 + (infoLines * 6) + 8; // Padding superior + líneas + padding inferior
  
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const patientName = `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim() || 
    (language === 'es' ? 'Paciente' : 'Patient');
  doc.text(patientName, margin + 5, yPosition + 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let infoY = yPosition + 20;
  if (patientData.dateOfBirth) {
    const dobLabel = language === 'es' ? 'Fecha de Nacimiento: ' : 'Date of Birth: ';
    doc.text(dobLabel + patientData.dateOfBirth, margin + 5, infoY);
    infoY += 6;
  }
  if (patientData.email) {
    doc.text(`📧 ${patientData.email}`, margin + 5, infoY);
    infoY += 6;
  }
  if (patientData.phoneNumber) {
    doc.text(`📞 ${patientData.phoneNumber}`, margin + 5, infoY);
  }
  
  yPosition += boxHeight + 5;

  // Función auxiliar para formatear claves como etiquetas legibles
  const formatKeyAsLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  };

  // Función para mapear valores PGWBI (0-6) a texto legible
  const mapPgwbiValue = (value: string | number, lang: 'es' | 'en'): string => {
    const val = String(value).trim();
    const map: Record<string, { es: string; en: string }> = {
      '6': { es: 'Muy bien', en: 'Very well' },
      '5': { es: 'Bien', en: 'Well' },
      '4': { es: 'Bastante bien', en: 'Fairly well' },
      '3': { es: 'Bastante mal', en: 'Fairly bad' },
      '2': { es: 'Mal', en: 'Bad' },
      '1': { es: 'Muy mal', en: 'Very bad' },
      '0': { es: 'No sé', en: 'Don\'t know' }
    };
    return map[val] ? map[val][lang] : String(value);
  };

  // Función para mapear valores GERD (0-4) a texto legible
  const mapGerdValue = (value: string | number, lang: 'es' | 'en'): string => {
    const val = String(value).trim();
    const map: Record<string, { es: string; en: string }> = {
      '4': { es: 'Siempre', en: 'Always' },
      '3': { es: 'Frecuentemente', en: 'Frequently' },
      '2': { es: 'Algunas veces', en: 'Sometimes' },
      '1': { es: 'Raramente', en: 'Rarely' },
      '0': { es: 'Nunca', en: 'Never' }
    };
    return map[val] ? map[val][lang] : String(value);
  };

  // Función para obtener etiqueta descriptiva de PGWBI
  const getPgwbiLabel = (key: string, lang: 'es' | 'en'): string => {
    const labels: Record<string, { es: string; en: string }> = {
      'pgwbi1Anxious': { es: '¿Se ha sentido ansioso, preocupado o inquieto?', en: 'Have you been anxious, worried or upset?' },
      'pgwbi2Depressed': { es: '¿Se ha sentido deprimido o triste?', en: 'Have you been depressed or sad?' },
      'pgwbi3SelfControl': { es: '¿Ha tenido control sobre sus emociones?', en: 'Have you had control over your emotions?' },
      'pgwbi4Vitality': { es: '¿Se ha sentido lleno de energía y vitalidad?', en: 'Have you felt full of energy and vitality?' },
      'pgwbi5Health': { es: '¿Se sintió lo suficientemente saludable?', en: 'Did you feel healthy enough?' },
      'pgwbi6Spirits': { es: '¿Cómo se sintió anímicamente?', en: 'How did you feel in spirits?' },
      'pgwbi7Worried': { es: '¿Se ha sentido preocupado?', en: 'Have you been worried?' },
      'pgwbi8Energy': { es: '¿Cuánta energía tuvo o sintió?', en: 'How much energy did you have or feel?' },
      'pgwbi9Mood': { es: '¿Cómo fue su estado de ánimo?', en: 'How was your mood?' },
      'pgwbi10Tension': { es: '¿Se sintió tenso?', en: 'Were you tense?' },
      'pgwbi11Happiness': { es: '¿Qué tan feliz se sintió?', en: 'How happy did you feel?' },
      'pgwbi12Interest': { es: '¿Su vida diaria estuvo llena de cosas interesantes?', en: 'Was your daily life full of interesting things?' },
      'pgwbi13Calm': { es: '¿Se sintió tranquilo y en calma?', en: 'Did you feel calm and at ease?' },
      'pgwbi14Sad': { es: '¿Se sintió triste o desanimado?', en: 'Did you feel sad or downhearted?' },
      'pgwbi15Active': { es: '¿Se sintió activo y vigoroso?', en: 'Did you feel active and vigorous?' },
      'pgwbi16Cheerful': { es: '¿Se sintió alegre y despreocupado?', en: 'Did you feel cheerful and lighthearted?' },
      'pgwbi17Tired': { es: '¿Se sintió cansado o agotado?', en: 'Did you feel tired or exhausted?' },
      'pgwbi18Pressure': { es: '¿Sintió presión, estrés o tensión?', en: 'Did you feel strain, stress or pressure?' }
    };
    return labels[key] ? labels[key][lang] : formatKeyAsLabel(key);
  };

  // Función auxiliar para determinar si un campo puede usar dos columnas (respuesta corta)
  const canUseTwoColumns = (key: string, value: unknown): boolean => {
    // Campos PGWBI y GERD siempre pueden usar dos columnas
    if (key.startsWith('pgwbi') || key.startsWith('gerd')) {
      return true;
    }
    // Valores numéricos simples
    if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value.trim()))) {
      return true;
    }
    // Valores cortos (sí/no, opciones cortas)
    const strValue = String(value);
    if (strValue.length <= 30 && !strValue.includes('\n') && !strValue.includes(',')) {
      return true;
    }
    return false;
  };

  // Función auxiliar para renderizar un campo individual (una columna)
  const renderFieldSingle = (key: string, value: unknown, label: string, xPos: number, width: number, skipPageBreak: boolean = false) => {
    if (!value || value === '' || value === null || value === undefined) return false;

    if (!skipPageBreak) {
      checkPageBreak(12);
    }
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', xPos, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Manejar diferentes tipos de valores y aplicar mapeos
    let valueStr: string;
    if (typeof value === 'object' && value !== null) {
      // Si es un objeto, formatearlo de manera legible
      if (Array.isArray(value)) {
        valueStr = value.join(', ');
      } else {
        // Para objetos, crear una representación legible
        const obj = value as Record<string, unknown>;
        // Formato especial para dirección
        if (key === 'address' && (obj.street || obj.addressLine || obj.city)) {
          const parts: string[] = [];
          if (obj.street || obj.addressLine) parts.push(String(obj.street || obj.addressLine));
          if (obj.city) parts.push(String(obj.city));
          if (obj.state) parts.push(String(obj.state));
          if (obj.zip_code || obj.zipCode || obj.zipcode) parts.push(String(obj.zip_code || obj.zipCode || obj.zipcode));
          if (obj.country) parts.push(String(obj.country));
          valueStr = parts.join(', ');
        } else {
          // Para otros objetos, mostrar como lista
          valueStr = Object.entries(obj)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        }
      }
    } else {
      const strVal = String(value).trim();
      // Aplicar mapeos para PGWBI y GERD
      if (key.startsWith('pgwbi')) {
        valueStr = mapPgwbiValue(strVal, language);
      } else if (key.startsWith('gerd')) {
        valueStr = mapGerdValue(strVal, language);
      } else {
        valueStr = strVal;
      }
    }
    const lines = doc.splitTextToSize(valueStr, width - 5);
    doc.text(lines, xPos, yPosition + 5);
    
    const fieldHeight = 5 + (lines.length * 5) + 3;
    yPosition += fieldHeight;
    return fieldHeight;
  };

  // Función auxiliar para renderizar un campo individual (compatibilidad)
  const renderField = (key: string, value: unknown, label: string) => {
    return renderFieldSingle(key, value, label, margin + 5, contentWidth - 15);
  };

  // Función auxiliar para renderizar una sección
  const renderSection = (
    title: string,
    data: Record<string, unknown> | undefined,
    fields: Array<{ key: string; label: string; labelEn: string }>
  ) => {
    if (!data || Object.keys(data).length === 0) {
      console.log(`⚠️ Sección "${title}" no tiene datos (data vacío o undefined)`);
      return;
    }

    // Crear un mapa de fields para búsqueda rápida
    const fieldsMap = new Map<string, { label: string; labelEn: string }>();
    fields.forEach(field => {
      fieldsMap.set(field.key, { label: field.label, labelEn: field.labelEn });
    });

    // Obtener todos los campos con datos (excluyendo metadatos)
    const excludedKeys = ['_id', 'medicalRecordId', 'createdAt', 'updatedAt'];
    const allDataKeys = Object.keys(data).filter(key => {
      if (excludedKeys.includes(key)) return false;
      const value = data[key];
      if (value === null || value === undefined) return false;
      // Si es string vacío, excluirlo
      if (typeof value === 'string' && value.trim() === '') return false;
      // Si es un objeto, verificar que tenga contenido
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        // Para objetos, verificar que tenga al menos una propiedad con valor
        const obj = value as Record<string, unknown>;
        return Object.keys(obj).length > 0 && 
               Object.values(obj).some(v => v !== null && v !== undefined && v !== '');
      }
      // Para otros tipos (number, boolean), siempre incluirlos si tienen valor
      return true;
    });

    // Separar campos: los que están en fields y los que no
    const fieldsInDefinition = allDataKeys.filter(key => fieldsMap.has(key));
    const fieldsNotInDefinition = allDataKeys.filter(key => !fieldsMap.has(key));

    // Contar campos con datos para mostrar progreso
    const fieldsWithData = fieldsInDefinition.length + fieldsNotInDefinition.length;
    const totalFields = fields.length;
    const completionPercentage = totalFields > 0 ? Math.round((fieldsWithData / totalFields) * 100) : 0;

    // Solo mostrar sección si tiene al menos un campo con datos
    if (fieldsWithData === 0) {
      console.log(`⚠️ Sección "${title}" tiene ${Object.keys(data).length} campos en data pero ninguno tiene valores válidos`);
      return;
    }

    console.log(`✅ Renderizando sección "${title}": ${fieldsWithData} campos con datos (${fieldsInDefinition.length} definidos, ${fieldsNotInDefinition.length} adicionales)`);

    checkPageBreak(25);
    
    // Título de sección con indicador de progreso
    yPosition += 5;
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPosition, contentWidth, 10, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const progressText = completionPercentage < 100 
      ? ` (${fieldsWithData}/${totalFields} - ${completionPercentage}%)`
      : '';
    doc.text(title + progressText, margin + 3, yPosition + 7);
    
    yPosition += 15;

    // Preparar todos los campos con sus valores y etiquetas
    const allFieldsToRender: Array<{ key: string; value: unknown; label: string }> = [];
    
    // Campos que están en la definición
    fields.forEach(field => {
      if (fieldsInDefinition.includes(field.key)) {
        const value = data[field.key];
        let label = language === 'es' ? field.label : field.labelEn;
        // Aplicar etiquetas descriptivas para PGWBI
        if (field.key.startsWith('pgwbi')) {
          label = getPgwbiLabel(field.key, language);
        }
        allFieldsToRender.push({ key: field.key, value, label });
      }
    });

    // Campos adicionales que no están en la definición
    fieldsNotInDefinition.forEach(key => {
      const value = data[key];
      let label = formatKeyAsLabel(key);
      // Aplicar etiquetas descriptivas para PGWBI
      if (key.startsWith('pgwbi')) {
        label = getPgwbiLabel(key, language);
      }
      allFieldsToRender.push({ key, value, label });
    });

    // Separar campos en dos grupos: los que pueden usar dos columnas y los que no
    const shortFields: Array<{ key: string; value: unknown; label: string }> = [];
    const longFields: Array<{ key: string; value: unknown; label: string }> = [];

    allFieldsToRender.forEach(field => {
      if (canUseTwoColumns(field.key, field.value)) {
        shortFields.push(field);
      } else {
        longFields.push(field);
      }
    });

    // Renderizar campos largos primero (una columna completa)
    longFields.forEach(field => {
      renderField(field.key, field.value, field.label);
    });

    // Renderizar campos cortos en dos columnas
    if (shortFields.length > 0) {
      const columnWidth = (contentWidth - 10) / 2; // Ancho de cada columna (con espacio entre ellas)
      const leftColumnX = margin + 5;
      const rightColumnX = margin + 5 + columnWidth + 10;
      let leftColumnY = yPosition;
      let rightColumnY = yPosition;
      let useLeftColumn = true;

      shortFields.forEach((field, index) => {
        // Verificar si necesitamos nueva página (verificar ambas columnas)
        const maxColumnY = Math.max(leftColumnY, rightColumnY);
        if (maxColumnY + 15 > pageHeight - margin - 20) {
          doc.addPage();
          leftColumnY = margin;
          rightColumnY = margin;
          yPosition = margin; // Resetear posición global también
          useLeftColumn = true;
        }

        const currentY = useLeftColumn ? leftColumnY : rightColumnY;
        const currentX = useLeftColumn ? leftColumnX : rightColumnX;
        
        // Renderizar campo (sin checkPageBreak interno ya que lo manejamos manualmente)
        yPosition = currentY;
        const fieldHeight = renderFieldSingle(field.key, field.value, field.label, currentX, columnWidth, true);
        
        // Actualizar posición de la columna correspondiente con la nueva posición
        if (useLeftColumn) {
          leftColumnY = yPosition;
        } else {
          rightColumnY = yPosition;
        }
        
        // Alternar columna para el siguiente campo
        useLeftColumn = !useLeftColumn;
      });

      // Asegurar que yPosition esté en la posición más baja después de dos columnas
      yPosition = Math.max(leftColumnY, rightColumnY);
    }
  };

  // Log de depuración
  console.log('📄 Generando PDF con datos:');
  console.log('- patientInfo:', patientData.chatbotData?.patientInfo ? Object.keys(patientData.chatbotData.patientInfo).length + ' campos' : 'sin datos');
  console.log('- surgeryInterest:', patientData.chatbotData?.surgeryInterest ? Object.keys(patientData.chatbotData.surgeryInterest).length + ' campos' : 'sin datos');
  console.log('- medicalHistory:', patientData.chatbotData?.medicalHistory ? Object.keys(patientData.chatbotData.medicalHistory).length + ' campos' : 'sin datos');
  console.log('- familyHistory:', patientData.chatbotData?.familyHistory ? Object.keys(patientData.chatbotData.familyHistory).length + ' campos' : 'sin datos');

  // Sección: Información Personal
  if (patientData.chatbotData?.patientInfo) {
    const personalFields = [
      { key: 'address', label: 'Dirección', labelEn: 'Address' },
      { key: 'addressLine', label: 'Dirección', labelEn: 'Address' },
      { key: 'city', label: 'Ciudad', labelEn: 'City' },
      { key: 'state', label: 'Estado/Provincia', labelEn: 'State/Province' },
      { key: 'country', label: 'País', labelEn: 'Country' },
      { key: 'zipcode', label: 'Código Postal', labelEn: 'Zip Code' },
      { key: 'zipCode', label: 'Código Postal', labelEn: 'Zip Code' },
      { key: 'occupation', label: 'Ocupación', labelEn: 'Occupation' },
      { key: 'employer', label: 'Empleador', labelEn: 'Employer' },
      { key: 'education', label: 'Educación', labelEn: 'Education' },
      { key: 'emergencyFirstName', label: 'Contacto de Emergencia - Nombre', labelEn: 'Emergency Contact - First Name' },
      { key: 'emergencyLastName', label: 'Contacto de Emergencia - Apellido', labelEn: 'Emergency Contact - Last Name' },
      { key: 'emergencyRelationship', label: 'Relación', labelEn: 'Relationship' },
      { key: 'emergencyPhone', label: 'Teléfono de Emergencia', labelEn: 'Emergency Phone' },
      { key: 'heightFeet', label: 'Altura (pies)', labelEn: 'Height (feet)' },
      { key: 'heightInches', label: 'Altura (pulgadas)', labelEn: 'Height (inches)' },
      { key: 'heightCm', label: 'Altura (cm)', labelEn: 'Height (cm)' },
      { key: 'weightLbs', label: 'Peso (libras)', labelEn: 'Weight (lbs)' },
      { key: 'weightKg', label: 'Peso (kg)', labelEn: 'Weight (kg)' },
      { key: 'bmi', label: 'BMI', labelEn: 'BMI' },
    ];
    
    renderSection(
      language === 'es' ? 'Información Personal' : 'Personal Information',
      patientData.chatbotData.patientInfo,
      personalFields
    );
  }

  // Sección: Interés Quirúrgico
  if (patientData.chatbotData?.surgeryInterest) {
    const surgeryFields = [
      { key: 'surgeryInterest', label: 'Interés Quirúrgico', labelEn: 'Surgery Interest' },
      { key: 'firstTimeBariatricName', label: 'Procedimiento Bariátrico Primera Vez', labelEn: 'First-time Bariatric Procedure' },
      { key: 'revisionalBariatricName', label: 'Procedimiento Bariátrico Revisional', labelEn: 'Revisional Bariatric Procedure' },
      { key: 'primaryPlasticName', label: 'Procedimiento Plástico Primario', labelEn: 'Primary Plastic Procedure' },
      { key: 'postBariatricPlasticName', label: 'Procedimiento Plástico Post-Bariátrico', labelEn: 'Post-Bariatric Plastic Procedure' },
      { key: 'highestWeight', label: 'Peso Más Alto', labelEn: 'Highest Weight' },
      { key: 'highestWeightDate', label: 'Fecha del Peso Más Alto', labelEn: 'Highest Weight Date' },
      { key: 'lowestWeight', label: 'Peso Más Bajo', labelEn: 'Lowest Weight' },
      { key: 'lowestWeightDate', label: 'Fecha del Peso Más Bajo', labelEn: 'Lowest Weight Date' },
      { key: 'currentWeight', label: 'Peso Actual', labelEn: 'Current Weight' },
      { key: 'goalWeight', label: 'Peso Meta', labelEn: 'Goal Weight' },
      { key: 'surgeryReadiness', label: 'Preparación para Cirugía', labelEn: 'Surgery Readiness' },
      { key: 'surgeonPreference', label: 'Preferencia de Cirujano', labelEn: 'Surgeon Preference' },
      { key: 'additionalProcedures', label: 'Procedimientos Adicionales', labelEn: 'Additional Procedures' },
    ];
    
    renderSection(
      language === 'es' ? 'Interés Quirúrgico e Historial de Peso' : 'Surgery Interest and Weight History',
      patientData.chatbotData.surgeryInterest,
      surgeryFields
    );
  }

  // Sección: Historial Médico
  if (patientData.chatbotData?.medicalHistory) {
    const medicalFields = [
      { key: 'sleepApnea', label: 'Apnea del Sueño', labelEn: 'Sleep Apnea' },
      { key: 'useCpap', label: 'Usa CPAP', labelEn: 'Uses CPAP' },
      { key: 'cpapDetails', label: 'Detalles CPAP', labelEn: 'CPAP Details' },
      { key: 'diabetes', label: 'Diabetes', labelEn: 'Diabetes' },
      { key: 'useInsulin', label: 'Usa Insulina', labelEn: 'Uses Insulin' },
      { key: 'highBloodPressure', label: 'Presión Arterial Alta', labelEn: 'High Blood Pressure' },
      { key: 'heartProblems', label: 'Problemas Cardíacos', labelEn: 'Heart Problems' },
      { key: 'respiratoryProblems', label: 'Problemas Respiratorios', labelEn: 'Respiratory Problems' },
      { key: 'respiratoryProblemsDetails', label: 'Detalles Problemas Respiratorios', labelEn: 'Respiratory Problems Details' },
      { key: 'medications', label: 'Medicamentos', labelEn: 'Medications' },
      { key: 'allergies', label: 'Alergias', labelEn: 'Allergies' },
      { key: 'previousSurgeries', label: 'Cirugías Previas', labelEn: 'Previous Surgeries' },
      { key: 'surgicalComplications', label: 'Complicaciones Quirúrgicas', labelEn: 'Surgical Complications' },
      { key: 'tobacco', label: 'Tabaco', labelEn: 'Tobacco' },
      { key: 'tobaccoDetails', label: 'Detalles Tabaco', labelEn: 'Tobacco Details' },
      { key: 'alcohol', label: 'Alcohol', labelEn: 'Alcohol' },
      { key: 'alcoholDetails', label: 'Detalles Alcohol', labelEn: 'Alcohol Details' },
      { key: 'drugs', label: 'Drogas', labelEn: 'Drugs' },
      { key: 'drugsDetails', label: 'Detalles Drogas', labelEn: 'Drugs Details' },
      { key: 'depression', label: 'Depresión', labelEn: 'Depression' },
      { key: 'anxiety', label: 'Ansiedad', labelEn: 'Anxiety' },
      { key: 'psychiatricMedications', label: 'Medicamentos Psiquiátricos', labelEn: 'Psychiatric Medications' },
      { key: 'otherMedicalConditions', label: 'Otras Condiciones Médicas', labelEn: 'Other Medical Conditions' },
    ];
    
    renderSection(
      language === 'es' ? 'Historial Médico' : 'Medical History',
      patientData.chatbotData.medicalHistory,
      medicalFields
    );
  }

  // Sección: Historial Familiar
  if (patientData.chatbotData?.familyHistory) {
    const familyFields = [
      { key: 'heartDisease', label: 'Enfermedad Cardíaca', labelEn: 'Heart Disease' },
      { key: 'diabetesMellitus', label: 'Diabetes Mellitus', labelEn: 'Diabetes Mellitus' },
      { key: 'highBloodPressure', label: 'Presión Arterial Alta', labelEn: 'High Blood Pressure' },
      { key: 'cancer', label: 'Cáncer', labelEn: 'Cancer' },
      { key: 'otherFamilyConditions', label: 'Otras Condiciones Familiares', labelEn: 'Other Family Conditions' },
    ];
    
    renderSection(
      language === 'es' ? 'Historial Familiar' : 'Family History',
      patientData.chatbotData.familyHistory,
      familyFields
    );
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerText = language === 'es'
    ? 'Documento confidencial - Expediente Médico zplendid'
    : 'Confidential document - zplendid Medical Record';
  doc.text(footerText, pageWidth / 2, footerY + 7, { align: 'center' });

  return doc;
}

