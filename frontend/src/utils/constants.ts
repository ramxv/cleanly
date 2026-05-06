// ============================================================
// Cleanly - Constantes
// ============================================================

export const SERVICIOS = [
  'Limpieza Regular',
  'Limpieza Profunda',
  'Limpieza Post-Obra',
  'Limpieza de Oficinas',
] as const;

export const ZONAS = [
  'Casco Viejo',
  'Costa del Este',
  'San Francisco',
  'Bella Vista',
  'Punta Pacífica',
  'Punta Paitilla',
  'Marbella',
  'Obarrio',
  'El Cangrejo',
  'Vía Argentina',
] as const;

export const TAMANOS_PROPIEDAD = [
  { value: 'pequeno', label: 'Pequeño (hasta 80m²)', horasBase: 3 },
  { value: 'mediano', label: 'Mediano (80-150m²)', horasBase: 5 },
  { value: 'grande', label: 'Grande (150-250m²)', horasBase: 8 },
  { value: 'extragrande', label: 'Extra grande (+250m²)', horasBase: 12 },
] as const;

export const COMISION_PLATAFORMA = 0.15; // 15%

export const MIN_HORAS_RESERVA = 2;

export const MAX_HORAS_RESERVA = 12;

export const LOYALTY_SERVICIOS_PARA_CUPON = 10;

export const LOYALTY_MAX_DESCUENTO = 50.0; // B/. 50.00
