// app/auth/callback/route.ts
// Route Handler (Paso 1.9): la dirección a la que Supabase devuelve al usuario después de Google (/auth/callback?code=...).
// No dibuja pantalla: lee el código de la URL, lo canjea por una sesión y redirige. Es la "puerta de vuelta" de OAuth.
// Corre en el servidor. Sigue la forma de app/auth/confirm/route.ts del proyecto de referencia (my-english-cards).
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { authService } from "@/features/auth/service";

// Next llama a GET cuando el navegador abre esta URL; `request` trae la URL ya separada en partes (nextUrl)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeRedirectPath(searchParams.get("next"));

  // Si el usuario cancela en Google no llega ?code=..., sino ?error=access_denied: completeOAuth lo trata como fallo
  const result = await authService.completeOAuth(searchParams.get("code"));
  if (result.ok) redirect(next); // fuera de try/catch: redirect() funciona lanzando una señal que Next entiende

  redirect("/login?error=oauth");
}

// Solo rutas internas. "//sitio.com" empieza con "/" pero el navegador lo trata como otro sitio, por eso se rechaza.
// "/\\sitio.com" tampoco: algunos navegadores convierten "\" en "/".
function safeRedirectPath(next: string | null) {
  if (!next) return "/routines"; // sin ?next=, el destino por defecto
  const isInternal = next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
  return isInternal ? next : "/routines";
}
