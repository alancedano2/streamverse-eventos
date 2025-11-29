// src/app/status/page.tsx
import Link from 'next/link';
import StatusCard from '@/components/StatusCard'; 

// =========================================================
// ⚠️ 1. DATOS DE ESTADO (HARDCODEADO PARA FÁCIL ACTUALIZACIÓN) ⚠️
// =========================================================
const SERVICES = [
  {
    name: 'Streams en Vivo (Player)',
    // 💡 IMPORTANTE: Si los streams fallan, cambia a 'degradado' o 'inactivo'.
    status: 'operacional' as const, 
    lastUpdate: '29 de noviembre del 2025, 4:15 PM AST',
  },
  {
    name: 'Lista de Eventos (API)',
    // 💡 Si no se cargan las tarjetas, cambia a 'inactivo'.
    status: 'operacional' as const, 
    lastUpdate: '29 de noviembre del 2025, 4:15 PM AST',
  },
  {
    name: 'Autenticación (Clerk)',
    // 💡 Si los usuarios no pueden iniciar sesión, cambia a 'degradado'.
    status: 'operacional' as const, 
    lastUpdate: '29 de noviembre del 2025, 4:15 PM AST',
  },
  {
    name: 'Formulario de Solicitud',
    // 💡 Si el envío a Formspree falla, cambia a 'degradado'.
    status: 'operacional' as const, 
    lastUpdate: '29 de noviembre del 2025, 4:15 PM AST',
  },
];

export default function StatusPage() {
  // Determina el estado general del servicio (para el banner principal)
  const overallStatus = SERVICES.some(s => s.status === 'inactivo')
    ? 'inactivo'
    : SERVICES.some(s => s.status === 'degradado')
    ? 'degradado'
    : 'operacional';
    
  const overallTextMap = {
      operacional: { title: 'Todos los Sistemas Operacionales', color: 'bg-green-600', detail: 'Tu experiencia de streaming es óptima. ¡Disfruta!' },
      degradado: { title: 'Rendimiento Degradado', color: 'bg-yellow-600', detail: 'Estamos investigando una latencia intermitente. Gracias por tu paciencia.' },
      inactivo: { title: 'Interrupción Mayor', color: 'bg-red-600', detail: 'Estamos trabajando activamente para restablecer el servicio.' },
  };
  
  const { title, color, detail } = overallTextMap[overallStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">

        {/* ENCABEZADO Y TÍTULO */}
        <header className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Estado del Servicio
            </h1>
            <p className="text-gray-400 text-lg">
                Monitoreando la funcionalidad de StreamVerse en tiempo real (o casi).
            </p>
        </header>

        {/* BANNER PRINCIPAL DE ESTADO */}
        <div className={`p-6 mb-12 rounded-xl shadow-2xl text-center ${color}`}>
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                <span className="text-white">⚪</span> {title}
            </h2>
            <p className="text-white/90">{detail}</p>
        </div>

        {/* GRID DE SERVICIOS */}
        <div className="space-y-6">
          {SERVICES.map((service) => (
            <StatusCard 
              key={service.name}
              serviceName={service.name}
              status={service.status}
              lastUpdate={service.lastUpdate}
            />
          ))}
        </div>

        <div className="mt-12 text-center border-t border-gray-700/50 pt-8">
            <p className="text-gray-500 mb-4">
                ¿Aún tienes problemas?
            </p>
            <Link
                href="/solicitar-evento"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
            >
                Contacta a Soporte o Envíanos un Mensaje
            </Link>
        </div>

      </div>
    </div>
  );
}
