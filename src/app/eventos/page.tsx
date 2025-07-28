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

      {/* GRID DE EVENTOS: Reducimos a xl:grid-cols-3 para más ancho horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {eventsData.map((evento: Evento) => (
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
        ))}
      </div>
    </div>
  );
}
