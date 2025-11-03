// src/app/eventos/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import eventsData from '../../../data/events.json';

interface Evento {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  streamUrl: string;
  league: string;
}

// Función para determinar si un evento está "en vivo"
const isLive = (dateStr: string, timeStr: string): boolean => {
  try {
    // ⚠️ Importante: Reemplaza esta hora ficticia con "const now = new Date();" para producción.
    const now = new Date('Sat Nov 01 2025 19:30:00 GMT-0400'); // Hora Ficticia (7:30 PM, Puerto Rico)
    
    // Convertimos la fecha del evento a un formato que Date pueda parsear
    const eventDateTimeString = `${dateStr.replace(/del \d{4}/, `del ${now.getFullYear()}`)} ${timeStr}`;
    const eventDate = new Date(eventDateTimeString.replace(/(del \d{4})/, '$1').replace(/\s*PM/, ' PM').replace(/\s*AM/, ' AM'));
    
    return now.getTime() >= eventDate.getTime();
  } catch (error) {
    console.error("Error al parsear la fecha del evento:", error);
    return false;
  }
};


export default function EventosPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        Cargando autenticación...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-8 lg:p-12 text-white">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="flex items-center text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg text-center sm:text-left">
          <Image
            src="/images/logo.webp" // Ruta a tu archivo logo.webp
            alt="StreamVerse Logo"
            width={300} // Valor deseado para el ancho
            height={240} // Valor deseado para el alto
            layout="intrinsic" // Usa intrinsic para mantener el aspecto y respetar width/height
            className="mr-2 sm:mr-3" // Margen a la derecha
          />
          Events 🚀 {/* Texto "Events" y el cohete */}
        </h1>
        {isSignedIn && (
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold hidden sm:block">
              Hola, {user?.firstName || user?.username || 'Usuario'}!
            </span>
            <UserButton afterSignOutUrl="/login" />
          </div>
        )}
      </header>

      {/* CUADRO DE ADVERTENCIA */}
      <div className="w-full max-w-7xl mx-auto p-4 mb-6 bg-red-700/80 border-2 border-red-500 rounded-xl shadow-2xl text-center">
        <p className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.344a1.875 1.875 0 013.486 0l5.807 10.373A2 2 0 0115.897 16H4.103a2 2 0 01-1.65-2.283l5.804-10.373zM10 13a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 011 1v2a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          AVISO IMPORTANTE PARA PUERTO RICO
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.344a1.875 1.875 0 013.486 0l5.807 10.373A2 2 0 0115.897 16H4.103a2 2 0 01-1.65-2.283l5.804-10.373zM10 13a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 011 1v2a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </p>
        <p className="text-md text-red-100 mt-2">
          Debido a las <strong>condiciones climatológicas actuales</strong>, existe un riesgo elevado de interrupciones en el servicio eléctrico (<strong>apagones</strong>). Recomendamos tener paciencia si la transmisión se ve afectada.
        </p>
      </div>
      {/* FIN CUADRO DE ADVERTENCIA */}
      
      {/* BOTÓN A SOLICITAR EVENTO */}
      <div className="w-full max-w-7xl mx-auto mb-10 text-center">
        <Link href="/solicitar-evento" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg">
          ¿Buscas un evento? ¡Solicítalo aquí! 📝
        </Link>
      </div>
      {/* FIN BOTÓN A SOLICITAR EVENTO */}

      {/* GRID DE EVENTOS: Reducimos a xl:grid-cols-3 para más ancho horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {eventsData.map((evento: Evento) => {
          const isEventLive = isLive(evento.date, evento.time);
          
          return (
            <div
              key={evento.id}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 flex flex-col"
            >
              {/* IMAGEN DEL EVENTO: Altura fija de h-56 sm:h-64 */}
              <div className="relative w-full h-56 sm:h-64">
                <Image
                  src={evento.image}
                  alt={evento.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
                
                {/* INDICADOR DE ESTADO EN VIVO */}
                {isEventLive && (
                  <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    EN VIVO
                  </div>
                )}
                {/* FIN INDICADOR DE ESTADO EN VIVO */}
              </div>
              {/* FIN IMAGEN DEL EVENTO */}

              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                {/* TÍTULO */}
                <h2 className="text-2xl font-bold mb-1 text-white">{evento.title}</h2>

                {/* LIGA / CATEGORÍA */}
                <p className="text-gray-400 text-sm mb-2">
                  {evento.league}
                </p>

                {/* FECHA Y HORA */}
                <p className="text-gray-400 text-sm mb-3">
                  🗓️ {evento.date} - ⏰ {evento.time}
                </p>

                {/* DESCRIPCIÓN */}
                <p className="text-gray-300 mb-4 text-base line-clamp-3 flex-grow">{evento.description}</p>

                {/* BOTÓN "VER TRANSMISIÓN" */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <Link href={`/eventos/${evento.id}`} className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                      Ver Transmisión
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
