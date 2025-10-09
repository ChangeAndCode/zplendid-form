import { useState, ChangeEvent, FormEvent } from 'react';

export type SurgeryInterest = 'first-time-bariatric' | 'revisional-bariatric' | 'primary-plastic' | 'post-bariatric-plastic' | 'metabolic-rehab' | '';

export interface FormData {
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

export function useHealthForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
  });

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, language: 'es' | 'en') => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    const successMessage = language === 'es' 
      ? 'Formulario enviado exitosamente' 
      : 'Form submitted successfully';
    alert(successMessage);
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
    setFormData
  };
}

