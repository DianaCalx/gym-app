// features/auth/actions.ts
// Puerta de entrada desde los formularios de registro e inicio de sesión:
// FormData → service → redirect o errores de vuelta al formulario.
"use server";

import { revalidatePath } from "next/cache";
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

export async function signUpAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const result = await authService.signUp(Object.fromEntries(formData));

  if (!result.ok) {
    return {
      fieldErrors: result.fieldErrors,
      message: result.message,
      values: { email: getString(formData, "email") },
    };
  }

  // Con "Confirm email" activado Supabase crea la cuenta pero no abre sesión.
  // En la Fase 2 esto pasa a redirect("/verify-email"); mientras tanto se avisa en el mismo formulario.
  if (result.data.needsEmailConfirmation) {
    return {
      success: "Te enviamos un correo para confirmar tu cuenta.",
      values: { email: getString(formData, "email") },
    };
  }

  revalidatePath("/", "layout");
  redirect("/routines");
}
