/**
 * API endpoint para guardar datos del chatbot en MongoDB
 * NO modifica código existente - nueva funcionalidad para chatbot
 */

import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { ChatbotDataSaver } from '../../../../lib/services/ChatbotDataSaver';
import ChatSessionService from '../../../../lib/services/ChatSessionService';
import { ChatbotExtractedData } from '../../../../lib/services/ChatbotDataMapper';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    const userId = decoded.userId;

    // Validar userId
    if (!userId || typeof userId !== 'number') {
      return NextResponse.json(
        { success: false, message: 'userId inválido en el token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, extractedData } = body as {
      sessionId?: string;
      extractedData?: ChatbotExtractedData;
    };

    // Validar que tenemos datos para guardar
    if (!sessionId && !extractedData) {
      return NextResponse.json(
        { success: false, message: 'Se requiere sessionId o extractedData' },
        { status: 400 }
      );
    }

    let dataToSave: ChatbotExtractedData = {};

    // Si tenemos sessionId, obtener datos de la sesión
    if (sessionId) {
      if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'sessionId inválido' },
          { status: 400 }
        );
      }

      const chatSessionService = new ChatSessionService();
      const session = await chatSessionService.getSession(sessionId);
      
      if (!session) {
        return NextResponse.json(
          { success: false, message: 'Sesión de chat no encontrada' },
          { status: 404 }
        );
      }

      dataToSave = session.extractedData || {};
    } else if (extractedData) {
      // Validar que extractedData sea un objeto
      if (typeof extractedData !== 'object' || Array.isArray(extractedData)) {
        return NextResponse.json(
          { success: false, message: 'extractedData debe ser un objeto válido' },
          { status: 400 }
        );
      }
      // Si tenemos extractedData directamente, usarlo
      dataToSave = extractedData;
    }

    // Guardar datos usando el servicio
    const result = await ChatbotDataSaver.saveChatbotData(userId, dataToSave);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          patientId: result.patientId,
          medicalRecordId: result.medicalRecordId,
          savedTables: result.savedTables
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al guardar datos del chatbot:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para verificar el estado del servicio
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Endpoint para guardar datos del chatbot en MongoDB',
      method: 'POST',
      status: 'active',
      description: 'Guarda datos extraídos del chatbot en las mismas tablas que usa el formulario tradicional'
    },
    { status: 200 }
  );
}

