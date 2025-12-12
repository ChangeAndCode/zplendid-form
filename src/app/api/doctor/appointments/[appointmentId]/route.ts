import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../../../lib/models/Appointment';
import { getCollection } from '../../../../../../lib/config/database';
import { ObjectId } from 'mongodb';

/**
 * GET /api/doctor/appointments/[appointmentId] - Obtener detalles de una cita
 */
export async function GET(
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

    // Verificar que el doctor tenga acceso a esta cita
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
        { success: false, message: 'No tienes permiso para ver esta cita' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: appointment
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener cita:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
