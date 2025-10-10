'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface Suggestion {
  category: string;
  items: string[];
}

interface HealthAssistantButtonProps {
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

export default function HealthAssistantButton({ type, currentValue, onSuggestionSelect }: HealthAssistantButtonProps) {
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

  const handleSuggestionClick = (item: string) => {
    const separator = currentValue && !currentValue.endsWith(',') && !currentValue.endsWith(', ') ? ', ' : '';
    onSuggestionSelect(currentValue + separator + item);
  };

  const suggestions = getSuggestions();

  const assistantTitle = {
    medications: language === 'es' ? 'Asistente de Medicamentos' : 'Medication Assistant',
    allergies: language === 'es' ? 'Asistente de Alergias' : 'Allergy Assistant',
    conditions: language === 'es' ? 'Asistente Médico' : 'Medical Assistant'
  };

  return (
    <div className="relative">
      {/* Botón de ayuda compacto */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200 transition-colors"
        title={assistantTitle[type]}
      >
        <span>🤖</span>
        <span className="hidden sm:inline">{language === 'es' ? 'Ayuda' : 'Help'}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown de sugerencias */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de sugerencias */}
          <div className="absolute top-8 left-0 z-20 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-sm text-[#212e5c]">
                {assistantTitle[type]}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {language === 'es'
                  ? 'Haz clic en las sugerencias para agregarlas:'
                  : 'Click suggestions to add them:'}
              </p>
            </div>
            
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="space-y-4">
                {suggestions.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h5 className="text-xs font-semibold text-[#212e5c] mb-2 uppercase tracking-wide">
                      {category.category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className="px-2 py-1 text-xs bg-gray-50 hover:bg-[#212e5c] hover:text-white border border-gray-200 rounded transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {language === 'es'
                    ? '💡 Incluye dosis y frecuencia cuando sea posible'
                    : '💡 Include dosage and frequency when possible'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
