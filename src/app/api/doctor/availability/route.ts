import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { DoctorAvailabilityModel } from '../../../../lib/models/DoctorAvailability';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';
import { DoctorAvailabilityCreate } from '../../../../lib/types/appointments';

/**
 * GET /api/doctor/availability - Obtener disponibilidades del doctor
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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Obtener doctorId
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      const userId = d.userId instanceof ObjectId ? parseInt(d.userId.toString().slice(-8), 16) : d.userId;
      return userId === decoded.userId;
    });

    if (!doctor || !doctor._id) {
      return NextResponse.json(
        { success: false, message: 'Doctor no encontrado' },
        { status: 404 }
      );
    }

    const doctorId = doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id;

    let availabilities;
    if (startDate && endDate) {
      availabilities = await DoctorAvailabilityModel.findByDateRange(
        doctorId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      availabilities = await DoctorAvailabilityModel.findByDoctorId(doctorId);
    }

    return NextResponse.json({
      success: true,
      data: availabilities
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener disponibilidades:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/doctor/availability - Crear disponibilidad específica
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
    
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const availabilityData: DoctorAvailabilityCreate = body;

    if (!availabilityData.date || !availabilityData.startTime || !availabilityData.endTime) {
      return NextResponse.json(
        { success: false, message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Obtener doctorId
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      const userId = d.userId instanceof ObjectId ? parseInt(d.userId.toString().slice(-8), 16) : d.userId;
      return userId === decoded.userId;
    });

    if (!doctor || !doctor._id) {
      return NextResponse.json(
        { success: false, message: 'Doctor no encontrado' },
        { status: 404 }
      );
    }

    const doctorId = doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id;
    const availability = await DoctorAvailabilityModel.create(doctorId, availabilityData);

    return NextResponse.json({
      success: true,
      message: 'Disponibilidad creada exitosamente',
      data: availability
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear disponibilidad:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
