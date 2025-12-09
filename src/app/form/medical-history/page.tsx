'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';
import MedicalHistorySteps from './components/MedicalHistorySteps';
import StepNumber from '../../components/atoms/StepNumber';

interface MedicalHistoryData {
  // Past Medical History
  sleepApnea: string;
  useCpap: string;
  cpapDetails: string;
  diabetes: string;
  useInsulin: string;

  // Other Conditions
  otherMedicalConditions: string;

  // Heart Problems
  highBloodPressure: string;
  heartProblems: string;
  heartAttack: string;
  angina: string;
  rhythmDisturbance: string;
  congestiveHeartFailure: string;
  ankleSwelling: string;
  varicoseVeins: string;
  hemorrhoids: string;
  phlebitis: string;
  ankleLegUlcers: string;
  heartBypass: string;
  pacemaker: string;
  cloggedHeartArteries: string;
  rheumaticFever: string;
  heartMurmur: string;
  irregularHeartBeat: string;
  crampingLegs: string;
  otherHeartSymptoms: string;

  // Respiratory
  respiratoryProblems: string;
  respiratoryProblemsDetails: string;
  emphysema: string;
  bronchitis: string;
  pneumonia: string;
  chronicCough: string;
  shortOfBreath: string;
  oxygenSupplement: string;
  tuberculosis: string;
  pulmonaryEmbolism: string;
  hypoventilationSyndrome: string;
  coughUpBlood: string;
  snoring: string;
  lungSurgery: string;
  lungCancer: string;

  // Other Systems
  urinaryConditions: string;
  urinaryConditionsDetails: string;
  kidneyStones: string;
  frequentUrination: string;
  bladderControl: string;
  painfulUrination: string;

  muscularConditions: string;
  muscularConditionsDetails: string;
  neckPain: string;
  shoulderPain: string;
  wristPain: string;
  backPain: string;
  hipPain: string;
  kneePain: string;
  anklePain: string;
  footPain: string;
  heelPain: string;
  plantarFasciitis: string;
  carpalTunnel: string;
  lupus: string;
  scleroderma: string;
  sciatica: string;
  autoimmuneDisease: string;
  musclePainSpasm: string;
  brokenBones: string;
  jointReplacement: string;
  nerveInjury: string;
  muscularDystrophy: string;

  neurologicalConditions: string;
  neurologicalConditionsDetails: string;
  balanceDisturbance: string;
  seizure: string;
  weakness: string;
  stroke: string;
  alzheimers: string;
  pseudoTumorCerebral: string;
  multipleSclerosis: string;
  severeHeadaches: string;
  knockedUnconscious: string;

  bloodDisorders: string;
  bloodDisordersDetails: string;
  anemiaIron: string;
  anemiaB12: string;
  lowPlatelets: string;
  lymphoma: string;
  swollenLymphNodes: string;
  superficialBloodClot: string;
  deepBloodClot: string;
  bloodClotLungs: string;
  bloodTransfusion: string;
  bloodThinningMedicine: string;

  endocrineCondition: string;
  endocrineConditionDetails: string;
  hypothyroid: string;
  hyperthyroid: string;
  goiter: string;
  parathyroid: string;
  elevatedCholesterol: string;
  elevatedTriglycerides: string;
  lowBloodSugar: string;
  prediabetes: string;
  gout: string;
  endocrineGlandTumor: string;
  endocrineCancer: string;
  highCalcium: string;
  abnormalFacialHair: string;

  gastrointestinalConditions: string;
  heartburn: string;
  hiatalHernia: string;
  ulcers: string;
  diarrhea: string;
  bloodInStool: string;
  changeBowelHabit: string;
  constipation: string;
  irritableBowel: string;
  colitis: string;
  crohns: string;
  fissure: string;
  rectalBleeding: string;
  blackTarryStools: string;
  polyps: string;
  abdominalPain: string;
  enlargedLiver: string;
  cirrhosisHepatitis: string;
  gallbladderProblems: string;
  jaundice: string;
  pancreaticDisease: string;
  unusualVomiting: string;

  headNeckConditions: string;
  wearContactsGlasses: string;
  visionProblems: string;
  hearingProblems: string;
  sinusDrainage: string;
  neckLumps: string;
  swallowingDifficulty: string;
  dentures: string;
  oralSores: string;
  hoarseness: string;
  headNeckSurgery: string;
  headNeckCancer: string;

  skinConditions: string;
  rashesUnderSkin: string;
  keloids: string;
  poorWoundHealing: string;
  frequentSkinInfections: string;
  skinSurgery: string;

  constitutionalSymptoms: string;
  fevers: string;
  nightSweats: string;
  anemia: string;
  weightLoss: string;
  chronicFatigue: string;
  hairLoss: string;

  // Infectious Diseases
  hepatitis: string;
  hepatitisType: string;
  hiv: string;
  refuseBlood: string;

  // Psychiatric
  psychiatricHospital: string;
  attemptedSuicide: string;
  depression: string;
  anxiety: string;
  eatingDisorders: string;
  psychiatricMedications: string;
  psychiatricTherapy: string;
  psychiatricHospitalization: string;
  physicallyAbused: string;
  seenPsychiatrist: string;
  chemicalDependency: string;
  bipolar: string;
  schizophrenia: string;

  // Social History
  tobacco: string;
  tobaccoDetails: string;
  tobaccoAmount: string;
  tobaccoYears: string;
  tobaccoQuit: string;
  snuff: string;
  vape: string;

  alcohol: string;
  alcoholDetails: string;
  alcoholFrequency: string;
  alcoholAmount: string;
  alcoholYears: string;
  alcoholQuit: string;
  alcoholConcern: string;

  drugs: string;
  drugsDetails: string;
  drugsFrequency: string;
  drugsQuit: string;

  caffeine: string;
  caffeineAmount: string;
  caffeineType: string;
  carbonatedDrinks: string;
  carbonatedType: string;
  carbonatedAmount: string;

  diet: string;
  sweetsFrequency: string;
  fastFoodFrequency: string;

  otherSubstances: string;
  marijuana: string;
  aspirin: string;
  hormones: string;

  // Medications & Allergies
  medications: string;
  allergies: string;

  // Past Surgical History
  previousSurgeries: string;
  surgicalComplications: string;

  // Diet Program
  dietProgram: string;

  // Only for Women
  pregnancy: string;
  pregnancyDetails: string;
  menstrualCycleDate: string;
  hormonalContraception: string;
  pregnanciesList: string;

  // Referral
  referral: string;
  referralDetails: string;

  // Other
  otherConditions: string;
  hospitalizations: string;
  hospitalizationsDetails: string;
}

export default function MedicalHistoryForm() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, patientId, getPatientRecord } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientGender, setPatientGender] = useState<string>(''); // Para condicional de Women's Health
  const [formData, setFormData] = useState<MedicalHistoryData>({
    sleepApnea: '',
    useCpap: '',
    cpapDetails: '',
    diabetes: '',
    useInsulin: '',
    otherMedicalConditions: '',
    highBloodPressure: '',
    heartProblems: '',
    heartAttack: '',
    angina: '',
    rhythmDisturbance: '',
    congestiveHeartFailure: '',
    ankleSwelling: '',
    varicoseVeins: '',
    hemorrhoids: '',
    phlebitis: '',
    ankleLegUlcers: '',
    heartBypass: '',
    pacemaker: '',
    cloggedHeartArteries: '',
    rheumaticFever: '',
    heartMurmur: '',
    irregularHeartBeat: '',
    crampingLegs: '',
    otherHeartSymptoms: '',
    respiratoryProblems: '',
    respiratoryProblemsDetails: '',
    emphysema: '',
    bronchitis: '',
    pneumonia: '',
    chronicCough: '',
    shortOfBreath: '',
    oxygenSupplement: '',
    tuberculosis: '',
    pulmonaryEmbolism: '',
    hypoventilationSyndrome: '',
    coughUpBlood: '',
    snoring: '',
    lungSurgery: '',
    lungCancer: '',
    urinaryConditions: '',
    urinaryConditionsDetails: '',
    kidneyStones: '',
    frequentUrination: '',
    bladderControl: '',
    painfulUrination: '',
    muscularConditions: '',
    muscularConditionsDetails: '',
    neckPain: '',
    shoulderPain: '',
    wristPain: '',
    backPain: '',
    hipPain: '',
    kneePain: '',
    anklePain: '',
    footPain: '',
    heelPain: '',
    plantarFasciitis: '',
    carpalTunnel: '',
    lupus: '',
    scleroderma: '',
    sciatica: '',
    autoimmuneDisease: '',
    musclePainSpasm: '',
    brokenBones: '',
    jointReplacement: '',
    nerveInjury: '',
    muscularDystrophy: '',
    neurologicalConditions: '',
    neurologicalConditionsDetails: '',
    balanceDisturbance: '',
    seizure: '',
    weakness: '',
    stroke: '',
    alzheimers: '',
    pseudoTumorCerebral: '',
    multipleSclerosis: '',
    severeHeadaches: '',
    knockedUnconscious: '',
    bloodDisorders: '',
    bloodDisordersDetails: '',
    anemiaIron: '',
    anemiaB12: '',
    lowPlatelets: '',
    lymphoma: '',
    swollenLymphNodes: '',
    superficialBloodClot: '',
    deepBloodClot: '',
    bloodClotLungs: '',
    bloodTransfusion: '',
    bloodThinningMedicine: '',
    endocrineCondition: '',
    endocrineConditionDetails: '',
    hypothyroid: '',
    hyperthyroid: '',
    goiter: '',
    parathyroid: '',
    elevatedCholesterol: '',
    elevatedTriglycerides: '',
    lowBloodSugar: '',
    prediabetes: '',
    gout: '',
    endocrineGlandTumor: '',
    endocrineCancer: '',
    highCalcium: '',
    abnormalFacialHair: '',
    gastrointestinalConditions: '',
    heartburn: '',
    hiatalHernia: '',
    ulcers: '',
    diarrhea: '',
    bloodInStool: '',
    changeBowelHabit: '',
    constipation: '',
    irritableBowel: '',
    colitis: '',
    crohns: '',
    fissure: '',
    rectalBleeding: '',
    blackTarryStools: '',
    polyps: '',
    abdominalPain: '',
    enlargedLiver: '',
    cirrhosisHepatitis: '',
    gallbladderProblems: '',
    jaundice: '',
    pancreaticDisease: '',
    unusualVomiting: '',
    headNeckConditions: '',
    wearContactsGlasses: '',
    visionProblems: '',
    hearingProblems: '',
    sinusDrainage: '',
    neckLumps: '',
    swallowingDifficulty: '',
    dentures: '',
    oralSores: '',
    hoarseness: '',
    headNeckSurgery: '',
    headNeckCancer: '',
    skinConditions: '',
    rashesUnderSkin: '',
    keloids: '',
    poorWoundHealing: '',
    frequentSkinInfections: '',
    skinSurgery: '',
    constitutionalSymptoms: '',
    fevers: '',
    nightSweats: '',
    anemia: '',
    weightLoss: '',
    chronicFatigue: '',
    hairLoss: '',
    hepatitis: '',
    hepatitisType: '',
    hiv: '',
    refuseBlood: '',
    psychiatricHospital: '',
    attemptedSuicide: '',
    depression: '',
    anxiety: '',
    eatingDisorders: '',
    psychiatricMedications: '',
    psychiatricTherapy: '',
    psychiatricHospitalization: '',
    physicallyAbused: '',
    seenPsychiatrist: '',
    chemicalDependency: '',
    bipolar: '',
    schizophrenia: '',
    tobacco: '',
    tobaccoDetails: '',
    tobaccoAmount: '',
    tobaccoYears: '',
    tobaccoQuit: '',
    snuff: '',
    vape: '',
    alcohol: '',
    alcoholDetails: '',
    alcoholFrequency: '',
    alcoholAmount: '',
    alcoholYears: '',
    alcoholQuit: '',
    alcoholConcern: '',
    drugs: '',
    drugsDetails: '',
    drugsFrequency: '',
    drugsQuit: '',
    caffeine: '',
    caffeineAmount: '',
    caffeineType: '',
    carbonatedDrinks: '',
    carbonatedType: '',
    carbonatedAmount: '',
    diet: '',
    sweetsFrequency: '',
    fastFoodFrequency: '',
    otherSubstances: '',
    marijuana: '',
    aspirin: '',
    hormones: '',
    medications: '',
    allergies: '',
    previousSurgeries: '',
    surgicalComplications: '',
    dietProgram: '',
    pregnancy: '',
    pregnancyDetails: '',
    menstrualCycleDate: '',
    hormonalContraception: '',
    pregnanciesList: '',
    referral: '',
    referralDetails: '',
    otherConditions: '',
    hospitalizations: '',
    hospitalizationsDetails: ''
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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar género del paciente desde Patient Info
  useEffect(() => {
    const loadPatientGender = async () => {
      if (isAuthenticated && patientId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('/api/forms/patient-info', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.gender) {
              setPatientGender(result.data.gender);
            }
          }
        } catch (error) {
          console.error('Error al cargar género del paciente:', error);
        }
      }
    };

    loadPatientGender();
  }, [isAuthenticated, patientId]);

  // Cargar datos existentes del formulario
  useEffect(() => {
    const loadExistingData = async () => {
      if (isAuthenticated && patientId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('/api/forms/medical-history', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              // Asegurar que todos los campos tengan valores de string (no undefined/null)
              const safeData: MedicalHistoryData = {} as MedicalHistoryData;
              Object.keys(formData).forEach((key) => {
                const fieldKey = key as keyof MedicalHistoryData;
                safeData[fieldKey] = result.data[fieldKey] || '';
              });
              setFormData(safeData);
            }
          }
        } catch (error) {
          console.error('Error al cargar datos existentes:', error);
        }
      }
    };

    loadExistingData();
  }, [isAuthenticated, patientId]);


  const handleFormDataChange = (field: keyof MedicalHistoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert(language === 'es' ? 'No estás autenticado' : 'You are not authenticated');
        router.push('/');
        return;
      }

      const response = await fetch('/api/forms/medical-history', {
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
        return true;
      } else {
        alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < 13) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Envío final del formulario
      const saved = await handleSave();
      if (saved) {
        // Navigate to next module (Family Info - Module 4)
        router.push('/form/family-info');
      }
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Si estamos en el paso 1, guardar y salir
      await handleSave();
      router.push('/');
    }
  };

  // Mostrar carga mientras verifica autenticación
  if (isLoading || !isHydrated) {
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
                stepNumber={3}
                totalSteps={4}
                isActive={true}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                  {language === 'es' ? 'Historial Clínico' : 'Medical History'}
                </h1>
                <p className="text-gray-600">
                  {language === 'es' ? 'Módulo 3 de 4' : 'Module 3 of 4'}
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

        <MedicalHistorySteps
          currentStep={currentStep}
          totalSteps={13}
          formData={formData}
          patientGender={patientGender}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
}