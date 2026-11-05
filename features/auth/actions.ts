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
