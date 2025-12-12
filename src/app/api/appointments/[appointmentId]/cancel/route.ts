import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../../lib/models/Appointment';
import { PatientRecordModel } from '../../../../../lib/models/PatientRecord';

/**
 * PUT /api/appointments/[appointmentId]/cancel - Cancelar cita
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
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
        { success: false, message: 'Solo los pacientes pueden cancelar sus citas' },
        { status: 403 }
      );
    }

    const appointmentId = parseInt(params.appointmentId);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, message: 'ID de cita inválido' },
        { status: 400 }
      );
    }

    // Verificar que la cita pertenece al paciente
    const patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      return NextResponse.json(
        { success: false, message: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    if (appointment.patientId !== patientRecord.patientId) {
      return NextResponse.json(
        { success: false, message: 'No tienes permiso para cancelar esta cita' },
        { status: 403 }
      );
    }

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Esta cita ya está cancelada o completada' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const reason = body.reason || 'Cancelada por el paciente';

    await AppointmentModel.cancel(appointmentId, reason);

    return NextResponse.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al cancelar cita:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
