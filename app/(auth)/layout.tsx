// app/(auth)/layout.tsx
// Marco compartido por las pantallas para entrar (/login, /signup). El grupo (auth) no cambia la URL:
// solo agrupa estas rutas para que compartan este layout, que centra el contenido en el medio de la pantalla.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // min-h-dvh = alto visible de la pantalla (en el celular descuenta la barra del navegador); justify-center centra en vertical
  return <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 p-4">{children}</main>;
}
