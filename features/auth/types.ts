// features/auth/types.ts
// Tipos propios del tema "auth". Los de formularios y resultados son compartidos y viven en lib/result.ts.
export type AuthUser = {
  id: string;
  email: string | null;
};
