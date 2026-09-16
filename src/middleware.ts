import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all routes under /admin except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminSession = request.cookies.get('admin_session')?.value;
    
    // If no valid session cookie, redirect to login
    if (adminSession !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If already logged in, prevent accessing login page again
  if (path === '/admin/login') {
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
