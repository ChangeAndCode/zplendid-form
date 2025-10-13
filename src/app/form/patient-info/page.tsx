'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { getPatientId, formatPatientId, getFormStorageKey } from '../../utils/patientId';
import FormField from '../../components/molecules/FormField';
import SelectField from '../../components/molecules/SelectField';
import Button from '../../components/atoms/Button';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';

interface PatientInfoData {
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
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  // BMI
  measurementSystem: 'standard' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  bmi: string;
  // How did you hear about us
  howHeardAboutUs: string;
  otherReferral: string;
}

export default function PatientInfoForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [formData, setFormData] = useState<PatientInfoData>({
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
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    measurementSystem: 'standard',
    heightFeet: '',
    heightInches: '',
    heightCm: '',
    weightLbs: '',
    weightKg: '',
    bmi: '',
    howHeardAboutUs: '',
    otherReferral: '',
  });

  useEffect(() => {
    const id = getPatientId();
    setPatientId(id);

    // Cargar datos guardados
    try {
      const storageKey = getFormStorageKey('patient_info', id);
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
      const storageKey = getFormStorageKey('patient_info', patientId);
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  }, [formData, patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    // Auto-calcular BMI (Standard)
    if ((name === 'heightFeet' || name === 'heightInches' || name === 'weightLbs') && formData.measurementSystem === 'standard') {
      setTimeout(() => {
        const feet = name === 'heightFeet' ? parseFloat(value) : parseFloat(formData.heightFeet);
        const inches = name === 'heightInches' ? parseFloat(value) : parseFloat(formData.heightInches);
        const weight = name === 'weightLbs' ? parseFloat(value) : parseFloat(formData.weightLbs);
        
        if (feet && weight) {
          const totalInches = (feet * 12) + (inches || 0);
          const bmi = (weight / (totalInches * totalInches)) * 703;
          setFormData(prev => ({ ...prev, bmi: bmi.toFixed(2) }));
        }
      }, 100);
    }

    // Auto-calcular BMI (Metric)
    if ((name === 'heightCm' || name === 'weightKg') && formData.measurementSystem === 'metric') {
      setTimeout(() => {
        const heightCm = name === 'heightCm' ? parseFloat(value) : parseFloat(formData.heightCm);
        const weightKg = name === 'weightKg' ? parseFloat(value) : parseFloat(formData.weightKg);
        
        if (heightCm && weightKg) {
          const heightM = heightCm / 100;
          const bmi = weightKg / (heightM * heightM);
          setFormData(prev => ({ ...prev, bmi: bmi.toFixed(2) }));
        }
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <LanguageSwitcher />

        {/* Header con Patient ID */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                {language === 'es' ? 'Información del Paciente' : 'Patient Information'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' ? 'Módulo 1 de 4' : 'Module 1 of 4'}
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
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Datos Personales' : 'Personal Data'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t('field.firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('placeholder.firstName')}
                required
              />
              <FormField
                label={t('field.lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('placeholder.lastName')}
                required
              />
              <FormField
                label={t('field.dateOfBirth')}
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <FormField
                label={t('field.age')}
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t('placeholder.autoCalculated')}
                readOnly
              />
              <SelectField
                label={t('field.gender')}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t('common.select')}</option>
                <option value="male">{t('gender.male')}</option>
                <option value="female">{t('gender.female')}</option>
                <option value="other">{t('gender.other')}</option>
              </SelectField>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t('field.phone')}
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t('placeholder.phone')}
                required
              />
              <FormField
                label={t('field.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('placeholder.email')}
                required
              />
              <SelectField
                label={t('field.preferredContact')}
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
              >
                <option value="text">{t('contact.text')}</option>
                <option value="call">{t('contact.call')}</option>
                <option value="email">{t('contact.email')}</option>
              </SelectField>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {t('section.address')}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                label={t('field.addressLine')}
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                placeholder={t('placeholder.address')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label={t('field.city')}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('placeholder.city')}
                />
                <FormField
                  label={t('field.state')}
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder={t('placeholder.state')}
                />
                <FormField
                  label={t('field.country')}
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={t('placeholder.country')}
                />
                <FormField
                  label={t('field.zipcode')}
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder={t('placeholder.zipcode')}
                />
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {t('section.emergency')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t('field.emergencyFirstName')}
                name="emergencyFirstName"
                value={formData.emergencyFirstName}
                onChange={handleChange}
                placeholder={t('placeholder.emergencyName')}
                required
              />
              <FormField
                label={t('field.emergencyLastName')}
                name="emergencyLastName"
                value={formData.emergencyLastName}
                onChange={handleChange}
                placeholder={t('placeholder.emergencyLastName')}
                required
              />
              <FormField
                label={t('field.emergencyRelationship')}
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={handleChange}
                placeholder={t('placeholder.emergencyRelationship')}
                required
              />
              <FormField
                label={t('field.emergencyPhone')}
                name="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder={t('placeholder.phone')}
                required
              />
            </div>
          </div>

          {/* BMI e Información Física */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {t('section.bmi')}
            </h2>
            
            <div className="space-y-4">
              <SelectField
                label={t('field.measurementSystem')}
                name="measurementSystem"
                value={formData.measurementSystem}
                onChange={handleChange}
              >
                <option value="standard">{t('measurement.standard')}</option>
                <option value="metric">{t('measurement.metric')}</option>
              </SelectField>

              {formData.measurementSystem === 'standard' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label={t('field.heightFeet')}
                    name="heightFeet"
                    type="number"
                    value={formData.heightFeet}
                    onChange={handleChange}
                    placeholder={t('placeholder.height')}
                  />
                  <FormField
                    label={t('field.heightInches')}
                    name="heightInches"
                    type="number"
                    value={formData.heightInches}
                    onChange={handleChange}
                    placeholder={t('placeholder.heightInches')}
                  />
                  <FormField
                    label={t('field.weightLbs')}
                    name="weightLbs"
                    type="number"
                    value={formData.weightLbs}
                    onChange={handleChange}
                    placeholder={t('placeholder.weight')}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t('field.heightCm')}
                    name="heightCm"
                    type="number"
                    value={formData.heightCm}
                    onChange={handleChange}
                    placeholder={t('placeholder.heightCm')}
                  />
                  <FormField
                    label={t('field.weightKg')}
                    name="weightKg"
                    type="number"
                    value={formData.weightKg}
                    onChange={handleChange}
                    placeholder={t('placeholder.weightKg')}
                  />
                </div>
              )}

              {formData.bmi && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#212e5c]">
                      {t('bmi.calculated')}
                    </span>
                    <span className="text-3xl font-bold text-[#212e5c]">
                      {formData.bmi}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How did you hear about us */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Referencia' : 'Referral'}
            </h2>
            
            <div className="space-y-4">
              <SelectField
                label={language === 'es' ? '¿Cómo nos conoció?' : 'How did you hear about us?'}
                name="howHeardAboutUs"
                value={formData.howHeardAboutUs}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="google">Google</option>
                <option value="referral">{language === 'es' ? 'Referencia de alguien' : 'Referral from someone'}</option>
                <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
              </SelectField>

              {formData.howHeardAboutUs === 'other' && (
                <FormField
                  label={language === 'es' ? 'Especifique' : 'Specify'}
                  name="otherReferral"
                  value={formData.otherReferral}
                  onChange={handleChange}
                />
              )}
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

