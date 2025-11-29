// src/components/StatusCard.tsx
import React from 'react';

interface StatusCardProps {
  serviceName: string;
  status: 'operacional' | 'degradado' | 'inactivo'; // Verde, Amarillo, Rojo
  lastUpdate: string;
}

const statusMap = {
  operacional: {
    color: 'bg-green-500',
    text: 'Totalmente Operacional',
    detail: 'Todos los sistemas funcionan con normalidad.',
  },
  degradado: {
    color: 'bg-yellow-500',
    text: 'Rendimiento Degradado',
    detail: 'Podrían ocurrir latencias o fallos intermitentes.',
  },
  inactivo: {
    color: 'bg-red-500',
    text: 'Servicio Interrumpido',
    detail: 'Los usuarios no pueden acceder al servicio.',
  },
};

export default function StatusCard({ serviceName, status, lastUpdate }: StatusCardProps) {
  const { color, text, detail } = statusMap[status];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 hover:shadow-cyan-500/30 transition duration-300">
      <div className="flex justify-between items-start mb-4 border-b border-gray-700/50 pb-3">
        {/* Título del Servicio */}
        <h3 className="text-xl font-semibold text-white">{serviceName}</h3>
        
        {/* Indicador de Estado */}
        <div className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${color} text-white`}>
          <span className={`w-3 h-3 rounded-full mr-2 ${color === 'bg-green-500' ? 'bg-white/80 animate-none' : 'animate-pulse'}`}></span>
          {text}
        </div>
      </div>
      
      <p className="text-gray-400 mb-4">{detail}</p>
      
      <p className="text-sm text-gray-500">Última actualización: {lastUpdate}</p>
    </div>
  );
}
