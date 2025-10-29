import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function testChatEnglish() {
  console.log('🤖 Testing chat conversation in English...');

  try {
    // Simular una conversación de inicio
    const response = await fetch('http://localhost:3000/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'start',
        patientId: 'test-patient-123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.response) {
        console.log('✅ Chat response received:');
        console.log('📝 Response:', data.response);
        console.log('🔍 Language check:', data.response.includes('Hello') ? '✅ English' : '❌ Not English');
        
        // Verificar que contenga palabras clave en inglés
        const englishKeywords = ['Hello', 'medical', 'assistant', 'information', 'name'];
        const hasEnglishKeywords = englishKeywords.some(keyword => 
          data.response.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log('🔍 Contains English keywords:', hasEnglishKeywords ? '✅ Yes' : '❌ No');
      } else {
        console.log('❌ No response content');
        console.log('Full response:', JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ Error testing chat:', error);
  }
}

testChatEnglish();
