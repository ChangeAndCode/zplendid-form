'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import Button from '../../components/atoms/Button';
import SelectField from '../../components/molecules/SelectField';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';
import StepNumber from '../../components/atoms/StepNumber';

interface FamilyHistoryData {
  heartDisease: string;
  pulmonaryEdema: string;
  diabetesMellitus: string;
  highBloodPressure: string;
  alcoholism: string;
  liverProblems: string;
  lungProblems: string;
  bleedingDisorder: string;
  gallstones: string;
  mentalIllness: string;
  malignantHyperthermia: string;
  cancer: string;
  otherFamilyConditions: string;
}

export default function FamilyInfoForm() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, patientId, getPatientRecord } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FamilyHistoryData>({
    heartDisease: '',
    pulmonaryEdema: '',
    diabetesMellitus: '',
    highBloodPressure: '',
    alcoholism: '',
    liverProblems: '',
    lungProblems: '',
    bleedingDisorder: '',
    gallstones: '',
    mentalIllness: '',
    malignantHyperthermia: '',
    cancer: '',
    otherFamilyConditions: '',
  });


  // Verificar autenticación y obtener expediente
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Obtener expediente del paciente cuando esté autenticado
  useEffect(() => {
    if (isAuthenticated && !patientId) {
      getPatientRecord();
    }
  }, [isAuthenticated, patientId, getPatientRecord]);

  // Cargar datos existentes del formulario
  useEffect(() => {
    const loadExistingData = async () => {
      if (isAuthenticated && patientId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('/api/forms/family-info', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setFormData(result.data);
            }
          }
        } catch (error) {
          console.error('Error al cargar datos existentes:', error);
        }
      }
    };

    loadExistingData();
  }, [isAuthenticated, patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert(language === 'es' ? 'No estás autenticado' : 'You are not authenticated');
        router.push('/');
        return;
      }

      const response = await fetch('/api/forms/family-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert(language === 'es' ? 'Formulario guardado correctamente' : 'Form saved successfully');
        router.push('/landing');
      } else {
        alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
    }
  };

  // Mostrar carga mientras verifica autenticación
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

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <LanguageSwitcher />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <StepNumber 
                stepNumber={4}
                totalSteps={4}
                isActive={true}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                  {language === 'es' ? 'Historial Familiar' : 'Family History'}
                </h1>
                <p className="text-gray-600">
                  {language === 'es' ? 'Módulo 4 de 4' : 'Module 4 of 4'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {language === 'es' ? 'Expediente' : 'Patient ID'}
              </div>
              <div className="text-lg font-bold text-[#212e5c] font-mono">
                {patientId || 'Cargando...'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Family Medical History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Condiciones Médicas Familiares' : 'Family Medical Conditions'}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {language === 'es'
                ? 'Indica si algún familiar directo (padres, hermanos, abuelos) ha padecido estas condiciones.'
                : 'Indicate if any direct family member (parents, siblings, grandparents) has had these conditions.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label={language === 'es' ? 'Enfermedad Cardíaca' : 'Heart Disease'}
                name="heartDisease"
                value={formData.heartDisease}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Edema Pulmonar' : 'Pulmonary Edema'}
                name="pulmonaryEdema"
                value={formData.pulmonaryEdema}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Diabetes Mellitus' : 'Diabetes Mellitus'}
                name="diabetesMellitus"
                value={formData.diabetesMellitus}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Presión Arterial Alta' : 'High Blood Pressure'}
                name="highBloodPressure"
                value={formData.highBloodPressure}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Alcoholismo' : 'Alcoholism'}
                name="alcoholism"
                value={formData.alcoholism}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Problemas Hepáticos' : 'Liver Problems'}
                name="liverProblems"
                value={formData.liverProblems}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Problemas Pulmonares' : 'Lung Problems'}
                name="lungProblems"
                value={formData.lungProblems}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Trastorno de Sangrado' : 'Bleeding Disorder'}
                name="bleedingDisorder"
                value={formData.bleedingDisorder}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Cálculos Biliares' : 'Gallstones'}
                name="gallstones"
                value={formData.gallstones}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Enfermedad Mental' : 'Mental Illness'}
                name="mentalIllness"
                value={formData.mentalIllness}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Hipertermia Maligna' : 'Malignant Hyperthermia'}
                name="malignantHyperthermia"
                value={formData.malignantHyperthermia}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>

              <SelectField
                label={language === 'es' ? 'Cáncer' : 'Cancer'}
                name="cancer"
                value={formData.cancer}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'es' ? 'Otras condiciones familiares (opcional)' : 'Other family conditions (optional)'}
              </label>
              <textarea
                name="otherFamilyConditions"
                value={formData.otherFamilyConditions}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent"
                placeholder={language === 'es' ? 'Especifica otras condiciones...' : 'Specify other conditions...'}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between bg-white rounded-lg shadow-md p-6">
            <Button
              type="button"
              onClick={() => router.push('/landing')}
              variant="secondary"
            >
              {language === 'es' ? 'Regresar' : 'Return'}
            </Button>
            <Button type="submit">
              {language === 'es' ? 'Continuar' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

