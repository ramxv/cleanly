// ============================================================
// Cleanly - Crear una reseña
// Solo permitido si el booking está COMPLETADA
// Recalcula el avgRating del trabajador
// ============================================================

import type { Booking, Review, WorkerProfile } from '@/utils/types';
import { getStore, insertOne, updateOne, delay } from '@/utils/storage';

interface CreateReviewDto {
  bookingId: string;
  clientId: string;
  workerId: string;
  rating: number;
  comentario: string;
}

export async function createReview(dto: CreateReviewDto): Promise<Review> {
  // Validar que la reserva esté COMPLETADA
  const bookings = getStore<Booking>('cleanly_bookings');
  const booking = bookings.find((b) => b.id === dto.bookingId);

  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  if (booking.status !== 'COMPLETADA') {
    throw new Error('Solo se puede reseñar una reserva completada');
  }

  // Validar rating entre 1 y 5
  if (dto.rating < 1 || dto.rating > 5) {
    throw new Error('El rating debe estar entre 1 y 5');
  }

  const review: Review = {
    id: `r-${Date.now()}`,
    bookingId: dto.bookingId,
    clientId: dto.clientId,
    workerId: dto.workerId,
    rating: dto.rating,
    comentario: dto.comentario,
    createdAt: new Date().toISOString(),
  };

  insertOne('cleanly_reviews', review);

  // Recalcular avgRating del trabajador
  const allReviews = getStore<Review>('cleanly_reviews');
  const workerReviews = allReviews.filter((r) => r.workerId === dto.workerId);
  const avgRating =
    workerReviews.reduce((sum, r) => sum + r.rating, 0) /
    workerReviews.length;

  updateOne<WorkerProfile>('cleanly_workers', dto.workerId, {
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: workerReviews.length,
  });

  return delay(review);
}
