//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires\

const { composePlugins, withNx } = require('@nx/next');

const PORTAL_BASE_URL = 'https://sunbird-editor.tekdinext.com';

const routes = {
  API: {
    GENERAL: {
      CONTENT_PREVIEW: '/content/preview/:path*',
      CONTENT_PLUGINS: '/content-plugins/:path*',
      GENERIC_EDITOR: '/generic-editor/:path*',
    },
  },
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // Remove i18n routing configuration
  async rewrites() {
    return [
      {
        source: '/action/asset/v1/upload/:identifier*',
        destination: '/api/fileUpload',
      },
      {
        source: '/assets/pdfjs/:path*',
        destination: '/assets/:path*',
      },
      {
        source: '/action/content/v3/upload/url/:identifier*',
        destination:
          '/api/proxy?path=/action/content/v3/upload/url/:identifier*',
      },
      {
        source: '/action/content/v3/upload/:identifier*',
        destination: '/api/fileUpload',
      },
      {
        source: '/action/asset/:path*',
        destination: '/api/proxy?path=/action/asset/:path*',
      },
      {
        source: '/action/content/:path*',
        destination: '/api/proxy?path=/action/content/:path*',
      },
      {
        source: '/action/data/v3/telemetry',
        destination: `${process.env.NEXT_PUBLIC_TELEMETRY_URL}/v1/telemetry`,
      },
      {
        source: '/data/v3/telemetry',
        destination: `${process.env.NEXT_PUBLIC_TELEMETRY_URL}/v1/telemetry`,
      },
      {
        source: '/action/:path*',
        destination: '/api/proxy?path=/action/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/proxy?path=/api/:path*',
      },
      {
        source: '/assets/public/:path*',
        destination: `${process.env.NEXT_PUBLIC_CLOUD_STORAGE_URL}/:path*`,
      },
      {
        source: '/workspace/content/assets/:path*',
        destination: '/assets/:path*',
      },
      {
        source: routes.API.GENERAL.CONTENT_PREVIEW,
        destination: `${PORTAL_BASE_URL}${routes.API.GENERAL.CONTENT_PREVIEW}`,
      },
      {
        source: routes.API.GENERAL.CONTENT_PLUGINS,
        destination: `${PORTAL_BASE_URL}${routes.API.GENERAL.CONTENT_PLUGINS}`,
      },
      {
        source: routes.API.GENERAL.GENERIC_EDITOR,
        destination: `${PORTAL_BASE_URL}/:path*`,
      },
      {
        source: '/app/telemetry',
        destination: '/api/telemetry',
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
