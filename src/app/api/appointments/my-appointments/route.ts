import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../lib/models/Appointment';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';

/**
 * GET /api/appointments/my-appointments - Obtener citas del paciente
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    
    if (decoded.role !== 'user') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener patientId
    const patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      return NextResponse.json({
        success: true,
        data: []
      }, { status: 200 });
    }

    const appointments = await AppointmentModel.findByPatientId(patientRecord.patientId);

    return NextResponse.json({
      success: true,
      data: appointments
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
