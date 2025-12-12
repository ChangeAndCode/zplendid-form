'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppointmentResponse } from '../../../lib/types/appointments';
import { formatAppointmentDate } from '../../../lib/utils/appointmentHelpers';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';

export default function MyAppointmentsPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'user') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAppointments();
    }
  }, [isAuthenticated, token]);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/my-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error('Error al cargar citas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm(language === 'es' ? '¿Estás seguro de cancelar esta cita?' : 'Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Cancelada por el paciente' })
      });

      const data = await response.json();
      if (data.success) {
        loadAppointments();
      } else {
        alert(data.message || 'Error al cancelar la cita');
      }
    } catch (err) {
      alert('Error al cancelar la cita');
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
      cancelled: { es: 'Cancelada', en: 'Cancelled' },
      no_show: { es: 'No asistió', en: 'No Show' }
    };
    return statusMap[status]?.[language === 'es' ? 'es' : 'en'] || status;
  };

  const filteredAppointments = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.appointmentDate);

    if (filter === 'upcoming') {
      return aptDate > now && apt.status !== 'cancelled';
    } else if (filter === 'past') {
      return aptDate < now || apt.status === 'completed';
    } else if (filter === 'cancelled') {
      return apt.status === 'cancelled';
    }
    return true;
  });

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

  if (!isAuthenticated || !user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
            <button
              onClick={() => router.push('/landing')}
              className="text-[#212e5c] hover:text-[#1a2347] font-medium text-sm"
            >
              {language === 'es' ? '← Inicio' : '← Home'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-[#212e5c] text-white px-4 py-1 rounded text-sm hover:bg-[#1a2347] transition-colors"
            >
              {language === 'es' ? 'Dashboard' : 'Dashboard'}
            </button>
            <button
              onClick={() => router.push('/appointments/book')}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              {language === 'es' ? '+ Agendar Cita' : '+ Book Appointment'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#212e5c]">
            {language === 'es' ? 'Mis Citas' : 'My Appointments'}
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'upcoming', 'past', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-[#212e5c] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && (language === 'es' ? 'Todas' : 'All')}
              {f === 'upcoming' && (language === 'es' ? 'Próximas' : 'Upcoming')}
              {f === 'past' && (language === 'es' ? 'Pasadas' : 'Past')}
              {f === 'cancelled' && (language === 'es' ? 'Canceladas' : 'Cancelled')}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">
              {language === 'es' ? 'No tienes citas' : 'You have no appointments'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appointment => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const canCancel = appointmentDate > new Date() && appointment.status !== 'cancelled' && appointment.status !== 'completed';

              return (
                <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#212e5c]">
                          {appointment.doctorName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <strong>{language === 'es' ? 'Especialidad:' : 'Specialty:'}</strong> {appointment.specialty}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>{language === 'es' ? 'Fecha y Hora:' : 'Date & Time:'}</strong> {formatAppointmentDate(appointmentDate)}
                      </p>
                      {appointment.reason && (
                        <p className="text-gray-600 mb-1">
                          <strong>{language === 'es' ? 'Motivo:' : 'Reason:'}</strong> {appointment.reason}
                        </p>
                      )}
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
