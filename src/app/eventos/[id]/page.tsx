// src/app/eventos/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '../../../components/VideoPlayer';
import eventsData from '../../../../data/events.json';
import { useState, useEffect } from 'react';

interface Evento {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  streamUrl: string;
  streamUrl2?: string;
  fallbackMp4Url?: string; // Add this line
  league: string;
}

export default function EventoDetailPage() {
  const params = useParams();
  const { id } = params;

  const evento = eventsData.find((e: Evento) => e.id === id);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (evento?.streamUrl) {
      setCurrentStreamUrl(evento.streamUrl);
    }
  }, [evento]);

  if (!evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
        <h1 className="text-4xl font-bold mb-4">Evento no encontrado 😔</h1>
        <p className="text-lg text-gray-400 mb-8">
          Parece que el evento que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/eventos" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Volver a Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <Link href="/eventos" className="text-blue-400 hover:text-blue-300 transition duration-200 text-lg font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Volver a la lista
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg text-center">
          Detalles del Evento
        </h1>
      </header>

      {/* CONTENEDOR PRINCIPAL DE LAS DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* COLUMNA IZQUIERDA: REPRODUCTOR DE VIDEO Y BOTONES DE OPCIÓN */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
          <div className="relative w-full pb-[56.25%] bg-black flex items-center justify-center flex-grow">
            {currentStreamUrl ? (
              <div className="absolute inset-0">
                  <VideoPlayer
                    streamUrl={currentStreamUrl}
                    fallbackMp4Url={evento.fallbackMp4Url}
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

          {(evento.streamUrl || evento.streamUrl2) && (
            <div className="flex justify-center gap-4 p-4 bg-gray-900 border-t border-gray-700">
              {evento.streamUrl && (
                <button
                  onClick={() => setCurrentStreamUrl(evento.streamUrl)}
                  className={`py-2 px-6 rounded-lg font-bold transition duration-300 ease-in-out ${
                    currentStreamUrl === evento.streamUrl
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Opción 1
                </button>
              )}
              {evento.streamUrl2 && (
                <button
                  onClick={() => setCurrentStreamUrl(evento.streamUrl2)}
                  className={`py-2 px-6 rounded-lg font-bold transition duration-300 ease-in-out ${
                    currentStreamUrl === evento.streamUrl2
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Opción 2
                </button>
              )}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: CUADRO DE DETALLES DEL EVENTO */}
        <div className="lg:col-span-1 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-6 sm:p-8 flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">{evento.title}</h2>
          <p className="text-blue-400 text-lg font-semibold mb-3">{evento.league}</p>
          <p className="text-gray-400 text-md mb-4">
            🗓️ <span className="font-semibold">{evento.date}</span> - ⏰ <span className="font-semibold">{evento.time}</span>
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 flex-grow">
            {evento.description}
          </p>

          <div className="mt-auto">
            {!evento.streamUrl && !evento.streamUrl2 && (
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
