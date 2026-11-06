// app/(auth)/forgot-password/page.tsx
// Pantalla "/forgot-password" (Paso 2.6): quien olvidó su contraseña escribe su correo y recibe un enlace para elegir otra.
// Es pública (está en PUBLIC_PATHS de proxy.ts) porque quien llega aquí no tiene sesión. Corre en el servidor y solo arma
// la pantalla; el formulario es un componente. El enlace del correo llega directo a /reset-password (Paso 2.7).
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold">Recuperar contraseña</h1>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 shadow-card">
        <p className="text-sm text-muted">Escribe tu correo y te enviamos un enlace para elegir una contraseña nueva.</p>
        <ForgotPasswordForm />
      </section>

      <p className="text-sm text-muted">
        <Link href="/login" className="font-semibold text-accent-text">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}
