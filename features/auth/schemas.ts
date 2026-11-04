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

export const signUpSchema = z
  .object({
    email: emailRule,
    password: z
      .string("Escribe una contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña no puede pasar de 72 caracteres"), // bcrypt solo usa los primeros 72 bytes
    confirmPassword: z.string("Repite la contraseña").min(1, "Repite la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // el error se muestra debajo de ese campo
  });
