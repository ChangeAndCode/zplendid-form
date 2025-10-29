import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function testClaude4() {
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is not set');
    return;
  }

  console.log('🤖 Testing Claude 4 Sonnet connection...');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, please respond with "Claude 4 Sonnet is working correctly" to confirm the connection.'
          }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        console.log('✅ Claude 4 Sonnet is working correctly!');
        console.log('📝 Response:', data.content[0].text);
        console.log('🔧 Model:', data.model);
        console.log('📊 Usage:', data.usage);
      } else {
        console.error('❌ Invalid response format from Claude API');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Claude API request failed:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ Error testing Claude 4:', error);
  }
}

testClaude4();
