/**
 * Utilidades para formateo y manejo de IDs de pacientes
 * Los IDs ahora se generan en el backend
 */

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

