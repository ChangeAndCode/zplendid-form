'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface AssignmentRecord {
  id: number;
  patientId: string;
  doctorId: number;
  interestArea: string;
  assignedAt: Date;
  status: string;
  notes?: string;
  patientName?: string;
  patientEmail?: string;
  doctorName?: string;
  doctorEmail?: string;
}

export interface AdminStats {
  totalPatients: number;
  activeDoctors: number;
  pendingRequests: number;
  todaysAssignments: number;
}

export interface PatientSummary {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  interestArea: string;
  status: 'complete' | 'in_progress' | 'assigned';
  createdAt: Date;
  assignedDoctor?: string;
}

export interface DoctorSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export function useAdminPanel() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState({
    stats: false,
    patients: false,
    doctors: false,
    assignments: false
  });
  const [error, setError] = useState<string | null>(null);

  // Función para hacer peticiones autenticadas
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return response.json();
  }, [token]);

  // Cargar estadísticas del dashboard
  const loadStats = useCallback(async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    setError(null);
    
    try {
      const response = await makeAuthenticatedRequest('/api/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, [makeAuthenticatedRequest]);

  // Cargar lista de pacientes
  const loadPatients = useCallback(async () => {
    setLoading(prev => ({ ...prev, patients: true }));
    setError(null);
    
    try {
      const response = await makeAuthenticatedRequest('/api/admin/patients');
      setPatients(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
    } finally {
      setLoading(prev => ({ ...prev, patients: false }));
    }
  }, [makeAuthenticatedRequest]);

  // Cargar lista de doctores
  const loadDoctors = useCallback(async () => {
    setLoading(prev => ({ ...prev, doctors: true }));
    setError(null);
    
    try {
      const response = await makeAuthenticatedRequest('/api/admin/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar doctores');
    } finally {
      setLoading(prev => ({ ...prev, doctors: false }));
    }
  }, [makeAuthenticatedRequest]);

  // Cargar historial de asignaciones
  const loadAssignments = useCallback(async () => {
    setLoading(prev => ({ ...prev, assignments: true }));
    setError(null);
    
    try {
      const response = await makeAuthenticatedRequest('/api/admin/assignments');
      setAssignments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar asignaciones');
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }));
    }
  }, [makeAuthenticatedRequest]);

  // Aprobar doctor
  const approveDoctor = async (doctorId: number) => {
    try {
      await makeAuthenticatedRequest('/api/admin/doctors', {
        method: 'POST',
        body: JSON.stringify({ action: 'approve', doctorId })
      });
      
      // Recargar lista de doctores
      await loadDoctors();
      await loadStats(); // Actualizar estadísticas
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar doctor');
      return false;
    }
  };

  // Rechazar doctor
  const rejectDoctor = async (doctorId: number) => {
    try {
      await makeAuthenticatedRequest('/api/admin/doctors', {
        method: 'POST',
        body: JSON.stringify({ action: 'reject', doctorId })
      });
      
      // Recargar lista de doctores
      await loadDoctors();
      await loadStats(); // Actualizar estadísticas
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar doctor');
      return false;
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    if (token) {
      loadStats();
      loadPatients();
      loadDoctors();
      loadAssignments();
    }
  }, [token, loadStats, loadPatients, loadDoctors, loadAssignments]);

  return {
    // Datos
    stats,
    patients,
    doctors,
    assignments,
    
    // Estados
    loading,
    error,
    
    // Acciones
    loadStats,
    loadPatients,
    loadDoctors,
    loadAssignments,
    approveDoctor,
    rejectDoctor,
    
    // Utilidades
    refreshAll: async () => {
      await Promise.all([
        loadStats(),
        loadPatients(),
        loadDoctors(),
        loadAssignments()
      ]);
    }
  };
}
