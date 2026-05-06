// ============================================================
// Cleanly - Composable de reseñas
// Estado reactivo: reviews, isLoading
// ============================================================

import { ref } from 'vue';
import type { Review } from '@/utils/types';
import { getReviewsByWorker } from '../services/getByWorker';
import { createReview as createReviewService } from '../services/createReview';

interface CreateReviewDto {
  bookingId: string;
  clientId: string;
  workerId: string;
  rating: number;
  comentario: string;
}

export function useReviews() {
  const reviews = ref<Review[]>([]);
  const isLoading = ref(false);

  async function loadWorkerReviews(workerId: string): Promise<void> {
    isLoading.value = true;
    try {
      reviews.value = await getReviewsByWorker(workerId);
    } finally {
      isLoading.value = false;
    }
  }

  async function submitReview(dto: CreateReviewDto): Promise<Review> {
    isLoading.value = true;
    try {
      const review = await createReviewService(dto);
      return review;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    reviews,
    isLoading,
    loadWorkerReviews,
    submitReview,
  };
}
