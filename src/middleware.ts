import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('firebase-auth-token');
  const protectedRoutes = ['/dashboard', '/menu', '/wallet', '/profile', '/more'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthenticated && (pathname === '/login' || pathname === '/pending-approval')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
