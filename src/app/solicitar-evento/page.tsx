// src/app/solicitar-evento/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SolicitarEventoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // ⚠️ REEMPLAZA 'YOUR_FORMSPREE_ENDPOINT' CON TU URL REAL (Ej: https://formspree.io/f/xvovoyp) ⚠️
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Usando fetch para enviar datos a un servicio de formulario de terceros (Formspree es un ejemplo común)
      const response = await fetch('https://formspree.io/f/xzzkwrgr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          correo: email,
          solicitud: eventDetails,
          _subject: 'Nueva Solicitud de Evento en StreamVerse',
        }),
      });

      if (response.ok) {
        setStatus('success');
        // Limpiar formulario después del envío exitoso
        setName('');
        setEmail('');
        setEventDetails('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setStatus('error');
    }
  };

  let buttonContent;
  switch (status) {
    case 'idle':
      buttonContent = 'Enviar Solicitud';
      break;
    case 'sending':
      buttonContent = 'Enviando...';
      break;
    case 'success':
      buttonContent = '¡Enviado! 🎉';
      break;
    case 'error':
      buttonContent = 'Error al enviar 😔';
      break;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700">
        <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center">
          📣 Solicitar un Evento
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          ¿No encuentras el evento que quieres ver? Dinos qué evento de deportes o lucha libre te gustaría que añadiéramos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Tu Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Tu Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-400">Detalles del Evento (Nombre, Fecha, Liga)</label>
            <textarea
              id="eventDetails"
              rows={4}
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: WWE Royal Rumble, 2026-01-25. Me gustaría ver la lucha de Roman Reigns."
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full py-3 px-4 rounded-md text-white font-bold transition duration-300 ${status === 'sending' || status === 'success' ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800'}`}
          >
            {buttonContent}
          </button>
          
          {status === 'error' && (
            <p className="text-center text-red-400 mt-4">Hubo un problema. Por favor, intenta más tarde o envíanos un correo directamente.</p>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link href="/eventos" className="text-sm text-gray-400 hover:text-blue-400">
            Volver a la lista de eventos
          </Link>
        </div>
      </div>
    </div>
  );
}
