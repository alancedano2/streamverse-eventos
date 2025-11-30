// src/app/eventos/page.tsx
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import eventsData from '../../../data/events.json'; 

// =========================================================
// ⚠️ 1. INTERRUPTOR PRINCIPAL DE VISIBILIDAD DE EVENTOS ⚠️
// =========================================================
const SHOW_WEEKLY_BREAK_MESSAGE = false;

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

// Función para determinar si un evento está "en vivo" (simulación)
const isLive = (dateStr: string, timeStr: string): boolean => {
  try {
    const now = new Date('Sat Nov 29 2025 04:31:00 GMT-0400');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando autenticación...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8 lg:p-12 relative overflow-hidden">
      
      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 z-0 opacity-20" style={{background: 'radial-gradient(circle at 50% -20%, #06b6d4, transparent 50%)'}}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <header className="flex justify-between items-center mb-12 gap-4 pb-4 border-b border-gray-700/50">
          
          {/* GRUPO IZQUIERDO: Logo y Título */}
          <div className="flex items-center gap-4"> 
            
            {/* Logo y Enlace al Home */}
            <Link href="/"> 
              <Image
                src="/images/logo.webp"
                alt="StreamVerse Logo"
                width={300}
                height={50}
                className="rounded-full shadow-lg hover:opacity-80 transition"
              />
            </Link>
            
            {/* Título de la Página */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Eventos
              </span>
            </h1>
          </div>
          
          {/* GRUPO DERECHO: Estado, Radio y Usuario */}
          <div className="flex items-center gap-4">

              {/* 🎧 NUEVO ENLACE: KQ105 Radio */}
              <Link
                href="/kq-105"
                className="text-sm font-medium text-amber-400 hover:text-amber-300 transition duration-200 hidden sm:flex items-center gap-2 border border-gray-700/50 px-3 py-1 rounded-full bg-amber-900/30 hover:bg-amber-800/50"
                title="Escuchar Radio KQ105 en vivo"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  KQ105
              </Link>
              
              {/* Enlace a /status (Esquina Derecha) */}
              <Link
                href="/status"
                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition duration-200 hidden sm:flex items-center gap-2 border border-gray-700/50 px-3 py-1 rounded-full hover:bg-gray-700/30"
                title="Ver el estado de los servidores y streams"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Estado
              </Link>
          
              {/* Componente de Autenticación de Clerk */}
              {isSignedIn && (
                <div className="flex items-center gap-4 p-2 rounded-full bg-gray-700/60 border border-gray-600">
                  <span className="text-md font-medium text-gray-300 hidden sm:block">
                    Hola, {user?.firstName || user?.username || 'Usuario'}
                  </span>
                  <UserButton afterSignOutUrl="/login" />
                </div>
              )}
          </div>
        </header>

        {/* 2. CUADRO DE AVISO DE PROGRAMACIÓN (CONDICIONAL) */}
        {SHOW_WEEKLY_BREAK_MESSAGE && (
          <div className="w-full mx-auto p-6 mb-10 bg-gray-700 border-l-4 border-blue-500 rounded-lg shadow-xl text-center">
              <p className="text-xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl">⚠️</span> **AVISO IMPORTANTE**
              </p>
              <p className="text-md text-gray-300 mt-2">
                Los eventos se programan para los **fines de semana** (viernes a domingo). ¡Vuelve pronto!
              </p>
          </div>
        )}
        
        {/* BANNER DESTACADO DE SOLICITUD DE EVENTO */}
        <div className="w-full mx-auto mb-12 text-center">
          <Link 
            href="/solicitar-evento" 
            className="inline-flex items-center justify-center 
                        bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-purple-600 
                        text-white font-bold py-3 px-10 rounded-full 
                        transition duration-300 ease-in-out transform hover:scale-[1.02] 
                        shadow-xl shadow-fuchsia-500/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            ¿Buscas un Evento Específico? ¡Solicítalo Aquí!
          </Link>
        </div>

        {/* 3. GRID DE EVENTOS (CONDICIONAL) */}
        {!SHOW_WEEKLY_BREAK_MESSAGE && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {eventsData.map((evento: Evento) => {
              const isEventLive = isLive(evento.date, evento.time);
              
              return (
                <Link
                  key={evento.id}
                  href={`/eventos/${evento.id}`}
                  className="block"
                >
                  {/* Tarjeta con efecto de borde de brillo */}
                  <div
                    className="group relative bg-gray-700/80 rounded-xl shadow-lg overflow-hidden transform transition duration-300 
                               hover:scale-[1.03] hover:shadow-cyan-500/40 
                               p-px before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-400 before:via-blue-500 before:to-purple-600 
                               before:opacity-0 group-hover:before:opacity-70 before:duration-500 before:transition-opacity before:rounded-xl"
                  >
                    {/* Contenido de la tarjeta */}
                    <div className="relative bg-gray-800 rounded-[calc(0.75rem-1px)] h-full flex flex-col">
                      
                      {/* IMAGEN DEL EVENTO */}
                      <div className="relative w-full h-56">
                        <Image
                          src={evento.image}
                          alt={evento.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-[calc(0.75rem-1px)]"
                        />
                        
                        {/* INDICADOR EN VIVO */}
                        {isEventLive && (
                          <div className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg flex items-center gap-1 border border-white/20">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse-slow"></span>
                            EN VIVO
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        {/* TÍTULO */}
                        <h2 className="text-2xl font-bold mb-1 text-white line-clamp-2">
                            {evento.title}
                        </h2>

                        {/* LIGA / CATEGORÍA */}
                        <p className="text-blue-400 text-sm font-semibold mb-3">
                          {evento.league}
                        </p>

                        {/* FECHA Y HORA */}
                        <div className="flex items-center text-gray-400 text-sm mb-4">
                            <span className="mr-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {evento.date}</span>
                            <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {evento.time}</span>
                        </div>

                        {/* DESCRIPCIÓN */}
                        <p className="text-gray-300 text-base line-clamp-3 flex-grow">{evento.description}</p>

                        {/* BOTÓN CTA VISUAL */}
                        <div className="mt-5 pt-4 border-t border-gray-700/50">
                          <span className="block w-full text-center bg-cyan-600 group-hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition duration-200 transform group-hover:scale-95">
                              Ver Transmisión
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

