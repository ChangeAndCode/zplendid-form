'use client';

import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useAdminPanel, AdminStats, PatientSummary, DoctorSummary, AssignmentRecord } from '../hooks/useAdminPanel';

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const { 
    stats, 
    patients, 
    doctors, 
    assignments, 
    loading, 
    error, 
    approveDoctor, 
    rejectDoctor,
    refreshAll
  } = useAdminPanel();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212e5c] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: language === 'es' ? 'Panel Principal' : 'Dashboard', icon: '📊' },
    { id: 'doctors', label: language === 'es' ? 'Gestión de Doctores' : 'Doctor Management', icon: '👨‍⚕️' },
    { id: 'patients', label: language === 'es' ? 'Pacientes' : 'Patients', icon: '👥' },
    { id: 'assignments', label: language === 'es' ? 'Asignaciones' : 'Assignments', icon: '📋' },
    { id: 'settings', label: language === 'es' ? 'Configuración' : 'Settings', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab language={language} stats={stats} loading={loading.stats} error={error} />;
      case 'doctors':
        return <DoctorsTab language={language} doctors={doctors} loading={loading.doctors} error={error} onApprove={approveDoctor} onReject={rejectDoctor} showAddDoctorModal={showAddDoctorModal} setShowAddDoctorModal={setShowAddDoctorModal} refreshAll={refreshAll} />;
      case 'patients':
        return <PatientsTab language={language} patients={patients} loading={loading.patients} error={error} />;
      case 'assignments':
        return <AssignmentsTab language={language} assignments={assignments} loading={loading.assignments} error={error} doctors={doctors} />;
      case 'settings':
        return <SettingsTab language={language} />;
      default:
        return <DashboardTab language={language} stats={stats} loading={loading.stats} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
            <span className="ml-4 px-3 py-1 bg-[#212e5c] text-white text-sm rounded-full">
              {language === 'es' ? 'Panel de Administrador' : 'Admin Panel'}
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
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-[#212e5c] text-[#212e5c]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

// Componente del Dashboard Principal
function DashboardTab({ language, stats, loading, error }: { 
  language: string; 
  stats: AdminStats | null; 
  loading: boolean; 
  error: string | null; 
}) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#212e5c] mb-6">
        {language === 'es' ? 'Panel Principal' : 'Dashboard Overview'}
      </h2>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                {language === 'es' ? 'Total Pacientes' : 'Total Patients'}
              </p>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-blue-400 h-8 w-16 rounded"></div>
                ) : (
                  stats?.totalPatients || 0
                )}
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                {language === 'es' ? 'Doctores Activos' : 'Active Doctors'}
              </p>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-green-400 h-8 w-16 rounded"></div>
                ) : (
                  stats?.activeDoctors || 0
                )}
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                {language === 'es' ? 'Solicitudes Pendientes' : 'Pending Requests'}
              </p>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-purple-400 h-8 w-16 rounded"></div>
                ) : (
                  stats?.pendingRequests || 0
                )}
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                {language === 'es' ? 'Asignaciones Hoy' : 'Today\'s Assignments'}
              </p>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-orange-400 h-8 w-16 rounded"></div>
                ) : (
                  stats?.todaysAssignments || 0
                )}
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
          {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
        </h3>
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>{language === 'es' ? 'No hay actividad reciente' : 'No recent activity'}</p>
        </div>
      </div>
    </div>
  );
}

// Componente de Gestión de Doctores
function DoctorsTab({ 
  language, 
  doctors, 
  loading, 
  error, 
  onApprove, 
  onReject,
  showAddDoctorModal,
  setShowAddDoctorModal,
  refreshAll
}: { 
  language: string; 
  doctors: DoctorSummary[]; 
  loading: boolean; 
  error: string | null; 
  onApprove: (id: number) => Promise<boolean>; 
  onReject: (id: number) => Promise<boolean>;
  showAddDoctorModal: boolean;
  setShowAddDoctorModal: (show: boolean) => void;
  refreshAll: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#212e5c]">
          {language === 'es' ? 'Gestión de Doctores' : 'Doctor Management'}
        </h2>
        <button 
          onClick={() => setShowAddDoctorModal(true)}
          className="bg-[#212e5c] text-white px-4 py-2 rounded-lg hover:bg-[#1a2347] transition-colors"
        >
          {language === 'es' ? '+ Agregar Doctor' : '+ Add Doctor'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Estado' : 'Status'}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent">
              <option value="all">{language === 'es' ? 'Todos' : 'All'}</option>
              <option value="pending">{language === 'es' ? 'Pendientes' : 'Pending'}</option>
              <option value="approved">{language === 'es' ? 'Aprobados' : 'Approved'}</option>
              <option value="rejected">{language === 'es' ? 'Rechazados' : 'Rejected'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Especialidad' : 'Specialty'}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent">
              <option value="all">{language === 'es' ? 'Todas' : 'All'}</option>
              <option value="cirugia-bariatrica">{language === 'es' ? 'Cirugía Bariátrica' : 'Bariatric Surgery'}</option>
              <option value="nutricion">{language === 'es' ? 'Nutrición' : 'Nutrition'}</option>
              <option value="psicologia">{language === 'es' ? 'Psicología' : 'Psychology'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Buscar' : 'Search'}
            </label>
            <input
              type="text"
              placeholder={language === 'es' ? 'Nombre o email...' : 'Name or email...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Doctor' : 'Doctor'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Especialidad' : 'Specialty'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Estado' : 'Status'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Fecha de Registro' : 'Registration Date'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Acciones' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>{language === 'es' ? 'No hay doctores registrados' : 'No doctors registered'}</p>
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#212e5c] flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doctor.specialty}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : doctor.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status === 'approved' 
                        ? (language === 'es' ? 'Aprobado' : 'Approved')
                        : doctor.status === 'pending'
                        ? (language === 'es' ? 'Pendiente' : 'Pending')
                        : (language === 'es' ? 'Rechazado' : 'Rejected')
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {doctor.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onApprove(doctor.id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                        >
                          {language === 'es' ? 'Aprobar' : 'Approve'}
                        </button>
                        <button
                          onClick={() => onReject(doctor.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                        >
                          {language === 'es' ? 'Rechazar' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar doctor */}
      {showAddDoctorModal && (
        <AddDoctorModal 
          language={language}
          onClose={() => setShowAddDoctorModal(false)}
          onSuccess={() => {
            setShowAddDoctorModal(false);
            refreshAll();
          }}
        />
      )}
    </div>
  );
}

// Componente Modal para agregar doctor
function AddDoctorModal({ 
  language, 
  onClose, 
  onSuccess 
}: { 
  language: string; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
    specialties: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/doctors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message || 'Error al crear el doctor');
      }
    } catch {
      setError('Error al crear el doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#212e5c]">
            {language === 'es' ? 'Agregar Nuevo Doctor' : 'Add New Doctor'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    {language === 'es' ? 'Doctor creado exitosamente. Se enviará un email de verificación.' : 'Doctor created successfully. A verification email will be sent.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Nombre' : 'First Name'} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Apellido' : 'Last Name'} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Correo Electrónico' : 'Email'} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Contraseña Temporal' : 'Temporary Password'} *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                placeholder={language === 'es' ? 'Mínimo 6 caracteres' : 'Minimum 6 characters'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Número de Licencia' : 'License Number'} *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Especialidades' : 'Specialties'} *
              </label>
              <select
                name="specialties"
                value={formData.specialties}
                onChange={handleSelectChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              >
                <option value="">{language === 'es' ? 'Seleccione las especialidades' : 'Select specialties'}</option>
                <option value="Cirugía Bariátrica">{language === 'es' ? 'Cirugía Bariátrica' : 'Bariatric Surgery'}</option>
                <option value="Cirugía Bariátrica Revisional">{language === 'es' ? 'Cirugía Bariátrica Revisional' : 'Revisional Bariatric Surgery'}</option>
                <option value="Cirugía Plástica Primaria">{language === 'es' ? 'Cirugía Plástica Primaria' : 'Primary Plastic Surgery'}</option>
                <option value="Cirugía Plástica Post-Bariátrica">{language === 'es' ? 'Cirugía Plástica Post-Bariátrica' : 'Post-Bariatric Plastic Surgery'}</option>
                <option value="Nutrición">{language === 'es' ? 'Nutrición' : 'Nutrition'}</option>
                <option value="Psicología">{language === 'es' ? 'Psicología' : 'Psychology'}</option>
                <option value="Endocrinología">{language === 'es' ? 'Endocrinología' : 'Endocrinology'}</option>
                <option value="Cardiología">{language === 'es' ? 'Cardiología' : 'Cardiology'}</option>
                <option value="Gastroenterología">{language === 'es' ? 'Gastroenterología' : 'Gastroenterology'}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="px-4 py-2 bg-[#212e5c] text-white rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                language === 'es' ? 'Creando...' : 'Creating...'
              ) : (
                language === 'es' ? 'Crear Doctor' : 'Create Doctor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de Pacientes
function PatientsTab({ 
  language, 
  patients, 
  loading, 
  error 
}: { 
  language: string; 
  patients: PatientSummary[]; 
  loading: boolean; 
  error: string | null; 
}) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#212e5c]">
          {language === 'es' ? 'Gestión de Pacientes' : 'Patient Management'}
        </h2>
        <button className="bg-[#212e5c] text-white px-4 py-2 rounded-lg hover:bg-[#1a2347] transition-colors">
          {language === 'es' ? 'Exportar Datos' : 'Export Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {language === 'es' ? 'Pacientes Completos' : 'Complete Patients'}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? (
                  <div className="animate-pulse bg-blue-200 h-6 w-12 rounded"></div>
                ) : (
                  patients.filter(p => p.status === 'complete').length
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {language === 'es' ? 'En Proceso' : 'In Process'}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? (
                  <div className="animate-pulse bg-yellow-200 h-6 w-12 rounded"></div>
                ) : (
                  patients.filter(p => (p.status as string) === 'in_progress' || (p.status as string) === 'registered').length
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {language === 'es' ? 'Asignados' : 'Assigned'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? (
                  <div className="animate-pulse bg-green-200 h-6 w-12 rounded"></div>
                ) : (
                  patients.filter(p => p.status === 'assigned').length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Paciente' : 'Patient'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Área de Interés' : 'Interest Area'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Estado' : 'Status'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Fecha' : 'Date'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Acciones' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>{language === 'es' ? 'No hay pacientes registrados' : 'No patients registered'}</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                        <div className="text-xs text-gray-400">ID: {patient.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{patient.interestArea}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (patient.status as string) === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : (patient.status as string) === 'assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : (patient.status as string) === 'registered'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(patient.status as string) === 'complete' 
                        ? (language === 'es' ? 'Completo' : 'Complete')
                        : (patient.status as string) === 'assigned'
                        ? (language === 'es' ? 'Asignado' : 'Assigned')
                        : (patient.status as string) === 'registered'
                        ? (language === 'es' ? 'Registrado' : 'Registered')
                        : (language === 'es' ? 'En Proceso' : 'In Process')
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#212e5c] hover:text-[#1a2347] bg-gray-50 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
                      {language === 'es' ? 'Ver Detalles' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Asignaciones
function AssignmentsTab({ 
  language, 
  assignments, 
  loading, 
  error,
  doctors
}: { 
  language: string; 
  assignments: AssignmentRecord[]; 
  loading: boolean; 
  error: string | null;
  doctors: DoctorSummary[];
}) {
  const { token } = useAuth();
  const [searchType, setSearchType] = useState<'expediente' | 'nombre' | 'procedimiento'>('expediente');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<PatientSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSummary | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleSearch = async () => {
    if (!searchValue) return;
    
    setIsSearching(true);
    setSearchResults([]);

    try {
      // Llamar a la API de búsqueda
      const response = await fetch(`/api/admin/patients/search?type=${searchType}&query=${encodeURIComponent(searchValue)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSearchResults(data.data);
      } else {
        setAssignmentMessage({ type: 'error', text: data.message || 'Error al buscar pacientes' });
        console.error('Error en búsqueda:', data.error || data.message);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setAssignmentMessage({ type: 'error', text: 'Error al buscar pacientes' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssignPatient = async () => {
    if (!selectedPatient || !selectedDoctor) {
      setAssignmentMessage({ type: 'error', text: language === 'es' ? 'Debes seleccionar un paciente y un doctor' : 'You must select a patient and a doctor' });
      return;
    }

    setIsAssigning(true);
    setAssignmentMessage(null);

    try {
      const response = await fetch('/api/admin/assignments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: selectedPatient.patientId,
          doctorId: selectedDoctor.id,
          interestArea: selectedDoctor.specialty || 'No especificado'
        })
      });

      const data = await response.json();

      if (data.success) {
        setAssignmentMessage({ type: 'success', text: language === 'es' ? 'Asignación realizada exitosamente' : 'Assignment completed successfully' });
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setSearchValue('');
        setSearchResults([]);
        
        // Actualizar solo las asignaciones
        try {
          window.location.reload();
        } catch {
          console.error('Error al actualizar asignaciones');
        }
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setAssignmentMessage(null);
        }, 3000);
      } else {
        setAssignmentMessage({ type: 'error', text: data.message || 'Error al asignar' });
        console.error('Error en asignación:', data.error || data.message);
      }
    } catch {
      setAssignmentMessage({ type: 'error', text: 'Error al asignar paciente' });
    } finally {
      setIsAssigning(false);
    }
  };


  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#212e5c]">
          {language === 'es' ? 'Asignaciones' : 'Assignments'}
        </h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              {language === 'es' 
                ? 'Esta sección mostrará el historial de todas las asignaciones de pacientes a doctores realizadas en el sistema.'
                : 'This section will show the history of all patient-to-doctor assignments made in the system.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Manual Assignment Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
          {language === 'es' ? 'Asignación Manual' : 'Manual Assignment'}
        </h3>

        {assignmentMessage && (
          <div className={`mb-4 p-3 rounded-lg ${
            assignmentMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {assignmentMessage.text}
          </div>
        )}
        
        {/* Tipo de búsqueda */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'es' ? 'Tipo de Búsqueda' : 'Search Type'}
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSearchType('expediente')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'expediente' 
                  ? 'bg-[#212e5c] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? 'Por Expediente' : 'By Record'}
            </button>
            <button
              type="button"
              onClick={() => setSearchType('nombre')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'nombre' 
                  ? 'bg-[#212e5c] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? 'Por Nombre' : 'By Name'}
            </button>
            <button
              type="button"
              onClick={() => setSearchType('procedimiento')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'procedimiento' 
                  ? 'bg-[#212e5c] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? 'Por Procedimiento' : 'By Procedure'}
            </button>
          </div>
        </div>

        {/* Campo de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={
              searchType === 'expediente' 
                ? (language === 'es' ? 'Ej: ZP23120001' : 'E.g: ZP23120001')
                : searchType === 'nombre'
                ? (language === 'es' ? 'Nombre del paciente' : 'Patient name')
                : (language === 'es' ? 'Tipo de procedimiento' : 'Procedure type')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-between gap-4 mb-4">
          <button 
            onClick={handleSearch}
            disabled={!searchValue || isSearching}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSearching ? (language === 'es' ? 'Buscando...' : 'Searching...') : (language === 'es' ? 'Buscar' : 'Search')}
          </button>
        </div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Resultados de la búsqueda:' : 'Search results:'}
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-[#212e5c] text-white border-[#212e5c]' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-sm opacity-80">ID: {patient.patientId}</div>
                  <div className="text-sm opacity-80">{patient.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selección de doctor */}
        {selectedPatient && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'es' ? 'Seleccionar Doctor' : 'Select Doctor'}
            </label>
            <select
              value={selectedDoctor?.id || ''}
              onChange={(e) => {
                const doctor = doctors.find(d => d.id === parseInt(e.target.value));
                setSelectedDoctor(doctor || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
            >
              <option value="">{language === 'es' ? 'Seleccionar doctor...' : 'Select doctor...'}</option>
              {doctors.filter(d => d.status === 'approved').map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón de asignar */}
        {selectedPatient && selectedDoctor && (
          <div className="flex justify-end">
            <button
              onClick={handleAssignPatient}
              disabled={isAssigning}
              className="bg-[#212e5c] text-white px-6 py-2 rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {language === 'es' ? 'Asignando...' : 'Assigning...'}
                </div>
              ) : (
                language === 'es' ? 'Confirmar Asignación' : 'Confirm Assignment'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Assignment History */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Paciente' : 'Patient'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Doctor Asignado' : 'Assigned Doctor'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Área' : 'Area'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Fecha' : 'Date'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'es' ? 'Estado' : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                  <svg className="w-12 h-12 mx-auto mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>{language === 'es' ? 'No hay asignaciones registradas' : 'No assignments recorded'}</p>
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.patientName}
                      </div>
                      <div className="text-sm text-gray-500">{assignment.patientEmail}</div>
                      <div className="text-xs text-gray-400">ID: {assignment.patientId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {assignment.doctorName}
                      </div>
                      <div className="text-sm text-gray-500">{assignment.doctorEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{assignment.interestArea}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : assignment.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status === 'completed' 
                        ? (language === 'es' ? 'Completado' : 'Completed')
                        : assignment.status === 'contacted'
                        ? (language === 'es' ? 'Contactado' : 'Contacted')
                        : (language === 'es' ? 'Asignado' : 'Assigned')
                      }
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Configuración
function SettingsTab({ language }: { language: string }) {
  const { token } = useAuth();
  const [emailConfig, setEmailConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const settings = data.data;
        
        setEmailConfig({
          host: settings.SMTP_HOST || 'smtp.gmail.com',
          port: settings.SMTP_PORT || '587',
          user: settings.SMTP_USER || '',
          password: settings.SMTP_PASSWORD || ''
        });
      }
    } catch {
      console.error('Error al cargar configuración');
    }
  }, [token]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'email',
          config: emailConfig
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: language === 'es' ? 'Configuración guardada correctamente' : 'Settings saved successfully' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al guardar' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar configuración' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#212e5c] mb-6">
        {language === 'es' ? 'Configuración del Sistema' : 'System Settings'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Configuration */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
            {language === 'es' ? 'Configuración de Correos' : 'Email Configuration'}
          </h3>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveEmailConfig} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'SMTP Server' : 'SMTP Server'}
              </label>
              <input
                type="text"
                value={emailConfig.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Puerto' : 'Port'}
              </label>
              <input
                type="text"
                value={emailConfig.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Usuario' : 'Username'}
              </label>
              <input
                type="email"
                value={emailConfig.user}
                onChange={(e) => handleInputChange('user', e.target.value)}
                placeholder="admin@zplendid.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Contraseña' : 'Password'}
              </label>
              <input
                type="password"
                value={emailConfig.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#212e5c] text-white py-2 rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50"
            >
              {isLoading 
                ? (language === 'es' ? 'Guardando...' : 'Saving...')
                : (language === 'es' ? 'Guardar Configuración' : 'Save Configuration')
              }
            </button>
          </form>
        </div>

        {/* System Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
            {language === 'es' ? 'Configuración General' : 'General Settings'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Nombre del Sistema' : 'System Name'}
              </label>
              <input
                type="text"
                defaultValue="zplendid"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Tiempo de Sesión (minutos)' : 'Session Timeout (minutes)'}
              </label>
              <input
                type="number"
                defaultValue="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-assign"
                className="h-4 w-4 text-[#212e5c] focus:ring-[#212e5c] border-gray-300 rounded"
              />
              <label htmlFor="auto-assign" className="ml-2 block text-sm text-gray-700">
                {language === 'es' ? 'Asignación automática habilitada' : 'Automatic assignment enabled'}
              </label>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
              {language === 'es' ? 'Guardar Cambios' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
