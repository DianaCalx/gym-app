// components/auth/ResendEmailForm.tsx
// Formulario "¿No te llegó?" de /verify-email (Paso 2.5). Corre en el navegador ("use client") por el estado de errores y de "enviando".
// Al enviarlo llama a resendConfirmationAction (features/auth/actions.ts), que corre en el servidor. Reutiliza FormField (II-38).
"use client";

import { useActionState, useEffect, useRef } from "react";
import FormField from "@/components/ui/FormField";
import { resendConfirmationAction } from "@/features/auth/actions";
import type { FormState } from "@/lib/result";

export default function ResendEmailForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(resendConfirmationAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Accesibilidad: al haber un error en el campo, el foco va a él (mismo patrón que LoginForm)
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <FormField
        id="email"
        label="Correo"
        type="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        defaultValue={state.values?.email} // React 19 vacía el formulario tras enviarlo; así el correo no se pierde
        error={state.fieldErrors?.email?.[0]}
      />

      {state.message && (
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          {state.message}
        </p>
      )}

      {state.success && (
        <p role="status" className="rounded-button border border-line p-3 text-sm font-semibold">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Reenviar correo"}
      </button>
    </form>
  );
}
