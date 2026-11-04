// components/ui/ErrorScreen.tsx
// Pantalla genérica para errores (Paso 1.10): título, explicación, código de referencia opcional y las acciones que se le
// pasen como children. La usan not-found.tsx, error.tsx y global-error.tsx para que las tres se vean igual. Sin hooks ni estado.

export default function ErrorScreen({
  title,
  message,
  reference,
  children,
}: {
  title: string;
  message: string;
  reference?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 p-4">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-muted">{message}</p>
      {reference && (
        <p className="text-sm text-muted">
          Código de referencia: <span className="font-mono">{reference}</span>
        </p>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </main>
  );
}

// Next agrega un "digest" (huella corta) a los errores del servidor. Se muestra como código de referencia para poder
// buscar ese error en los registros del servidor sin mostrarle al usuario el mensaje real, que podría revelar detalles internos.
export function getErrorDigest(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
  return undefined; // los errores del navegador no traen digest
}
