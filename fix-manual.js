const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('src/app/api/forms/surgery-interest/route.ts', 'utf8');

// Crear la línea VALUES correcta con exactamente 54 placeholders + NOW() + NOW()
const correctValues = 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

// Reemplazar SOLO la línea VALUES del INSERT de surgery_interest
const lines = content.split('\n');
let foundInsert = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO surgery_interest')) {
    foundInsert = true;
    // Buscar la línea VALUES correspondiente
    for (let j = i; j < lines.length && j < i + 20; j++) {
      if (lines[j].includes('VALUES (')) {
        lines[j] = lines[j].replace(/VALUES \([^)]+\)/, correctValues);
        console.log('✅ Línea VALUES reemplazada en línea', j + 1);
        break;
      }
    }
    break;
  }
}

if (!foundInsert) {
  console.log('❌ No se encontró INSERT INTO surgery_interest');
}

// Escribir el archivo
fs.writeFileSync('src/app/api/forms/surgery-interest/route.ts', lines.join('\n'), 'utf8');

console.log('✅ Archivo actualizado');

// Verificar
const newContent = fs.readFileSync('src/app/api/forms/surgery-interest/route.ts', 'utf8');
const valuesMatch = newContent.match(/VALUES \([^)]+\)/);
if (valuesMatch) {
  const placeholders = (valuesMatch[0].match(/\?/g) || []).length;
  const nowCount = (valuesMatch[0].match(/NOW\(\)/g) || []).length;
  console.log(`✅ Verificación: ${placeholders} placeholders + ${nowCount} NOW() = ${placeholders + nowCount} valores`);
}
