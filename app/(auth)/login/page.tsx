// app/(auth)/login/page.tsx
// Pantalla "/login" (Paso 1.6): entrar con correo y contraseña. Es pública (está en PUBLIC_PATHS de proxy.ts)
// y es adonde proxy.ts manda a quien no tiene sesión. Corre en el servidor y solo arma la pantalla.
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold">Entrar</h1>

      <section className="rounded-card border border-line bg-surface p-4 shadow-card">
        <LoginForm />
      </section>

      <p className="text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="font-semibold text-accent-text">
          Crea una
        </Link>
      </p>
    </>
  );
}
