import { NextRequest, NextResponse } from 'next/server';
import { AppointmentModel } from '../../../../lib/models/Appointment';
import { DoctorScheduleModel } from '../../../../lib/models/DoctorSchedule';
import { DoctorAvailabilityModel } from '../../../../lib/models/DoctorAvailability';
import { generateTimeSlots, isTimeInRange } from '../../../../lib/utils/appointmentHelpers';

/**
 * GET /api/appointments/available-slots - Obtener horarios disponibles de un doctor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const duration = searchParams.get('duration') || '30';

    if (!doctorId || !date) {
      return NextResponse.json(
        { success: false, message: 'doctorId y date son requeridos' },
        { status: 400 }
      );
    }

    const doctorIdNum = parseInt(doctorId);
    const durationNum = parseInt(duration);
    
    // Asegurar que la fecha esté en formato correcto
    const dateStr = date.split('T')[0]; // Obtener solo la parte de la fecha
    const selectedDate = new Date(dateStr + 'T00:00:00'); // Agregar hora para evitar problemas de zona horaria

    // Verificar que no sea en el pasado
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (selectedDate < now) {
      return NextResponse.json({
        success: true,
        data: []
      }, { status: 200 });
    }

    // Obtener horario del día de la semana
    const dayOfWeek = selectedDate.getDay();
    console.log(`Buscando horarios para doctor ${doctorIdNum}, día de la semana ${dayOfWeek} (0=Domingo, 6=Sábado)`);
    
    const schedules = await DoctorScheduleModel.findByDoctorId(doctorIdNum);
    console.log(`Total de horarios encontrados para el doctor: ${schedules.length}`);
    schedules.forEach(s => {
      console.log(`  - Día ${s.dayOfWeek}: ${s.startTime} - ${s.endTime}, Disponible: ${s.isAvailable}`);
    });
    
    const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isAvailable);

    if (!daySchedule) {
      console.log(`No se encontró horario disponible para el día ${dayOfWeek}`);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return NextResponse.json({
        success: true,
        data: [],
        message: `No hay horario configurado para ${dayNames[dayOfWeek]}. Por favor configura horarios en tu panel de doctor.`
      }, { status: 200 });
    }
    
    console.log(`Horario encontrado para el día ${dayOfWeek}: ${daySchedule.startTime} - ${daySchedule.endTime}`);

    // Obtener disponibilidad específica del día
    const availabilities = await DoctorAvailabilityModel.findByDateRange(
      doctorIdNum,
      selectedDate,
      new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000 - 1) // Fin del día
    );
    const dayAvailability = availabilities.find(a => {
      const aDate = new Date(a.date);
      aDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(selectedDate);
      compareDate.setHours(0, 0, 0, 0);
      return aDate.getTime() === compareDate.getTime();
    });

    // Si hay disponibilidad específica que indica no disponible
    if (dayAvailability && !dayAvailability.isAvailable) {
      return NextResponse.json({
        success: true,
        data: []
      }, { status: 200 });
    }

    // Usar horario específico si existe, sino el horario semanal
    const startTime = dayAvailability?.startTime || daySchedule.startTime;
    const endTime = dayAvailability?.endTime || daySchedule.endTime;

    // Generar slots
    const allSlots = generateTimeSlots(startTime, endTime, durationNum);
    console.log(`Horario base: ${startTime} - ${endTime}, Duración: ${durationNum} min`);
    console.log(`Slots generados: ${allSlots.length}`, allSlots);

    if (allSlots.length === 0) {
      console.log('No se generaron slots. Verificar horarios de inicio y fin.');
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No se pudieron generar horarios. Verifica que el horario de inicio sea menor al de fin.'
      }, { status: 200 });
    }

    // Verificar disponibilidad de cada slot
    const availableSlots: string[] = [];
    console.log(`Verificando disponibilidad de ${allSlots.length} slots...`);
    
    for (const slot of allSlots) {
      try {
        const slotDateTime = new Date(selectedDate);
        const [hour, minute] = slot.split(':').map(Number);
        slotDateTime.setHours(hour, minute, 0, 0);

        // Verificar que no sea en el pasado
        if (slotDateTime < new Date()) {
          continue;
        }

        // Verificar disponibilidad real
        const isAvailable = await AppointmentModel.checkAvailability(
          doctorIdNum,
          slotDateTime,
          durationNum
        );

        if (isAvailable) {
          availableSlots.push(slot);
        }
      } catch (slotError) {
        console.error(`Error verificando slot ${slot}:`, slotError);
        // Continuar con el siguiente slot
      }
    }

    console.log(`Slots disponibles encontrados: ${availableSlots.length}`);

    return NextResponse.json({
      success: true,
      data: availableSlots
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
