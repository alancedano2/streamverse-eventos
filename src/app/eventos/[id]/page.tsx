// src/app/eventos/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import eventsData from '../../../../data/events.json';
import { useEffect, useRef } from 'react'; 
// Importamos 'dynamic' de next/dynamic
import dynamic from 'next/dynamic'; 
// Importaciones de Clappr y HLS ya NO van aquí, van dentro del componente Player dinámico.

interface Evento {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  streamUrl: string;
  fallbackMp4Url?: string;
  league: string;
}

// 1. Crear un componente funcional que contendrá la lógica de Clappr
const ClapprPlayer = ({ streamUrl, imageUrl }: { streamUrl: string, imageUrl?: string }) => {
    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let player: unknown | null = null;
        
        const loadPlayer = async () => {
            const Clappr = (await import('@clappr/player')).default;
            const HlsPlayback = (await import('@clappr/hlsjs-playback')).default;

            if (playerContainerRef.current) {
                player = new Clappr.Player({
                    source: streamUrl,
                    parent: playerContainerRef.current,
                    autoPlay: true,
                    width: '100%',
                    height: '100%',
                    plugins: [HlsPlayback],
                    poster: imageUrl,
                    playbackNotSupportedMessage: 'Tu navegador no soporta la reproducción de este stream.'
                });
            }
        };

        if (streamUrl) loadPlayer();

        return () => {
            if (player && typeof (player as any).destroy === "function") {
                (player as any).destroy();
            }
        };
    }, [streamUrl, imageUrl]);

    return <div ref={playerContainerRef} className="w-full h-full" />;
};


// 2. Definir el componente dinámico (ClapprPlayer no se renderiza en el servidor)
const DynamicClapprPlayer = dynamic(() => Promise.resolve(ClapprPlayer), {
  ssr: false, // ¡ESTO ES CLAVE! Deshabilita el Server-Side Rendering
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <p className="text-cyan-400">Cargando reproductor...</p>
    </div>
  ),
});


export default function EventoDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; 
  const evento = eventsData.find((e: Evento) => e.id === id);
  
  const streamToPlay = evento?.streamUrl || evento?.fallbackMp4Url;
 
  if (!evento) {
    // ... (código para evento no encontrado)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-4 text-cyan-400">Evento no encontrado 😔</h1>
        <p className="text-lg text-gray-400 mb-8">
          Parece que el evento que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/eventos" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md">
          Volver a Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <header className="w-full max-w-7xl mb-8">
        <Link href="/eventos" className="text-cyan-400 hover:text-cyan-300 transition duration-200 text-lg font-semibold flex items-center mb-4">
          {/* Icono de flecha izquierda más moderno */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </Link>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          {evento.title}
        </h1>
        <p className="text-blue-400 text-xl font-medium mt-1">{evento.league}</p>
      </header>

      {/* --- */}

      {/* CONTENEDOR PRINCIPAL DE LAS DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* COLUMNA IZQUIERDA: REPRODUCTOR DE VIDEO */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
          {/* REPRODUCTOR */}
          <div className="relative w-full pb-[56.25%] bg-black flex items-center justify-center flex-grow">
            {streamToPlay ? (
              <div className="absolute inset-0">
                {/* 3. Renderizar el componente dinámico */}
                <DynamicClapprPlayer 
                  streamUrl={streamToPlay}
                  imageUrl={evento.image}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-yellow-400 text-center text-xl sm:text-2xl font-medium p-4">
                  Stream no disponible para este evento. 😔
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: CUADRO DE DETALLES DEL EVENTO */}
        <div className="lg:col-span-1 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-6 sm:p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-white border-b pb-3 border-gray-700/50">
            Información del Evento
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-300">
              <span className="text-xl mr-3 text-cyan-400">🗓️</span>
              <div>
                <p className="text-sm text-gray-400">Fecha</p>
                <p className="font-semibold">{evento.date}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-300">
              <span className="text-xl mr-3 text-cyan-400">⏰</span>
              <div>
                <p className="text-sm text-gray-400">Hora</p>
                <p className="font-semibold">{evento.time}</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3 text-white border-b pb-2 border-gray-700/50">
            Descripción
          </h3>
          <p className="text-gray-300 text-base leading-relaxed flex-grow">
            {evento.description}
          </p>

          <div className="mt-6 pt-4 border-t border-gray-700/50">
            {!streamToPlay && (
              <p className="text-yellow-500 text-center text-lg font-medium">
                No hay streams asociados a este evento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
