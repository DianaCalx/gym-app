// lib/result.ts
// Tipos compartidos por todos los temas (mismo patrón que my-english-cards): lo que devuelven los services
// y lo que una Server Action devuelve a un formulario.
export type FieldErrors = Partial<Record<string, string[]>>;

// Lo que devuelven los services
export type Result<T = null> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors?: FieldErrors; message?: string; code?: string };

// Lo que una Server Action devuelve a un formulario (useActionState)
export type FormState = {
  fieldErrors?: FieldErrors;
  message?: string; // error general
  code?: string; // tipo de error (ej. "email_not_confirmed"), para que la UI elija una acción
  success?: string; // mensaje de éxito (cuando no rediriges)
  values?: Record<string, string>; // para no vaciar el formulario si falla (nunca contraseñas)
};
