'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppointmentResponse } from '../../../lib/types/appointments';
import { formatAppointmentDate } from '../../../lib/utils/appointmentHelpers';

export default function DoctorAppointmentsPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'confirmed' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'doctor') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAppointments();
    }
  }, [isAuthenticated, token, dateFilter]);

  const loadAppointments = async () => {
    try {
      let url = '/api/doctor/appointments';
      if (dateFilter) {
        const startDate = new Date(dateFilter);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      const response = await fetch(url, {
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

  const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        loadAppointments();
      } else {
        alert(data.message || 'Error al actualizar estado');
      }
    } catch (err) {
      alert('Error al actualizar estado');
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

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
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

  if (!isAuthenticated || !user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#212e5c]">
            {language === 'es' ? 'Mi Agenda' : 'My Schedule'}
          </h1>
          <button
            onClick={() => router.push('/doctor/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {language === 'es' ? '← Volver' : '← Back'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Filtrar por Fecha' : 'Filter by Date'}
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setDateFilter('')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'es' ? 'Limpiar' : 'Clear'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'scheduled', 'confirmed', 'completed'] as const).map(f => (
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
              {f === 'scheduled' && (language === 'es' ? 'Programadas' : 'Scheduled')}
              {f === 'confirmed' && (language === 'es' ? 'Confirmadas' : 'Confirmed')}
              {f === 'completed' && (language === 'es' ? 'Completadas' : 'Completed')}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">
              {language === 'es' ? 'No hay citas' : 'No appointments'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appointment => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const isPast = appointmentDate < new Date();

              return (
                <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#212e5c]">
                          {appointment.patientName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <strong>{language === 'es' ? 'Email:' : 'Email:'}</strong> {appointment.patientEmail}
                      </p>
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
                      {appointment.notes && (
                        <p className="text-gray-600 mb-1">
                          <strong>{language === 'es' ? 'Notas:' : 'Notes:'}</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                    {!isPast && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                      <div className="flex flex-col gap-2">
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            {language === 'es' ? 'Confirmar' : 'Confirm'}
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {language === 'es' ? 'Completar' : 'Complete'}
                        </button>
                      </div>
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
