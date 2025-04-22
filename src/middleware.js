/**
 * This middleware handles authentication and route protection in a Next.js application.
 * 
 * The code does the following:
 * 1. Imports NextResponse for handling HTTP responses
 * 2. Checks for authentication token in cookies
 * 3. Protects specified routes from unauthorized access
 * 4. Redirects unauthenticated users to login
 * 5. Prevents authenticated users from accessing auth pages
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get authentication token from cookies
  const authToken = request.cookies.get('authToken');
  console.log('Auth Token:', authToken);
  console.log('Request Path:', request.nextUrl.pathname);
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/profile',
    '/products',
    '/cart',
    '/address',
    '/thankyou',
    '/orders',
    '/reviews'
  ];

  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !authToken) {
    console.log('Redirecting to signin');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

//   // Prevent authenticated users from accessing auth pages
//   if (request.nextUrl.pathname.startsWith('/auth') && authToken) {
//     return NextResponse.redirect(new URL('/profile', request.url));
//   }

  return NextResponse.next();
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/products/:path*',
    '/cart/:path*',
    '/address/:path*',
    '/thankyou/:path*',
    '/orders/:path*',
    '/reviews/:path*',
  ]
};