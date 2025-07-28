// C:\streamverse-eventos\middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define las rutas que son públicas (accesibles sin autenticación)
// Estos matchers esperan el objeto 'req' completo.
const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)']);

// Define las rutas que SIEMPRE deben ser ignoradas por el middleware de Clerk (ej: APIs, estáticos)
// Estos matchers esperan el objeto 'req' completo.
const isIgnoredRoute = createRouteMatcher([
  '/api(.*)',
  '/_next/static(.*)',
  '/_next/image(.*)',
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentPath = req.nextUrl.pathname; // Still useful for general string comparisons

  // CAMBIO CLAVE AQUÍ: Pasar 'req' a isIgnoredRoute
  if (isIgnoredRoute(req)) { // Pass req directly
    return NextResponse.next();
  }

  // Si el usuario está logueado (tiene userId)
  if (userId) {
    // CAMBIO CLAVE AQUÍ: Pasar 'req' a isPublicRoute
    if (currentPath === '/' || isPublicRoute(req)) { // Pass req directly
      return NextResponse.redirect(new URL('/eventos', req.url));
    }
  }

  // Si el usuario NO está logueado (no tiene userId)
  if (!userId) { // No need to check !isPublicRoute(currentPath) here for the first part
    // CAMBIO CLAVE AQUÍ: Pasar 'req' a isPublicRoute
    if (currentPath === '/' || !isPublicRoute(req)) { // Pass req directly
      // If currentPath is '/' AND user is not logged in, redirect to login
      if (currentPath === '/') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      // For any other protected route, redirect to login.
      // This is for routes like /eventos, /evento/id
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
