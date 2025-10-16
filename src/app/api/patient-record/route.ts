import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../lib/models/PatientRecord';
import { JWTUtils } from '../../../lib/utils/jwt';
import { UserModel } from '../../../lib/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Endpoint /api/patient-record llamado');
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      console.log('❌ No hay token en la petición');
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    console.log('🔍 Token encontrado, verificando...');
    const payload = JWTUtils.verifyToken(token);
    console.log('🔍 Token verificado, userId:', payload.userId);
    
    const user = await UserModel.findById(payload.userId);
    console.log('🔍 Usuario encontrado:', user ? `${user.firstName} ${user.lastName}` : 'No encontrado');

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar expediente existente
    console.log('🔍 Buscando expediente existente...');
    let patientRecord = await PatientRecordModel.findByUserId(user.id);
    console.log('🔍 Expediente existente:', patientRecord ? `ID: ${patientRecord.patientId}` : 'No encontrado');

    // Si no existe, crear uno nuevo
    if (!patientRecord) {
      console.log('🔍 Creando nuevo expediente...');
      patientRecord = await PatientRecordModel.create(user.id);
      console.log('✅ Expediente creado:', patientRecord.patientId);
    }

    console.log('✅ Devolviendo Patient ID:', patientRecord.patientId);
    return NextResponse.json(
      {
        success: true,
        patientId: patientRecord.patientId,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error al obtener expediente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
