// Página temporal "/conexion" (Paso 0.6b): comprueba que la app llega a tu proyecto Supabase.
// Se borra cuando exista la pantalla real. Lleva "use client" porque usa estado y un botón (corre en el navegador).
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Estado =
  | { tipo: "inicial" }
  | { tipo: "probando" }
  | { tipo: "ok" }
  | { tipo: "error"; mensaje: string };

export default function ConexionPage() {
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });

  async function probar() {
    setEstado({ tipo: "probando" });
    try {
      const supabase = createClient();
      // La tabla no existe a propósito: la base aún está vacía y solo queremos ver si responde
      const { error } = await supabase.from("conexion_prueba").select("*").limit(1);

      // PGRST205 = "esa tabla no existe". Significa que el proyecto respondió y aceptó la clave
      if (!error || error.code === "PGRST205") {
        setEstado({ tipo: "ok" });
      } else {
        setEstado({ tipo: "error", mensaje: error.message });
      }
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : "No se pudo llegar al proyecto";
      setEstado({ tipo: "error", mensaje });
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-3xl font-extrabold">Conexión</h1>

      <section className="rounded-card border border-line bg-surface p-4 shadow-card">
        <p className="text-sm text-muted">Comprueba que la app llega a tu proyecto Supabase.</p>
        <button
          type="button"
          onClick={probar}
          disabled={estado.tipo === "probando"}
          className="mt-4 w-full rounded-button bg-accent p-4 text-lg font-extrabold text-on-accent disabled:opacity-50"
        >
          {estado.tipo === "probando" ? "Probando..." : "Probar conexión"}
        </button>

        {estado.tipo === "ok" && (
          <p className="mt-4 text-accent-text">Conexión correcta: el proyecto respondió y aceptó la clave.</p>
        )}
        {estado.tipo === "error" && <p className="mt-4 text-sm">No se pudo conectar: {estado.mensaje}</p>}
      </section>
    </main>
  );
}
