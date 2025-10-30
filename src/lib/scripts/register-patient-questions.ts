import { DataMappingService } from '../services/DataMappingService';
import { patientInfoQuestions } from '../data/patient-questions';

async function registerPatientQuestions() {
  try {
    console.log('🚀 Registrando preguntas de información del paciente...');
    
    const mappings = patientInfoQuestions.map(q => ({
      id: q.id,
      mapping: {
        fieldName: q.fieldName,
        category: q.category,
        questionText: q.questionText,
        expectedResponseType: q.expectedResponseType,
        options: q.options,
        validationRules: q.validationRules
      }
    }));

    DataMappingService.registerQuestions(mappings);

    console.log('✅ Preguntas registradas exitosamente:');
    patientInfoQuestions.forEach(q => {
      console.log(`   - ${q.id}: ${q.questionText}`);
    });

    console.log(`\n📊 Total: ${patientInfoQuestions.length} preguntas registradas`);
    console.log('🎯 Categoría: Información Personal');
    
  } catch (error) {
    console.error('❌ Error registrando preguntas:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  registerPatientQuestions();
}

export { registerPatientQuestions };
