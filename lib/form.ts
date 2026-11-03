// lib/form.ts
// Ayudas para leer un FormData en las Server Actions (mismo patrón que my-english-cards).

// Lee un campo de texto del FormData ('' si no existe o si es un archivo).
export function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

// Copia los campos de texto para devolverlos al formulario si hay errores.
// React añade campos internos que empiezan por $ACTION: se ignoran.
// IMPORTANTE: solo para formularios sin contraseñas; en los de cuenta se devuelve únicamente el correo.
export function formDataToValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) values[key] = value;
  }
  return values;
}
