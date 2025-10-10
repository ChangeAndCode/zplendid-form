'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface Suggestion {
  category: string;
  items: string[];
}

interface HealthAssistantProps {
  type: 'medications' | 'allergies' | 'conditions';
  currentValue: string;
  onSuggestionSelect: (suggestion: string) => void;
}

const medicationsSuggestions: Record<'es' | 'en', Suggestion[]> = {
  es: [
    {
      category: 'Diabetes',
      items: ['Metformina', 'Insulina (especificar tipo)', 'Glibenclamida', 'Sitagliptina']
    },
    {
      category: 'Presión Arterial',
      items: ['Losartán', 'Enalapril', 'Amlodipino', 'Hidroclorotiazida']
    },
    {
      category: 'Colesterol',
      items: ['Atorvastatina', 'Simvastatina', 'Rosuvastatina']
    },
    {
      category: 'Corazón',
      items: ['Aspirina', 'Clopidogrel', 'Warfarina']
    },
    {
      category: 'Tiroides',
      items: ['Levotiroxina', 'Metimazol']
    },
    {
      category: 'Dolor/Antiinflamatorios',
      items: ['Ibuprofeno', 'Naproxeno', 'Acetaminofén']
    }
  ],
  en: [
    {
      category: 'Diabetes',
      items: ['Metformin', 'Insulin (specify type)', 'Glibenclamide', 'Sitagliptin']
    },
    {
      category: 'Blood Pressure',
      items: ['Losartan', 'Enalapril', 'Amlodipine', 'Hydrochlorothiazide']
    },
    {
      category: 'Cholesterol',
      items: ['Atorvastatin', 'Simvastatin', 'Rosuvastatin']
    },
    {
      category: 'Heart',
      items: ['Aspirin', 'Clopidogrel', 'Warfarin']
    },
    {
      category: 'Thyroid',
      items: ['Levothyroxine', 'Methimazole']
    },
    {
      category: 'Pain/Anti-inflammatory',
      items: ['Ibuprofen', 'Naproxen', 'Acetaminophen']
    }
  ]
};

const allergiesSuggestions: Record<'es' | 'en', Suggestion[]> = {
  es: [
    {
      category: 'Antibióticos',
      items: ['Penicilina', 'Sulfa/Sulfonamidas', 'Cefalosporinas', 'Tetraciclina']
    },
    {
      category: 'Alimentos',
      items: ['Mariscos', 'Nueces', 'Lácteos', 'Huevo', 'Gluten']
    },
    {
      category: 'Otros Medicamentos',
      items: ['Aspirina', 'Ibuprofeno', 'Látex', 'Anestesia']
    }
  ],
  en: [
    {
      category: 'Antibiotics',
      items: ['Penicillin', 'Sulfa/Sulfonamides', 'Cephalosporins', 'Tetracycline']
    },
    {
      category: 'Foods',
      items: ['Shellfish', 'Nuts', 'Dairy', 'Egg', 'Gluten']
    },
    {
      category: 'Other Medications',
      items: ['Aspirin', 'Ibuprofen', 'Latex', 'Anesthesia']
    }
  ]
};

const conditionsTips: Record<'es' | 'en', { title: string; tips: string[] }> = {
  es: {
    title: '💡 Consejos para responder',
    tips: [
      'Sea honesto sobre todas sus condiciones médicas',
      'Incluya condiciones controladas con medicamentos',
      'Mencione cualquier hospitalización reciente',
      'Si tiene diabetes, especifique el tipo (Tipo 1 o Tipo 2)',
      'Si usa CPAP, indique cuántas horas por noche'
    ]
  },
  en: {
    title: '💡 Tips for answering',
    tips: [
      'Be honest about all your medical conditions',
      'Include conditions controlled with medication',
      'Mention any recent hospitalizations',
      'If you have diabetes, specify the type (Type 1 or Type 2)',
      'If you use CPAP, indicate how many hours per night'
    ]
  }
};

export default function HealthAssistant({ type, currentValue, onSuggestionSelect }: HealthAssistantProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getSuggestions = () => {
    switch (type) {
      case 'medications':
        return medicationsSuggestions[language];
      case 'allergies':
        return allergiesSuggestions[language];
      default:
        return [];
    }
  };

  const getTips = () => {
    if (type === 'conditions') {
      return conditionsTips[language];
    }
    return null;
  };

  const handleSuggestionClick = (item: string) => {
    const separator = currentValue && !currentValue.endsWith(',') && !currentValue.endsWith(', ') ? ', ' : '';
    onSuggestionSelect(currentValue + separator + item);
  };

  const suggestions = getSuggestions();
  const tips = getTips();

  const assistantTitle = {
    medications: language === 'es' ? '🤖 Asistente de Medicamentos' : '🤖 Medication Assistant',
    allergies: language === 'es' ? '🤖 Asistente de Alergias' : '🤖 Allergy Assistant',
    conditions: language === 'es' ? '🤖 Asistente Médico' : '🤖 Medical Assistant'
  };

  return (
    <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
      >
        <span className="font-medium text-[#212e5c] flex items-center gap-2">
          {assistantTitle[type]}
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
            {language === 'es' ? 'Ayuda' : 'Help'}
          </span>
        </span>
        <svg
          className={`w-5 h-5 text-[#212e5c] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2">
          {type === 'conditions' && tips ? (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#212e5c] mb-2">{tips.title}</h4>
              <ul className="space-y-1.5">
                {tips.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'es'
                  ? 'Haz clic en las sugerencias para agregarlas rápidamente:'
                  : 'Click on suggestions to add them quickly:'}
              </p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {suggestions.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h4 className="text-xs font-semibold text-[#212e5c] mb-2 uppercase tracking-wide">
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className="px-3 py-1.5 text-sm bg-white hover:bg-[#212e5c] hover:text-white border border-gray-300 rounded-full transition-colors shadow-sm"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-500 italic">
                  {language === 'es'
                    ? '💡 Consejo: Incluye dosis y frecuencia cuando sea posible (ej: "Metformina 500mg, 2 veces al día")'
                    : '💡 Tip: Include dosage and frequency when possible (e.g., "Metformin 500mg, twice daily")'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

