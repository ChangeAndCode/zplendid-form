'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './organisms/LanguageSwitcher';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  patientId: string;
  messages: Message[];
  currentCategory: string;
  completedCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, logout, patientId } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar chat al cargar (muestra saludo incluso sin patientId)
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      initializeChat();
    }
  }, [isAuthenticated]);

  // Crear sesión cuando patientId esté disponible
  useEffect(() => {
    const createSessionIfNeeded = async () => {
      try {
        if (!isAuthenticated || !patientId || chatSession) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('/api/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: 'start',
            patientId: patientId
          })
        });
        if (response.ok) {
          const data = await response.json();
          setChatSession(data.session);
        }
      } catch (error) {
        console.error('Error creating session:', error);
      }
    };
    createSessionIfNeeded();
  }, [isAuthenticated, patientId, chatSession]);

  const initializeChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !patientId) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Hi there! I\'m your AI medical assistant. To get started, what\'s your first name?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        return;
      }

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: 'start',
          patientId: patientId
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Si el backend devuelve sesión (en start), solo guardamos la sesión.
        if (data.session) {
          setChatSession(data.session);
        }
        // Asegurar mensaje de bienvenida si aún no existe
        if (messages.length === 0) {
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            type: 'assistant',
            content: 'Hi there! I\'m your AI medical assistant. To get started, what\'s your first name?',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      } else {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Hi there! I\'m your AI medical assistant. To get started, what\'s your first name?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Hi there! I\'m your AI medical assistant. To get started, what\'s your first name?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoadingResponse) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoadingResponse(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          patientId: patientId,
          sessionId: chatSession?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setChatSession(data.session);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: language === 'es' 
            ? 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.'
            : 'Sorry, there was an error processing your message. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: language === 'es' 
          ? 'Lo siento, hubo un error de conexión. Por favor intenta de nuevo.'
          : 'Sorry, there was a connection error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mostrar carga mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212e5c] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header minimalista */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/landing')}
              className="text-[#212e5c] hover:text-[#1a2347] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[#212e5c] text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoadingResponse && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {language === 'es' ? 'Escribiendo...' : 'Typing...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 sm:p-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'es' 
                ? 'Escribe tu respuesta aquí...' 
                : 'Type your response here...'}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212e5c] focus:border-transparent outline-none text-sm sm:text-base"
              disabled={isLoadingResponse}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoadingResponse}
              className="bg-[#212e5c] text-white px-6 py-3 rounded-lg hover:bg-[#1a2347] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              {language === 'es' ? 'Enviar' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
