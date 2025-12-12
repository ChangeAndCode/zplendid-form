'use client';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  appointmentCount: number;
}

export default function DoctorPatientsPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'doctor') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadPatients();
    }
  }, [isAuthenticated, token]);

  const loadPatients = async () => {
    try {
      const response = await fetch('/api/doctor/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#212e5c]">
            {language === 'es' ? 'Mis Pacientes' : 'My Patients'}
          </h1>
          <button
            onClick={() => router.push('/doctor/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {language === 'es' ? '← Volver' : '← Back'}
          </button>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">
              {language === 'es' ? 'No tienes pacientes asignados' : 'You have no assigned patients'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(patient => (
              <div key={patient.patientId} className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-[#212e5c] mb-1">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>{language === 'es' ? 'ID:' : 'ID:'}</strong> {patient.patientId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{language === 'es' ? 'Email:' : 'Email:'}</strong> {patient.email}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>{language === 'es' ? 'Total de Citas:' : 'Total Appointments:'}</strong>{' '}
                    <span className="text-[#212e5c] font-semibold">{patient.appointmentCount}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
