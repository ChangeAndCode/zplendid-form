'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Cargando...</div>}>
      <VerifyDoctorClient />
    </Suspense>
  );
}

function VerifyDoctorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  const email = searchParams?.get('email');

  useEffect(() => {
    if (!email) {
      setMessage('No se proporcionó un email válido');
      setStatus('error');
    }
  }, [email]);


  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace Inválido</h2>
            <p className="text-gray-600">No se proporcionó un email válido en el enlace de verificación.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-[#212e5c] text-white px-6 py-3 rounded-lg hover:bg-[#1a2347] transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {status === 'pending' && (
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#212e5c] mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación de Cuenta</h2>
            <p className="text-gray-600 mb-6">
              Tu cuenta de doctor ha sido creada. Para activarla, necesitas iniciar sesión con las credenciales temporales que recibiste por email.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#212e5c] text-white px-6 py-3 rounded-lg hover:bg-[#1a2347] transition-colors"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Verificación Exitosa!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#212e5c] text-white px-6 py-3 rounded-lg hover:bg-[#1a2347] transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

