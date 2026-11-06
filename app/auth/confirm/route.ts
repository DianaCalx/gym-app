// app/auth/confirm/route.ts
// Route Handler (Paso 2.3): la dirección a la que llegan los enlaces de los correos de Supabase
// (/auth/confirm?token_hash=...&type=...). No dibuja pantalla: canjea el token por una sesión y redirige.
// Corre en el servidor. Sigue la forma de app/auth/confirm/route.ts del proyecto de referencia (my-english-cards).
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { authService } from "@/features/auth/service";

// Next llama a GET cuando el navegador abre esta URL; `request.nextUrl` trae la URL ya separada en partes
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Correos de recuperación con el formato anterior (/auth/confirm?...&type=recovery): aquí ya no se abre sesión.
  // Se reenvía el token a /reset-password, que lo canjea al enviar el formulario. No se llama a Supabase: el token no se gasta.
  if (searchParams.get("type") === "recovery") {
    const params = new URLSearchParams({ token_hash: searchParams.get("token_hash") ?? "" });
    redirect(`/reset-password?${params}`);
  }

  const next = safeRedirectPath(searchParams.get("next"));

  // El service valida que token_hash y type tengan forma válida; aquí solo se le pasa lo que trae la URL
  const result = await authService.confirmEmail({
    tokenHash: searchParams.get("token_hash"),
    type: searchParams.get("type"),
  });
  if (result.ok) redirect(next); // fuera de try/catch: redirect() funciona lanzando una señal que Next entiende

  redirect("/login?error=confirmation");
}

// Solo rutas internas. "//sitio.com" empieza con "/" pero el navegador lo trata como otro sitio, por eso se rechaza.
// "/\\sitio.com" tampoco: algunos navegadores convierten "\" en "/".
// NOTA: es la misma función que en app/auth/callback/route.ts; un archivo de ruta no puede exportar otras funciones,
// así que queda duplicada hasta que se extraiga a lib/ en un paso propio.
function safeRedirectPath(next: string | null) {
  if (!next) return "/routines"; // sin ?next=, el destino por defecto
  const isInternal = next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
  return isInternal ? next : "/routines";
}
