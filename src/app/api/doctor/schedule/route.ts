import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { DoctorScheduleModel } from '../../../../lib/models/DoctorSchedule';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';
import { DoctorScheduleCreate } from '../../../../lib/types/appointments';

/**
 * GET /api/doctor/schedule - Obtener horarios del doctor
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
    const schedules = await DoctorScheduleModel.findByDoctorId(doctorId);

    return NextResponse.json({
      success: true,
      data: schedules
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/doctor/schedule - Crear/actualizar horarios del doctor
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
    const scheduleData: DoctorScheduleCreate = body;

    // Validar datos básicos
    if (scheduleData.dayOfWeek === undefined || scheduleData.dayOfWeek === null) {
      return NextResponse.json(
        { success: false, message: 'Día de la semana requerido' },
        { status: 400 }
      );
    }

    // Si está disponible, se requieren horarios
    if (scheduleData.isAvailable) {
      if (!scheduleData.startTime || !scheduleData.endTime) {
        return NextResponse.json(
          { success: false, message: 'Horarios requeridos cuando el día está disponible' },
          { status: 400 }
        );
      }
    } else {
      // Si no está disponible, usar valores por defecto
      scheduleData.startTime = scheduleData.startTime || '09:00';
      scheduleData.endTime = scheduleData.endTime || '17:00';
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
    const schedule = await DoctorScheduleModel.upsert(doctorId, scheduleData);

    return NextResponse.json({
      success: true,
      message: 'Horario actualizado exitosamente',
      data: schedule
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al actualizar horario:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
