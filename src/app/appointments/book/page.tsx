'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AvailableDoctor } from '../../../lib/types/appointments';

export default function BookAppointmentPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState<AvailableDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'user') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleSpecialtyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSpecialty(value);
    // Resetear todo cuando cambia la especialidad
    setSelectedDoctor(null);
    setDoctors([]);
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedTime('');

    if (value) {
      try {
        const response = await fetch(`/api/appointments/available-doctors?specialty=${encodeURIComponent(value)}`);
        const data = await response.json();
        if (data.success) {
          setDoctors(data.data);
        }
      } catch (err) {
        console.error('Error al obtener doctores:', err);
      }
    }
  };

  const handleDoctorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = parseInt(e.target.value);
    setSelectedDoctor(doctorId);
    // Resetear fecha y hora cuando cambia el doctor
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedTime('');
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setAvailableSlots([]);
    setSelectedTime('');
    setError(null);

    // Cargar horarios disponibles cuando se selecciona fecha
    if (date && selectedDoctor) {
      await loadAvailableSlots(selectedDoctor, date);
    }
  };

  const loadAvailableSlots = async (doctorId: number, date: string) => {
    setLoadingSlots(true);
    setError(null);
    try {
      console.log(`Cargando horarios para doctor ${doctorId}, fecha ${date}`);
      const response = await fetch(`/api/appointments/available-slots?doctorId=${doctorId}&date=${date}&duration=30`);
      const data = await response.json();
      console.log('Respuesta de horarios:', data);
      
      if (data.success) {
        setAvailableSlots(data.data || []);
        if (data.message) {
          setError(data.message);
        }
      } else {
        setError(data.message || 'Error al cargar horarios disponibles');
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Error al obtener horarios:', err);
      setError('Error al cargar horarios disponibles. Por favor intenta de nuevo.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDoctor || !selectedDate || !selectedTime || !specialty) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          specialty,
          appointmentDate: appointmentDateTime.toISOString(),
          duration: 30,
          reason
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/appointments/my-appointments');
        }, 2000);
      } else {
        setError(data.message || 'Error al agendar la cita');
      }
    } catch (err) {
      setError('Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
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

  const specialties = [
    { value: 'First-time Bariatric Surgery', label: language === 'es' ? 'Cirugía Bariátrica (Primera vez)' : 'First-time Bariatric Surgery' },
    { value: 'Revisional Bariatric Surgery', label: language === 'es' ? 'Cirugía Bariátrica (Revisión)' : 'Revisional Bariatric Surgery' },
    { value: 'Primary Plastic Surgery', label: language === 'es' ? 'Cirugía Plástica (Primaria)' : 'Primary Plastic Surgery' },
    { value: 'Post Bariatric Plastic Surgery', label: language === 'es' ? 'Cirugía Plástica (Post-Bariátrica)' : 'Post Bariatric Plastic Surgery' },
    { value: 'Metabolic Rehab', label: language === 'es' ? 'Rehabilitación Metabólica' : 'Metabolic Rehab' }
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-[#212e5c] mb-8">
          {language === 'es' ? 'Agendar Cita' : 'Book Appointment'}
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {language === 'es' ? '¡Cita agendada exitosamente!' : 'Appointment booked successfully!'}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          {/* Paso 1: Especialidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-[#212e5c] font-semibold">1.</span> {language === 'es' ? 'Especialidad' : 'Specialty'}
            </label>
            <select
              value={specialty}
              onChange={handleSpecialtyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              required
            >
              <option value="">{language === 'es' ? 'Selecciona una especialidad' : 'Select a specialty'}</option>
              {specialties.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Paso 2: Doctor - Solo se muestra si hay especialidad seleccionada */}
          {specialty && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-[#212e5c] font-semibold">2.</span> {language === 'es' ? 'Doctor' : 'Doctor'}
              </label>
              {doctors.length === 0 ? (
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  {language === 'es' 
                    ? 'Cargando doctores disponibles...' 
                    : 'Loading available doctors...'}
                </div>
              ) : (
                <select
                  value={selectedDoctor || ''}
                  onChange={handleDoctorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                  required
                >
                  <option value="">{language === 'es' ? 'Selecciona un doctor' : 'Select a doctor'}</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Paso 3: Fecha - Solo se muestra si hay doctor seleccionado */}
          {selectedDoctor && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-[#212e5c] font-semibold">3.</span> {language === 'es' ? 'Fecha' : 'Date'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Paso 4: Hora - Solo se muestra si hay fecha seleccionada */}
          {selectedDate && selectedDoctor && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-[#212e5c] font-semibold">4.</span> {language === 'es' ? 'Hora' : 'Time'}
              </label>
              {loadingSlots ? (
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#212e5c]"></div>
                  {language === 'es' 
                    ? 'Cargando horarios disponibles...' 
                    : 'Loading available times...'}
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedTime === slot
                          ? 'bg-[#212e5c] text-white border-[#212e5c]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50">
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    {language === 'es' 
                      ? 'No hay horarios disponibles para esta fecha' 
                      : 'No available times for this date'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {language === 'es' 
                      ? 'El doctor debe configurar sus horarios de trabajo para este día de la semana en su panel. Ve a "Configurar Horarios" en el panel del doctor.' 
                      : 'The doctor must configure working hours for this day of the week in their panel. Go to "Configure Schedule" in the doctor panel.'}
                  </p>
                  {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Paso 5: Motivo - Solo se muestra si hay hora seleccionada */}
          {selectedTime && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-[#212e5c] font-semibold">5.</span> {language === 'es' ? 'Motivo de la cita (opcional)' : 'Reason (optional)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                placeholder={language === 'es' ? 'Describe el motivo de tu cita' : 'Describe the reason for your appointment'}
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#212e5c] text-white px-6 py-3 rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (language === 'es' ? 'Agendando...' : 'Booking...')
                : (language === 'es' ? 'Agendar Cita' : 'Book Appointment')
              }
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
