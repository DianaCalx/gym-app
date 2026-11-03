// Página temporal "/": muestra los tokens de diseño en pantalla (Paso 0.4).
// Se reemplaza en la Fase 1 por la pantalla real de entrada.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-3xl font-extrabold">GymApp</h1>

      <section className="rounded-card border border-line bg-surface p-4 shadow-card">
        <span className="rounded-chip bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-text">
          Piernas
        </span>
        <p className="mt-3 text-5xl font-extrabold">
          80 <span className="text-base font-semibold text-muted">kg x 8 reps</span>
        </p>
        <p className="text-sm text-muted">Sentadilla - serie 2 de 4</p>
        <button
          type="button"
          className="mt-4 w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent"
        >
          Serie hecha
        </button>
      </section>
    </main>
  );
}
