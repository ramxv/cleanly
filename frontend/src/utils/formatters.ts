// ============================================================
// Cleanly - Formateadores
// ============================================================

export function formatCurrency(amount: number): string {
  return `B/. ${amount.toFixed(2)}`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-PA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-PA', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('es-PA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return '1 hora';
  return `${hours} horas`;
}

export function dayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayOfWeek] || 'Desconocido';
}

export function turnoName(turno: string): string {
  return turno === 'manana' ? 'Mañana (8am-12pm)' : 'Tarde (2pm-6pm)';
}

export function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
