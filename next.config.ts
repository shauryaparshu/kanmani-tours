import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tours/:slug*',
        destination: '/india/tours/:slug*',
        permanent: true,
      },
      {
        source: '/en/tours/:slug*',
        destination: '/en/india/tours/:slug*',
        permanent: true,
      },
      {
        source: '/ja/tours/:slug*',
        destination: '/india/tours/:slug*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
