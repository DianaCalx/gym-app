// features/auth/schemas.ts
// Reglas de forma para los formularios de cuenta, escritas una sola vez con Zod.
// Las usa el service (recibe los datos sin validar y los comprueba aquí antes de llamar al repository).
import { z } from "zod";

const emailRule = z.email("Escribe un correo válido");

export const signInSchema = z.object({
  email: emailRule,
  // Al entrar solo se pide que no esté vacía; la fuerza se exigió al registrarse y revisarla aquí revelaría las reglas
  password: z.string("Escribe tu contraseña").min(1, "Escribe tu contraseña"),
});

// ¿Es un origen http(s) exacto, como "http://localhost:3000" o "https://miapp.com"? (sin ruta, sin barra final)
// NOTA: z.httpUrl() de Zod no sirve aquí: rechaza "localhost" porque exige un dominio con punto.
function isHttpOrigin(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.origin === value;
  } catch {
    return false; // texto que no es una URL
  }
}

// El sitio desde el que se pidió entrar con Google. Con él se arma la dirección de vuelta (origin + /auth/callback).
export const oauthStartSchema = z.object({
  origin: z.string("No se pudo detectar el sitio").refine(isHttpOrigin, "No se pudo detectar el sitio"),
});

// El código que Supabase pone en la URL al volver de Google (?code=...). Si falta o viene vacío, no hay nada que canjear.
export const oauthCodeSchema = z.object({
  code: z.string("Falta el código de Google").min(1, "Falta el código de Google"),
});

// Lo que trae el enlace de confirmación de cuenta (/auth/confirm?token_hash=...&type=...). "type" es una lista cerrada.
// "recovery" NO está: el enlace de recuperación no abre sesión aquí, se canjea al enviar /reset-password (Paso 2.7).
export const emailTokenSchema = z.object({
  tokenHash: z.string("Falta el código del enlace").min(1, "Falta el código del enlace"),
  type: z.enum(["email", "signup"], "El tipo de enlace no es válido"),
});

// El correo al que se reenvía el enlace de confirmación (pantalla /verify-email). Solo se pide el correo: no hay sesión.
export const resendEmailSchema = z.object({ email: emailRule });

// El correo de quien olvidó su contraseña (pantalla /forgot-password). Igual que el reenvío: sin sesión, solo el correo.
export const forgotPasswordSchema = z.object({ email: emailRule });

// Reglas de la contraseña nueva, escritas una vez: las usan el registro y la recuperación (/reset-password)
const passwordRule = z
  .string("Escribe una contraseña")
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(72, "La contraseña no puede pasar de 72 caracteres"); // bcrypt solo usa los primeros 72 bytes
const confirmPasswordRule = z.string("Repite la contraseña").min(1, "Repite la contraseña");
const passwordsMatch = (data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword;
const passwordsMatchError = {
  error: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // el error se muestra debajo de ese campo
};

export const signUpSchema = z
  .object({ email: emailRule, password: passwordRule, confirmPassword: confirmPasswordRule })
  .refine(passwordsMatch, passwordsMatchError);

// El formulario de /reset-password: el token del enlace (viaja en un campo oculto) y la contraseña nueva dos veces, con las
// mismas reglas que el registro. No hay correo ni sesión: quién eres lo decide el token al canjearlo.
const invalidLink = "El enlace no es válido. Pide uno nuevo.";
export const resetPasswordSchema = z
  .object({
    tokenHash: z.string(invalidLink).min(1, invalidLink),
    password: passwordRule,
    confirmPassword: confirmPasswordRule,
  })
  .refine(passwordsMatch, passwordsMatchError);
