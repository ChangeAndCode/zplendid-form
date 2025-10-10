/**
 * Sistema de generación y gestión de IDs únicos para pacientes
 * Formato: ZPLD-YYYYMMDD-XXXX (ej: ZPLD-20241010-A3F9)
 */

const STORAGE_KEY = 'zplendid_patient_id';

/**
 * Genera un ID único para el paciente con timestamp y código aleatorio
 * Formato: ZPLD-YYYYMMDD-HHMM-XXXX
 * Ejemplo: ZPLD-20241010-1430-A3F9
 */
export function generatePatientId(): string {
  // Obtener fecha y hora actual
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // Generar código aleatorio de 4 caracteres (alfanumérico)
  // Esto da 1,679,616 combinaciones posibles
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Agregar componente de timestamp para mayor unicidad
  const timestamp = now.getTime().toString(36).slice(-3).toUpperCase();
  
  return `ZPLD-${year}${month}${day}-${hours}${minutes}-${randomCode}${timestamp}`;
}

/**
 * Obtiene el ID del paciente actual desde localStorage
 * Si no existe, genera uno nuevo
 */
export function getPatientId(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const existingId = localStorage.getItem(STORAGE_KEY);
    
    if (existingId) {
      return existingId;
    }
    
    // Si no existe, generar uno nuevo
    const newId = generatePatientId();
    localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  } catch (error) {
    console.error('Error al obtener/generar ID del paciente:', error);
    return generatePatientId(); // Fallback: generar ID temporal
  }
}

/**
 * Guarda el ID del paciente en localStorage
 */
export function savePatientId(patientId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, patientId);
  } catch (error) {
    console.error('Error al guardar ID del paciente:', error);
  }
}

/**
 * Verifica si ya existe un ID de paciente
 */
export function hasExistingPatientId(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Limpia el ID del paciente (usado después de completar todos los formularios)
 */
export function clearPatientId(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error('Error al limpiar ID del paciente');
  }
}

/**
 * Formatea el ID del paciente para mostrar en UI
 */
export function formatPatientId(patientId: string): string {
  if (!patientId) return 'N/A';
  return patientId;
}

/**
 * Obtiene el storage key para un formulario específico
 */
export function getFormStorageKey(formName: string, patientId: string): string {
  return `zplendid_${formName}_${patientId}`;
}

