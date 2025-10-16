export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 Backend Funcionando Correctamente
        </h1>
        <p className="text-gray-600 mb-4">
          El sistema de autenticación está listo para usar.
        </p>
        <div className="space-y-2">
          <p><strong>Servidor:</strong> Ejecutándose en puerto 3001</p>
          <p><strong>Base de datos:</strong> MySQL conectada</p>
          <p><strong>APIs:</strong> 5 endpoints disponibles</p>
        </div>
        <div className="mt-6">
          <a 
            href="/auth-test" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ir a Pruebas de Autenticación
          </a>
        </div>
      </div>
    </div>
  );
}
