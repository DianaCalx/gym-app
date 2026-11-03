// Formulario de registro (Pasos 1.5 y 1.5b). Corre en el navegador ("use client") porque usa estado para mostrar errores y "enviando".
// Al enviarlo llama a signupAction (features/auth/actions.ts), que corre en el servidor.
"use client";

import { useActionState, useEffect, useRef } from "react";
import FormField from "@/components/ui/FormField";
import { signupAction, type SignupState } from "@/features/auth/actions";

export default function SignupForm() {
  // state = lo que devolvió la última vez la action; formAction = lo que se le pasa al <form>; pending = está enviando
  const [state, formAction, pending] = useActionState<SignupState, FormData>(signupAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Accesibilidad: cuando la action devuelve errores, el foco va al primer campo con error
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
        defaultValue={state?.email} // React 19 vacía el formulario tras enviarlo; así el correo no se pierde
        error={state?.fieldErrors?.email?.[0]}
      />

      <FormField
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        required
        hint="Entre 8 y 72 caracteres."
        error={state?.fieldErrors?.password?.[0]}
      />

      <FormField
        id="confirmPassword"
        label="Repite la contraseña"
        type="password"
        autoComplete="new-password"
        required
        error={state?.fieldErrors?.confirmPassword?.[0]}
      />

      {state?.message && (
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent disabled:opacity-50"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
