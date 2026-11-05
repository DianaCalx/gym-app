// app/(auth)/login/page.tsx
// Pantalla "/login" (Paso 1.6): entrar con correo y contraseña, o con Google (Paso 1.9c). Es pública (está en PUBLIC_PATHS
// de proxy.ts) y es adonde proxy.ts manda a quien no tiene sesión. Corre en el servidor y solo arma la pantalla.
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import LoginForm from "@/components/auth/LoginForm";

// Next entrega ?error=... en searchParams, que es una promesa (hay que esperarla con await)
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className="text-3xl font-extrabold">Entrar</h1>

      {/* app/auth/callback/route.ts redirige aquí con ?error=oauth si no pudo completar el inicio con Google */}
      {error === "oauth" && (
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          No se pudo entrar con Google. Inténtalo de nuevo.
        </p>
      )}

      {/* app/auth/confirm/route.ts redirige aquí con ?error=confirmation si el enlace del correo venció, ya se usó o es inválido */}
      {error === "confirmation" && (
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          El enlace de confirmación no es válido o ya venció. Si ya confirmaste tu correo, inicia sesión.
        </p>
      )}

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 shadow-card">
        <LoginForm />
        <GoogleButton />
      </section>

      <p className="text-sm text-muted">
        <Link href="/forgot-password" className="font-semibold text-accent-text">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="font-semibold text-accent-text">
          Crea una
        </Link>
      </p>
    </>
  );
}
