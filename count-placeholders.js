const fs = require('fs');

// Leer el archivo
const content = fs.readFileSync('src/app/api/forms/patient-info/route.ts', 'utf8');

// Buscar la línea VALUES
const valuesMatch = content.match(/VALUES \([^)]+\)/);
if (valuesMatch) {
  const valuesLine = valuesMatch[0];
  console.log('🔍 Línea VALUES encontrada:');
  console.log(valuesLine);
  
  // Contar placeholders (?)
  const placeholders = (valuesLine.match(/\?/g) || []).length;
  console.log('📊 Total placeholders (?):', placeholders);
  
  // Contar NOW()
  const nowCount = (valuesLine.match(/NOW\(\)/g) || []).length;
  console.log('📊 Total NOW():', nowCount);
  
  // Total valores
  const totalValues = placeholders + nowCount;
  console.log('📊 Total valores en VALUES:', totalValues);
  
  console.log('📊 Valores que enviamos: 35');
  console.log('📊 Diferencia:', totalValues - 35);
  
  if (totalValues === 35) {
    console.log('✅ Correcto: VALUES tiene 35 valores');
  } else {
    console.log('❌ PROBLEMA: VALUES tiene', totalValues, 'valores pero enviamos 35');
  }
} else {
  console.log('❌ No se encontró la línea VALUES');
}
