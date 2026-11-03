// components/auth/LoginForm.tsx
// Formulario de inicio de sesión (Paso 1.6). Corre en el navegador ("use client") por el estado de errores y de "enviando".
// Al enviarlo llama a signInAction (features/auth/actions.ts), que corre en el servidor. Reutiliza FormField (II-38).
"use client";

import { useActionState, useEffect, useRef } from "react";
import FormField from "@/components/ui/FormField";
import { signInAction } from "@/features/auth/actions";
import type { FormState } from "@/lib/result";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signInAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Accesibilidad: al haber errores en un campo, el foco va al primero (mismo patrón que SignupForm)
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

      <FormField
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password?.[0]}
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
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
