'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useLanguage } from '../context/LanguageContext';

interface EmotionData {
  emotion: string;
  confidence: number;
  arousal: number;
  valence: number;
  attention: number;
  facePositivity: number;
}

export default function EmotionDetector() {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const morphcastRef = useRef<any>(null);
  const startStopRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const isActiveRef = useRef(false);

  // Cargar los scripts de MorphCast según la documentación oficial
  useEffect(() => {
    const loadSDK = () => {
      // Verificar si CY ya está disponible (SDK cargado)
      if (window.CY && window.MphTools) {
        console.log('✅ MorphCast SDK ya está disponible');
        setSdkLoaded(true);
        initializeMorphCast();
        return;
      }

      // Verificar si los scripts ya están cargándose
      const existingMphTools = document.querySelector('script[src*="mphtools.js"]');
      const existingAISDK = document.querySelector('script[src*="ai-sdk.js"]');
      
      if (existingMphTools && existingAISDK) {
        console.log('Scripts de MorphCast ya existen, esperando carga...');
        const checkInterval = setInterval(() => {
          if (window.CY && window.MphTools) {
            setSdkLoaded(true);
            initializeMorphCast();
            clearInterval(checkInterval);
          }
        }, 200);
        setTimeout(() => clearInterval(checkInterval), 10000);
        return;
      }

      // Cargar mphtools primero
      console.log('Cargando MorphCast mphtools...');
      const mphtoolsScript = document.createElement('script');
      mphtoolsScript.src = 'https://sdk.morphcast.com/mphtools/v1.1/mphtools.js';
      mphtoolsScript.setAttribute('data-config', 'cameraPrivacyPopup, compatibilityUI, compatibilityAutoCheck');
      mphtoolsScript.async = true;
      
      mphtoolsScript.onload = () => {
        console.log('✅ mphtools cargado');
        
        // Cargar ai-sdk después de mphtools
        console.log('Cargando MorphCast AI SDK...');
        const aiSdkScript = document.createElement('script');
        aiSdkScript.src = 'https://ai-sdk.morphcast.com/v1.16/ai-sdk.js';
        aiSdkScript.async = true;
        
        aiSdkScript.onload = () => {
          console.log('✅ AI SDK cargado');
          setTimeout(() => {
            if (window.CY && window.MphTools) {
              console.log('✅ MorphCast SDK disponible');
              setSdkLoaded(true);
              initializeMorphCast();
            } else {
              console.warn('⚠️ Scripts cargados pero SDK no disponible aún');
              const retryInterval = setInterval(() => {
                if (window.CY && window.MphTools) {
                  setSdkLoaded(true);
                  initializeMorphCast();
                  clearInterval(retryInterval);
                }
              }, 500);
              setTimeout(() => clearInterval(retryInterval), 5000);
            }
          }, 500);
        };
        
        aiSdkScript.onerror = (e) => {
          console.error('❌ Error cargando AI SDK:', e);
          setError(language === 'es' 
            ? 'Error al cargar el SDK de MorphCast. Verifica tu conexión.' 
            : 'Error loading MorphCast SDK. Please check your connection.');
        };
        
        document.body.appendChild(aiSdkScript);
      };
      
      mphtoolsScript.onerror = (e) => {
        console.error('❌ Error cargando mphtools:', e);
        setError(language === 'es' 
          ? 'Error al cargar las herramientas de MorphCast.' 
          : 'Error loading MorphCast tools.');
      };
      
      document.body.appendChild(mphtoolsScript);
    };

    loadSDK();
  }, [language]);

  const initializeMorphCast = () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_MORPHCAST_API_KEY || 'sk2a445b81c60d36aa35d361e4575a7c8db0b707ea6a0e';
      
      if (!apiKey) {
        setError(language === 'es' 
          ? 'API key de MorphCast no configurada' 
          : 'MorphCast API key not configured');
        return;
      }

      if (!window.CY || !window.CY.loader) {
        console.error('CY.loader no disponible');
        setError(language === 'es' 
          ? 'SDK de MorphCast no está completamente cargado' 
          : 'MorphCast SDK is not fully loaded');
        return;
      }

      console.log('Inicializando MorphCast con API key:', apiKey.substring(0, 10) + '...');

      // Configurar popup de privacidad
      if (window.MphTools && window.MphTools.CameraPrivacyPopup) {
        window.MphTools.CameraPrivacyPopup.setText({
          title: language === 'es' 
            ? 'Permitir uso de la cámara' 
            : 'Allow us to use your camera',
          description: language === 'es'
            ? 'Esta experiencia está diseñada para ser vista con la cámara encendida. La siguiente pantalla solicitará tu consentimiento para acceder a los datos de tu cámara.'
            : 'This experience is designed to be viewed with your camera on. The next screen will ask your consent to access data from your camera.',
          url: '/privacy'
        });
      }

      // Inicializar MorphCast con todos los módulos del nuevo snippet
      window.CY.loader()
        .licenseKey(apiKey)
        .addModule(window.CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.70 })
        .addModule(window.CY.modules().FACE_EMOTION.name, { smoothness: 0.40 })
        .addModule(window.CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
        .addModule(window.CY.modules().ALARM_LOW_ATTENTION.name, { timeWindowMs: 5000, initialToleranceMs: 7000, threshold: 0.33 })
        .addModule(window.CY.modules().FACE_WISH.name, { smoothness: 0.8 })
        .addModule(window.CY.modules().FACE_POSE.name, { smoothness: 0.65 })
        .addModule(window.CY.modules().FACE_AGE.name, { rawOutput: false })
        .addModule(window.CY.modules().FACE_GENDER.name, { smoothness: 0.95, threshold: 0.70 })
        .addModule(window.CY.modules().FACE_FEATURES.name, { smoothness: 0.90 })
        .addModule(window.CY.modules().FACE_DETECTOR.name, { maxInputFrameSize: 320, smoothness: 0.83 })
        .addModule(window.CY.modules().ALARM_MORE_FACES.name, { timeWindowMs: 3000, initialToleranceMs: 7000, threshold: 0.33 })
        .addModule(window.CY.modules().ALARM_NO_FACE.name, { timeWindowMs: 10000, initialToleranceMs: 7000, threshold: 0.75 })
        .addModule(window.CY.modules().FACE_POSITIVITY.name, { smoothness: 0.40, gain: 2, angle: 17 })
        .load()
        .then(({ start, stop }) => {
          console.log('✅ MorphCast inicializado correctamente');
          startStopRef.current = { start, stop };
          setSdkReady(true);
          
          // Configurar listener para EVENT_BARRIER (como en el ejemplo)
          const eventBarrier = window.CY.modules().EVENT_BARRIER;
          if (eventBarrier && eventBarrier.eventName) {
            window.addEventListener(eventBarrier.eventName, (evt: any) => {
              // Solo procesar si la cámara está activa
              if (!isActiveRef.current) return;
              
              console.log('EVENT_BARRIER result', evt.detail);
              
              if (evt.detail) {
                const data = evt.detail;
                
                // Extraer emoción - asegurar que siempre sea un string
                let emotionStr = 'neutral';
                let confidence = 0;
                
                if (data.face_emotion) {
                  const emotion = data.face_emotion;
                  
                  // Primero intentar dominantEmotion (la clave principal)
                  if (emotion.dominantEmotion && typeof emotion.dominantEmotion === 'string') {
                    emotionStr = emotion.dominantEmotion;
                    confidence = emotion.confidence || emotion.value || 0;
                  } 
                  // Si es string directo
                  else if (typeof emotion === 'string') {
                    emotionStr = emotion;
                  } 
                  // Si es objeto, buscar en diferentes propiedades
                  else if (emotion && typeof emotion === 'object') {
                    // Buscar en todas las propiedades posibles
                    emotionStr = emotion.dominantEmotion || emotion.m || emotion.name || emotion.label || emotion.emotion || 'neutral';
                    confidence = emotion.confidence || emotion.value || emotion.probability || 0;
                    
                    // Asegurar que emotionStr sea string (no objeto)
                    if (typeof emotionStr !== 'string') {
                      emotionStr = 'neutral';
                    }
                  }
                }
                
                // Garantizar que emotionStr siempre sea un string válido
                emotionStr = typeof emotionStr === 'string' ? emotionStr : 'neutral';
                
                // Actualizar estado con los datos que vienen
                setCurrentEmotion({
                  emotion: String(emotionStr).toLowerCase(),
                  confidence: confidence,
                  arousal: data.face_arousal_valence?.arousal || 0,
                  valence: data.face_arousal_valence?.valence || 0,
                  attention: data.face_attention?.attention || data.face_attention?.value || 0,
                  facePositivity: data.face_positivity?.positivity || data.face_positivity?.value || 0,
                });
              }
            });
          }
        })
        .catch((err: any) => {
          console.error('Error inicializando MorphCast:', err);
          setError(language === 'es'
            ? 'Error al inicializar el SDK de MorphCast: ' + (err?.message || 'Error desconocido')
            : 'Error initializing MorphCast SDK: ' + (err?.message || 'Unknown error'));
        });
    } catch (err) {
      console.error('Error en initializeMorphCast:', err);
      setError(language === 'es'
        ? 'Error al inicializar el detector de emociones'
        : 'Error initializing emotion detector');
    }
  };


  useEffect(() => {
    // Actualizar ref cuando cambia isActive
    isActiveRef.current = isActive;
    
    if (!isActive || !sdkReady) {
      // Si se desactiva, limpiar datos y detener
      if (!isActive) {
        setCurrentEmotion(null);
        if (startStopRef.current && startStopRef.current.stop) {
          startStopRef.current.stop();
        }
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
      return;
    }

    // Obtener el stream de la cámara y asignarlo al video antes de iniciar MorphCast
    if (videoRef.current && startStopRef.current) {
      const initVideo = async () => {
        try {
          // 1. Obtener acceso a la cámara
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          if (videoRef.current) {
            // 2. Asignar el stream al elemento de video
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            
            // 3. Iniciar MorphCast con el elemento de video
            startStopRef.current.start(videoRef.current);
          }
        } catch (err) {
          console.error('❌ Error al acceder a la cámara:', err);
          setError(language === 'es'
            ? 'Error al acceder a la cámara. Por favor, permite el acceso.'
            : 'Error accessing camera. Please allow access.');
          setIsActive(false);
          isActiveRef.current = false;
        }
      };
      
      initVideo();
    }

    // Cleanup
    return () => {
      if (isActive && startStopRef.current && startStopRef.current.stop) {
        try {
          startStopRef.current.stop();
        } catch (e) {
          console.error('Error stopping MorphCast:', e);
        }
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCurrentEmotion(null);
      isActiveRef.current = false;
    };
  }, [isActive, sdkReady, language]);

  const toggleDetection = () => {
    if (isActive) {
      // Detener - limpiar TODOS los datos
      if (startStopRef.current && startStopRef.current.stop) {
        startStopRef.current.stop();
      }
      isActiveRef.current = false;
      setIsActive(false);
      setCurrentEmotion(null); // Limpiar datos inmediatamente
    } else {
      // Activar
      if (!sdkReady) {
        setError(language === 'es'
          ? 'El SDK aún no está listo. Por favor, espera unos segundos.'
          : 'SDK is not ready yet. Please wait a few seconds.');
        return;
      }
      isActiveRef.current = true;
      setIsActive(true);
      setCurrentEmotion(null); // Asegurar que empiece sin datos
      setError(null);
    }
  };

  const getEmotionColor = (emotion: string | null | undefined) => {
    if (!emotion || typeof emotion !== 'string') return 'text-gray-600';
    const colors: Record<string, string> = {
      happy: 'text-green-600',
      sad: 'text-blue-600',
      angry: 'text-red-600',
      surprised: 'text-yellow-600',
      fearful: 'text-purple-600',
      disgusted: 'text-orange-600',
      neutral: 'text-gray-600',
    };
    return colors[emotion.toLowerCase()] || 'text-gray-600';
  };

  const getEmotionLabel = (emotion: string | null | undefined) => {
    if (!emotion || typeof emotion !== 'string') {
      return language === 'es' ? 'Neutral' : 'Neutral';
    }
    const labels: Record<string, { es: string; en: string }> = {
      happy: { es: 'Feliz', en: 'Happy' },
      sad: { es: 'Triste', en: 'Sad' },
      angry: { es: 'Enojado', en: 'Angry' },
      surprised: { es: 'Sorprendido', en: 'Surprised' },
      fearful: { es: 'Temeroso', en: 'Fearful' },
      disgusted: { es: 'Disgustado', en: 'Disgusted' },
      neutral: { es: 'Neutral', en: 'Neutral' },
    };
    return labels[emotion.toLowerCase()]?.[language] || emotion;
  };

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#212e5c] text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">
            {language === 'es' ? 'Detección de Emociones' : 'Emotion Detection'}
          </h3>
          <p className="text-sm text-blue-100 mt-1">
            {language === 'es' 
              ? 'Análisis en tiempo real de tus emociones' 
              : 'Real-time analysis of your emotions'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-4">
          {/* Debug info - solo en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs w-full mb-2">
              <p className="font-semibold mb-1">Debug Info:</p>
              <p>API Key: {process.env.NEXT_PUBLIC_MORPHCAST_API_KEY 
                ? `✅ Configurada (${process.env.NEXT_PUBLIC_MORPHCAST_API_KEY.substring(0, 10)}...)` 
                : '❌ No configurada'}</p>
              <p>SDK Status: {sdkLoaded ? (sdkReady ? '✅ Listo' : '⏳ Inicializando...') : '⏳ Cargando...'}</p>
              <p>CY: {typeof window !== 'undefined' && window.CY ? '✅' : '❌'}</p>
              <p>MphTools: {typeof window !== 'undefined' && window.MphTools ? '✅' : '❌'}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isActive ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'es'
                  ? 'Haz clic para activar la detección de emociones'
                  : 'Click to activate emotion detection'}
              </p>
              <button
                onClick={toggleDetection}
                disabled={!sdkReady}
                className="bg-[#212e5c] text-white px-6 py-2 rounded-lg hover:bg-[#1a2347] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'es' ? 'Activar Cámara' : 'Activate Camera'}
              </button>
            </div>
          ) : (
            <>
              {/* Video Container */}
              <div className="relative w-full max-w-xs">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg border-2 border-gray-300"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Emotion Display - Mostrar siempre cuando está activo */}
              <div className="w-full space-y-3">
                {currentEmotion ? (
                  <>
                    {/* Emoción Principal */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {language === 'es' ? 'Emoción Detectada' : 'Detected Emotion'}
                        </span>
                        <span className={`text-lg font-bold ${getEmotionColor(currentEmotion.emotion)}`}>
                          {getEmotionLabel(currentEmotion.emotion)}
                        </span>
                      </div>
                      {currentEmotion.confidence > 0 && (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                              className="bg-[#212e5c] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(currentEmotion.confidence * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {Math.round(currentEmotion.confidence * 100)}% {language === 'es' ? 'confianza' : 'confidence'}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Métricas Detalladas */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600">{language === 'es' ? 'Atención' : 'Attention'}</p>
                        <p className="font-semibold text-blue-700">
                          {currentEmotion.attention > 0 ? Math.round(currentEmotion.attention * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-gray-600">{language === 'es' ? 'Positividad' : 'Positivity'}</p>
                        <p className="font-semibold text-green-700">
                          {currentEmotion.facePositivity > 0 ? Math.round(currentEmotion.facePositivity * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <p className="text-gray-600">{language === 'es' ? 'Activación' : 'Arousal'}</p>
                        <p className="font-semibold text-purple-700">
                          {currentEmotion.arousal > 0 ? Math.round(currentEmotion.arousal * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <p className="text-gray-600">{language === 'es' ? 'Valencia' : 'Valence'}</p>
                        <p className="font-semibold text-orange-700">
                          {currentEmotion.valence > 0 ? Math.round(currentEmotion.valence * 100) : 0}%
                        </p>
                      </div>
                    </div>

                    {/* Datos en bruto para debug (solo en desarrollo) */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="bg-gray-100 rounded-lg p-2 text-xs font-mono overflow-auto max-h-32">
                        <p className="font-semibold mb-1">Raw Data:</p>
                        <pre className="text-[10px]">
                          {JSON.stringify(currentEmotion, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      {language === 'es' 
                        ? 'Esperando detección de emociones...' 
                        : 'Waiting for emotion detection...'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {language === 'es' 
                        ? 'Asegúrate de que tu rostro esté visible en la cámara' 
                        : 'Make sure your face is visible in the camera'}
                    </p>
                  </div>
                )}
              </div>

              {/* Stop Button */}
              <button
                onClick={toggleDetection}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors mt-4"
              >
                {language === 'es' ? 'Detener Detección' : 'Stop Detection'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Extender el tipo Window para incluir MorphCast
declare global {
  interface Window {
    CY?: any;
    MphTools?: any;
  }
}
