import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración de Turbopack (nueva sintaxis estable)
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  
  // Configuraciones experimentales mínimas
  experimental: {
    // Optimizaciones básicas
    workerThreads: false,
    cpus: 1,
  },
  
  // NO usar webpack cuando Turbopack está activo
  // webpack: removido para evitar conflictos
  
  // Optimizaciones de imágenes
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Optimizar bundle para producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;