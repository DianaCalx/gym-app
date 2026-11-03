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
