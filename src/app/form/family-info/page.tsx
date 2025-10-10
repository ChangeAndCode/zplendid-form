'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useEffect } from 'react';
import { getPatientId, formatPatientId, getFormStorageKey } from '../../utils/patientId';
import Button from '../../components/atoms/Button';
import SelectField from '../../components/molecules/SelectField';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';

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
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
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

  useEffect(() => {
    const id = getPatientId();
    setPatientId(id);

    // Cargar datos guardados
    try {
      const storageKey = getFormStorageKey('family_history', id);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }, []);

  // Auto-guardar
  useEffect(() => {
    if (!patientId) return;
    
    try {
      const storageKey = getFormStorageKey('family_history', patientId);
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  }, [formData, patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <LanguageSwitcher />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                {language === 'es' ? 'Historial Familiar' : 'Family History'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' ? 'Módulo 2 de 4' : 'Module 2 of 4'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {language === 'es' ? 'Expediente' : 'Patient ID'}
              </div>
              <div className="text-lg font-bold text-[#212e5c] font-mono">
                {formatPatientId(patientId)}
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
              onClick={() => router.push('/')}
              variant="secondary"
            >
              {language === 'es' ? 'Guardar y Volver' : 'Save and Return'}
            </Button>
            <Button type="submit">
              {language === 'es' ? 'Guardar y Continuar' : 'Save and Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

