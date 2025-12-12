import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { DoctorAvailabilityModel } from '../../../../../lib/models/DoctorAvailability';
import { getCollection } from '../../../../../lib/config/database';
import { ObjectId } from 'mongodb';
import { DoctorAvailabilityCreate } from '../../../../../lib/types/appointments';

/**
 * DELETE /api/doctor/availability/[availabilityId] - Eliminar disponibilidad
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { availabilityId: string } }
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

    const availabilityId = parseInt(params.availabilityId);
    if (isNaN(availabilityId)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar que la disponibilidad pertenece al doctor
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

    await DoctorAvailabilityModel.delete(availabilityId);

    return NextResponse.json({
      success: true,
      message: 'Disponibilidad eliminada exitosamente'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al eliminar disponibilidad:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
