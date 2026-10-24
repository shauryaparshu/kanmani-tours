import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
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
      // /about-kanmani was a near-duplicate of /about
      {
        source: '/about-kanmani',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/ja/about-kanmani',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/en/about-kanmani',
        destination: '/en/about',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
