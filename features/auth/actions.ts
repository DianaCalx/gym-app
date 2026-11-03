// Server Actions de cuenta (Paso 1.5). Corren en el servidor, pero el formulario del navegador las llama como si fueran una función.
// Es la puerta de entrada: valida con el schema, habla con Supabase Auth y decide a dónde va el usuario.
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "./schemas";

// Lo que la action devuelve al formulario cuando algo no sale bien (null = todavía no se envió nada)
export type SignupState = {
  message?: string; // aviso general, por ejemplo "ese correo ya tiene cuenta"
  fieldErrors?: { email?: string[]; password?: string[]; confirmPassword?: string[] }; // errores de cada campo
  email?: string; // para no borrar el correo que el usuario escribió
} | null;

export async function signupAction(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get("email") ?? "");

  // 1) Forma del dato: el navegador no es de fiar, aquí se valida de verdad
  const parsed = signupSchema.safeParse({
    email,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, email };
  }

  // 2) Crear la cuenta en Supabase Auth
  const supabase = await createClient();
  // confirmPassword solo sirve para comparar: a Supabase se le envía únicamente correo y contraseña
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { message: describeSignupError(error.code), email };
  }

  // Con "Confirm email" activado Supabase crea la cuenta pero no abre sesión (llega en la Fase 2)
  if (!data.session) {
    return { message: "Te enviamos un correo para confirmar tu cuenta.", email };
  }

  // 3) Con sesión abierta, redirect() navega al destino. Va fuera de try/catch porque funciona lanzando una excepción interna
  redirect("/");
}

// Traduce el código de error de Supabase a un mensaje que la persona entienda
function describeSignupError(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "Ese correo ya tiene una cuenta. Inicia sesión.";
    case "weak_password":
      return "Esa contraseña es muy débil o ya apareció en filtraciones. Prueba con otra.";
    case "email_address_invalid":
      return "Ese correo no es válido. Prueba con otro.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Demasiados intentos. Espera unos minutos y vuelve a intentar.";
    default:
      console.error("signUp falló con el código:", code); // queda en la terminal del servidor, no en la pantalla
      return "No pudimos crear la cuenta. Intenta de nuevo.";
  }
}
