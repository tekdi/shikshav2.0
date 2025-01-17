import { NextResponse } from 'next/server';

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/iframenext')) {
    url.hostname = 'localhost';
    url.port = '4100';
    return NextResponse.rewrite(url);
  }

  if (url.pathname.startsWith('/iframereact')) {
    url.hostname = 'localhost';
    url.port = '4200';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
