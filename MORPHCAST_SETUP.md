# Configuración de MorphCast Emotion AI

## Descripción
Integración de MorphCast Emotion AI SDK para detección de emociones en tiempo real en el chatbot médico.

## Configuración

### 1. Variable de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y agrega tu API key de MorphCast:

```env
NEXT_PUBLIC_MORPHCAST_API_KEY=tu_api_key_aqui
```

**Nota:** Si no se configura la variable de entorno, el componente usará una API key por defecto (solo para desarrollo).

### 2. Obtener tu API Key

1. Visita el configurador de MorphCast: https://ai-sdk.morphcast.com/configurator/latest/?k=#/
2. Ingresa tu license key en el campo "Your license key"
3. Selecciona los módulos que deseas activar:
   - ✅ Arousal/Valence & Affects
   - ✅ Attention
   - ✅ Emotions (Requerido)
   - ✅ Gender
   - ✅ Face Positivity

### 3. Módulos Activados

El componente `EmotionDetector` está configurado con los siguientes módulos:
- **Emotions**: Detección de emociones (feliz, triste, enojado, etc.)
- **Attention**: Nivel de atención del usuario
- **Arousal/Valence**: Activación y valencia emocional
- **Face Positivity**: Positividad facial
- **Gender**: Detección de género

### 4. Privacidad

El componente incluye un popup de privacidad que se muestra antes de solicitar acceso a la cámara. Puedes personalizar:
- Título del popup
- Descripción
- Enlace a la política de privacidad

## Uso

El componente `EmotionDetector` se muestra automáticamente en el costado derecho del chatbot (solo en pantallas grandes, `lg:` breakpoint).

### Características:
- ✅ Detección de emociones en tiempo real
- ✅ Visualización de confianza
- ✅ Métricas de atención y positividad
- ✅ Interfaz responsive
- ✅ Soporte multiidioma (español/inglés)
- ✅ Manejo de errores

## Archivos Modificados

- `src/app/components/EmotionDetector.tsx` - Componente principal del detector de emociones
- `src/app/components/ChatPage.tsx` - Integración del detector en el layout del chat

## Referencias

- [MorphCast Configurador](https://ai-sdk.morphcast.com/configurator/latest/?k=#/)
- [Documentación MorphCast SDK](https://ai-sdk.morphcast.com/latest/index.html)

