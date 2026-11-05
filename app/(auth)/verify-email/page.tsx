// app/(auth)/verify-email/page.tsx
// Pantalla "/verify-email" (Paso 2.4): "Revisa tu correo". A ella llega signUpAction cuando la cuenta se creó pero
// aún no está confirmada. Es pública (está en PUBLIC_PATHS de proxy.ts) porque quien llega aquí todavía no tiene sesión.
// Corre en el servidor y no recibe datos: el texto es el mismo para todos, así no revela si el correo ya tenía cuenta.
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold">Revisa tu correo</h1>

      <section className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
        <p>Si es la primera vez que usas ese correo, te enviamos un enlace para confirmar tu cuenta. Ábrelo para entrar.</p>
        <p className="text-sm text-muted">
          Puede tardar un par de minutos; mira también la carpeta de spam. Si ya tenías una cuenta con ese correo no te
          llegará nada nuevo: inicia sesión.
        </p>
      </section>

      <p className="text-sm text-muted">
        <Link href="/login" className="font-semibold text-accent-text">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}
