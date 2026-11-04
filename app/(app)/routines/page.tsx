// app/(app)/routines/page.tsx
// Pantalla "/routines" (Paso 1.7), provisional: demuestra que la guardia funciona mostrando quién entró.
// En la Fase 4 se reemplaza por la lista real de rutinas. Es privada: proxy.ts la protege y requireUser() la protege otra vez.
import { signOutAction } from "@/features/auth/actions";
import { requireUser } from "@/features/auth/require-user";

export default async function RoutinesPage() {
  const user = await requireUser(); // sin sesión redirige a /login; con sesión entrega { id, email }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-3xl font-extrabold">Mis rutinas</h1>

      <section className="rounded-card border border-line bg-surface p-4 shadow-card">
        <p className="text-sm text-muted">Sesión iniciada como</p>
        <p className="font-semibold">{user.email}</p>
        <p className="mt-3 text-sm text-muted">Aquí aparecerán tus rutinas (Fase 4).</p>
      </section>

      {/* Un formulario sin campos: al enviarlo el navegador llama a signOutAction en el servidor */}
      <form action={signOutAction}>
        <button
          type="submit"
          className="min-h-11 w-full rounded-button border border-line bg-surface px-4 font-semibold"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
