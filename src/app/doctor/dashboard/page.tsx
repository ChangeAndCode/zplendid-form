'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppointmentResponse } from '../../../lib/types/appointments';
import { formatAppointmentDate } from '../../../lib/utils/appointmentHelpers';

export default function DoctorDashboard() {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [todayAppointments, setTodayAppointments] = useState<AppointmentResponse[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentResponse[]>([]);
  const [totalUpcomingCount, setTotalUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'doctor') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && token && user?.role === 'doctor') {
      loadAppointments();
    }
  }, [isAuthenticated, token, user]);

  const loadAppointments = async () => {
    try {
      // Cargar todas las citas (sin filtro de fecha para obtener todas las futuras)
      const response = await fetch(
        `/api/doctor/appointments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        const appointments = data.data || [];
        
        // Fecha de hoy (inicio del día)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filtrar citas de hoy (que no estén canceladas)
        const todayApts = appointments.filter((apt: AppointmentResponse) => {
          const aptDate = new Date(apt.appointmentDate);
          // Normalizar para comparar solo la fecha
          const aptDateOnly = new Date(aptDate);
          aptDateOnly.setHours(0, 0, 0, 0);
          const todayOnly = new Date(today);
          todayOnly.setHours(0, 0, 0, 0);
          
          const isToday = aptDateOnly.getTime() === todayOnly.getTime() && apt.status !== 'cancelled';
          return isToday;
        });
        setTodayAppointments(todayApts);
        console.log(`Citas de hoy: ${todayApts.length}`);

        // Filtrar próximas citas (después de hoy, no canceladas, ordenadas por fecha)
        const allUpcoming = appointments
          .filter((apt: AppointmentResponse) => {
            const aptDate = new Date(apt.appointmentDate);
            // Normalizar fechas para comparación (solo fecha, sin hora)
            const aptDateOnly = new Date(aptDate);
            aptDateOnly.setHours(0, 0, 0, 0);
            const todayOnly = new Date(today);
            todayOnly.setHours(0, 0, 0, 0);
            
            // Es próxima si la fecha es mayor que hoy (ignorando la hora) y no está cancelada
            const isUpcoming = aptDateOnly > todayOnly && apt.status !== 'cancelled';
            return isUpcoming;
          })
          .sort((a: AppointmentResponse, b: AppointmentResponse) => {
            const dateA = new Date(a.appointmentDate).getTime();
            const dateB = new Date(b.appointmentDate).getTime();
            return dateA - dateB;
          });
        
        console.log(`Total de próximas citas: ${allUpcoming.length}`);
        
        // Contar todas las próximas
        setTotalUpcomingCount(allUpcoming.length);
        
        // Mostrar solo las primeras 5
        setUpcomingAppointments(allUpcoming.slice(0, 5));
      }
    } catch (err) {
      console.error('Error al cargar citas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { es: string; en: string }> = {
      scheduled: { es: 'Programada', en: 'Scheduled' },
      confirmed: { es: 'Confirmada', en: 'Confirmed' },
      completed: { es: 'Completada', en: 'Completed' },
      cancelled: { es: 'Cancelada', en: 'Cancelled' }
    };
    return statusMap[status]?.[language === 'es' ? 'es' : 'en'] || status;
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212e5c] mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
            <span className="ml-4 px-3 py-1 bg-[#212e5c] text-white text-sm rounded-full">
              {language === 'es' ? 'Panel de Doctor' : 'Doctor Panel'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {language === 'es' ? 'Hola,' : 'Hello,'} {user.firstName}
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-3xl font-bold text-[#212e5c] mb-8">
          {language === 'es' ? 'Panel de Control' : 'Dashboard'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {language === 'es' ? 'Citas de Hoy' : 'Today\'s Appointments'}
            </h3>
            <p className="text-3xl font-bold text-[#212e5c]">{todayAppointments.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {language === 'es' ? 'Próximas Citas' : 'Upcoming Appointments'}
            </h3>
            <p className="text-3xl font-bold text-[#212e5c]">{totalUpcomingCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
            </h3>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => router.push('/doctor/appointments')}
                className="text-left text-[#212e5c] hover:text-[#1a2347] font-medium"
              >
                → {language === 'es' ? 'Ver Agenda Completa' : 'View Full Schedule'}
              </button>
              <button
                onClick={() => router.push('/doctor/schedule')}
                className="text-left text-[#212e5c] hover:text-[#1a2347] font-medium"
              >
                → {language === 'es' ? 'Configurar Horarios' : 'Configure Schedule'}
              </button>
              <button
                onClick={() => router.push('/doctor/patients')}
                className="text-left text-[#212e5c] hover:text-[#1a2347] font-medium"
              >
                → {language === 'es' ? 'Ver Pacientes' : 'View Patients'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Citas de Hoy' : 'Today\'s Appointments'}
            </h3>
            {todayAppointments.length === 0 ? (
              <p className="text-gray-600">{language === 'es' ? 'No hay citas programadas para hoy' : 'No appointments scheduled for today'}</p>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map(appointment => {
                  const appointmentDate = new Date(appointment.appointmentDate);
                  return (
                    <div key={appointment.id} className="border-l-4 border-[#212e5c] pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{formatAppointmentDate(appointmentDate)}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Próximas Citas' : 'Upcoming Appointments'}
            </h3>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-600">{language === 'es' ? 'No hay próximas citas' : 'No upcoming appointments'}</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map(appointment => {
                  const appointmentDate = new Date(appointment.appointmentDate);
                  return (
                    <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{formatAppointmentDate(appointmentDate)}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
