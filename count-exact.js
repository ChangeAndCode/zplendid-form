const fs = require('fs');

// Leer el archivo
const content = fs.readFileSync('src/app/api/forms/patient-info/route.ts', 'utf8');

// Buscar la línea VALUES específica
const lines = content.split('\n');
let valuesLine = '';

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('VALUES (')) {
    valuesLine = lines[i];
    console.log('🔍 Línea VALUES encontrada en línea', i + 1);
    console.log('📝 Contenido:', valuesLine);
    break;
  }
}

if (valuesLine) {
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
  
  if (totalValues === 37) {
    console.log('✅ Correcto: VALUES tiene 37 valores (35 placeholders + 2 NOW)');
  } else {
    console.log('❌ PROBLEMA: VALUES tiene', totalValues, 'valores pero necesitamos 37');
  }
} else {
  console.log('❌ No se encontró la línea VALUES');
}
