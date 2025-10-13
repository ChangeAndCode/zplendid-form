/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Suppress hydration warnings for browser extensions
  experimental: {
    suppressHydrationWarning: true,
  },
  // Custom webpack configuration to handle hydration issues
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Suppress hydration warnings in production
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
