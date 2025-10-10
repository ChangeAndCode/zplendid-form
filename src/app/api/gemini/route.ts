import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, fieldType, language } = await request.json();

    const API_KEY = process.env.NEXT_GEMINI_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Eres un asistente médico especializado en ayudar a completar formularios médicos. 

CONTEXTO: ${fieldType === 'medications' ? 'medicamentos' : fieldType === 'allergies' ? 'alergias' : 'condiciones médicas'}

INSTRUCCIONES:
- Responde SOLO en ${language === 'es' ? 'español' : 'inglés'}
- Sé específico y útil (máximo 100 palabras)
- NO uses asteriscos (*) ni markdown
- Usa formato de texto plano, simple y claro
- Si mencionan medicamentos parciales (como "telmi"), sugiere el nombre completo
- Para presión arterial: Losartán, Telmisartán, Enalapril, Amlodipino
- NO reemplaces consejo médico profesional
- Responde como si fueras un médico amigable y directo

PREGUNTA: ${question}

RESPUESTA:`;

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return NextResponse.json({
          success: true,
          response: data.candidates[0].content.parts[0].text
        });
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
    }

  } catch {
    return NextResponse.json(
      { error: 'Failed to get response from Gemini API' },
      { status: 500 }
    );
  }
}
