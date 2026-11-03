# gym-app

Sistema fitness: rutinas por día de la semana con ejercicios de un banco de imágenes, pesos opcionales, historial de progreso y app instalable en el celular (PWA).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase (Auth, Postgres, Storage).

## Comandos

```bash
npm run dev     # servidor de desarrollo en http://localhost:3000
npm run build   # compilación de producción
npm start       # servidor de producción (después de build)
npm run lint    # revisión con ESLint
```

## Variables de entorno

Los nombres están en `.env.example` (se agrega en la Fase 0, paso 0.5). Los valores reales van en `.env.local`, que nunca se sube a git.

## Ramas

`main` (estable) · `develop` (integración) · `feature/fase-N-tema` (una por fase).
