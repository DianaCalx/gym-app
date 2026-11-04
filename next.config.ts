import type { NextConfig } from "next";

// Cabeceras de seguridad (Paso 1.11): Next las agrega a TODAS las respuestas. Cada una le pide algo al navegador.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" }, // no adivinar el tipo de un archivo
  { key: "X-Frame-Options", value: "DENY" }, // nadie puede mostrar la app dentro de un iframe (clickjacking)
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, // a otros sitios solo se les dice el dominio, no la ruta
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" }, // la app no usa estas funciones
  // NOTA: solo tiene efecto sobre HTTPS; el navegador la ignora en http://localhost. Sin "preload" a propósito: es difícil de deshacer.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // no anunciar "x-powered-by: Next.js"
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
