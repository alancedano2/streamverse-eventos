// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    // Contenedor principal con fondo de gradiente oscuro
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4">
      
      {/* Efecto de brillo de fondo para dar profundidad */}
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{background: 'radial-gradient(circle at 70% 30%, #a855f7, transparent 60%)'}}
      ></div>

      {/* Contenido centrado */}
      <main className="relative z-10 max-w-4xl mx-auto text-center py-16">
        
        {/* Logo/Marca */}
        <div className="mb-8 flex justify-center">
            <Image
                src="/images/logo.webp" // Asegúrate de que esta ruta sea correcta
                alt="StreamVerse Logo"
                width={150}
                height={150}
                className="rounded-full shadow-2xl shadow-blue-500/50 transform transition duration-500 hover:scale-105"
            />
        </div>

        {/* Título Principal */}
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 leading-tight">
          Bienvenido a 
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
            StreamVerse
          </span>
        </h1>

        {/* Descripción */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Tu destino premium para ver los mejores eventos deportivos y de lucha libre, en vivo y bajo demanda, con la más alta calidad de streaming.
        </p>

        {/* Contenedor de Botones de Navegación */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          
          {/* Botón Principal: Ver Eventos */}
          <Link
            href="/eventos"
            className="w-full sm:w-auto inline-flex items-center justify-center
                       bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500
                       text-white font-bold py-4 px-10 rounded-full text-lg
                       transition duration-300 ease-in-out transform hover:scale-[1.05]
                       shadow-2xl shadow-cyan-500/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Explorar Eventos Ahora
          </Link>

          {/* Botón Secundario: Solicitar Evento */}
          <Link
            href="/solicitar-evento"
            className="w-full sm:w-auto inline-flex items-center justify-center
                       bg-gray-700 hover:bg-gray-600 border border-gray-600
                       text-gray-200 font-semibold py-4 px-10 rounded-full text-lg
                       transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Solicitar un Evento
          </Link>

        </div>

        {/* Enlace al Estado del Servicio (opcional pero recomendado) */}
        <div className="mt-16">
            <Link
                href="/status"
                className="text-sm text-gray-500 hover:text-cyan-400 transition duration-200"
            >
                Ver Estado del Servicio
            </Link>
        </div>

      </main>
    </div>
  );
}
