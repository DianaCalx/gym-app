// features/auth/service.ts
// Valida con Zod, llama al repository y traduce los códigos de error de Supabase a mensajes en español
// que un usuario pueda entender. No sabe de Next (redirigir y cookies son de la action).
import "server-only";
import { z } from "zod";
import type { AuthError } from "@supabase/supabase-js";
import type { Result } from "@/lib/result";
import { authRepository } from "./repository";
import { emailTokenSchema, oauthCodeSchema, oauthStartSchema, signInSchema, signUpSchema } from "./schemas";
import type { AuthUser } from "./types";

// error.code de Supabase → mensaje en español
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.", // un solo mensaje: no se revela qué cuentas existen
  email_not_confirmed: "Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.",
  user_already_exists: "Ese correo ya tiene una cuenta. Inicia sesión.",
  email_exists: "Ese correo ya tiene una cuenta. Inicia sesión.",
  weak_password: "Esa contraseña es muy débil o ya apareció en filtraciones. Prueba con otra.",
  email_address_invalid: "Ese correo no es válido. Prueba con otro.",
  over_email_send_rate_limit: "Demasiados intentos. Espera unos minutos.",
  over_request_rate_limit: "Demasiados intentos. Espera unos minutos.",
  otp_expired: "El enlace venció o ya se usó. Pide uno nuevo.", // verifyOtp usa este código para "vencido" y para "ya usado"
};

function toFriendlyMessage(error: AuthError) {
  const message = error.code ? AUTH_ERROR_MESSAGES[error.code] : undefined;
  if (!message) console.error("[auth] error no mapeado:", error.code, error.message); // queda en la terminal del servidor
  return message ?? "Algo salió mal. Inténtalo de nuevo.";
}

export const authService = {
  async signIn(input: unknown): Promise<Result> {
    const parsed = signInSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    const { error } = await authRepository.signIn(parsed.data.email, parsed.data.password);
    if (error) {
      return {
        ok: false,
        message: toFriendlyMessage(error),
        code: error.code, // la UI usará "email_not_confirmed" para ofrecer el reenvío (Fase 2)
      };
    }

    return { ok: true, data: null };
  },

  async signUp(input: unknown): Promise<Result<{ needsEmailConfirmation: boolean }>> {
    const parsed = signUpSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    // confirmPassword solo sirvió para comparar: al repository van únicamente correo y contraseña
    const { email, password } = parsed.data;
    const { needsEmailConfirmation, error } = await authRepository.signUp(email, password);
    if (error) return { ok: false, message: toFriendlyMessage(error) };

    return { ok: true, data: { needsEmailConfirmation } };
  },

  // Ida a Google: valida el sitio de origen, arma la dirección de vuelta y pide a Supabase la URL de Google.
  // Devuelve esa URL; la action es quien redirige al navegador (redirect es de Next, no del service).
  async signInWithGoogle(input: unknown): Promise<Result<{ url: string }>> {
    const parsed = oauthStartSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "No se pudo iniciar con Google. Inténtalo de nuevo." };
    }

    const redirectTo = `${parsed.data.origin}/auth/callback`; // la ruta del Paso 1.9
    const { url, error } = await authRepository.signInWithGoogle(redirectTo);
    if (error) return { ok: false, message: toFriendlyMessage(error), code: error.code };
    if (!url) return { ok: false, message: "No se pudo iniciar con Google. Inténtalo de nuevo." };

    return { ok: true, data: { url } };
  },

  // Vuelta de Google: valida que haya código y lo canjea por la sesión. La ruta decide a dónde redirigir.
  async completeOAuth(code: unknown): Promise<Result> {
    const parsed = oauthCodeSchema.safeParse({ code });
    if (!parsed.success) {
      return { ok: false, message: "No se pudo completar el inicio de sesión con Google." };
    }

    const { error } = await authRepository.exchangeCodeForSession(parsed.data.code);
    if (error) return { ok: false, message: toFriendlyMessage(error), code: error.code };

    return { ok: true, data: null };
  },

  // Enlace del correo (confirmar cuenta o recuperar contraseña): valida lo que trae la URL y canjea el token por la sesión.
  // La ruta /auth/confirm decide a dónde redirigir.
  async confirmEmail(input: unknown): Promise<Result> {
    const parsed = emailTokenSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "El enlace no es válido. Pide uno nuevo." };
    }

    const { error } = await authRepository.verifyEmailToken(parsed.data.tokenHash, parsed.data.type);
    if (error) return { ok: false, message: toFriendlyMessage(error), code: error.code };

    return { ok: true, data: null };
  },

  async signOut(): Promise<Result> {
    const { error } = await authRepository.signOut();
    if (error) return { ok: false, message: toFriendlyMessage(error), code: error.code };
    return { ok: true, data: null };
  },

  getCurrentUser(): Promise<AuthUser | null> {
    return authRepository.getCurrentUser();
  },
};
