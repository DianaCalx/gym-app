// Cliente de Supabase para el SERVIDOR (Paso 1.2). Lo usan las páginas, las actions y los route handlers.
// A diferencia de client.ts (navegador), aquí las cookies no existen solas: hay que leerlas de la petición.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Faltan variables en .env.local: revisa .env.example y reinicia npm run dev");
  }

  const cookieStore = await cookies(); // en Next 16 cookies() es asíncrona

  return createServerClient(url, key, {
    cookies: {
      // Devuelve TODAS las cookies: Supabase parte la sesión en trozos y necesita verlos todos
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Al dibujar una página (Server Component) Next no deja escribir cookies.
          // No es un error: proxy.ts (Paso 1.3) renueva la sesión antes de cada página.
        }
      },
    },
  });
}
