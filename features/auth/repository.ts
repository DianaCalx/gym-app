// features/auth/repository.ts
// Único archivo que llama a supabase.auth.*. Devuelve el error en vez de lanzarlo:
// "contraseña incorrecta" es esperable, no un bug. No valida ni decide: eso es de schemas.ts y service.ts.
import "server-only";
import type { EmailOtpType } from "@supabase/supabase-js";
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

  // Pide a Supabase la dirección de Google a la que hay que mandar al usuario. Supabase guarda el secreto PKCE
  // en una cookie (setAll) y devuelve la URL; no sale a Google desde aquí: eso lo hace el navegador al seguirla.
  // redirectTo debe estar en la lista de Redirect URLs del panel de Supabase, o Supabase no devolverá a la app.
  async signInWithGoogle(redirectTo: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    return { url: data.url, error };
  },

  // Cambia el código de un solo uso (?code=...) por la sesión. Supabase lo presenta junto con el secreto PKCE
  // que dejó en una cookie al salir hacia Google, y escribe las cookies de sesión (setAll de lib/supabase/server.ts).
  async exchangeCodeForSession(code: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return { error };
  },

  // Canjea el token_hash del enlace del correo por una sesión. Supabase marca el correo como confirmado (o abre la sesión
  // de recuperación) y escribe las cookies de sesión con setAll de lib/supabase/server.ts. Un token se puede usar una vez.
  async verifyEmailToken(tokenHash: string, type: EmailOtpType) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    return { error };
  },

  // Pide a Supabase otro correo de confirmación ("signup"). Si el correo no existe o ya está confirmado, Supabase responde
  // igual que si todo hubiera ido bien (200) y no envía nada: así no revela qué cuentas existen.
  // Supabase también pone los límites: 1 solicitud por minuto por usuario y 30 por 5 minutos por IP.
  async resendConfirmation(email: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    return { error };
  },

  // Pide a Supabase el correo de recuperación de contraseña. Si el correo no tiene cuenta, Supabase responde igual (200)
  // y no envía nada. No se pasa redirectTo: a dónde llega el usuario lo define la plantilla "Reset password" del panel
  // (/auth/confirm?...&type=recovery&next=/reset-password), que usa la ruta del Paso 2.3.
  async sendPasswordReset(email: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  // scope "local": cierra solo esta sesión. El valor por defecto de Supabase es "global" (cierra todos los dispositivos).
  // Con "local" la sesión se borra aquí antes de avisar al servidor, así que cerrar sesión no depende de la red.
  async signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    return { error };
  },

  // Quién es el usuario según la cookie. getClaims() verifica la firma del token (no es solo leer la cookie).
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data) return null;
    return { id: data.claims.sub, email: data.claims.email ?? null };
  },
};
