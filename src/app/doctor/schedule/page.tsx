'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DoctorSchedule } from '../../../lib/types/appointments';

export default function DoctorSchedulePage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { value: 0, name: language === 'es' ? 'Domingo' : 'Sunday' },
    { value: 1, name: language === 'es' ? 'Lunes' : 'Monday' },
    { value: 2, name: language === 'es' ? 'Martes' : 'Tuesday' },
    { value: 3, name: language === 'es' ? 'Miércoles' : 'Wednesday' },
    { value: 4, name: language === 'es' ? 'Jueves' : 'Thursday' },
    { value: 5, name: language === 'es' ? 'Viernes' : 'Friday' },
    { value: 6, name: language === 'es' ? 'Sábado' : 'Saturday' }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'doctor') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadSchedules();
    }
  }, [isAuthenticated, token]);

  const loadSchedules = async () => {
    try {
      const response = await fetch('/api/doctor/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (err) {
      console.error('Error al cargar horarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForDay = (dayOfWeek: number): DoctorSchedule | undefined => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  const handleSave = async (dayOfWeek: number, startTime: string, endTime: string, isAvailable: boolean) => {
    setSaving(true);
    try {
      const response = await fetch('/api/doctor/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
          isAvailable
        })
      });

      const data = await response.json();
      if (data.success) {
        loadSchedules();
        alert(language === 'es' ? 'Horario guardado exitosamente' : 'Schedule saved successfully');
      } else {
        alert(data.message || 'Error al guardar horario');
      }
    } catch (err) {
      alert('Error al guardar horario');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#212e5c]">
            {language === 'es' ? 'Configurar Horarios' : 'Configure Schedule'}
          </h1>
          <button
            onClick={() => router.push('/doctor/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {language === 'es' ? '← Volver' : '← Back'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-6">
            {language === 'es' 
              ? 'Configura tus horarios de trabajo para cada día de la semana. Los pacientes podrán agendar citas solo en estos horarios.'
              : 'Configure your working hours for each day of the week. Patients will only be able to book appointments during these hours.'
            }
          </p>

          <div className="space-y-6">
            {daysOfWeek.map(day => {
              const schedule = getScheduleForDay(day.value);
              return (
                <DayScheduleEditor
                  key={day.value}
                  dayName={day.name}
                  dayOfWeek={day.value}
                  initialSchedule={schedule}
                  onSave={handleSave}
                  saving={saving}
                  language={language}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayScheduleEditor({
  dayName,
  dayOfWeek,
  initialSchedule,
  onSave,
  saving,
  language
}: {
  dayName: string;
  dayOfWeek: number;
  initialSchedule?: DoctorSchedule;
  onSave: (dayOfWeek: number, startTime: string, endTime: string, isAvailable: boolean) => void;
  saving: boolean;
  language: string;
}) {
  const [startTime, setStartTime] = useState(initialSchedule?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSchedule?.endTime || '17:00');
  const [isAvailable, setIsAvailable] = useState(initialSchedule?.isAvailable ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asegurar que siempre tengamos valores válidos para los horarios
    const finalStartTime = startTime || '09:00';
    const finalEndTime = endTime || '17:00';
    
    // Si está disponible, validar que los horarios estén completos
    if (isAvailable && (!finalStartTime || !finalEndTime)) {
      alert(language === 'es' ? 'Por favor completa los horarios' : 'Please complete the schedule times');
      return;
    }
    
    onSave(dayOfWeek, finalStartTime, finalEndTime, isAvailable);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#212e5c]">{dayName}</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="w-4 h-4 text-[#212e5c] border-gray-300 rounded focus:ring-[#212e5c]"
          />
          <span className="text-sm text-gray-700">
            {language === 'es' ? 'Disponible' : 'Available'}
          </span>
        </label>
      </div>

      {isAvailable && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Hora de Inicio' : 'Start Time'}
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              required={isAvailable}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Hora de Fin' : 'End Time'}
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              required={isAvailable}
            />
          </div>
        </div>
      )}
      
      {!isAvailable && (
        <p className="text-sm text-gray-500 mb-4">
          {language === 'es' 
            ? 'Este día no estará disponible para citas'
            : 'This day will not be available for appointments'
          }
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#212e5c] text-white px-4 py-2 rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving
          ? (language === 'es' ? 'Guardando...' : 'Saving...')
          : (language === 'es' ? 'Guardar' : 'Save')
        }
      </button>
    </form>
  );
}
