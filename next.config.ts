import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para optimizar el rendimiento
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración para el App Router (por defecto en Next.js 15+)
  experimental: {
    // Configuraciones experimentales si las necesitas
  },
};

export default nextConfig;
