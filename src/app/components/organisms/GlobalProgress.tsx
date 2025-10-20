'use client';

import { useLanguage } from '../../context/LanguageContext';

interface GlobalProgressProps {
  completedForms: string[];
  totalForms: number;
}

const formNames = {
  es: ['Paciente', 'Cirugía', 'Clínico', 'Familia'],
  en: ['Patient', 'Surgery', 'Medical', 'Family']
};

const formIds = ['patient-info', 'surgery-interest', 'medical-history', 'family-info'];

export default function GlobalProgress({ completedForms, totalForms }: GlobalProgressProps) {
  const { language } = useLanguage();
  const completedCount = completedForms.length;
  const progressPercentage = (completedCount / totalForms) * 100;
  const names = formNames[language];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#212e5c]">
          {language === 'es' ? 'Progreso General' : 'Overall Progress'}
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {completedCount}/{totalForms} {language === 'es' ? 'completados' : 'completed'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-[#212e5c] to-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Form Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              completedForms.includes(formIds[index])
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-2xl mb-1">
              {completedForms.includes(formIds[index]) ? '✓' : (index + 1)}
            </div>
            <div className="text-xs font-medium text-gray-600">
              {names[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

