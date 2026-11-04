// app/(auth)/signup/page.tsx
// Pantalla "/signup" (Paso 1.5): crear una cuenta con correo, o entrar con Google (Paso 1.9c). Es pública
// (está en PUBLIC_PATHS de proxy.ts). Corre en el servidor y solo arma la pantalla; los formularios son componentes.
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold">Crear cuenta</h1>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 shadow-card">
        <SignupForm />
        <GoogleButton />
      </section>

      <p className="text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-accent-text">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
