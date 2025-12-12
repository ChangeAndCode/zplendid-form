import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AppointmentModel } from '../../../../lib/models/Appointment';
import { getCollection, getDatabase } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';

/**
 * GET /api/doctor/patients - Obtener lista de pacientes del doctor
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

    // Obtener todas las citas del doctor para extraer pacientes únicos
    const appointments = await AppointmentModel.findByDoctorId(doctorId);
    const patientIds = [...new Set(appointments.map(a => a.patientId))];

    // Obtener información de los pacientes
    const db = await getDatabase();
    const patients = await db.collection('patient_records').aggregate([
      { $match: { patientId: { $in: patientIds } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          patientId: 1,
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email'
        }
      }
    ]).toArray();

    // Agregar conteo de citas por paciente
    const patientsWithCounts = patients.map((patient: any) => {
      const appointmentCount = appointments.filter(a => a.patientId === patient.patientId).length;
      return {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        appointmentCount
      };
    });

    return NextResponse.json({
      success: true,
      data: patientsWithCounts
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
