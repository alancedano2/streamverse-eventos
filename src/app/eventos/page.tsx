// src/app/eventos/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
// Asegúrate de que eventsData exista en la ruta proporcionada
import eventsData from '../../../data/events.json';

// =========================================================
// ⚠️ 1. INTERRUPTOR PRINCIPAL DE VISIBILIDAD DE EVENTOS ⚠️
// Si es 'true', SOLO se muestra el aviso de programación y el botón de solicitud.
// Si es 'false', se muestra la lista completa de eventos.
// =========================================================
const SHOW_WEEKLY_BREAK_MESSAGE = false // CAMBIA a 'false' para mostrar la lista

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
    const now = new Date('Sat Nov 01 2025 19:30:00 GMT-0400'); // Hora Ficticia
    
    // Convertimos la fecha del evento a un formato que Date pueda parsear
    const eventDateTimeString = `${dateStr.replace(/del \d{4}/, `del ${now.getFullYear()}`)} ${timeStr}`;
    const eventDate = new Date(eventDateTimeString.replace(/(del \d{4})/, '$1').replace(/\s*PM/, ' PM').replace(/\s*AM/, ' AM'));
    
    // Asumimos que un evento está "en vivo" si la hora actual es posterior o igual a la hora del evento.
    // Para una lógica de "en vivo" real, se debería incluir una ventana de tiempo (ej: si la hora actual está entre la hora de inicio y la hora de fin).
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando autenticación...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 lg:p-12">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 max-w-7xl mx-auto">
        {/* LOGO Y TÍTULO */}
        <h1 className="flex items-center text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md">
          {/* Logo con ancho ajustado para un look más estilizado */}
          <Image
            src="/images/logo.webp"
            alt="StreamVerse Logo"
            width={300} // Más pequeño
            height={50} // Más pequeño
            className="mr-3 rounded-full"
          />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Eventos
          </span>
        </h1>
        
        {/* BOTÓN DE USUARIO Y SALUDO */}
        {isSignedIn && (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-gray-300 hidden sm:block">
              Hola, **{user?.firstName || user?.username || 'Usuario'}**!
            </span>
            <UserButton afterSignOutUrl="/login" />
          </div>
        )}
      </header>

      {/* --- */}

      {/* 2. CUADRO DE AVISO DE PROGRAMACIÓN (CONDICIONAL) */}
      {SHOW_WEEKLY_BREAK_MESSAGE && (
        <>
          <div className="w-full max-w-7xl mx-auto p-6 mb-10 bg-gray-800 border border-blue-600 rounded-lg shadow-xl text-center">
            <p className="text-xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">🚧</span> **AVISO DE PROGRAMACIÓN**
            </p>
            <p className="text-md text-gray-300 mt-2">
              Los eventos estarán disponibles todos los **viernes, sábados y domingos**. ¡Gracias por siempre estar pendiente!
            </p>
          </div>
          
          {/* BOTÓN A SOLICITAR EVENTO (Estilo Minimalista) */}
          <div className="w-full max-w-7xl mx-auto mb-10 text-center">
            <Link href="/solicitar-evento" className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-cyan-400 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md border border-gray-600">
              ¿Buscas un evento? ¡Solicítalo aquí!
            </Link>
          </div>
        </>
      )}

      {/* --- */}

      {/* 3. GRID DE EVENTOS (CONDICIONAL) */}
      {!SHOW_WEEKLY_BREAK_MESSAGE && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {eventsData.map((evento: Evento) => {
            const isEventLive = isLive(evento.date, evento.time);
            
            return (
              <Link
                key={evento.id}
                href={`/eventos/${evento.id}`}
                className="block" // Asegura que el Link cubra toda la tarjeta
              >
                <div
                  className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl border border-gray-700 hover:border-cyan-500/50 flex flex-col h-full"
                >
                  {/* IMAGEN DEL EVENTO */}
                  <div className="relative w-full h-56">
                    <Image
                      src={evento.image}
                      alt={evento.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-xl"
                    />
                    
                    {/* INDICADOR DE ESTADO EN VIVO (Estilo más compacto) */}
                    {isEventLive && (
                      <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping-slow"></span>
                        EN VIVO
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    {/* LIGA / CATEGORÍA (Color de acento) */}
                    <p className="text-cyan-400 text-sm font-semibold mb-1">
                      {evento.league}
                    </p>

                    {/* TÍTULO */}
                    <h2 className="text-xl font-bold mb-2 text-white line-clamp-2">{evento.title}</h2>

                    {/* FECHA Y HORA */}
                    <p className="text-gray-400 text-sm mb-3">
                      🗓️ {evento.date} - ⏰ {evento.time}
                    </p>

                    {/* DESCRIPCIÓN */}
                    <p className="text-gray-300 text-sm line-clamp-3 flex-grow">{evento.description}</p>

                    {/* BOTÓN (Implicitamente es el Link de la tarjeta, pero añadimos un CTA visual) */}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <span className="block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-lg transition duration-200 text-sm">
                          Ver Detalles & Stream
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
