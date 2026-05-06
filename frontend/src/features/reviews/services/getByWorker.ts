// ============================================================
// Cleanly - Obtener reseñas de un trabajador
// ============================================================

import type { Review } from '@/utils/types';
import { query, delay } from '@/utils/storage';

export async function getReviewsByWorker(workerId: string): Promise<Review[]> {
  const reviews = query<Review>(
    'cleanly_reviews',
    (r) => r.workerId === workerId,
  );
  return delay(reviews);
}
