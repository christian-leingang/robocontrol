import { NextResponse } from 'next/server';

export function middleware(request) {
  const { cookies } = request;
  const isAuthenticated = cookies.get('isAuthenticated');

  const url = request.nextUrl.clone();
  if (!isAuthenticated && !url.pathname.startsWith('/login')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && url.pathname === '/login') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/login'],
};
