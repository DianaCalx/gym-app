// components/auth/GoogleButton.tsx
// Botón "Continuar con Google" (Paso 1.9c) con su separador "o". Corre en el navegador ("use client") por el estado
// de "enviando" y del error. Al enviarlo llama a signInWithGoogleAction (features/auth/actions.ts), que corre en el
// servidor y redirige el navegador a Google. Se usa igual en /login y en /signup: para Google no hay "registro" aparte.
"use client";

import { useActionState } from "react";
import { signInWithGoogleAction } from "@/features/auth/actions";
import type { FormState } from "@/lib/result";

export default function GoogleButton() {
  // La action no recibe campos, por eso el formulario no tiene ninguno: solo el botón
  const [state, formAction, pending] = useActionState<FormState>(signInWithGoogleAction, {});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />o<span className="h-px flex-1 bg-line" />
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-button border border-line bg-surface p-4 font-semibold disabled:opacity-50"
        >
          <GoogleLogo />
          {pending ? "Abriendo Google..." : "Continuar con Google"}
        </button>

        {state.message && (
          <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

// El logotipo de Google, en SVG inline (sin imagen externa). Es decorativo: el texto del botón ya dice qué hace
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
      />
    </svg>
  );
}
