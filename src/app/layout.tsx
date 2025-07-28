// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs'; // Importa ClerkProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamVerse Eventos',
  description: 'Descubre y reproduce tus eventos favoritos con Clerk Auth',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> {/* Envuelve toda la aplicación con ClerkProvider */}
      <html lang="es">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}