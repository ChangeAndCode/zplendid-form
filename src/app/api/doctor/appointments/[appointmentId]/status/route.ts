import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../../lib/models/Appointment';
import { getCollection } from '../../../../../lib/config/database';
import { ObjectId } from 'mongodb';
import { AppointmentStatus } from '../../../../../lib/types/appointments';

/**
 * PUT /api/doctor/appointments/[appointmentId]/status - Actualizar estado de cita
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
    
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado' },
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

    const body = await request.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Estado requerido' },
        { status: 400 }
      );
    }

    const validStatuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Verificar que el doctor tenga acceso
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      const userId = d.userId instanceof ObjectId ? parseInt(d.userId.toString().slice(-8), 16) : d.userId;
      return userId === decoded.userId;
    });

    if (!doctor || !doctor.isApproved) {
      return NextResponse.json(
        { success: false, message: 'Doctor no aprobado' },
        { status: 403 }
      );
    }

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    const doctorId = doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id;
    if (appointment.doctorId !== doctorId) {
      return NextResponse.json(
        { success: false, message: 'No tienes permiso para modificar esta cita' },
        { status: 403 }
      );
    }

    await AppointmentModel.updateStatus(appointmentId, status, notes);

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado exitosamente'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al actualizar estado:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
