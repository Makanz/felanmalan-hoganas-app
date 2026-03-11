import type { NextConfig } from "next";
import NextPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const withPWA = NextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.dedu\.se\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dedu-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
});

export default withPWA(nextConfig);
