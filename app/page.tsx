// app/page.tsx
// La raíz "/" no tiene pantalla propia: manda a /routines. Si no hay sesión, proxy.ts ya la
// habrá redirigido a /login antes de llegar aquí (por eso no se revisa la sesión en este archivo).
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/routines");
}
