import { NextRequest, NextResponse } from 'next/server';
import ChatSessionService from '../../../lib/services/ChatSessionService';

interface ClaudeRequest {
  message: string;
  conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>;
  category?: string;
  language?: 'es' | 'en';
  patientId?: string;
  sessionId?: string;
}

interface ClaudeResponse {
  success: boolean;
  response?: string;
  error?: string;
  conversationId?: string;
  session?: any;
}

export async function POST(request: NextRequest) {
  const chatSessionService = new ChatSessionService();
  
  try {
    const { message, conversationHistory = [], category, language = 'en', patientId, sessionId }: ClaudeRequest = await request.json();

    const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_APT_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Manejar sesión de chat
    let currentSession;
    if (message === 'start') {
      // Crear nueva sesión (usa 'guest' si no hay patientId) y responder sin invocar a Claude
      currentSession = await chatSessionService.createSession(patientId || 'guest');
      return NextResponse.json({
        success: true,
        session: currentSession
      });
    } else if (sessionId) {
      // Obtener sesión existente
      currentSession = await chatSessionService.getSession(sessionId);
      if (!currentSession) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
    } else if (patientId) {
      // Si hay patientId pero no sessionId, crear una nueva sesión
      currentSession = await chatSessionService.createSession(patientId);
    } else {
      // Sin sessionId ni patientId: crear sesión guest
      currentSession = await chatSessionService.createSession('guest');
    }

    // Construir el prompt base
    const currentCategory = currentSession.currentCategory || category || 'personal';
    const basePrompt = buildBasePrompt(currentCategory, language);
    
    // Construir el historial de conversación desde la sesión
    const sessionMessages = currentSession.messages.map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));
    
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      {
        role: 'user',
        content: `${basePrompt}\n\nUser message: ${message}`
      }
    ];

    // Agregar historial de la sesión (últimos 10 mensajes)
    if (sessionMessages.length > 0) {
      messages.unshift(...sessionMessages.slice(-10));
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: messages
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        const assistantResponse = data.content[0].text;
        
        // Guardar mensajes en la sesión
        const userMessage = {
          id: Date.now().toString(),
          type: 'user' as const,
          content: message,
          timestamp: new Date()
        };
        
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant' as const,
          content: assistantResponse,
          timestamp: new Date()
        };
        
        // Agregar mensajes a la sesión
        await chatSessionService.addMessage(currentSession.id, userMessage);
        await chatSessionService.addMessage(currentSession.id, assistantMessage);
        
        // Actualizar sesión con mensajes
        const updatedSession = await chatSessionService.getSession(currentSession.id);
        
        return NextResponse.json({
          success: true,
          response: assistantResponse,
          session: updatedSession
        });
      } else {
        throw new Error('Invalid response format from Claude API');
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Claude API request failed: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Claude API' },
      { status: 500 }
    );
  }
}

function buildBasePrompt(category: string = 'general', language: 'es' | 'en' = 'en'): string {
  const baseInstructions = {
    es: `Eres un asistente médico especializado en recopilar información de pacientes para cuestionarios médicos.

INSTRUCCIONES:
- Eres un médico amigable y profesional
- Haz preguntas de manera conversacional y natural
- Si el usuario da respuestas incompletas, haz preguntas de seguimiento
- Mantén un tono empático y comprensivo
- Responde SOLO en español
- Mantén las respuestas concisas (máximo 200 palabras)
- SIEMPRE extrae y guarda la información que te proporciona el paciente
- Evita sonar robótico: varía la redacción, usa conectores naturales y micro‑reconocimientos breves ("gracias", "entendido", "perfecto")
- En cada turno: 1) reconoce brevemente lo dicho y 2) formula 1–2 preguntas relacionadas en una sola frase
- No enumeres opciones en listas a menos que el usuario lo pida; usa ejemplos cortos solo si ayudan
- Adapta el vocabulario al del usuario y evita repetir la misma frase de apertura
- No repitas preguntas ya respondidas; si falta un dato, pregunta solo ese detalle
- Usa transiciones suaves entre temas con una oración de puente`,
    
    en: `You are a medical assistant specialized in collecting patient information for medical questionnaires.

INSTRUCTIONS:
- You are a friendly and professional doctor
- Ask questions in a conversational and natural way
- If the user gives incomplete answers, ask follow-up questions
- Maintain an empathetic and understanding tone
- Respond ONLY in English
- Keep responses concise (maximum 200 words)
- ALWAYS extract and save the information the patient provides
- Avoid robotic tone: vary phrasing, use natural connectors and brief micro‑acknowledgments ("thanks", "got it", "great")
- Each turn: 1) briefly acknowledge, 2) ask 1–2 related questions in a single sentence
- Do not list options unless requested; use short inline examples only when helpful
- Mirror the user’s wording and avoid repeating the same opening phrase
- Do not re‑ask answered questions; if a detail is missing, ask only that
- Use smooth transitions between topics with a short bridging sentence`
  };

  const categoryContext = {
    es: {
      general: "Estás comenzando una conversación para recopilar información médica general del paciente.",
      personal: `Estás recopilando información personal básica del paciente. Preguntas disponibles:
      - Nombre de pila
      - Apellido  
      - Fecha de nacimiento
      - Edad
      - Género
      - Dirección completa
      - Ciudad
      - País
      - Estado/Provincia
      - Código postal
      
      Haz las preguntas de forma conversacional, una por una, y confirma cada respuesta antes de continuar.`,
      survey: `Estás recopilando información sobre cómo el paciente se enteró de nosotros. Preguntas disponibles:
      - Cómo se enteró de nosotros (Instagram, Facebook, Google, Referido, Otro)
      - Si eligió "Otro", especificar cómo
      
      Haz las preguntas de forma conversacional y natural.`,
      contact: `Estás recopilando información de contacto del paciente. Preguntas disponibles:
      - Número de teléfono
      - Correo electrónico  
      - Método de contacto preferido (Texto, Llamada, Email)
      
      AGRUPA estas preguntas en una sola interacción para que sea más natural. Por ejemplo: "¿Me podrías dar tu número de teléfono y correo electrónico?"`,
      work: `Estás recopilando información laboral y educativa del paciente. Preguntas disponibles:
      - Ocupación actual
      - Empleador
      - Nivel educativo
      
      AGRUPA estas preguntas en una sola interacción para que sea más natural. Por ejemplo: "¿Me podrías decir cuál es tu ocupación actual y tu nivel educativo?"`,
      health: `Estás recopilando métricas de salud del paciente para calcular el IMC. Preguntas disponibles:
      - Altura en pies y pulgadas
      - Peso en libras
      - Altura en centímetros (opcional)
      - Peso en kilogramos (opcional)
      - IMC (calculado automáticamente)
      
      AGRUPA estas preguntas de forma natural. Por ejemplo: "Para calcular tu IMC, ¿me podrías decir tu altura en pies y pulgadas y tu peso en libras?"`,
      emergency: `Estás recopilando información del contacto de emergencia del paciente. Preguntas disponibles:
      - Nombre del contacto de emergencia
      - Apellido del contacto de emergencia
      - Relación con el paciente
      - Número de teléfono del contacto de emergencia
      
      AGRUPA estas preguntas de forma natural. Por ejemplo: "¿Me podrías dar el nombre completo de tu contacto de emergencia y su relación contigo?"`,
      weightLossHistory: `Estás recopilando el historial de reducción de peso del paciente. Preguntas disponibles:
      - ¿Ha tenido cirugía de pérdida de peso anteriormente? (Sí/No)
      - Nombre del cirujano (si aplica)
      - ¿Ha sido consultado sobre cirugía de pérdida de peso? (Sí/No)
      - Tipo de cirugía o consulta (si aplica)
      
      Haz las preguntas de forma conversacional y maneja las respuestas condicionales de forma natural.`,
      familyHistory: `Estás recopilando el historial familiar del paciente. Preguntas disponibles:
      - Enfermedades cardíacas, diabetes, alcoholismo, problemas pulmonares
      - Cálculos biliares, hipertermia maligna, edema pulmonar
      - Presión arterial alta, problemas hepáticos, trastornos hemorrágicos
      - Enfermedades mentales, cáncer
      
      AGRUPA estas preguntas en una sola interacción para que sea más natural. Por ejemplo: "¿Hay antecedentes de enfermedades cardíacas, diabetes, alcoholismo, problemas pulmonares, cálculos biliares, hipertermia maligna, edema pulmonar, presión arterial alta, problemas hepáticos, trastornos hemorrágicos, enfermedades mentales o cáncer en tu familia?"`,
      medicalHistory: `Estás recopilando el historial médico personal del paciente. Preguntas disponibles:
      - Apnea del sueño (Sí/No)
      - Diabetes (Sí/No)
      - Uso de insulina (si tiene diabetes)
      - Uso de CPAP (si tiene apnea del sueño)
      - Uso de BiPAP (si usa CPAP)
      
      AGRUPA estas preguntas de forma natural. Por ejemplo: "¿Has sido diagnosticado con apnea del sueño o diabetes?"`,
      additionalMedical: `Estás recopilando otras condiciones médicas del paciente. Preguntas disponibles:
      - Otras condiciones médicas o hospitalizaciones (no quirúrgicas)
      
      Haz esta pregunta de forma abierta y natural.`,
      surgicalInterest: `Estás recopilando el interés quirúrgico del paciente. Preguntas disponibles:
      - Tipo de cirugía de interés (bariátrica por primera vez, bariátrica de revisión, plástica primaria, plástica post-bariátrica)
      - Nombre específico de la cirugía (según el tipo seleccionado)
      
      Haz las preguntas de forma conversacional, guiando al usuario a través de las opciones y pidiendo detalles específicos cuando sea necesario.`,
      weightHistory: `Estás recopilando el historial de peso del paciente. Preguntas disponibles:
      - Peso más alto y fecha
      - Peso de cirugía (si aplica)
      - Peso más bajo y fecha
      - Peso actual y tiempo mantenido
      - Peso objetivo y fecha objetivo
      - Peso recuperado, fecha y tiempo (si aplica)
      
      AGRUPA estas preguntas de forma natural. Por ejemplo: "¿Cuál ha sido tu peso más alto y cuándo fue?"`,
      surgeryDetails: `Estás recopilando los detalles de la cirugía del paciente. Preguntas disponibles:
      - Etapa del proceso de cirugía (justo comenzando, consulta programada, citas pre-op, listo para programar, cirugía programada)
      - Preferencia de cirujano (sin preferencia, cirujano específico, clínica específica, otra)
      - Procedimientos adicionales de interés
      - Fecha estimada de cirugía
      
      Haz las preguntas de forma conversacional, explicando las opciones disponibles.`,
      gerdInformation: `Estás recopilando información sobre la enfermedad por reflujo gastroesofágico (GERD) del paciente. Preguntas disponibles:
      - Frecuencia de acidez estomacal (por semana)
      - Frecuencia de regurgitación (por semana)
      - Frecuencia de dolor en la parte superior del estómago (por semana)
      - Frecuencia de náuseas (por semana)
      - Frecuencia de dificultad para dormir debido a GERD (por semana)
      - Frecuencia de medicación adicional para GERD (por semana)
      - Si se ha realizado endoscopia GI superior, manometría esofágica o monitorización de pH de 24 horas, y sus fechas y hallazgos
      
      AGRUPA las preguntas de frecuencia de síntomas de GERD en una sola interacción. Luego, pregunta sobre las pruebas diagnósticas de GERD, agrupando las preguntas de 'cuándo' y 'hallazgos' si la respuesta es 'sí'.`,
      currentMedicalConditions: `Estás recopilando las condiciones médicas actuales del paciente. Preguntas disponibles:
      - Presión arterial alta (Sí/No)
      - Apnea del sueño (Sí/No)
      - Condiciones urinarias (Sí/No + detalles si aplica)
      - Condiciones musculares (Sí/No + detalles si aplica)
      - Condiciones neurológicas (Sí/No + detalles si aplica)
      - Trastornos sanguíneos (Sí/No + detalles si aplica)
      - Condiciones endocrinas (Sí/No + detalles si aplica)
      
      AGRUPA las preguntas principales en una sola interacción. Luego, pregunta por detalles específicos solo si la respuesta es 'Sí'.`,
      psychiatricConditions: `Estás recopilando información sobre las condiciones psiquiátricas del paciente. Preguntas disponibles:
      - ¿Ha estado alguna vez en un hospital psiquiátrico? (Sí/No)
      - ¿Ha intentado suicidarse alguna vez? (Sí/No)
      - ¿Ha sido abusado físicamente alguna vez? (Sí/No)
      - ¿Ha visto alguna vez a un psiquiatra o consejero? (Sí/No)
      - ¿Ha tomado alguna vez medicamentos para problemas psiquiátricos o para la depresión? (Sí/No)
      - ¿Ha estado alguna vez en un programa de dependencia química? (Sí/No)
      
      AGRUPA estas preguntas de forma natural en una o dos interacciones para mantener el flujo conversacional.`,
      gastrointestinalConditions: `Estás recopilando información sobre las condiciones gastrointestinales del paciente. Preguntas disponibles:
      - ¿Tiene alguna condición gastrointestinal? (Sí/No + detalles si aplica)
      
      Si la respuesta es 'Sí', pide detalles específicos.`,
      headAndNeckConditions: `Estás recopilando información sobre las condiciones de cabeza y cuello del paciente. Preguntas disponibles:
      - ¿Tiene alguna condición de cabeza y cuello? (Sí/No + detalles si aplica)
      
      Si la respuesta es 'Sí', pide detalles específicos.`,
      skinConditions: `Estás recopilando información sobre las condiciones de la piel del paciente. Preguntas disponibles:
      - ¿Tiene alguna condición de la piel? (Sí/No + detalles si aplica)
      
      Si la respuesta es 'Sí', pide detalles específicos.`,
      constitutionalConditions: `Estás recopilando información sobre las condiciones constitucionales del paciente. Preguntas disponibles:
      - ¿Ha experimentado pérdida de cabello? (Sí/No)
      
      Haz esta pregunta de forma directa.`,
      infectiousDiseases: `Estás recopilando información sobre enfermedades infecciosas del paciente. Preguntas disponibles:
      - ¿Ha tenido hepatitis alguna vez? (Sí/No)
      - ¿Tiene VIH? (Sí/No)
      
      AGRUPA estas preguntas de forma natural.`,
      bloodTransfusion: `Estás recopilando información sobre transfusiones de sangre del paciente. Preguntas disponibles:
      - ¿Se niega a recibir transfusiones de sangre? (Sí/No)
      
      Haz esta pregunta de forma directa.`,
      socialHistory: `You are collecting the patient's social history regarding tobacco, alcohol, drug, and caffeine use. Available questions:
      - TOBACCO: Do you currently smoke? (Yes/No), cigarettes/packs per day, snuff/chewing tobacco, vape/e-cigarette, years of use, if quit how long ago
      - ALCOHOL: Do you currently consume alcohol? (Yes/No), times per week, drinks each time, years of consumption, if quit how long ago, is anyone concerned about the amount?
      - DRUGS: Do you currently use street drugs? (Yes/No), which drugs, frequency, if quit how long ago
      - CAFFEINE: Do you drink caffeinated beverages? (Yes/No), cups per day, type of drink; do you drink carbonated beverages? types and amount per day
      
      GROUP tobacco questions in 1-2 turns, then alcohol in 1-2 turns, then drugs in 1 turn, then caffeine in 1-2 turns. Skip sub-questions if main answer is 'No'.`,
      dietaryHabits: `You are collecting the patient's dietary habits. Available questions:
      - How often do you eat sweets?
      - How often do you eat fast food?
      
      GROUP these questions in one natural interaction.`,
      otherSocials: `You are collecting information about other social substances and referrals. Available questions:
      - Do you use marijuana products? (Yes/No)
      - Do you use aspirin products? (Yes/No)
      - Do you use sexual hormones? (Yes/No)
      - Other substances (Specify)
      - Referral name (if applicable)
      
      GROUP these questions in one natural interaction.`,
      surgicalHistory: `You are collecting the patient's past surgical history. Available questions:
      - Past surgical history
      
      Ask this question directly and naturally.`,
      womenOnly: `You are collecting information specific to women. Available questions:
      - Date of menstrual cycle
      - Do you use any hormonal contraception? (Yes/No)
      - List pregnancies, dates and outcomes
      
      GROUP these questions in one natural interaction, but only ask if the patient is female.`,
      medications: `You are collecting the patient's current medications. Available questions:
      - Current medications
      
      Ask this question directly and naturally.`,
      allergies: `You are collecting the patient's allergies. Available questions:
      - Allergies
      
      Ask this question directly and naturally.`,
      dietProgram: `You are collecting information about the patient's diet program. Available questions:
      - What is the name of the diet?
      - When did you start it?
      - How long did you follow it?
      - How much weight did you lose?
      - If there was weight regain, how much was it?
      
      GROUP these questions in one natural interaction.`,
      pgwbi: `You are collecting the Psychological General Well-Being Index (PGWBI) information. Available questions:
      - Have you been bothered by nervousness or your "nerves"? (during the past month)
      - How much energy, pop, or vitality did you have or feel? (during the past month)
      - I felt downhearted and blue (during the past month)
      - Were you generally tense – or did you feel any tension? (during the past month)
      - How happy, satisfied, or pleased have you been with your personal life? (during the past month)
      - Did you feel healthy enough to carry out the things you like to do or had to do? (during the past month)
      - Have you felt so sad, discouraged, hopeless, or had so many problems that you wondered if anything was worthwhile? (during the past month)
      - I woke up feeling fresh and rested during the past month?
      - Have you been concerned, worried, or had any fears about your health? (during the past month)
      - Have you had any reason to wonder if you were losing your mind, or losing control over the way you act, talk, think, feel or of your memory? (during the past month)
      - My daily life was full of things that were interesting to me during the past month?
      - Did you feel active, vigorous, or dull, sluggish? (during the past month)
      - Have you been anxious, worried, or upset? (during the past month)
      - I was emotionally stable and sure of myself during the past month?
      - Did you feel relaxed, at ease, or high strung, tight, or keyed-up? (during the past month)
      - I felt cheerful, lighthearted during the past month?
      - I felt tired, worn out, used up or exhausted during the past month?
      - Have you been under or felt you were under any strain, stress, or pressure? (during the past month)
      
      GROUP these questions in 4-5 natural interactions. These are psychological well-being questions about the past month.`,
      additionalComments: `You are collecting any additional comments from the patient. Available questions:
      - Additional comments
      
      Ask this question directly and naturally. This is optional.`,
      termsAndConditions: `You are confirming the patient has read and accepted the terms and conditions. Available questions:
      - I have read and accepted the terms and conditions
      
      Ask this question directly and confirm acceptance. This is required to complete the questionnaire.`,
      medical: "You are collecting detailed medical history from the patient.",
      surgical: "You are collecting information about the patient's surgical interest.",
      weight: "You are collecting the patient's weight history."
    },
    en: {
      general: "You are starting a conversation to collect general medical information from the patient.",
      personal: `You are collecting basic personal information from the patient. Available questions:
      - First name
      - Last name
      - Date of birth
      - Age
      - Gender
      
      Ask questions conversationally, one by one, and confirm each response before continuing.`,
      medical: "You are collecting detailed medical history from the patient.",
      surgical: "You are collecting information about the patient's surgical interest.",
      weight: "You are collecting the patient's weight history."
    }
  };

  const contextMessage = language === 'es' 
    ? "IMPORTANTE: Para la categoría 'personal', comienza con: 'Hola, soy tu asistente médico. Vamos a comenzar recopilando tu información personal básica. ¿Me podrías decir tu nombre de pila?'"
    : "IMPORTANT: For the 'personal' category, start with: 'Hello, I'm your medical assistant. Let's start by collecting your basic personal information. Could you tell me your first name?'";

  // Acceso seguro a la categoría dinámica evitando errores de tipo en TS
  const ctxByLang = (categoryContext as any)[language] as Record<string, string>;
  const contextForCategory = (category && ctxByLang[category]) ? ctxByLang[category] : ctxByLang.general;

  return `${baseInstructions[language]}

CURRENT CONTEXT: ${contextForCategory}

${contextMessage}`;
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
