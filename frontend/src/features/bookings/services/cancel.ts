// ============================================================
// Cleanly - Cancelar una reserva
// Cambia el estado a CANCELADA
// ============================================================

import type { Booking } from '@/utils/types';
import { updateOne, delay } from '@/utils/storage';

export async function cancelBooking(id: string): Promise<Booking> {
  const updated = updateOne<Booking>('cleanly_bookings', id, {
    status: 'CANCELADA',
  });

  if (!updated) {
    throw new Error('Reserva no encontrada');
  }

  return delay(updated);
}
