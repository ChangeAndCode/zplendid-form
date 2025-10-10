import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

export type SurgeryInterest = 'first-time-bariatric' | 'revisional-bariatric' | 'primary-plastic' | 'post-bariatric-plastic' | 'metabolic-rehab' | '';

const STORAGE_KEYS = {
  FORM_DATA: 'zplendid_form_data',
  CURRENT_STEP: 'zplendid_current_step',
  LAST_SAVED: 'zplendid_last_saved'
};

export interface HealthFormData {
  // Información del Paciente
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  addressLine: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  occupation: string;
  employer: string;
  education: string;
  
  // Interés de cirugía
  surgeryInterest: SurgeryInterest;
  specificProcedure: string;
  surgeryReadiness: string;
  
  // BMI
  measurementSystem: 'standard' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  bmi: string;
  
  // Historial de peso
  highestWeight: string;
  highestWeightDate: string;
  lowestWeight: string;
  lowestWeightDate: string;
  currentWeight: string;
  goalWeight: string;
  
  // Contacto de emergencia
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  
  // Historial médico
  previousWeightLossSurgery: string;
  sleepApnea: string;
  useCpap: string;
  highBloodPressure: string;
  diabetes: string;
  useInsulin: string;
  heartburnFrequency: string;
  currentlySmoking: string;
  alcoholConsumption: string;
  medications: string;
  allergies: string;
  additionalComments: string;
}

// Mantener compatibilidad con código existente
export type FormData = HealthFormData;

// Función para cargar datos del localStorage
const loadFromStorage = (): { formData: HealthFormData | null; currentStep: number } => {
  if (typeof window === 'undefined') return { formData: null, currentStep: 1 };
  
  try {
    const savedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    
    return {
      formData: savedFormData ? JSON.parse(savedFormData) : null,
      currentStep: savedStep ? parseInt(savedStep, 10) : 1
    };
  } catch (error) {
    console.error('Error al cargar datos guardados:', error);
    return { formData: null, currentStep: 1 };
  }
};

const initialFormData: HealthFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  addressLine: '',
  city: '',
  country: '',
  state: '',
  zipcode: '',
  phoneNumber: '',
  email: '',
  preferredContact: 'text',
  occupation: '',
  employer: '',
  education: '',
  surgeryInterest: '',
  specificProcedure: '',
  surgeryReadiness: '',
  measurementSystem: 'standard',
  heightFeet: '',
  heightInches: '',
  heightCm: '',
  weightLbs: '',
  weightKg: '',
  bmi: '',
  highestWeight: '',
  highestWeightDate: '',
  lowestWeight: '',
  lowestWeightDate: '',
  currentWeight: '',
  goalWeight: '',
  emergencyFirstName: '',
  emergencyLastName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  previousWeightLossSurgery: 'no',
  sleepApnea: 'no',
  useCpap: 'no',
  highBloodPressure: 'no',
  diabetes: 'no',
  useInsulin: 'no',
  heartburnFrequency: '0',
  currentlySmoking: 'no',
  alcoholConsumption: 'no',
  medications: '',
  allergies: '',
  additionalComments: '',
};

export function useHealthForm() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HealthFormData>(initialFormData);

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const { formData: savedData, currentStep: savedStep } = loadFromStorage();
    
    if (savedData) {
      setFormData(savedData);
      setCurrentStep(savedStep);
    }
    
    setIsLoaded(true);
  }, []);

  // Guardar datos automáticamente cuando cambien
  useEffect(() => {
    if (!isLoaded) return; // No guardar en la carga inicial
    
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  }, [formData, currentStep, isLoaded]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calcular edad
    if (name === 'dateOfBirth' && value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }

    // Auto-calcular BMI
    if ((name === 'heightFeet' || name === 'heightInches' || name === 'weightLbs') && formData.measurementSystem === 'standard') {
      const feet = name === 'heightFeet' ? parseFloat(value) : parseFloat(formData.heightFeet);
      const inches = name === 'heightInches' ? parseFloat(value) : parseFloat(formData.heightInches);
      const weight = name === 'weightLbs' ? parseFloat(value) : parseFloat(formData.weightLbs);
      
      if (feet && weight) {
        const totalInches = (feet * 12) + (inches || 0);
        const bmi = (weight / (totalInches * totalInches)) * 703;
        setFormData(prev => ({ ...prev, bmi: bmi.toFixed(2) }));
      }
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFormData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
      setFormData(initialFormData);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error al limpiar datos:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, language: 'es' | 'en') => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    
    try {
      // Aquí se integrará la generación de PDF y envío de correo
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, language }),
      });

      if (response.ok) {
        const successMessage = language === 'es' 
          ? 'Formulario enviado exitosamente. Recibirás un correo con la confirmación.' 
          : 'Form submitted successfully. You will receive a confirmation email.';
        alert(successMessage);
        
        // Limpiar datos después de envío exitoso
        clearFormData();
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      const errorMessage = language === 'es'
        ? 'Error al enviar el formulario. Por favor, intenta de nuevo.'
        : 'Error submitting the form. Please try again.';
      alert(errorMessage);
      console.error('Error:', error);
    }
  };

  const isBariatricSurgery = formData.surgeryInterest === 'first-time-bariatric' || formData.surgeryInterest === 'revisional-bariatric';
  const isPlasticSurgery = formData.surgeryInterest === 'primary-plastic' || formData.surgeryInterest === 'post-bariatric-plastic';
  const totalSteps = formData.surgeryInterest === '' ? 3 : isBariatricSurgery ? 5 : 4;

  return {
    currentStep,
    formData,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    isBariatricSurgery,
    isPlasticSurgery,
    totalSteps,
    setFormData,
    clearFormData,
  };
}

