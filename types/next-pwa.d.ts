declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: any[];
    buildExcludes?: string[];
    publicExcludes?: string[];
    fallbacks?: Record<string, string>;
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    sw?: string;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
  }

  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}
