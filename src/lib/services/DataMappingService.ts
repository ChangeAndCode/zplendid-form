import { HealthFormData } from '../../app/hooks/useHealthForm';

interface QuestionMapping {
  fieldName: keyof HealthFormData;
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

export class DataMappingService {
  private static questionMappings: Map<string, QuestionMapping> = new Map();

  /**
   * Registrar una pregunta del cuestionario
   */
  static registerQuestion(
    questionId: string,
    mapping: QuestionMapping
  ): void {
    this.questionMappings.set(questionId, mapping);
  }

  /**
   * Registrar múltiples preguntas
   */
  static registerQuestions(mappings: Array<{id: string, mapping: QuestionMapping}>): void {
    mappings.forEach(({ id, mapping }) => {
      this.questionMappings.set(id, mapping);
    });
  }

  /**
   * Obtener mapeo de una pregunta
   */
  static getQuestionMapping(questionId: string): QuestionMapping | null {
    return this.questionMappings.get(questionId) || null;
  }

  /**
   * Obtener todas las preguntas de una categoría
   */
  static getQuestionsByCategory(category: string): Array<{id: string, mapping: QuestionMapping}> {
    const questions: Array<{id: string, mapping: QuestionMapping}> = [];
    
    for (const [id, mapping] of this.questionMappings.entries()) {
      if (mapping.category === category) {
        questions.push({ id, mapping });
      }
    }
    
    return questions;
  }

  /**
   * Procesar respuesta del usuario y extraer datos
   */
  static processUserResponse(
    questionId: string,
    userResponse: string,
    currentFormData: Partial<HealthFormData> = {}
  ): {
    success: boolean;
    extractedValue?: any;
    fieldName?: keyof HealthFormData;
    error?: string;
    needsFollowUp?: boolean;
    followUpQuestion?: string;
  } {
    const mapping = this.questionMappings.get(questionId);
    if (!mapping) {
      return {
        success: false,
        error: 'Question mapping not found'
      };
    }

    try {
      const extractedValue = this.extractValueFromResponse(
        userResponse,
        mapping.expectedResponseType,
        mapping.options
      );

      // Validar respuesta
      const validation = this.validateResponse(extractedValue, mapping.validationRules);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          needsFollowUp: true,
          followUpQuestion: this.generateFollowUpQuestion(mapping, validation.error)
        };
      }

      return {
        success: true,
        extractedValue,
        fieldName: mapping.fieldName
      };

    } catch (error) {
      return {
        success: false,
        error: 'Error processing response',
        needsFollowUp: true,
        followUpQuestion: `No pude entender tu respuesta. ${mapping.questionText}`
      };
    }
  }

  /**
   * Extraer valor de la respuesta del usuario
   */
  private static extractValueFromResponse(
    response: string,
    expectedType: string,
    options?: string[]
  ): any {
    const cleanResponse = response.toLowerCase().trim();

    switch (expectedType) {
      case 'yesno':
        if (cleanResponse.includes('sí') || cleanResponse.includes('si') || cleanResponse.includes('yes')) {
          return 'yes';
        } else if (cleanResponse.includes('no') || cleanResponse.includes('none')) {
          return 'no';
        }
        return cleanResponse;

      case 'select':
        if (options) {
          const matchedOption = options.find(option => 
            cleanResponse.includes(option.toLowerCase())
          );
          return matchedOption || cleanResponse;
        }
        return cleanResponse;

      case 'number':
        const numberMatch = cleanResponse.match(/\d+/);
        return numberMatch ? parseInt(numberMatch[0]) : cleanResponse;

      case 'date':
        // Buscar patrones de fecha
        const dateMatch = cleanResponse.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (dateMatch) {
          return `${dateMatch[3]}-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`;
        }
        return cleanResponse;

      case 'text':
      default:
        return cleanResponse;
    }
  }

  /**
   * Validar respuesta extraída
   */
  private static validateResponse(
    value: any,
    rules?: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp }
  ): { isValid: boolean; error?: string } {
    if (!rules) return { isValid: true };

    if (rules.required && (!value || value.toString().trim() === '')) {
      return { isValid: false, error: 'Esta información es requerida' };
    }

    if (rules.minLength && value.toString().length < rules.minLength) {
      return { isValid: false, error: `La respuesta debe tener al menos ${rules.minLength} caracteres` };
    }

    if (rules.maxLength && value.toString().length > rules.maxLength) {
      return { isValid: false, error: `La respuesta no puede exceder ${rules.maxLength} caracteres` };
    }

    if (rules.pattern && !rules.pattern.test(value.toString())) {
      return { isValid: false, error: 'El formato de la respuesta no es válido' };
    }

    return { isValid: true };
  }

  /**
   * Generar pregunta de seguimiento
   */
  private static generateFollowUpQuestion(
    mapping: QuestionMapping,
    error: string
  ): string {
    return `${error}. Por favor, ${mapping.questionText.toLowerCase()}`;
  }

  /**
   * Mapear datos extraídos al formulario completo
   */
  static mapToFormData(
    extractedData: Record<string, any>
  ): Partial<HealthFormData> {
    const formData: Partial<HealthFormData> = {};

    for (const [questionId, value] of Object.entries(extractedData)) {
      const mapping = this.questionMappings.get(questionId);
      if (mapping && mapping.fieldName) {
        (formData as any)[mapping.fieldName] = value;
      }
    }

    return formData;
  }

  /**
   * Obtener estadísticas de completitud
   */
  static getCompletenessStats(
    extractedData: Record<string, any>,
    category?: string
  ): {
    totalQuestions: number;
    answeredQuestions: number;
    completenessPercentage: number;
    missingQuestions: string[];
  } {
    const questions = category 
      ? this.getQuestionsByCategory(category)
      : Array.from(this.questionMappings.entries()).map(([id, mapping]) => ({ id, mapping }));

    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(({ id }) => 
      extractedData[id] !== undefined && extractedData[id] !== ''
    ).length;

    const missingQuestions = questions
      .filter(({ id, mapping }) => {
        const value = extractedData[id];
        return !value || value === '' || (mapping.validationRules?.required && !value);
      })
      .map(({ mapping }) => mapping.questionText);

    const completenessPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

    return {
      totalQuestions,
      answeredQuestions,
      completenessPercentage,
      missingQuestions
    };
  }
}
