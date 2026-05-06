// ============================================================
// Cleanly - Máquina de estados de una reserva
// PENDIENTE_PAGO -> CONFIRMADA -> EN_PROGRESO -> COMPLETADA
// Al pasar a COMPLETADA, libera el pago al trabajador
// ============================================================

import type { Booking, BookingStatus, Payment } from '@/utils/types';
import { getStore, updateOne, delay } from '@/utils/storage';

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDIENTE_PAGO: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['EN_PROGRESO', 'CANCELADA'],
  EN_PROGRESO: ['COMPLETADA', 'CANCELADA'],
  COMPLETADA: [],
  CANCELADA: [],
};

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
): Promise<Booking> {
  const bookings = getStore<Booking>('cleanly_bookings');
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  const allowed = VALID_TRANSITIONS[booking.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `No se puede cambiar de ${booking.status} a ${newStatus}`,
    );
  }

  const updatedBooking = updateOne<Booking>('cleanly_bookings', id, {
    status: newStatus,
  });

  if (!updatedBooking) {
    throw new Error('Error al actualizar la reserva');
  }

  // Al pasar a COMPLETADA, liberar el pago al trabajador
  if (newStatus === 'COMPLETADA') {
    const payments = getStore<Payment>('cleanly_payments');
    const payment = payments.find((p) => p.bookingId === id);

    if (payment) {
      updateOne<Payment>('cleanly_payments', payment.id, {
        status: 'LIBERADO',
      });
    }
  }

  return delay(updatedBooking);
}
