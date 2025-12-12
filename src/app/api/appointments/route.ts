import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../lib/utils/jwt';
import { AppointmentModel } from '../../../lib/models/Appointment';
import { PatientRecordModel } from '../../../lib/models/PatientRecord';
import { AppointmentCreate } from '../../../lib/types/appointments';
import { validateAppointmentTime } from '../../../lib/utils/appointmentHelpers';

/**
 * POST /api/appointments - Crear nueva cita
 */
export async function POST(request: NextRequest) {
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
    
    // Solo pacientes pueden agendar citas
    if (decoded.role !== 'user') {
      return NextResponse.json(
        { success: false, message: 'Solo los pacientes pueden agendar citas' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const appointmentData: AppointmentCreate = body;

    // Validaciones
    if (!appointmentData.doctorId || !appointmentData.specialty || !appointmentData.appointmentDate) {
      return NextResponse.json(
        { success: false, message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Validar que la fecha no sea en el pasado
    const appointmentDate = new Date(appointmentData.appointmentDate);
    if (!validateAppointmentTime(appointmentDate)) {
      return NextResponse.json(
        { success: false, message: 'No se pueden agendar citas en el pasado' },
        { status: 400 }
      );
    }

    // Obtener patientId
    const patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      return NextResponse.json(
        { success: false, message: 'Expediente de paciente no encontrado' },
        { status: 404 }
      );
    }

    // Crear cita
    const appointment = await AppointmentModel.create(
      appointmentData,
      decoded.userId,
      patientRecord.patientId
    );

    return NextResponse.json({
      success: true,
      message: 'Cita agendada exitosamente',
      data: appointment
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear cita:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
