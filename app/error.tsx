// app/error.tsx
// Pantalla de error inesperado (Paso 1.10): Next la muestra cuando algo falla al dibujar una página o un componente.
// Debe ser un componente de navegador ("use client"), porque es una "barrera de errores" de React. Las páginas siguen
// dentro del layout raíz. Los fallos del propio layout raíz los atiende global-error.tsx.
"use client";

import Link from "next/link";
import { useEffect } from "react";
import ErrorScreen, { getErrorDigest } from "@/components/ui/ErrorScreen";

// En esta versión de Next el componente recibe "retry" (volver a pedir y dibujar), no solo "reset"
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error); // NOTA: aquí se enchufaría un servicio de errores en producción (P-13 de docs/produccion.md)
  }, [error]);

  return (
    <ErrorScreen
      title="Algo salió mal"
      message="No pudimos mostrar esta pantalla. Puedes intentarlo de nuevo."
      reference={getErrorDigest(error)}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="min-h-11 w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent"
      >
        Intentar de nuevo
      </button>
      <Link href="/" className="min-h-11 w-full rounded-button border border-line bg-surface p-4 text-center font-semibold">
        Ir al inicio
      </Link>
    </ErrorScreen>
  );
}
