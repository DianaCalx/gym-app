// components/auth/ResetPasswordForm.tsx
// Formulario de /reset-password (Paso 2.7): elegir la contraseña nueva. Corre en el navegador ("use client") por el estado
// de errores y de "enviando". Al enviarlo llama a resetPasswordAction (features/auth/actions.ts), que corre en el servidor.
// Recibe el token del enlace (lo lee la página de la URL) y lo reenvía en un campo oculto: con él se prueba quién es.
"use client";

import { useActionState, useEffect, useRef } from "react";
import FormField from "@/components/ui/FormField";
import { resetPasswordAction } from "@/features/auth/actions";
import type { FormState } from "@/lib/result";

export default function ResetPasswordForm({ tokenHash }: { tokenHash: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(resetPasswordAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Accesibilidad: cuando la action devuelve errores, el foco va al primer campo con error
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tokenHash" value={tokenHash} />

      <FormField
        id="password"
        label="Contraseña nueva"
        type="password"
        autoComplete="new-password"
        required
        hint="Entre 8 y 72 caracteres."
        error={state.fieldErrors?.password?.[0]}
      />

      <FormField
        id="confirmPassword"
        label="Repite la contraseña nueva"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirmPassword?.[0]}
      />

      {state.message && (
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
