// app/signup/page.tsx
// Pantalla "/signup" (Paso 1.5): crear una cuenta. Es pública (está en PUBLIC_PATHS de proxy.ts).
// Corre en el servidor y solo arma la pantalla; el formulario interactivo es SignupForm.
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-3xl font-extrabold">Crear cuenta</h1>

      <section className="rounded-card border border-line bg-surface p-4 shadow-card">
        <SignupForm />
      </section>

      <p className="text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-accent-text">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
