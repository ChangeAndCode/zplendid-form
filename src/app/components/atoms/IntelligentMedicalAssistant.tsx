'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface IntelligentMedicalAssistantProps {
  fieldType: 'medications' | 'allergies' | 'conditions' | 'general';
  currentValue?: string;
  onSuggestionSelect?: (value: string) => void;
  context?: string;
}

export default function IntelligentMedicalAssistant({ 
  fieldType
}: IntelligentMedicalAssistantProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);



  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    
    try {
      // Usar Gemini API real
      const aiResponse = await callGeminiAPI(question, fieldType, language);
      setResponse(aiResponse);
      
      // Agregar al historial
      setChatHistory(prev => [...prev, { question, answer: aiResponse }]);
      setQuestion('');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback a respuestas inteligentes locales
      const fallbackResponse = generateIntelligentResponse(question, fieldType, language);
      setResponse(fallbackResponse);
      
      setChatHistory(prev => [...prev, { question, answer: fallbackResponse }]);
      setQuestion('');
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (question: string, fieldType: string, lang: string) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          fieldType,
          language: lang
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from Gemini API');
      }
    } catch (error) {
      throw error;
    }
  };

  const generateIntelligentResponse = (question: string, fieldType: string, lang: string) => {
    const questionLower = question.toLowerCase();

    // Respuestas específicas para alergias
    if (fieldType === 'allergies') {
      if (lang === 'es') {
                // Alergia a picaduras de abeja
                if (questionLower.includes('abeja') || questionLower.includes('picad') || questionLower.includes('avisp') || 
                    questionLower.includes('piquet') || questionLower.includes('insect') || 
                    (questionLower.includes('alérg') && questionLower.includes('medicamento'))) {
                  return "Para alergia a picaduras de abeja, el medicamento común es Epinefrina (EpiPen). También puedes mencionar: Alergia a picaduras de abeja, uso EpiPen. ¿Tienes un EpiPen prescrito?";
                }
                
                // Alergias comunes
                if (questionLower.includes('común') || questionLower.includes('que alergias')) {
                  return "Las alergias más comunes son: Medicamentos (Penicilina, Aspirina, Ibuprofeno), Alimentos (Mariscos, Nueces, Lácteos, Huevo), Otros (Látex, Picaduras de insectos), Ambientales (Polen, Ácaros, Moho). ¿Tienes alguna de estas?";
                }
                
                // Cómo saber si tienes alergias
                if (questionLower.includes('como saber') || questionLower.includes('detectar')) {
                  return "Para identificar alergias: 1) Revisa reacciones pasadas (sarpullido, hinchazón, dificultad para respirar), 2) Pregunta a familiares (las alergias pueden ser hereditarias), 3) Revisa pruebas de alergia previas, 4) Observa síntomas después de comer/tomar medicamentos. ¿Has tenido alguna reacción extraña?";
                }
                
                // Síntomas de alergia
                if (questionLower.includes('síntomas') || questionLower.includes('sintomas')) {
                  return "Los síntomas de alergia incluyen: Piel (sarpullido, picazón, urticaria, hinchazón), Respiración (estornudos, congestión, dificultad para respirar), Digestivo (náuseas, vómitos, diarrea), General (mareos, desmayos, shock anafiláctico). ¿Has experimentado alguno de estos?";
                }
                
                // Medicamentos para alergias
                if (questionLower.includes('medicamento') || questionLower.includes('tratamiento')) {
                  return "Medicamentos comunes para alergias: Antihistamínicos (Loratadina, Cetirizina, Difenhidramina), Epinefrina (para reacciones severas, EpiPen), Corticosteroides (Prednisona, para inflamación), Descongestionantes (Pseudoefedrina). ¿Necesitas ayuda con alguno específico?";
                }
      } else {
        // English responses for allergies
        if (questionLower.includes('bee') || questionLower.includes('sting') || questionLower.includes('wasp')) {
          return "For bee sting allergies, the common medication is Epinephrine (EpiPen). You can also mention: Bee sting allergy, use EpiPen. Do you have a prescribed EpiPen?";
        }
        
        if (questionLower.includes('common') || questionLower.includes('what allergies')) {
          return "Most common allergies are: Medications (Penicillin, Aspirin, Ibuprofen), Foods (Shellfish, Nuts, Dairy, Egg), Others (Latex, Insect stings), Environmental (Pollen, Dust mites, Mold). Do you have any of these?";
        }
      }
    }

    // Respuestas específicas para medicamentos
    if (fieldType === 'medications') {
      if (lang === 'es') {
                // Detectar medicamentos específicos mencionados
                if (questionLower.includes('telmi') || questionLower.includes('telmisartan')) {
                  return "Telmisartán es un medicamento para la presión arterial alta. También puedes mencionar otros para presión arterial como Losartán, Enalapril, Amlodipino. ¿Recuerdas la dosis que tomas?";
                }
        
                if (questionLower.includes('losa') || questionLower.includes('losartan')) {
                  return "Losartán es un medicamento para la presión arterial. ¿Recuerdas la dosis? Ejemplo: Losartán 50mg, una vez al día";
                }
                
                if (questionLower.includes('metfor') || questionLower.includes('metformina')) {
                  return "Metformina es para diabetes. ¿Recuerdas la dosis? Ejemplo: Metformina 500mg, 2 veces al día";
                }
                
                if (questionLower.includes('presión') || questionLower.includes('presion')) {
                  return "Para presión arterial, los medicamentos más comunes son: Telmisartán, Losartán, Enalapril, Amlodipino, Hidroclorotiazida. ¿Alguno de estos te suena familiar?";
                }
                
                if (questionLower.includes('común') || questionLower.includes('que medicamentos')) {
                  return "Los medicamentos más comunes son: Diabetes (Metformina, Insulina), Presión arterial (Losartán, Telmisartán, Enalapril, Amlodipino), Colesterol (Atorvastatina, Simvastatina), Corazón (Aspirina, Clopidogrel), Dolor (Ibuprofeno, Acetaminofén), Tiroides (Levotiroxina). ¿Tomas alguno de estos?";
                }
                
                if (questionLower.includes('recordar') || questionLower.includes('como recordar')) {
                  return "Para recordar tus medicamentos: 1) Revisa tus frascos de medicinas actuales, 2) Pregunta a tu farmacéutico (tienen tu historial), 3) Revisa tu historial médico o app de salud, 4) Pregunta a familiares que te ayuden, 5) Revisa recetas recientes del médico. ¿Te ayuda esto?";
                }
                
                if (questionLower.includes('dosis') || questionLower.includes('cantidad')) {
                  return "Para escribir dosis correctamente: Ejemplo 'Metformina 500mg, 2 veces al día', Otro 'Losartán 50mg, una vez al día'. Incluye: Medicamento + cantidad + frecuencia. Frecuencias: una vez al día, 2 veces al día, cada 8 horas. ¿Necesitas ayuda con alguna dosis específica?";
                }
      }
    }

    // Respuestas específicas para condiciones médicas
    if (fieldType === 'conditions') {
      if (lang === 'es') {
        if (questionLower.includes('que mencionar') || questionLower.includes('importante')) {
          return "Es importante mencionar:\n• **Condiciones actuales** que tienes ahora\n• **Condiciones pasadas** que ya no tienes\n• **Hospitalizaciones** recientes\n• **Cirugías** previas\n• **Enfermedades crónicas** como diabetes, hipertensión\n• **Condiciones familiares** relevantes\n\n¿Tienes alguna condición específica?";
        }
      }
    }

    // Respuesta por defecto más inteligente
    if (lang === 'es') {
      if (questionLower.includes('alérg') || questionLower.includes('alerg')) {
        return "Si tienes alergias, es importante mencionar:\n• **Tipo de alergia**: Medicamentos, alimentos, picaduras, etc.\n• **Reacciones**: Qué síntomas tienes\n• **Tratamiento**: Si usas algún medicamento (como EpiPen)\n• **Severidad**: Si es leve o severa\n\n¿Qué tipo de alergia tienes?";
      }
      
      if (questionLower.includes('medicamento') || questionLower.includes('medicina')) {
        return "Para medicamentos, incluye:\n• **Nombre del medicamento**\n• **Dosis** (ej: 500mg)\n• **Frecuencia** (ej: 2 veces al día)\n• **Para qué lo tomas**\n\n¿Qué medicamentos tomas actualmente?";
      }
    }

    // Respuesta por defecto más útil
    return lang === 'es' 
      ? `Puedo ayudarte con información específica sobre ${fieldType === 'medications' ? 'medicamentos' : fieldType === 'allergies' ? 'alergias' : 'condiciones médicas'}. Hazme una pregunta específica como:\n• "¿Qué medicamentos comunes debo mencionar?"\n• "¿Cómo recordar mis medicamentos?"\n• "¿Qué alergias son más comunes?"`
      : `I can help you with specific information about ${fieldType === 'medications' ? 'medications' : fieldType === 'allergies' ? 'allergies' : 'medical conditions'}. Ask me a specific question like:\n• "What common medications should I mention?"\n• "How to remember my medications?"\n• "What are the most common allergies?"`;
  };

  const quickSuggestions: Record<string, string[]> = {
    medications: language === 'es' 
      ? ['¿Qué medicamentos comunes debo mencionar?', '¿Cómo puedo recordar mis medicamentos?', '¿Cómo escribir las dosis?']
      : ['What common medications should I mention?', 'How can I remember my medications?', 'How to write dosages?'],
    allergies: language === 'es'
      ? ['¿Qué alergias son más comunes?', '¿Cómo saber si tengo alergias?', '¿Cuáles son los síntomas?']
      : ['What are the most common allergies?', 'How to know if I have allergies?', 'What are the symptoms?'],
    conditions: language === 'es'
      ? ['¿Qué condiciones debo mencionar?', '¿Cómo describir síntomas?', '¿Qué información es importante?']
      : ['What conditions should I mention?', 'How to describe symptoms?', 'What information is important?'],
    general: language === 'es'
      ? ['¿Qué información médica es importante?', '¿Cómo completar este formulario?', '¿Qué debo incluir?']
      : ['What medical information is important?', 'How to complete this form?', 'What should I include?']
  };

  const assistantTitle = {
    medications: language === 'es' ? 'Asistente de Medicamentos' : 'Medication Assistant',
    allergies: language === 'es' ? 'Asistente de Alergias' : 'Allergy Assistant',
    conditions: language === 'es' ? 'Asistente Médico' : 'Medical Assistant',
    general: language === 'es' ? 'Asistente Médico' : 'Medical Assistant'
  };

  return (
    <div className="relative">
      {/* Botón de asistente inteligente */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-full border border-blue-200 transition-all duration-200 shadow-sm"
        title={assistantTitle[fieldType]}
      >
        <span className="text-base">🧠</span>
        <span className="hidden sm:inline font-medium">{language === 'es' ? 'Pregúntame' : 'Ask me'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel de chat inteligente */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de chat - Responsive */}
          <div className="absolute bottom-10 right-0 sm:absolute sm:top-10 sm:left-0 sm:right-auto sm:bottom-auto z-20 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[70vh] sm:max-h-[500px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-[#212e5c] flex items-center gap-2">
                  🧠 {assistantTitle[fieldType]}
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {language === 'es' 
                  ? 'Haz preguntas específicas sobre este campo'
                  : 'Ask specific questions about this field'}
              </p>
            </div>
            
            {/* Chat History */}
            <div className="p-4 max-h-64 overflow-y-auto space-y-3">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-right">
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded-lg max-w-[80%]">
                      {chat.question}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-2 rounded-lg max-w-[80%]">
                      {chat.answer}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Current Response - Solo mostrar si no hay historial */}
              {response && chatHistory.length === 0 && (
                <div className="text-left">
                  <div className="inline-block bg-green-50 text-green-800 text-xs px-3 py-2 rounded-lg max-w-[80%] border border-green-200">
                    {response}
                  </div>
                </div>
              )}
              
              {/* Quick Suggestions */}
              {!response && chatHistory.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">
                    {language === 'es' ? 'Preguntas sugeridas:' : 'Suggested questions:'}
                  </p>
                  {quickSuggestions[fieldType]?.map((suggestion: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setQuestion(suggestion)}
                      className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={language === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">{language === 'es' ? 'Pensando...' : 'Thinking...'}</span>
                    </>
                  ) : (
                    <>
                      <span>→</span>
                      <span className="hidden sm:inline">{language === 'es' ? 'Enviar' : 'Send'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
