// Campo de formulario reutilizable (Paso 1.5b). Reúne en un solo lugar las buenas prácticas de accesibilidad:
// etiqueta visible enlazada al campo, ayuda antes del error, error enlazado con aria-describedby y aria-invalid.
// Lo usan todos los formularios de la app (registro, login, rutinas...).
import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  id: string; // también es el name del campo, así que coincide con la clave que lee la action
  label: string;
  hint?: string; // regla o ayuda que se ve ANTES de equivocarse
  error?: string; // mensaje que devolvió la action para este campo
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className">;

export default function FormField({ id, label, hint, error, ...inputProps }: FormFieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        className="w-full rounded-button border border-line bg-background p-3 text-foreground"
        {...inputProps}
      />
      {error ? (
        <p id={messageId} className="text-sm font-semibold">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
