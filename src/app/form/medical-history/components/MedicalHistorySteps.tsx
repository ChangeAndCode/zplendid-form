'use client';

import { useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import SelectField from '../../../components/molecules/SelectField';
import FormField from '../../../components/molecules/FormField';
import TextareaField from '../../../components/molecules/TextareaField';
import IntelligentMedicalAssistant from '../../../components/atoms/IntelligentMedicalAssistant';
import Button from '../../../components/atoms/Button';

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

interface MedicalHistoryStepsProps {
  formData: MedicalHistoryData;
  patientGender: string; // Para condicional de Women's Health
  onFormDataChange: (field: keyof MedicalHistoryData, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function MedicalHistorySteps({
  formData,
  patientGender,
  onFormDataChange,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}: MedicalHistoryStepsProps) {
  const { language } = useLanguage();

  // Omitir Step 12 (Women's Health) si el paciente es masculino
  useEffect(() => {
    if (currentStep === 12 && patientGender === 'male') {
      // Si llegamos al Step 12 y el paciente es masculino, saltar automáticamente
      // Determinar dirección: si venimos del 11, ir al 13; si venimos del 13, ir al 11
      const timer = setTimeout(() => {
        onNext(); // Avanzar al Step 13
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentStep, patientGender, onNext]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange(name as keyof MedicalHistoryData, value);
  };

  const handleAssistantSuggestion = (field: keyof MedicalHistoryData, value: string) => {
    onFormDataChange(field, value);
  };

  // Wizard Step Logic
  // 1. Past Medical History (Sleep Apnea, Diabetes, HBP)
  // 2. Heart Problems
  // 3. Respiratory Problems
  // 4. Gastrointestinal Conditions
  // 5. Head & Neck
  // 6. Skin Conditions
  // 7. Constitutional Symptoms
  // 8. Other Systems (Urinary, Muscular, Neuro, Blood, Endocrine)
  // 9. Social History (Tobacco, Alcohol, Drugs)
  // 10. Diet & Caffeine
  // 11. Medications & Allergies
  // 12. Women's Health (Conditional)
  // 13. Psychiatric & Previous Surgeries

  const renderStep = () => {
    const stepContentClass = "animate-fadeIn";
    const questionGroupClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-300";
    const sectionTitleClass = "text-xl font-bold text-[#212e5c] mb-6 flex items-center gap-2";

    switch (currentStep) {
      case 1: // Past Medical History
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🏥</span>
                {language === 'es' ? 'Historial Médico General' : 'General Medical History'}
              </h3>

              <div className="space-y-6">
                <div className="bg-blue-50/50 p-4 rounded-lg space-y-4">
                  <SelectField
                    label={language === 'es' ? '¿Tiene Apnea del Sueño?' : 'Do you have Sleep Apnea?'}
                    name="sleepApnea"
                    value={formData.sleepApnea}
                    onChange={handleChange}
                  >
                    <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                    <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                    <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                  </SelectField>

                  {formData.sleepApnea === 'yes' && (
                    <div className="pl-4 border-l-2 border-blue-200 space-y-4 animate-slideDown">
                      <SelectField
                        label={language === 'es' ? '¿Usa CPAP?' : 'Do you use C-PAP?'}
                        name="useCpap"
                        value={formData.useCpap}
                        onChange={handleChange}
                      >
                        <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                        <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                        <option value="cpap">C-PAP</option>
                        <option value="bipap">Bi-PAP</option>
                      </SelectField>

                      {formData.useCpap !== 'no' && (
                        <FormField
                          label={language === 'es' ? 'Detalles (horas por noche)' : 'Details (hours per night)'}
                          name="cpapDetails"
                          value={formData.cpapDetails}
                          onChange={handleChange}
                          placeholder={language === 'es' ? 'Ej: 8 horas' : 'Ex: 8 hours'}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-lg space-y-4">
                  <SelectField
                    label={language === 'es' ? '¿Tiene Diabetes?' : 'Do you have Diabetes?'}
                    name="diabetes"
                    value={formData.diabetes}
                    onChange={handleChange}
                  >
                    <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                    <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                    <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                  </SelectField>

                  {formData.diabetes === 'yes' && (
                    <div className="pl-4 border-l-2 border-blue-200 animate-slideDown">
                      <SelectField
                        label={language === 'es' ? '¿Usa insulina?' : 'Do you use insulin?'}
                        name="useInsulin"
                        value={formData.useInsulin}
                        onChange={handleChange}
                      >
                        <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                        <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                        <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                      </SelectField>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-lg">
                  <SelectField
                    label={language === 'es' ? '¿Tiene Presión Arterial Alta?' : 'Do you have High Blood Pressure?'}
                    name="highBloodPressure"
                    value={formData.highBloodPressure}
                    onChange={handleChange}
                  >
                    <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                    <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                    <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                  </SelectField>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Heart Problems
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">❤️</span>
                {language === 'es' ? 'Salud Cardíaca' : 'Heart Health'}
              </h3>
              <p className="text-gray-500 mb-6 text-sm">
                {language === 'es' ? 'Por favor indique si ha tenido alguna de estas condiciones:' : 'Please indicate if you have had any of these conditions:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'heartAttack', label: 'Heart Attack' },
                  { key: 'angina', label: 'Angina' },
                  { key: 'congestiveHeartFailure', label: 'Congestive Heart Failure' },
                  { key: 'pacemaker', label: 'Pacemaker' },
                  { key: 'irregularHeartBeat', label: 'Irregular Heart Beat' },
                  { key: 'heartMurmur', label: 'Heart Murmur' },
                  { key: 'cloggedHeartArteries', label: 'Clogged Heart Arteries' },
                  { key: 'heartBypass', label: 'Heart Bypass' },
                  { key: 'rhythmDisturbance', label: 'Rhythm Disturbance' },
                  { key: 'rheumaticFever', label: 'Rheumatic Fever' },
                  { key: 'ankleSwelling', label: 'Ankle Swelling' },
                  { key: 'varicoseVeins', label: 'Varicose Veins' },
                  { key: 'phlebitis', label: 'Phlebitis' },
                  { key: 'hemorrhoids', label: 'Hemorrhoids' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <TextareaField
                  label={language === 'es' ? 'Otros síntomas cardíacos' : 'Other Heart Symptoms'}
                  name="otherHeartSymptoms"
                  value={formData.otherHeartSymptoms}
                  onChange={handleChange}
                  rows={2}
                  placeholder={language === 'es' ? 'Describa...' : 'Describe...'}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Respiratory Problems
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🫁</span>
                {language === 'es' ? 'Salud Respiratoria' : 'Respiratory Health'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'respiratoryProblems', label: 'Asthma' },
                  { key: 'emphysema', label: 'Emphysema' },
                  { key: 'bronchitis', label: 'Bronchitis' },
                  { key: 'pneumonia', label: 'Pneumonia' },
                  { key: 'chronicCough', label: 'Chronic Cough' },
                  { key: 'shortOfBreath', label: 'Short of Breath' },
                  { key: 'tuberculosis', label: 'Tuberculosis' },
                  { key: 'pulmonaryEmbolism', label: 'Pulmonary Embolism' },
                  { key: 'hypoventilationSyndrome', label: 'Hypoventilation Syndrome' },
                  { key: 'coughUpBlood', label: 'Cough Up Blood' },
                  { key: 'snoring', label: 'Snoring' },
                  { key: 'lungSurgery', label: 'Lung Surgery' },
                  { key: 'lungCancer', label: 'Lung Cancer' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <SelectField
                  label="Do you use Oxygen?"
                  name="oxygenSupplement"
                  value={formData.oxygenSupplement}
                  onChange={handleChange}
                >
                  <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                </SelectField>
              </div>
            </div>
          </div>
        );

      case 4: // Gastrointestinal
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🍽️</span>
                {language === 'es' ? 'Salud Gastrointestinal' : 'Gastrointestinal Health'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'heartburn', label: 'Heartburn' },
                  { key: 'hiatalHernia', label: 'Hiatal Hernia' },
                  { key: 'ulcers', label: 'Ulcers' },
                  { key: 'constipation', label: 'Constipation' },
                  { key: 'irritableBowel', label: 'Irritable Bowel' },
                  { key: 'colitis', label: 'Colitis' },
                  { key: 'crohns', label: 'Crohns Disease' },
                  { key: 'gallbladderProblems', label: 'Gallbladder Problems' },
                  { key: 'diarrhea', label: 'Diarrhea' },
                  { key: 'bloodInStool', label: 'Blood in Stool' },
                  { key: 'changeBowelHabit', label: 'Change in Bowel Habits' },
                  { key: 'fissure', label: 'Anal Fissure' },
                  { key: 'rectalBleeding', label: 'Rectal Bleeding' },
                  { key: 'blackTarryStools', label: 'Black Tarry Stools' },
                  { key: 'polyps', label: 'Polyps' },
                  { key: 'abdominalPain', label: 'Abdominal Pain' },
                  { key: 'enlargedLiver', label: 'Enlarged Liver' },
                  { key: 'cirrhosisHepatitis', label: 'Cirrhosis/Hepatitis' },
                  { key: 'jaundice', label: 'Jaundice' },
                  { key: 'pancreaticDisease', label: 'Pancreatic Disease' },
                  { key: 'unusualVomiting', label: 'Unusual Vomiting' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Head & Neck
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">👤</span>
                {language === 'es' ? 'Cabeza y Cuello' : 'Head & Neck'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'wearContactsGlasses', label: 'Wear Contacts/Glasses' },
                  { key: 'visionProblems', label: 'Vision Problems' },
                  { key: 'hearingProblems', label: 'Hearing Problems' },
                  { key: 'swallowingDifficulty', label: 'Swallowing Difficulty' },
                  { key: 'dentures', label: 'Dentures/Partial' },
                  { key: 'sinusDrainage', label: 'Sinus Drainage' },
                  { key: 'neckLumps', label: 'Neck Lumps' },
                  { key: 'oralSores', label: 'Oral Sores' },
                  { key: 'hoarseness', label: 'Hoarseness' },
                  { key: 'headNeckSurgery', label: 'Head/Neck Surgery' },
                  { key: 'headNeckCancer', label: 'Head/Neck Cancer' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Skin
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🧴</span>
                {language === 'es' ? 'Piel' : 'Skin Conditions'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'rashesUnderSkin', label: 'Rashes under Skin Folds' },
                  { key: 'keloids', label: 'Keloids' },
                  { key: 'poorWoundHealing', label: 'Poor Wound Healing' },
                  { key: 'frequentSkinInfections', label: 'Frequent Skin Infections' },
                  { key: 'skinSurgery', label: 'Skin Surgery' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7: // Constitutional
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🌡️</span>
                {language === 'es' ? 'Síntomas Generales' : 'Constitutional Symptoms'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'fevers', label: 'Fevers' },
                  { key: 'nightSweats', label: 'Night Sweats' },
                  { key: 'weightLoss', label: 'Unexpected Weight Loss' },
                  { key: 'chronicFatigue', label: 'Chronic Fatigue' },
                  { key: 'hairLoss', label: 'Hair Loss' }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <SelectField
                      label={item.label}
                      name={item.key}
                      value={formData[item.key as keyof MedicalHistoryData]}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 8: // Other Systems
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🧬</span>
                {language === 'es' ? 'Otros Sistemas' : 'Other Systems'}
              </h3>

              <div className="space-y-6">
                {/* Urinary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Urinary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Kidney Stones" name="kidneyStones" value={formData.kidneyStones} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Frequent Urination" name="frequentUrination" value={formData.frequentUrination} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Loss of Bladder Control" name="bladderControl" value={formData.bladderControl} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Painful Urination" name="painfulUrination" value={formData.painfulUrination} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                </div>

                {/* Muscular */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Musculoskeletal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Arthritis" name="muscularConditions" value={formData.muscularConditions} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Back Pain" name="backPain" value={formData.backPain} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Joint Replacement" name="jointReplacement" value={formData.jointReplacement} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Lupus" name="lupus" value={formData.lupus} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                </div>

                {/* Neurological */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Neurological</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Migraine Headaches" name="neurologicalConditions" value={formData.neurologicalConditions} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Seizure/Epilepsy" name="seizure" value={formData.seizure} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Stroke" name="stroke" value={formData.stroke} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                </div>

                {/* Blood & Endocrine */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Blood & Endocrine</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Anemia" name="bloodDisorders" value={formData.bloodDisorders} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Thyroid Problems" name="endocrineCondition" value={formData.endocrineCondition} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Hepatitis" name="hepatitis" value={formData.hepatitis} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    {formData.hepatitis === 'yes' && (
                      <div className="pl-4 border-l-2 border-blue-200 animate-slideDown">
                        <SelectField label={language === 'es' ? '¿Qué tipo de hepatitis?' : 'What type of hepatitis?'} name="hepatitisType" value={formData.hepatitisType} onChange={handleChange}>
                          <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                          <option value="B">Hepatitis B</option>
                          <option value="C">Hepatitis C</option>
                          <option value="both">{language === 'es' ? 'Ambas (B y C)' : 'Both (B and C)'}</option>
                        </SelectField>
                      </div>
                    )}
                    <SelectField label="HIV / AIDS" name="hiv" value={formData.hiv} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9: // Social History
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🍷</span>
                {language === 'es' ? 'Historia Social' : 'Social History'}
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Tobacco</h4>
                  <SelectField label="Do you currently smoke?" name="tobacco" value={formData.tobacco} onChange={handleChange}>
                    <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                  </SelectField>
                  {formData.tobacco === 'yes' && (
                    <div className="mt-3 animate-slideDown">
                      <FormField label="How many cigarettes/packs per day?" name="tobaccoAmount" value={formData.tobaccoAmount} onChange={handleChange} />
                    </div>
                  )}
                  <div className="mt-3">
                    <SelectField label="Do you use snuff or chew tobacco?" name="snuff" value={formData.snuff} onChange={handleChange}>
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                    {formData.snuff === 'yes' && (
                      <div className="mt-3 animate-slideDown">
                        <FormField label="How frequently do you use snuff/chew?" name="tobaccoDetails" value={formData.tobaccoDetails} onChange={handleChange} placeholder="e.g. Daily, Weekly" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <SelectField label="Do you use a vape or e-cigarette?" name="vape" value={formData.vape} onChange={handleChange}>
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                    {formData.vape === 'yes' && (
                      <div className="mt-3 animate-slideDown">
                        <FormField label="How frequently do you use a vape or e-cigarette?" name="tobaccoDetails" value={formData.tobaccoDetails} onChange={handleChange} placeholder="e.g. Daily, Weekly" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="For how many years have/did you use tobacco?" name="tobaccoYears" value={formData.tobaccoYears} onChange={handleChange} placeholder="e.g. 10 years, N/A" />
                    <FormField label="If you have quit, how long ago did you stop using tobacco products?" name="tobaccoQuit" value={formData.tobaccoQuit} onChange={handleChange} placeholder="e.g. 2 years ago, N/A" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Alcohol</h4>
                  <SelectField label="Do you consume alcohol now?" name="alcohol" value={formData.alcohol} onChange={handleChange}>
                    <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                  </SelectField>
                  {formData.alcohol === 'yes' && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
                      <FormField label="How many times a week?" name="alcoholFrequency" value={formData.alcoholFrequency} onChange={handleChange} />
                      <FormField label="How many drinks each time?" name="alcoholAmount" value={formData.alcoholAmount} onChange={handleChange} />
                    </div>
                  )}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="For how many years do/did you drink alcohol?" name="alcoholYears" value={formData.alcoholYears} onChange={handleChange} placeholder="e.g. 5 years, Off and on" />
                    <FormField label="If you have quit, how long ago?" name="alcoholQuit" value={formData.alcoholQuit} onChange={handleChange} placeholder="e.g. 1 year ago, N/A" />
                  </div>
                  <div className="mt-3">
                    <SelectField label="Is anyone concerned about the amount you drink?" name="alcoholConcern" value={formData.alcoholConcern} onChange={handleChange}>
                      <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                    </SelectField>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Drugs</h4>
                  <SelectField label="Do you use street drugs now?" name="drugs" value={formData.drugs} onChange={handleChange}>
                    <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                  </SelectField>
                  {formData.drugs === 'yes' && (
                    <div className="mt-3 animate-slideDown">
                      <FormField label="Which drugs and how frequently?" name="drugsDetails" value={formData.drugsDetails} onChange={handleChange} />
                    </div>
                  )}
                  {formData.drugs === 'no' && (
                    <div className="mt-3">
                      <FormField label="If you have quit, how long ago?" name="drugsQuit" value={formData.drugsQuit} onChange={handleChange} placeholder="e.g. 3 years ago, N/A" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 10: // Diet & Caffeine
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">☕</span>
                {language === 'es' ? 'Dieta y Cafeína' : 'Diet & Caffeine'}
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Caffeine</h4>
                  <SelectField label="Do you drink coffee or caffeine beverages?" name="caffeine" value={formData.caffeine} onChange={handleChange}>
                    <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                  </SelectField>
                  {formData.caffeine === 'yes' && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
                      <FormField label={language === 'es' ? '¿Cuántas tazas al día?' : 'How many cups per day?'} name="caffeineAmount" value={formData.caffeineAmount} onChange={handleChange} placeholder="e.g. 2-3" />
                      <FormField label={language === 'es' ? '¿Qué tipo de bebida?' : 'What type of drink?'} name="caffeineType" value={formData.caffeineType} onChange={handleChange} placeholder={language === 'es' ? 'Ej: Café, Té, Bebida energética' : 'Ex: Coffee, Tea, Energy drink'} />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Dietary Habits</h4>
                  <div className="space-y-4">
                    <FormField label="How often do you eat sweets?" name="sweetsFrequency" value={formData.sweetsFrequency} onChange={handleChange} placeholder="e.g. 2 to 3 times a month" />
                    <FormField label="How often do you eat fast food?" name="fastFoodFrequency" value={formData.fastFoodFrequency} onChange={handleChange} placeholder="e.g. Once a month" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">{language === 'es' ? 'Bebidas Carbonatadas' : 'Carbonated Beverages'}</h4>
                  <SelectField label={language === 'es' ? '¿Bebes bebidas carbonatadas?' : 'Do you drink carbonated beverages?'} name="carbonatedDrinks" value={formData.carbonatedDrinks} onChange={handleChange}>
                    <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                    <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                    <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                  </SelectField>
                  {formData.carbonatedDrinks === 'yes' && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
                      <FormField label={language === 'es' ? '¿Qué tipos?' : 'What types?'} name="carbonatedType" value={formData.carbonatedType} onChange={handleChange} placeholder={language === 'es' ? 'Ej: Soda, Agua mineral' : 'Ex: Soda, Sparkling water'} />
                      <FormField label={language === 'es' ? '¿Cuántas al día?' : 'How many per day?'} name="carbonatedAmount" value={formData.carbonatedAmount} onChange={handleChange} placeholder="e.g. 1-2" />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">{language === 'es' ? 'Otras Sustancias' : 'Other Substances'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="Marijuana?" name="marijuana" value={formData.marijuana} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Aspirin?" name="aspirin" value={formData.aspirin} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Hormones?" name="hormones" value={formData.hormones} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                  <div className="mt-3">
                    <FormField label={language === 'es' ? 'Otras sustancias (Especifique)' : 'Other substances (Specify)'} name="otherSubstances" value={formData.otherSubstances} onChange={handleChange} placeholder={language === 'es' ? 'Especifique otras sustancias...' : 'Specify other substances...'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11: // Medications & Allergies
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">💊</span>
                {language === 'es' ? 'Medicamentos y Alergias' : 'Medications & Allergies'}
              </h3>

              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      {language === 'es' ? 'Medicamentos Actuales' : 'Current Medications'}
                    </label>
                    <IntelligentMedicalAssistant
                      fieldType="medications"
                      currentValue={formData.medications}
                      onSuggestionSelect={(value) => handleAssistantSuggestion('medications', value)}
                      context={`Paciente con: ${formData.sleepApnea === 'yes' ? 'Apnea del sueño' : ''} ${formData.diabetes === 'yes' ? 'Diabetes' : ''} ${formData.highBloodPressure === 'yes' ? 'Presión arterial alta' : ''}`}
                    />
                  </div>
                  <TextareaField
                    label=""
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    rows={4}
                    placeholder={language === 'es' ? 'Liste todos los medicamentos que toma actualmente...' : 'List all medications you currently take...'}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      {language === 'es' ? 'Alergias' : 'Allergies'}
                    </label>
                    <IntelligentMedicalAssistant
                      fieldType="allergies"
                      currentValue={formData.allergies}
                      onSuggestionSelect={(value) => handleAssistantSuggestion('allergies', value)}
                      context={`Medicamentos actuales: ${formData.medications}`}
                    />
                  </div>
                  <TextareaField
                    label=""
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows={3}
                    placeholder={language === 'es' ? 'Describa cualquier alergia conocida...' : 'Describe any known allergies...'}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 12: // Women's Health
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🌸</span>
                {language === 'es' ? 'Salud Femenina' : 'Women\'s Health'}
              </h3>

              <div className="bg-pink-50 p-6 rounded-lg border border-pink-100 space-y-6">
                <FormField label="Date of menstrual cycle" name="menstrualCycleDate" type="date" value={formData.menstrualCycleDate} onChange={handleChange} />
                <SelectField label="Do you use hormonal contraception?" name="hormonalContraception" value={formData.hormonalContraception} onChange={handleChange}>
                  <option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option>
                </SelectField>
                <TextareaField
                  label="List pregnancies, date and outcome"
                  name="pregnanciesList"
                  value={formData.pregnanciesList}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Full term, premature, C-section, miscarriage..."
                />
              </div>
            </div>
          </div>
        );

      case 13: // Psychiatric & Final
        return (
          <div className={stepContentClass}>
            <div className={questionGroupClass}>
              <h3 className={sectionTitleClass}>
                <span className="text-2xl">🧠</span>
                {language === 'es' ? 'Información Final' : 'Final Information'}
              </h3>

              <div className="space-y-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#212e5c] mb-3">Psychiatric Conditions</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <SelectField label="Have you ever been in a psychiatric hospital?" name="psychiatricHospital" value={formData.psychiatricHospital} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Have you ever attempted suicide?" name="attemptedSuicide" value={formData.attemptedSuicide} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Have you ever been physically abused?" name="physicallyAbused" value={formData.physicallyAbused} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Have you ever seen a psychiatrist or counselor?" name="seenPsychiatrist" value={formData.seenPsychiatrist} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Have you ever taken medications for psychiatric problems or for depression?" name="psychiatricMedications" value={formData.psychiatricMedications} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                    <SelectField label="Have you ever been in a chemical dependency program?" name="chemicalDependency" value={formData.chemicalDependency} onChange={handleChange}><option value="">Select...</option><option value="no">No</option><option value="yes">Yes</option></SelectField>
                  </div>
                </div>

                <TextareaField
                  label={language === 'es' ? 'Cirugías Previas' : 'Previous Surgeries'}
                  name="previousSurgeries"
                  value={formData.previousSurgeries}
                  onChange={handleChange}
                  rows={3}
                  placeholder={language === 'es' ? 'Describa cualquier cirugía previa...' : 'Describe any previous surgeries...'}
                />

                <TextareaField
                  label={language === 'es' ? 'Otras Condiciones' : 'Other Conditions'}
                  name="otherConditions"
                  value={formData.otherConditions}
                  onChange={handleChange}
                  rows={3}
                  placeholder={language === 'es' ? 'Cualquier otra información relevante...' : 'Any other relevant information...'}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'es' ? 'Paso' : 'Step'} {currentStep} {language === 'es' ? 'de' : 'of'} {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#212e5c] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onPrevious}
          variant="secondary"
          className="px-6 py-3"
        >
          {currentStep === 1
            ? (language === 'es' ? 'Guardar y Volver' : 'Save and Return')
            : (language === 'es' ? 'Anterior' : 'Previous')
          }
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-[#212e5c] text-white hover:bg-[#1a2347]"
        >
          {currentStep === totalSteps
            ? (language === 'es' ? 'Finalizar' : 'Finish')
            : (language === 'es' ? 'Siguiente' : 'Next')
          }
        </Button>
      </div>
    </div>
  );
}
