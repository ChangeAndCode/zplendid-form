import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../lib/models/Appointment';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';

/**
 * GET /api/doctor/appointments - Obtener citas del doctor
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
    
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Verificar que el doctor esté aprobado
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

    const doctorId = doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id;

    // Obtener filtros opcionales
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    let appointments;

    if (startDate && endDate) {
      appointments = await AppointmentModel.findByDateRange(
        doctorId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      appointments = await AppointmentModel.findByDoctorId(doctorId);
    }

    // Filtrar por estado si se proporciona
    if (status) {
      appointments = appointments.filter(a => a.status === status);
    }

    return NextResponse.json({
      success: true,
      data: appointments
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener citas del doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
