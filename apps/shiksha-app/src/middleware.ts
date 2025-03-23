import { NextResponse } from 'next/server';

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/mfe_registration')) {
    url.hostname = 'localhost';
    url.port = '4104';
    return NextResponse.rewrite(url);
  }

  if (
    url.pathname.startsWith('/mfe_content') ||
    url.pathname.startsWith('/content-plugins')
  ) {
    url.hostname = 'localhost';
    url.port = '4105';
    if (url.pathname.startsWith('/content-plugins')) {
      url.pathname = '/mfe_content' + url.pathname;
    }
    return NextResponse.rewrite(url);
  }
  if (url.pathname.startsWith('/assets')) {
    const baseurl = process.env.NEXT_PUBLIC_ASSETS_HOSTNAME;
    const [protocol, hostname] = baseurl?.split('://') || [];
    url.protocol = protocol || 'https';
    url.hostname = hostname || '';
    url.port = '';
    return NextResponse.redirect(url);
  }

  // if (url.pathname.startsWith('/content/v3/read/')) {
  //   url.hostname = 'dev-shiksha-admin.tekdinext.com';
  //   url.pathname = `/action${url.pathname}`;
  //   url.port = '';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}
