// Cliente de Supabase para el NAVEGADOR (Paso 0.6b). Una función que arma el objeto con el
// que los componentes con "use client" hablan con tu proyecto. El cliente del servidor llega en la Fase 1.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Next solo reemplaza estas variables si se escriben exactamente así, una por una
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Faltan variables en .env.local: revisa .env.example y reinicia npm run dev");
  }

  return createBrowserClient(url, key);
}
