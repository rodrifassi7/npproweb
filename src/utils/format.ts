/** $10.800 — formato argentino, sin decimales */
export const formatPrice = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;
