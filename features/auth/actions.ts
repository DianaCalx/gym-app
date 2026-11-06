// features/auth/actions.ts
// Puerta de entrada desde los formularios de registro e inicio de sesión:
// FormData → service → redirect o errores de vuelta al formulario.
"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getString } from "@/lib/form";
import type { FormState } from "@/lib/result";
import { authService } from "./service";

export async function signInAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.signIn(Object.fromEntries(formData));

  if (!result.ok) {
    return {
      fieldErrors: result.fieldErrors,
      message: result.message,
      code: result.code,
      values: { email: getString(formData, "email") }, // la contraseña NUNCA se devuelve
    };
  }

  // La pantalla cambia según haya sesión o no: se invalida todo el árbol de layouts, no una ruta puntual
  revalidatePath("/", "layout");
  redirect("/routines"); // fuera de cualquier try/catch
}

// Botón "Continuar con Google": no recibe campos del formulario (no tiene ninguno), por eso no declara parámetros.
// Devuelve un FormState solo si falla; si sale bien, redirige el navegador a la pantalla de Google.
export async function signInWithGoogleAction(): Promise<FormState> {
  // Una Server Action solo se ejecuta por POST, y el navegador siempre manda "origin" en un POST: es el sitio actual
  const origin = (await headers()).get("origin");
  const result = await authService.signInWithGoogle({ origin });

  if (!result.ok) return { message: result.message };

  redirect(result.data.url); // URL externa (accounts.google.com, vía Supabase); fuera de cualquier try/catch
}

// Formulario "¿No te llegó?" de /verify-email. No redirige: se queda en la pantalla y muestra el resultado.
export async function resendConfirmationAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.resendConfirmation(Object.fromEntries(formData));
  const values = { email: getString(formData, "email") };

  if (!result.ok) return { fieldErrors: result.fieldErrors, message: result.message, code: result.code, values };

  // El mismo texto exista o no la cuenta: no se revela qué correos están registrados
  return {
    success: "Si ese correo tiene una cuenta sin confirmar, te enviamos un enlace nuevo. Puedes pedir otro en un minuto.",
    values,
  };
}

// Formulario de /forgot-password. No redirige: se queda en la pantalla y muestra el resultado.
export async function forgotPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.requestPasswordReset(Object.fromEntries(formData));
  const values = { email: getString(formData, "email") };

  if (!result.ok) return { fieldErrors: result.fieldErrors, message: result.message, code: result.code, values };

  // El mismo texto exista o no la cuenta: no se revela qué correos están registrados
  return {
    success: "Si ese correo tiene una cuenta, te enviamos un enlace para elegir una contraseña nueva. Revisa también el spam.",
    values,
  };
}

// Formulario de /reset-password: canjea el token del enlace, guarda la contraseña nueva y manda al login, porque el
// repository cerró todas las sesiones. No usa requireUser(): quien llega aquí aún no tiene sesión, la prueba es el token.
export async function resetPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.resetPassword(Object.fromEntries(formData));

  // Se devuelve solo el mensaje: las contraseñas NUNCA vuelven al formulario
  if (!result.ok) return { fieldErrors: result.fieldErrors, message: result.message, code: result.code };

  revalidatePath("/", "layout");
  redirect("/login?reset=ok"); // fuera de cualquier try/catch
}

// Se usa directo como <form action={signOutAction}>: no recibe estado previo ni devuelve nada
export async function signOutAction(): Promise<void> {
  // Aunque el aviso al servidor de Supabase fallara, la sesión local ya se borró (scope "local"): se sale igual
  await authService.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signUpAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.signUp(Object.fromEntries(formData));

  if (!result.ok) {
    return {
      fieldErrors: result.fieldErrors,
      message: result.message,
      values: { email: getString(formData, "email") },
    };
  }

  // Con "Confirm email" activado Supabase crea la cuenta pero no abre sesión: se manda a "Revisa tu correo".
  // El correo NO viaja en la URL: la página es la misma para todos y no revela si la cuenta ya existía.
  if (result.data.needsEmailConfirmation) redirect("/verify-email"); // fuera de cualquier try/catch

  revalidatePath("/", "layout");
  redirect("/routines");
}
