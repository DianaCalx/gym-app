// features/auth/require-user.ts
// La guardia que usan todas las páginas y actions privadas: identidad verificada o redirect a /login.
// Nunca aceptes un userId que no venga de aquí (ni de un formulario ni de la URL).
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { authService } from "./service";

// cache() recuerda el resultado durante una misma petición: si la página y dos componentes la llaman, se consulta una vez
export const requireUser = cache(async () => {
  const user = await authService.getCurrentUser();
  if (!user) redirect("/login");
  return user;
});
