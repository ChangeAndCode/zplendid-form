import { NextRequest, NextResponse } from 'next/server';
import { DataMappingService } from '../../../lib/services/DataMappingService';
import { patientInfoQuestions } from '../../../lib/data/patient-questions';

export async function POST(request: NextRequest) {
  try {
    // Registrar las preguntas de información del paciente
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

    return NextResponse.json({
      success: true,
      message: `Registered ${patientInfoQuestions.length} patient information questions`,
      questions: patientInfoQuestions.map(q => ({
        id: q.id,
        category: q.category,
        questionText: q.questionText
      }))
    });

  } catch (error) {
    console.error('Error registering patient questions:', error);
    return NextResponse.json(
      { error: 'Failed to register questions' },
      { status: 500 }
    );
  }
}
