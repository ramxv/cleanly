// ============================================================
// Cleanly - Obtener todas las reservas de un cliente
// ============================================================

import type { Booking } from '@/utils/types';
import { query, delay } from '@/utils/storage';

export async function getAllBookings(clientId: string): Promise<Booking[]> {
  const bookings = query<Booking>(
    'cleanly_bookings',
    (b) => b.clientId === clientId,
  );
  return delay(bookings);
}
