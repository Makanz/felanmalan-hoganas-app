declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface RuntimeCachingOptions {
    cacheName?: string;
    networkTimeoutSeconds?: number;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    cacheableResponse?: {
      statuses?: number[];
    };
  }
  
  interface RuntimeCaching {
    urlPattern: RegExp | string;
    handler: string;
    options?: RuntimeCachingOptions;
  }
  
  interface NextPWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    scope?: string;
    sw?: string;
    disable?: boolean;
    mode?: 'production' | 'development';
    runtimeCaching?: RuntimeCaching[];
  }
  
  function NextPWA(options?: NextPWAOptions): (config: NextConfig) => NextConfig;
  export default NextPWA;
}
