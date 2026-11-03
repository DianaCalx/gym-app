// Reglas de forma para los formularios de cuenta (Paso 1.4), escritas una sola vez con Zod.
// Las usarán las actions de registro y login (1.5 y 1.6) para rechazar datos mal formados antes de llamar a Supabase.
import { z } from "zod";

const emailRule = z.email("Escribe un correo válido");

// Registro: se exige una contraseña razonable
export const signupSchema = z
  .object({
    email: emailRule,
    password: z
      .string("Escribe una contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña no puede pasar de 72 caracteres"), // bcrypt solo usa los primeros 72 bytes
    confirmPassword: z.string("Repite la contraseña").min(1, "Repite la contraseña"),
  })
  // Regla que compara dos campos: el error se asigna a confirmPassword para mostrarlo junto a ese campo
  .refine((datos) => datos.password === datos.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Login: solo se pide que no esté vacía; la fuerza se exigió al registrarse, y revisarla aquí revelaría las reglas
export const loginSchema = z.object({
  email: emailRule,
  password: z.string("Escribe tu contraseña").min(1, "Escribe tu contraseña"),
});

// Tipos de TypeScript derivados de las reglas: una sola fuente de verdad
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
