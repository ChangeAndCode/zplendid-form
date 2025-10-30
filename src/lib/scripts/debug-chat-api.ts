import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function debugChatAPI() {
  console.log('🔍 Debugging chat API...');

  try {
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

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📊 Response body:', responseText);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Parsed JSON response:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError);
      }
    } else {
      console.log('❌ API request failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing chat API:', error);
  }
}

debugChatAPI();
