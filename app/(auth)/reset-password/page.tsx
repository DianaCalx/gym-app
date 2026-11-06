// app/(auth)/reset-password/page.tsx
// Pantalla "/reset-password" (Paso 2.7): elegir la contraseña nueva. A ella llega quien pulsó el enlace del correo de
// recuperación (/reset-password?token_hash=...). Es pública (está en PUBLIC_PATHS de proxy.ts) porque aún NO hay sesión:
// el token se canjea recién cuando se envía el formulario (resetPasswordAction), no al abrir la página.
// Corre en el servidor y solo arma la pantalla.
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

// Next entrega ?token_hash=... en searchParams, que es una promesa (hay que esperarla con await)
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token_hash: tokenHash } = await searchParams;

  // Sin token (página abierta a mano) no hay nada que canjear: se manda a pedir el enlace
  if (typeof tokenHash !== "string" || tokenHash === "") {
    return (
      <>
        <h1 className="text-3xl font-extrabold">Enlace no válido</h1>
        <p role="alert" className="rounded-button border border-line p-3 text-sm font-semibold">
          Este enlace no es válido. Pide uno nuevo desde &quot;¿Olvidaste tu contraseña?&quot;.
        </p>
        <p className="text-sm text-muted">
          <Link href="/forgot-password" className="font-semibold text-accent-text">
            Pedir un enlace nuevo
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold">Contraseña nueva</h1>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 shadow-card">
        <p className="text-sm text-muted">Elige la contraseña con la que vas a entrar a partir de ahora.</p>
        <ResetPasswordForm tokenHash={tokenHash} />
      </section>
    </>
  );
}
