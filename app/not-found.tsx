// app/not-found.tsx
// Pantalla 404 (Paso 1.10): Next la muestra cuando se abre una dirección que no existe o cuando el código llama a notFound().
// Corre en el servidor y va dentro del layout raíz. Con el servidor devuelve el estado HTTP 404.
import Link from "next/link";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function NotFound() {
  return (
    <ErrorScreen title="Página no encontrada" message="La dirección que abriste no existe o ya no está disponible.">
      {/* "/" redirige a /routines con sesión y a /login sin ella */}
      <Link href="/" className="min-h-11 w-full rounded-button bg-accent p-4 text-center text-lg font-extrabold text-on-accent">
        Ir al inicio
      </Link>
    </ErrorScreen>
  );
}
