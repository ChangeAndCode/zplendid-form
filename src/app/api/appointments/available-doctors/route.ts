import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/config/database';
import { AvailableDoctor } from '../../../../lib/types/appointments';

/**
 * GET /api/appointments/available-doctors - Obtener doctores disponibles por especialidad
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');

    if (!specialty) {
      return NextResponse.json(
        { success: false, message: 'Especialidad requerida' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Mapeo de especialidades del formulario a especialidades en la base de datos
    const specialtyMapping: Record<string, string[]> = {
      'First-time Bariatric Surgery': ['Cirugía Bariátrica', 'Bariatric Surgery', 'First-time Bariatric Surgery', 'Cirugía Bariátrica Primera vez'],
      'Revisional Bariatric Surgery': ['Cirugía Bariátrica Revisional', 'Revisional Bariatric Surgery', 'Bariatric Surgery Revisional', 'Cirugía Bariátrica Revisión'],
      'Primary Plastic Surgery': ['Cirugía Plástica', 'Plastic Surgery', 'Primary Plastic Surgery', 'Cirugía Plástica Primaria'],
      'Post Bariatric Plastic Surgery': ['Cirugía Plástica Post-Bariátrica', 'Post Bariatric Plastic Surgery', 'Post-Bariatric Plastic Surgery', 'Cirugía Plástica Post Bariátrica'],
      'Metabolic Rehab': ['Rehabilitación Metabólica', 'Metabolic Rehab', 'Metabolic Rehabilitation']
    };

    // Obtener términos de búsqueda para la especialidad
    const searchTerms = specialtyMapping[specialty] || [specialty];

    // Construir condiciones de búsqueda más flexibles
    const matchConditions: any[] = [];
    
    // Para cada término de búsqueda, crear múltiples condiciones
    searchTerms.forEach(term => {
      // 1. Coincidencia exacta en array
      matchConditions.push({ specialties: term });
      
      // 2. Coincidencia exacta con $in (para arrays)
      matchConditions.push({ specialties: { $in: [term] } });
      
      // 3. Regex en elementos del array
      matchConditions.push({
        specialties: {
          $elemMatch: {
            $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // Escapar caracteres especiales
            $options: 'i'
          }
        }
      });
      
      // 4. Regex directo (por si specialties es string)
      matchConditions.push({
        specialties: {
          $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          $options: 'i'
        }
      });
    });
    
    console.log(`Buscando doctores con especialidad: "${specialty}"`);
    console.log(`Términos de búsqueda:`, searchTerms);
    console.log(`Total de condiciones: ${matchConditions.length}`);

    // Buscar doctores aprobados con la especialidad (sin filtrar por isActive)
    const doctors = await db.collection('doctors').aggregate([
      {
        $match: {
          isApproved: true,
          $or: matchConditions
        }
      },
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
          _id: 1,
          userId: 1,
          specialties: 1,
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email'
        }
      }
    ]).toArray();

    console.log(`Doctores encontrados: ${doctors.length}`);
    doctors.forEach((d: any) => {
      console.log(`- Doctor: ${d.firstName} ${d.lastName}, Especialidades:`, d.specialties);
    });

    const availableDoctors: AvailableDoctor[] = doctors.map((doctor: any) => {
      let specialtiesArray: string[] = [];
      try {
        specialtiesArray = typeof doctor.specialties === 'string' 
          ? JSON.parse(doctor.specialties) 
          : (Array.isArray(doctor.specialties) ? doctor.specialties : []);
      } catch {
        specialtiesArray = doctor.specialties ? [String(doctor.specialties)] : [];
      }

      return {
        id: doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id,
        doctorId: doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : doctor.id,
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        email: doctor.email || '',
        specialties: specialtiesArray
      };
    });

    return NextResponse.json({
      success: true,
      data: availableDoctors
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener doctores:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
