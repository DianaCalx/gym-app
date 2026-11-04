// app/global-error.tsx
// Último recurso (Paso 1.10): se usa solo si falla el layout raíz, que es lo que error.tsx no puede atender.
// Reemplaza al layout raíz, así que debe traer sus propios <html> y <body> y volver a importar los estilos globales.
"use client";

import "./globals.css";
import { useEffect } from "react";
import ErrorScreen, { getErrorDigest } from "@/components/ui/ErrorScreen";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">
        <title>Error | GymApp</title>
        <ErrorScreen
          title="Algo salió mal"
          message="La aplicación no pudo arrancar. Puedes intentarlo de nuevo."
          reference={getErrorDigest(error)}
        >
          <button
            type="button"
            onClick={() => retry()}
            className="min-h-11 w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent"
          >
            Intentar de nuevo
          </button>
        </ErrorScreen>
      </body>
    </html>
  );
}
