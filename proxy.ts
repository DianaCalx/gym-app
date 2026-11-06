// proxy.ts
// Proxy de la app (Paso 1.3): código que Next ejecuta ANTES de dibujar cada página.
// Hace dos cosas: renueva la sesión del usuario y manda a /login a quien no ha entrado.
// Usa el mismo patrón getAll/setAll que lib/supabase/server.ts, pero sobre la petición y la respuesta de Next.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutas que se pueden ver sin sesión (el resto exige haber entrado)
const PUBLIC_PATHS = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password", "/auth"];

// Pantallas solo para quien aún no entró: con sesión iniciada se redirigen a /routines
const AUTH_PAGES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Faltan variables en .env.local: revisa .env.example y reinicia npm run dev");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // 1) Las páginas de esta misma petición deben ver la cookie renovada
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        // 2) El navegador recibe las cookies nuevas para reemplazar las viejas
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // 3) Cabeceras anti-caché: evitan que un CDN guarde la respuesta con la sesión de otra persona
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // IMPORTANTE: no pongas código entre createServerClient y getClaims().
  // getClaims() verifica la firma del token y, si está por vencer, lo renueva (y dispara setAll).
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  if (!isLoggedIn && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  // Con sesión, /login y /signup no tienen sentido: se manda a /routines.
  // (/auth/* no entra aquí: el retorno de Google debe poder abrirse con sesión.)
  if (isLoggedIn && AUTH_PAGES.includes(path)) {
    const routinesUrl = request.nextUrl.clone();
    routinesUrl.pathname = "/routines";
    routinesUrl.search = "";
    const redirectResponse = NextResponse.redirect(routinesUrl);
    // Si getClaims() acaba de renovar la sesión, esas cookies están en `response`: se copian a la redirección
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  // Se devuelve la respuesta que armó setAll tal cual: si se crea otra, se pierden las cookies renovadas
  return response;
}

export const config = {
  // Corre en todo menos archivos estáticos (JS, CSS, imágenes y el favicon): no tienen sesión que revisar
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
