import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  // const token = request.cookies.get('token')?.value; // Check auth token in cookies

  // const protectedRoutes = ['/auth']; // Routes that require auth

  // if (
  //   protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  // ) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/auth/login', request.url));
  //   }
  // }

  if (url.pathname.startsWith('/mfe_content')) {
    url.hostname = 'localhost';
    url.port = '4105';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
