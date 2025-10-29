import { NextRequest, NextResponse } from 'next/server';
import { DataMappingService } from '../../../lib/services/DataMappingService';

interface QuestionData {
  id: string;
  category: string;
  questionText: string;
  expectedResponseType: 'text' | 'yesno' | 'select' | 'number' | 'date';
  options?: string[];
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { questions }: { questions: QuestionData[] } = await request.json();

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid questions format' },
        { status: 400 }
      );
    }

    // Registrar las preguntas en el servicio de mapeo
    const mappings = questions.map(q => ({
      id: q.id,
      mapping: {
        fieldName: q.id as any, // Se mapeará correctamente cuando se implemente
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
      message: `Registered ${questions.length} questions successfully`,
      registeredQuestions: questions.length
    });

  } catch (error) {
    console.error('Error registering questions:', error);
    return NextResponse.json(
      { error: 'Failed to register questions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let questions;
    
    if (category) {
      questions = DataMappingService.getQuestionsByCategory(category);
    } else {
      // Retornar todas las preguntas registradas
      questions = Array.from(DataMappingService['questionMappings'].entries())
        .map(([id, mapping]) => ({ id, mapping }));
    }

    return NextResponse.json({
      success: true,
      questions: questions.map(({ id, mapping }) => ({
        id,
        category: mapping.category,
        questionText: mapping.questionText,
        expectedResponseType: mapping.expectedResponseType,
        options: mapping.options,
        validationRules: mapping.validationRules
      }))
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
