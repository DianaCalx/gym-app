// features/auth/repository.ts
// Único archivo que llama a supabase.auth.*. Devuelve el error en vez de lanzarlo:
// "contraseña incorrecta" es esperable, no un bug. No valida ni decide: eso es de schemas.ts y service.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "./types";

export const authRepository = {
  async signIn(email: string, password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  async signUp(email: string, password: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    // Si "Confirm email" está activo, no hay sesión hasta que el usuario confirme
    return { needsEmailConfirmation: !data.session, error };
  },

  // Quién es el usuario según la cookie. getClaims() verifica la firma del token (no es solo leer la cookie).
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data) return null;
    return { id: data.claims.sub, email: data.claims.email ?? null };
  },
};
