const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('src/app/api/forms/surgery-interest/route.ts', 'utf8');

// Crear la línea VALUES correcta con exactamente 54 placeholders + NOW() + NOW()
const correctValues = 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

// Reemplazar la línea VALUES del INSERT de surgery_interest
content = content.replace(/VALUES \([^)]+\)/, correctValues);

// Escribir el archivo
fs.writeFileSync('src/app/api/forms/surgery-interest/route.ts', content, 'utf8');

console.log('✅ INSERT arreglado correctamente');
console.log('📊 Ahora: 54 placeholders + NOW() + NOW() = 56 valores');
console.log('📊 Tabla: 54 datos + createdAt + updatedAt = 56 columnas');

// Verificar
const newContent = fs.readFileSync('src/app/api/forms/surgery-interest/route.ts', 'utf8');
const valuesMatch = newContent.match(/VALUES \([^)]+\)/);
if (valuesMatch) {
  const placeholders = (valuesMatch[0].match(/\?/g) || []).length;
  const nowCount = (valuesMatch[0].match(/NOW\(\)/g) || []).length;
  console.log(`✅ Verificación: ${placeholders} placeholders + ${nowCount} NOW() = ${placeholders + nowCount} valores`);
}
